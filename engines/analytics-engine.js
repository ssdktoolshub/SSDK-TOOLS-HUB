// SSDK Analytics Engine - Measures page views, operations runs, copies, and downloads metric events

export class AnalyticsEngine {
  constructor() {
    this.core = null;
    this.storageKey = "ssdk-analytics-logs";
  }

  async init(core) {
    this.core = core;
    this.logEvent("session", "start", window.location.pathname);
  }

  /**
   * Records an analytics event block.
   */
  logEvent(category, action, label = "", value = null) {
    const event = {
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString()
    };

    console.log(`[AnalyticsEngine] Event Logged:`, event);
    this.saveEvent(event);
  }

  saveEvent(event) {
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
      console.warn("[AnalyticsEngine] Storage failed:", e);
    }
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
