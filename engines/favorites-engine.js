// SSDK Favorites Engine - Synchronizes favorited tools locally or via Supabase
// Integrates client-side favorites persistence with Cloud storage backups on auth change.

export class FavoritesEngine {
  constructor() {
    this.core = null;
    this.storageKey = "ssdk-tool-favorites";
    this.favsSet = new Set();
    this.currentUser = null;
    this.supabase = null;
  }

  async init(core) {
    this.core = core;
    this.loadLocalFavorites();

    // Listen for auth change events
    window.addEventListener('ssdk-auth-change', (e) => {
      const user = e.detail;
      const supabaseEngine = this.core.getEngine("supabase");
      if (supabaseEngine) {
        this.syncUser(user, supabaseEngine.supabase);
      }
    });
  }

  loadLocalFavorites() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      const list = stored ? JSON.parse(stored) : [];
      this.favsSet = new Set(list.map(t => typeof t === "string" ? t : (t.id || t)));
    } catch (e) {
      console.warn("[FavoritesEngine] Failed parsing local favorites storage", e);
      this.favsSet = new Set();
    }
  }

  isFavorite(toolId) {
    return this.favsSet.has(toolId);
  }

  getFavorites() {
    return Array.from(this.favsSet);
  }

  async toggleFavorite(tool) {
    if (!tool || !tool.id) return;

    const notification = this.core.getEngine("notification");
    const isAdding = !this.favsSet.has(tool.id);

    if (isAdding) {
      this.favsSet.add(tool.id);
      if (notification) notification.show(`Added ${tool.name || tool.id} to Favorites`, "success");
    } else {
      this.favsSet.delete(tool.id);
      if (notification) notification.show(`Removed ${tool.name || tool.id} from Favorites`, "info");
    }

    // Save locally
    const list = Array.from(this.favsSet);
    localStorage.setItem(this.storageKey, JSON.stringify(list));

    // Dispatch update event for UI reactivity
    window.dispatchEvent(new CustomEvent('ssdk-favorites-updated', { detail: list }));

    // Sync to Supabase if user is logged in
    const supabaseEngine = this.core.getEngine("supabase");
    if (supabaseEngine && supabaseEngine.currentUser) {
      try {
        if (isAdding) {
          await supabaseEngine.addCloudFavorite(tool.id);
        } else {
          await supabaseEngine.removeCloudFavorite(tool.id);
        }
      } catch (err) {
        console.warn("[FavoritesEngine] Supabase sync failed, local backup active:", err);
      }
    }
  }

  async syncUser(user, supabase) {
    this.currentUser = user;
    this.supabase = supabase;

    if (user && supabase) {
      try {
        const { data, error } = await supabase.from('favorites').select('tool_id').eq('user_id', user.id);
        if (data && !error) {
          data.forEach(f => this.favsSet.add(f.tool_id));
          const list = Array.from(this.favsSet);
          localStorage.setItem(this.storageKey, JSON.stringify(list));
          window.dispatchEvent(new CustomEvent('ssdk-favorites-updated', { detail: list }));
          console.log("[FavoritesEngine] Merged local and cloud favorites. Total:", list.length);
        }
      } catch (e) {
        console.warn("[FavoritesEngine] Cloud download failed:", e);
      }
    } else {
      this.currentUser = null;
      this.supabase = null;
    }
  }
}
