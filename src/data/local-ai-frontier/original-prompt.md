# Original coding challenge

You are a senior TypeScript engineer. Implement a production-quality in-memory task scheduler as a SINGLE TypeScript class named TaskScheduler.

Requirements:

1. API:
- constructor(maxConcurrency: number)
- add<T>(id: string, task: () => Promise<T>, options?: { priority?: number; timeoutMs?: number; retries?: number }): Promise<T>
- cancel(id: string): boolean
- pause(): void
- resume(): void
- getStats(): { running: number; pending: number; completed: number; failed: number; cancelled: number }

2. Execute no more than maxConcurrency tasks simultaneously.
3. Pending tasks run in descending priority order; equal priorities use FIFO.
4. Reject duplicate IDs while an existing task with the same ID is pending or running. Permit reuse once settled.
5. Each task may have an execution timeout and configurable retries.
6. Retry failed or timed-out tasks up to the configured number of retries. Retries must respect maxConcurrency.
7. Cancellation of pending tasks must reject their promises and prevent execution.
8. Running tasks cannot be forcibly stopped; cancel(id) must return false for running tasks.
9. pause() prevents new tasks from starting but does not interrupt running tasks.
10. resume() continues scheduling pending tasks.
11. Every accepted task must settle exactly once, even with timeouts, retries, cancellation and synchronous exceptions.
12. A timed-out task may continue running in the background. It must NOT allow the scheduler to exceed maxConcurrency in physically active task executions.
13. No external dependencies.

Deliver:
- The complete implementation as one TypeScript class.
- A short explanation of how you handle concurrency, timeouts and retries.
- Five concrete edge cases your implementation handles.

Prioritise correctness, readability and maintainability over cleverness. Do not omit functionality or use pseudocode. Do not create additional top-level classes or helper functions.
