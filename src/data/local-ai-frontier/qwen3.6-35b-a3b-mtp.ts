export class TaskScheduler {
  private maxConcurrency: number;
  private activeCount = 0;
  private isPaused = false;
  private heap: TaskEntry[] = [];
  private tasksMap = new Map<string, TaskEntry>();
  private seqCounter = 0;
  private stats = { running: 0, pending: 0, completed: 0, failed: 0, cancelled: 0 };

  constructor(maxConcurrency: number) {
    if (maxConcurrency < 1) throw new Error('maxConcurrency must be >= 1');
    this.maxConcurrency = maxConcurrency;
  }

  add<T>(id: string, task: () => Promise<T>, options?: { priority?: number; timeoutMs?: number; retries?: number }): Promise<T> {
    if (this.tasksMap.has(id)) {
      return Promise.reject(new Error(`Task with id '${id}' is already pending or running.`));
    }

    const priority = options?.priority ?? 0;
    const timeoutMs = options?.timeoutMs;
    const retriesLeft = Math.max(0, options?.retries ?? 0);
    const seq = this.seqCounter++;

    return new Promise<T>((resolve, reject) => {
      const entry: TaskEntry = {
        id, status: 'pending', priority, timeoutMs, retriesLeft, seq, taskFn: task as () => Promise<any>, resolve, reject, timerId: undefined
      };
      this.tasksMap.set(id, entry);
      this.stats.pending++;
      this.heap.push(entry);
      this.siftUp(this.heap.length - 1);
      this.scheduleNext();
    });
  }

  cancel(id: string): boolean {
    const entry = this.tasksMap.get(id);
    if (!entry || entry.status !== 'pending') return false;

    entry.status = 'cancelled';
    this.stats.pending--;
    this.stats.cancelled++;
    entry.reject(new Error('Cancelled'));
    this.tasksMap.delete(id);
    this.scheduleNext();
    return true;
  }

  pause(): void { this.isPaused = true; }
  resume(): void { this.isPaused = false; this.scheduleNext(); }

  getStats() {
    return { ...this.stats };
  }

  private scheduleNext(): void {
    while (!this.isPaused && this.activeCount < this.maxConcurrency) {
      const entry = this.popFromHeap();
      if (!entry || entry.status !== 'pending') break;
      this.executeTask(entry);
    }
  }

  private executeTask(entry: TaskEntry): void {
    this.stats.running++;
    entry.status = 'running';

    const onSettle = (success: boolean, value?: any) => {
      if (entry.status !== 'running') return; // Guard against double settlement
      clearTimeout(entry.timerId);
      this.activeCount--;
      this.stats.running--;
      this.tasksMap.delete(entry.id);
      entry.status = 'settled';

      if (success) {
        this.stats.completed++;
        entry.resolve(value);
      } else {
        if (entry.retriesLeft > 0) {
          entry.retriesLeft--;
          entry.status = 'pending';
          this.stats.pending++;
          this.heap.push(entry);
          this.siftUp(this.heap.length - 1);
          this.scheduleNext();
        } else {
          this.stats.failed++;
          entry.reject(value);
        }
      }
    };

    const timeoutPromise = new Promise<never>((_, reject) => {
      if (entry.timeoutMs != null && entry.timeoutMs > 0) {
        entry.timerId = setTimeout(() => reject(new Error('Timeout')), entry.timeoutMs);
      }
    });

    // Detach original task to prevent unhandled rejection warnings when it continues in background after timeout
    const userTask = entry.taskFn();
    userTask.catch(() => {});

    Promise.race([timeoutPromise, userTask])
      .then(res => onSettle(true, res))
      .catch(err => onSettle(false, err));
  }

  private siftUp(i: number): void {
    const entry = this.heap[i];
    while (i > 0) {
      const parentIdx = (i - 1) >>> 1;
      if (this.compare(this.heap[parentIdx], entry) <= 0) break;
      this.heap[i] = this.heap[parentIdx];
      i = parentIdx;
    }
    this.heap[i] = entry;
  }

  private popFromHeap(): TaskEntry | undefined {
    while (this.heap.length > 0) {
      const last = this.heap.pop();
      if (!last || this.heap.length === 0) return last;
      const root = this.heap[0];
      this.heap[0] = last;

      let i = 0;
      while (true) {
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        let smallest = i;
        if (left < this.heap.length && this.compare(this.heap[left], this.heap[smallest]) < 0) smallest = left;
        if (right < this.heap.length && this.compare(this.heap[right], this.heap[smallest]) < 0) smallest = right;
        if (smallest === i) break;
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        i = smallest;
      }

      // Lazy removal of cancelled tasks
      if (root.status !== 'cancelled') return root;
    }
    return undefined;
  }

  private compare(a: TaskEntry, b: TaskEntry): number {
    if (a.priority !== b.priority) return b.priority - a.priority; // Descending priority
    return a.seq - b.seq; // FIFO for equal priorities
  }
}

interface TaskEntry {
  id: string;
  status: 'pending' | 'running';
  priority: number;
  timeoutMs?: number;
  retriesLeft: number;
  seq: number;
  taskFn: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  timerId?: ReturnType<typeof setTimeout>;
}
