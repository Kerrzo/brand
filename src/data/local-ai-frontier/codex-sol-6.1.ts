export class TaskScheduler {
  private readonly maxConcurrency: number;

  private readonly pending: Array<{
    id: string;
    priority: number;
    timeoutMs: number | undefined;
    retriesRemaining: number;
    invoke: () => Promise<unknown>;
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
    state: "pending" | "running";
  }> = [];

  private readonly active = new Map<
    string,
    TaskScheduler["pending"][number]
  >();

  private paused = false;
  private drainScheduled = false;
  private running = 0;
  private completed = 0;
  private failed = 0;
  private cancelled = 0;

  constructor(maxConcurrency: number) {
    if (!Number.isSafeInteger(maxConcurrency) || maxConcurrency < 1) {
      throw new RangeError("maxConcurrency must be a positive safe integer");
    }

    this.maxConcurrency = maxConcurrency;
  }

  add<T>(
    id: string,
    task: () => Promise<T>,
    options?: {
      priority?: number;
      timeoutMs?: number;
      retries?: number;
    },
  ): Promise<T> {
    if (this.active.has(id)) {
      return Promise.reject(new Error(`Task ID is already active: ${id}`));
    }

    const { priority = 0, timeoutMs, retries = 0 } = options ?? {};

    if (!Number.isFinite(priority)) {
      return Promise.reject(new RangeError("priority must be finite"));
    }

    if (!Number.isSafeInteger(retries) || retries < 0) {
      return Promise.reject(
        new RangeError("retries must be a non-negative safe integer"),
      );
    }

    if (
      timeoutMs !== undefined &&
      (!Number.isInteger(timeoutMs) ||
        timeoutMs < 1 ||
        timeoutMs > 2_147_483_647)
    ) {
      return Promise.reject(
        new RangeError("timeoutMs must be an integer from 1 to 2147483647"),
      );
    }

    return new Promise<T>((resolve, reject) => {
      const entry: TaskScheduler["pending"][number] = {
        id,
        priority,
        timeoutMs,
        retriesRemaining: retries,
        invoke: task,
        // Only the result of this entry's own task reaches this callback.
        resolve: (value) => resolve(value as T),
        reject,
        state: "pending",
      };

      this.active.set(id, entry);
      this.enqueue(entry);
      this.scheduleDrain();
    });
  }

  cancel(id: string): boolean {
    const entry = this.active.get(id);

    if (entry === undefined || entry.state === "running") {
      return false;
    }

    this.pending.splice(this.pending.indexOf(entry), 1);
    this.active.delete(id);
    this.cancelled++;

    const error = new Error(`Task was cancelled: ${id}`);
    error.name = "AbortError";
    entry.reject(error);
    return true;
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
    this.scheduleDrain();
  }

  getStats(): {
    running: number;
    pending: number;
    completed: number;
    failed: number;
    cancelled: number;
  } {
    return {
      running: this.running,
      pending: this.pending.length,
      completed: this.completed,
      failed: this.failed,
      cancelled: this.cancelled,
    };
  }

  private enqueue(entry: TaskScheduler["pending"][number]): void {
    entry.state = "pending";

    // Insert after all entries with equal priority to preserve FIFO.
    let low = 0;
    let high = this.pending.length;

    while (low < high) {
      const middle = low + Math.floor((high - low) / 2);

      if (this.pending[middle]!.priority >= entry.priority) {
        low = middle + 1;
      } else {
        high = middle;
      }
    }

    this.pending.splice(low, 0, entry);
  }

  private scheduleDrain(): void {
    if (
      this.drainScheduled ||
      this.paused ||
      this.running >= this.maxConcurrency ||
      this.pending.length === 0
    ) {
      return;
    }

    this.drainScheduled = true;

    queueMicrotask(() => {
      this.drainScheduled = false;

      while (!this.paused && this.running < this.maxConcurrency) {
        const entry = this.pending.shift();

        if (entry === undefined) {
          return;
        }

        entry.state = "running";
        this.running++;
        void this.runAttempt(entry);
      }
    });
  }

  private async runAttempt(
    entry: TaskScheduler["pending"][number],
  ): Promise<void> {
    const { id, timeoutMs } = entry;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let timedOut = false;
    let shouldRetry = false;

    const failAttempt = (reason: unknown): void => {
      if (entry.retriesRemaining > 0) {
        entry.retriesRemaining--;
        shouldRetry = true;
        return;
      }

      this.active.delete(id);
      this.failed++;
      entry.reject(reason);
    };

    const expire = (): void => {
      timedOut = true;

      const error = new Error(`Task "${id}" timed out after ${timeoutMs} ms`);
      error.name = "TimeoutError";
      failAttempt(error);
    };

    const deadline =
      timeoutMs === undefined ? undefined : performance.now() + timeoutMs;

    if (timeoutMs !== undefined) {
      timer = setTimeout(expire, timeoutMs);
    }

    // A synchronous task body can delay the timer callback past the deadline.
    const checkDeadline = (): void => {
      if (!timedOut && deadline !== undefined && performance.now() >= deadline) {
        expire();
      }
    };

    try {
      const value = await entry.invoke();
      checkDeadline();

      if (!timedOut) {
        this.active.delete(id);
        this.completed++;
        entry.resolve(value);
      }
    } catch (error) {
      checkDeadline();

      if (!timedOut) {
        failAttempt(error);
      }
    } finally {
      if (timer !== undefined) {
        clearTimeout(timer);
      }

      this.running--;

      if (shouldRetry) {
        this.enqueue(entry);
      }

      this.scheduleDrain();
    }
  }
}
