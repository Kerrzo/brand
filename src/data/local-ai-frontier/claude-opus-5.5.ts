/**
 * Internal bookkeeping for one accepted task. This is a type alias only
 * (erased at compile time), not a class or runtime helper.
 */
type ScheduledTask = {
  readonly id: string;
  readonly run: () => Promise<unknown>;
  readonly priority: number;
  readonly timeoutMs: number | undefined;
  /** Total attempts allowed: 1 initial attempt + configured retries. */
  readonly maxAttempts: number;
  /** Monotonic insertion order; gives FIFO among equal priorities. */
  readonly sequence: number;
  attempts: number;
  state: "pending" | "running";
  readonly resolve: (value: unknown) => void;
  readonly reject: (reason: unknown) => void;
};

/**
 * In-memory, priority-ordered task scheduler with bounded concurrency,
 * per-task timeouts, retries, cancellation and pause/resume.
 *
 * Concurrency is measured in *physical* executions: a slot is only released
 * when the underlying promise returned by a task settles, even if the
 * scheduler has already given up on that attempt because it timed out.
 */
export class TaskScheduler {
  /** setTimeout silently fires immediately for delays above this value. */
  private static readonly MAX_TIMEOUT_MS = 2_147_483_647;

  private readonly maxConcurrency: number;

  /** Pending tasks, kept sorted: highest priority first, then FIFO. */
  private readonly queue: ScheduledTask[] = [];

  /** Tasks that are pending or running (not yet settled), keyed by ID. */
  private readonly activeTasks = new Map<string, ScheduledTask>();

  /** Underlying task executions still in flight, including timed-out ones. */
  private activeExecutions = 0;

  private nextSequence = 0;
  private paused = false;
  private drainScheduled = false;

  private completedCount = 0;
  private failedCount = 0;
  private cancelledCount = 0;

  constructor(maxConcurrency: number) {
    if (!Number.isInteger(maxConcurrency) || maxConcurrency < 1) {
      throw new RangeError(
        `maxConcurrency must be a positive integer, received ${String(maxConcurrency)}`,
      );
    }
    this.maxConcurrency = maxConcurrency;
  }

  /**
   * Accepts a task and returns a promise that settles exactly once with the
   * task's result, its final error, a timeout error, or a cancellation error.
   *
   * Invalid arguments and duplicate IDs are not accepted: the returned promise
   * rejects immediately and the task is never queued.
   */
  add<T>(
    id: string,
    task: () => Promise<T>,
    options: { priority?: number; timeoutMs?: number; retries?: number } = {},
  ): Promise<T> {
    if (typeof id !== "string" || id.length === 0) {
      return Promise.reject(new TypeError("Task id must be a non-empty string"));
    }
    if (typeof task !== "function") {
      return Promise.reject(new TypeError(`Task "${id}" must be a function`));
    }

    const { priority = 0, timeoutMs, retries = 0 } = options ?? {};

    if (typeof priority !== "number" || !Number.isFinite(priority)) {
      return Promise.reject(new RangeError(`Task "${id}": priority must be a finite number`));
    }
    if (
      timeoutMs !== undefined &&
      (typeof timeoutMs !== "number" ||
        !Number.isFinite(timeoutMs) ||
        timeoutMs <= 0 ||
        timeoutMs > TaskScheduler.MAX_TIMEOUT_MS)
    ) {
      return Promise.reject(
        new RangeError(
          `Task "${id}": timeoutMs must be > 0 and <= ${TaskScheduler.MAX_TIMEOUT_MS}`,
        ),
      );
    }
    if (!Number.isInteger(retries) || retries < 0) {
      return Promise.reject(
        new RangeError(`Task "${id}": retries must be a non-negative integer`),
      );
    }
    if (this.activeTasks.has(id)) {
      return Promise.reject(
        TaskScheduler.createError(
          "DuplicateTaskError",
          `Task "${id}" is already pending or running`,
        ),
      );
    }

    // The executor runs synchronously, so the task is registered (and can be
    // cancelled or detected as a duplicate) before add() returns.
    return new Promise<T>((resolve, reject) => {
      const entry: ScheduledTask = {
        id,
        run: task,
        priority,
        timeoutMs,
        maxAttempts: retries + 1,
        sequence: this.nextSequence++,
        attempts: 0,
        state: "pending",
        resolve: resolve as (value: unknown) => void,
        reject,
      };
      this.activeTasks.set(id, entry);
      this.enqueue(entry);
      this.scheduleDrain();
    });
  }

  /**
   * Cancels a pending task (including one waiting for a retry attempt).
   * Returns false for running, settled or unknown tasks.
   */
  cancel(id: string): boolean {
    const entry = this.activeTasks.get(id);
    if (entry === undefined || entry.state !== "pending") {
      return false;
    }

    const index = this.queue.indexOf(entry);
    if (index !== -1) {
      this.queue.splice(index, 1);
    }
    this.activeTasks.delete(id);
    this.cancelledCount++;
    entry.reject(
      TaskScheduler.createError("TaskCancelledError", `Task "${id}" was cancelled`),
    );
    return true;
  }

  /** Stops new attempts from starting. Running executions are unaffected. */
  pause(): void {
    this.paused = true;
  }

  /** Resumes starting pending tasks. */
  resume(): void {
    if (!this.paused) {
      return;
    }
    this.paused = false;
    this.scheduleDrain();
  }

  /**
   * `running` is the number of physically active executions, i.e. occupied
   * concurrency slots. It includes timed-out attempts whose underlying
   * promise has not settled yet, so it never exceeds maxConcurrency.
   * `pending` includes tasks queued for a retry attempt.
   */
  getStats(): {
    running: number;
    pending: number;
    completed: number;
    failed: number;
    cancelled: number;
  } {
    return {
      running: this.activeExecutions,
      pending: this.queue.length,
      completed: this.completedCount,
      failed: this.failedCount,
      cancelled: this.cancelledCount,
    };
  }

  /** Inserts into the sorted queue: priority descending, then sequence ascending. */
  private enqueue(entry: ScheduledTask): void {
    let low = 0;
    let high = this.queue.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      const other = this.queue[mid];
      const otherGoesFirst =
        other.priority > entry.priority ||
        (other.priority === entry.priority && other.sequence < entry.sequence);
      if (otherGoesFirst) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    this.queue.splice(low, 0, entry);
  }

  /**
   * Coalesces scheduling into one microtask. Deferring the start means tasks
   * added in the same synchronous block are ordered by priority before any of
   * them starts, and nothing a task does runs re-entrantly inside add().
   */
  private scheduleDrain(): void {
    if (this.drainScheduled) {
      return;
    }
    this.drainScheduled = true;
    queueMicrotask(() => {
      this.drainScheduled = false;
      this.drain();
    });
  }

  private drain(): void {
    // Conditions are re-checked on every iteration: a task may call pause(),
    // cancel() or add() synchronously while it is being started.
    while (
      !this.paused &&
      this.activeExecutions < this.maxConcurrency &&
      this.queue.length > 0
    ) {
      const entry = this.queue.shift() as ScheduledTask;
      this.startAttempt(entry);
    }
  }

  private startAttempt(entry: ScheduledTask): void {
    entry.state = "running";
    entry.attempts++;
    this.activeExecutions++;

    // Guards this attempt's outcome. Whichever comes first (the task settling
    // or the timeout) decides it; anything later is ignored.
    let attemptDecided = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const decide = (succeeded: boolean, valueOrError: unknown): void => {
      if (attemptDecided) {
        return;
      }
      attemptDecided = true;
      if (timer !== undefined) {
        clearTimeout(timer);
      }
      this.handleAttemptOutcome(entry, succeeded, valueOrError);
    };

    // Releases the concurrency slot only when the real execution finishes.
    const onExecutionSettled = (succeeded: boolean, valueOrError: unknown): void => {
      this.activeExecutions--;
      decide(succeeded, valueOrError);
      this.scheduleDrain();
    };

    let execution: Promise<unknown>;
    try {
      // Promise.resolve also tolerates a task that returns a non-promise value.
      execution = Promise.resolve(entry.run());
    } catch (error) {
      // Synchronous throw: treat it as a failed attempt, not a crash.
      execution = Promise.reject(error);
    }

    if (entry.timeoutMs !== undefined) {
      const timeoutMs = entry.timeoutMs;
      timer = setTimeout(() => {
        decide(
          false,
          TaskScheduler.createError(
            "TaskTimeoutError",
            `Task "${entry.id}" timed out after ${timeoutMs}ms (attempt ${entry.attempts}/${entry.maxAttempts})`,
          ),
        );
      }, timeoutMs);
    }

    // Both handlers are attached, so a timed-out execution that later rejects
    // never surfaces as an unhandled rejection.
    execution.then(
      (value) => onExecutionSettled(true, value),
      (error: unknown) => onExecutionSettled(false, error),
    );
  }

  private handleAttemptOutcome(
    entry: ScheduledTask,
    succeeded: boolean,
    valueOrError: unknown,
  ): void {
    if (succeeded) {
      this.activeTasks.delete(entry.id);
      this.completedCount++;
      entry.resolve(valueOrError);
      return;
    }

    if (entry.attempts < entry.maxAttempts) {
      // Back into the queue so the retry competes for a slot like any other
      // task. It keeps its original sequence, so it stays ahead of
      // equal-priority tasks that were added after it.
      entry.state = "pending";
      this.enqueue(entry);
      this.scheduleDrain();
      return;
    }

    this.activeTasks.delete(entry.id);
    this.failedCount++;
    entry.reject(valueOrError);
  }

  private static createError(name: string, message: string): Error {
    const error = new Error(message);
    error.name = name;
    return error;
  }
}