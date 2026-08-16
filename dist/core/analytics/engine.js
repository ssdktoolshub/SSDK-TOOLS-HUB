// SSDK Analytics Engine - Measures page views, operations runs, copies, and downloads metric events
// Saves usage logs in localStorage and batches synchronization to Supabase analytics_events.

export class AnalyticsEngine {
  constructor() {
    this.core = null;
    this.storageKey = "ssdk-analytics-logs";
    this.eventBuffer = [];
    this.flushThreshold = 5;
    this.flushTimer = null;
  }

  async init(core) {
    this.core = core;
    this.logEvent("session", "start", window.location.pathname);

    // Flush on page unload
    window.addEventListener("beforeunload", () => {
      this.flushEvents(true);
    });
  }

  /**
   * Records an analytics event block.
   */
  logEvent(category, action, label = "", value = null, metadata = {}) {
    const event = {
      event_category: category,
      event_type: action,
      tool_id: label,
      metadata: { value, ...metadata },
      created_at: new Date().toISOString()
    };

    this.saveEventLocally(event);
    this.queueEventForCloud(event);
  }

  saveEventLocally(event) {
    try {
      const stored = localStorage.getItem(this.storageKey);
      const list = stored ? JSON.parse(stored) : [];
      list.push(event);

      // Limit memory stack to 100 entries locally
      if (list.length > 100) {
        list.shift();
      }
      localStorage.setItem(this.storageKey, JSON.stringify(list));
    } catch (e) {
      console.warn("[AnalyticsEngine] Local storage failed:", e);
    }
  }

  queueEventForCloud(event) {
    this.eventBuffer.push(event);
    if (this.eventBuffer.length >= this.flushThreshold) {
      this.flushEvents();
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flushEvents(), 10000);
    }
  }

  async flushEvents(sync = false) {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.eventBuffer.length === 0) return;

    const eventsToSend = [...this.eventBuffer];
    this.eventBuffer = [];

    const supabaseEngine = this.core ? this.core.getEngine("supabase") : null;
    if (supabaseEngine && supabaseEngine.supabase) {
      const userId = supabaseEngine.currentUser ? supabaseEngine.currentUser.id : null;
      const records = eventsToSend.map(e => ({
        user_id: userId,
        event_type: e.event_type,
        event_category: e.event_category,
        tool_id: e.tool_id || null,
        metadata: e.metadata || {},
        created_at: e.created_at
      }));

      try {
        await supabaseEngine.supabase.from("analytics_events").insert(records);
      } catch (err) {
        console.warn("[AnalyticsEngine] Supabase batch push failed:", err);
      }
    }
  }

  /**
   * Enterprise KPI Tracking Hooks
   */
  logProcessingTime(toolId, startTimeMs) {
    const duration = performance.now() - startTimeMs;
    this.logEvent("performance", "processing_time", toolId, Math.round(duration));
  }

  logDownload(toolId) {
    this.logEvent("tool_interaction", "download", toolId);
  }

  logUpload(toolId, fileType = "") {
    this.logEvent("tool_interaction", "upload", toolId, null, { fileType });
  }

  logCategoryUsage(category) {
    this.logEvent("navigation", "category_usage", category);
  }

  /**
   * Retrieves the event list.
   */
  getEvents() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  clearEvents() {
    localStorage.removeItem(this.storageKey);
  }
}
