// SSDK API Service - Clean Abstraction Layer for Supabase Backend
// Eliminates direct database calls from UI components.

export class APIService {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }

  setClient(client) {
    this.supabase = client;
  }

  // --- USER PROFILES ---
  async getProfile(userId) {
    if (!this.supabase) return null;
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      console.warn("[APIService] Profile fetch error:", error);
      return null;
    }
    return data;
  }

  async updateProfile(userId, profileData) {
    if (!this.supabase) return null;
    const { data, error } = await this.supabase
      .from("profiles")
      .upsert({ id: userId, ...profileData, updated_at: new Date().toISOString() });
    if (error) throw error;
    return data;
  }

  // --- FAVORITES ---
  async getFavorites(userId) {
    if (!this.supabase) return [];
    const { data, error } = await this.supabase
      .from("favorites")
      .select("tool_id")
      .eq("user_id", userId);
    if (error) {
      console.warn("[APIService] Favorites fetch error:", error);
      return [];
    }
    return data.map(f => f.tool_id);
  }

  async addFavorite(userId, toolId) {
    if (!this.supabase) return null;
    const { data, error } = await this.supabase
      .from("favorites")
      .insert([{ user_id: userId, tool_id: toolId }]);
    if (error) throw error;
    return data;
  }

  async removeFavorite(userId, toolId) {
    if (!this.supabase) return null;
    const { data, error } = await this.supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("tool_id", toolId);
    if (error) throw error;
    return data;
  }

  // --- SAVED RESULTS ---
  async getSavedResults(userId) {
    if (!this.supabase) return [];
    const { data, error } = await this.supabase
      .from("saved_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data;
  }

  async saveResult(userId, toolId, title, payload) {
    if (!this.supabase) return null;
    const { data, error } = await this.supabase
      .from("saved_results")
      .insert([{ user_id: userId, tool_id: toolId, title, result_payload: payload }]);
    if (error) throw error;
    return data;
  }

  // --- NOTIFICATIONS ---
  async getNotifications(userId) {
    if (!this.supabase) return [];
    const { data, error } = await this.supabase
      .from("notifications")
      .select("*")
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data;
  }

  // --- SEARCH ANALYTICS ---
  async logSearchQuery(query, resultsCount = 0, userId = null) {
    if (!this.supabase) return;
    try {
      await this.supabase
        .from("search_analytics")
        .insert([{ query, results_count: resultsCount, user_id: userId }]);
    } catch (e) {
      console.warn("[APIService] Search analytics log error", e);
    }
  }

  // --- API KEYS ---
  async getAPIKeys(userId) {
    if (!this.supabase) return [];
    const { data, error } = await this.supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", userId);
    if (error) return [];
    return data;
  }

  async generateAPIKey(userId, name) {
    const rawKey = "ssdk_live_" + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const prefix = rawKey.substring(0, 14) + "...";
    if (this.supabase) {
      await this.supabase.from("api_keys").insert([{
        user_id: userId,
        name: name,
        key_prefix: prefix,
        key_hash: rawKey
      }]);
    }
    return { rawKey, prefix, name };
  }
}
