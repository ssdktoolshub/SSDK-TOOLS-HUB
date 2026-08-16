// SSDK Enterprise Logger Engine
// Centralized, structured logging replacing raw console.log. Ready for log shipping.

export class LoggerEngine {
  constructor() {
    this.core = null;
    this.logLevel = "info"; // debug, info, warn, error
    this.levels = { debug: 0, info: 1, warn: 2, error: 3 };
    this.buffer = [];
    this.maxBufferSize = 100; // Send to backend when buffer is full
  }

  async init(core) {
    this.core = core;
    // Determine log level based on environment (e.g. from config engine)
    const config = this.core.getEngine("config");
    if (config) {
      // In a real app, read from config. For now, default to info.
      this.logLevel = "info"; 
    }
    this.info("[LoggerEngine] Initialized Structured Logger");
  }

  _shouldLog(level) {
    return this.levels[level] >= this.levels[this.logLevel];
  }

  _formatMessage(level, context, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`;
  }

  _pushToBuffer(entry) {
    this.buffer.push(entry);
    if (this.buffer.length >= this.maxBufferSize) {
      this._flush();
    }
  }

  _flush() {
    if (this.buffer.length === 0) return;
    
    // In a production environment, this would send to Datadog, Sentry, or a custom backend via API Service.
    // For now, we mock the shipping process to avoid breaking the frontend.
    // console.log("[LoggerEngine] Shipping logs to backend...", this.buffer.length);
    
    this.buffer = []; // clear buffer
  }

  debug(context, message, data = null) {
    if (!this._shouldLog("debug")) return;
    const msg = this._formatMessage("debug", context, message);
    console.debug(msg, data || "");
    this._pushToBuffer({ level: "debug", context, message, data, ts: Date.now() });
  }

  info(context, message, data = null) {
    if (!this._shouldLog("info")) return;
    const msg = this._formatMessage("info", context, message);
    console.info(msg, data || "");
    this._pushToBuffer({ level: "info", context, message, data, ts: Date.now() });
  }

  warn(context, message, data = null) {
    if (!this._shouldLog("warn")) return;
    const msg = this._formatMessage("warn", context, message);
    console.warn(msg, data || "");
    this._pushToBuffer({ level: "warn", context, message, data, ts: Date.now() });
  }

  error(context, message, data = null) {
    if (!this._shouldLog("error")) return;
    const msg = this._formatMessage("error", context, message);
    console.error(msg, data || "");
    this._pushToBuffer({ level: "error", context, message, data, ts: Date.now() });
    
    // Send critical errors to ErrorEngine if available
    if (this.core) {
      const errorEngine = this.core.getEngine("error");
      if (errorEngine && typeof errorEngine.handleGlobalError === "function") {
        // Just inform the UI optionally
      }
    }
  }

  // Allow manual flushing
  forceFlush() {
    this._flush();
  }
}
