// SSDK History Engine - Tracks and stores recently used tools locally and in Supabase
// Persists visited tool profiles inside a capped queue and syncs to cloud when logged in.

export class HistoryEngine {
  constructor() {
    this.core = null;
    this.storageKey = "ssdk-tool-history";
    this.maxHistory = 25;
  }

  async init(core) {
    this.core = core;
  }

  /**
   * Retrieves the history stack from localStorage.
   */
  getHistory() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn("[HistoryEngine] Failed parsing history storage:", e);
      return [];
    }
  }

  /**
   * Appends a new tool visited event to the stack.
   */
  async addVisited(tool, metadata = {}) {
    if (!tool || !tool.id) return;
    
    let list = this.getHistory();
    // Filter duplicate entries
    list = list.filter(item => item.id !== tool.id);
    
    // Add to front of stack
    const entry = {
      id: tool.id,
      name: tool.name || tool.id,
      icon: tool.icon || "🔧",
      category: tool.category || "",
      url: tool.url || `pages/tool.html?id=${tool.id}`,
      visitedAt: new Date().toISOString()
    };
    list.unshift(entry);

    // Enforce size limits
    if (list.length > this.maxHistory) {
      list.pop();
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(list));
      
      // Sync to Supabase if user is logged in
      const supabaseEngine = this.core.getEngine("supabase");
      if (supabaseEngine && supabaseEngine.currentUser) {
        const timeMs = metadata.processingTime || 0;
        const sizeBytes = metadata.inputSize || 0;
        const outType = metadata.outputType || "text";
        supabaseEngine.addHistoryEntry(tool.id, tool.category || "", timeMs, sizeBytes, outType)
          .catch(e => console.warn("[HistoryEngine] Supabase sync failed:", e));
      }
      
      // Dispatch update event
      window.dispatchEvent(new CustomEvent('ssdk-history-updated', { detail: list }));
    } catch (e) {
      console.error("[HistoryEngine] Failed to save history entry:", e);
    }
  }

  /**
   * Clears all history records locally and in Supabase.
   */
  async clearHistory() {
    localStorage.removeItem(this.storageKey);
    window.dispatchEvent(new CustomEvent('ssdk-history-updated', { detail: [] }));

    const supabaseEngine = this.core.getEngine("supabase");
    if (supabaseEngine && supabaseEngine.currentUser) {
      try {
        await supabaseEngine.clearHistory();
      } catch (e) {
        console.warn("[HistoryEngine] Supabase clear history failed:", e);
      }
    }
  }
}
