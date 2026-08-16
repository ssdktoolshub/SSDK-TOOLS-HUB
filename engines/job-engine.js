// SSDK Enterprise Background Job Engine
// Abstracts setTimeout/setInterval and provides Web Worker batch processing

export class JobEngine {
  constructor() {
    this.core = null;
    this.queue = [];
    this.isProcessing = false;
    this.workers = new Map();
    this.intervals = new Map();
  }

  async init(core) {
    this.core = core;
    const logger = this.core.getEngine("logger");
    if (logger) {
      logger.info("JobEngine", "Job Queue Initialized");
    }
  }

  /**
   * Schedule a low-priority task to run without blocking the main thread UI
   * Uses requestIdleCallback if available
   */
  scheduleTask(name, taskFn) {
    this.queue.push({ name, fn: taskFn });
    this._processQueue();
  }

  _processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const processNext = (deadline) => {
      while (this.queue.length > 0 && (deadline ? deadline.timeRemaining() > 0 : true)) {
        const job = this.queue.shift();
        try {
          job.fn();
        } catch (e) {
          const logger = this.core ? this.core.getEngine("logger") : null;
          if (logger) logger.error("JobEngine", `Task failed: ${job.name}`, e);
        }
      }
      
      if (this.queue.length > 0) {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(processNext);
        } else {
          setTimeout(() => processNext(), 50);
        }
      } else {
        this.isProcessing = false;
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(processNext);
    } else {
      setTimeout(() => processNext(), 0);
    }
  }

  /**
   * Register a repeating background cron job
   */
  registerCron(name, taskFn, intervalMs) {
    if (this.intervals.has(name)) {
      clearInterval(this.intervals.get(name));
    }
    const id = setInterval(taskFn, intervalMs);
    this.intervals.set(name, id);
  }

  cancelCron(name) {
    if (this.intervals.has(name)) {
      clearInterval(this.intervals.get(name));
      this.intervals.delete(name);
    }
  }

  /**
   * Run a heavy computational task in an isolated Web Worker
   * Note: taskFn must be self-contained (no closures over main thread vars)
   */
  runInWorker(name, taskFn, data) {
    return new Promise((resolve, reject) => {
      if (!window.Worker) {
        // Fallback to main thread
        try {
          resolve(taskFn(data));
        } catch(e) {
          reject(e);
        }
        return;
      }

      // Create blob from function string
      const code = `
        self.onmessage = function(e) {
          const fn = ${taskFn.toString()};
          try {
            const result = fn(e.data);
            self.postMessage({ type: 'SUCCESS', payload: result });
          } catch(err) {
            self.postMessage({ type: 'ERROR', payload: err.message });
          }
        };
      `;
      
      const blob = new Blob([code], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);
      
      worker.onmessage = (e) => {
        if (e.data.type === 'SUCCESS') {
          resolve(e.data.payload);
        } else {
          reject(new Error(e.data.payload));
        }
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      };
      
      worker.onerror = (err) => {
        reject(err);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      };
      
      worker.postMessage(data);
    });
  }
}
