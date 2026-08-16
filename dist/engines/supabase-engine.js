// SSDK Supabase Engine - Orchestrates Auth, User Profiles, APIService Layer, and Cloud Sync
// Converts platform into a SaaS backend system

import { APIService } from "../services/api-service.js";

export class SupabaseEngine {
  constructor() {
    this.core = null;
    this.supabase = null;
    this.auth = null;
    this.currentUser = null;
    this.api = new APIService(null);
    
    this.SUPABASE_URL = "https://wyqdfwtslkfzmorvggdq.supabase.co";
    this.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cWRmd3RzbGtmem1vcnZnZ2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3NzQ5MTYsImV4cCI6MjA5OTM1MDkxNn0.I1CPWLqtv-p3XBC2F_6f-IEBbr0M_G6JkB76vc1ZR8A";
  }

  async init(core) {
    this.core = core;
    console.log("[SupabaseEngine] Booting Universal SaaS Backend Integration...");

    if (window.location.protocol !== "file:") {
      this.loadSupabase(() => this.configureSupabase());
    } else {
      console.log("[SupabaseEngine] Local file protocol detected. Skipping backend connection.");
    }
  }

  loadSupabase(callback) {
    if (window.supabaseClient) {
      callback();
      return;
    }
    
    import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')
      .then(module => {
        window.supabaseClient = module.createClient(this.SUPABASE_URL, this.SUPABASE_ANON_KEY);
        callback();
      })
      .catch(err => console.error("[SupabaseEngine] Failed to load module", err));
  }

  async configureSupabase() {
    try {
      if (window.supabaseClient) {
        this.supabase = window.supabaseClient;
        this.auth = this.supabase.auth;
        this.api.setClient(this.supabase);

        // Listen for auth state transitions
        this.auth.onAuthStateChange(async (event, session) => {
          const user = session ? session.user : null;
          this.currentUser = user;
          console.log(`[SupabaseEngine] Auth state changed: ${event}`, user ? user.email : "Logged Out");
          
          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            await this.syncUserData();
          }
          this.updateHeaderAuthUI(user);
          window.dispatchEvent(new CustomEvent('ssdk-auth-change', { detail: user }));
        });
        
        // Initial session check
        const { data: { session } } = await this.auth.getSession();
        if (session && session.user) {
          this.currentUser = session.user;
          this.updateHeaderAuthUI(session.user);
          await this.syncUserData();
        }
      }
    } catch (e) {
      console.error("[SupabaseEngine] Configuration failed:", e);
    }
  }

  updateHeaderAuthUI(user) {
    const authBtn = document.getElementById("navAuthBtn");
    if (!authBtn) return;

    const prefix = this.core.prefix || ".";
    if (user) {
      authBtn.href = `${prefix}/pages/dashboard.html`;
      const displayName = user.user_metadata?.full_name || (user.email ? user.email.split("@")[0].substring(0, 8) : "User");
      authBtn.textContent = displayName + " (Dash)";
      authBtn.style.border = "1px solid var(--accent-color, #C084FC)";
      authBtn.style.color = "var(--accent-color, #C084FC)";
    } else {
      authBtn.href = `${prefix}/pages/login.html`;
      authBtn.textContent = "Login";
      authBtn.style.border = "1px solid var(--border-color)";
      authBtn.style.color = "var(--text-primary)";
    }
  }

  async syncUserData() {
    if (!this.currentUser) return;
    const favsEngine = this.core.getEngine("favorites");
    if (favsEngine && typeof favsEngine.syncUser === "function") {
      await favsEngine.syncUser(this.currentUser, this.supabase);
    }
  }

  // --- Auth Methods ---

  async signIn(email, password) {
    if (!this.auth) throw new Error("Supabase Auth not loaded");
    const { data, error } = await this.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  async signUp(email, password, displayName) {
    if (!this.auth) throw new Error("Supabase Auth not loaded");
    const { data, error } = await this.auth.signUp({
      email,
      password,
      options: { data: { full_name: displayName, display_name: displayName } }
    });
    return { data, error };
  }

  async signInWithGoogle() {
    if (!this.auth) throw new Error("Supabase Auth not loaded");
    const { data, error } = await this.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/pages/dashboard.html' }
    });
    return { data, error };
  }

  async signOut() {
    if (this.auth) {
      await this.auth.signOut();
      this.currentUser = null;
      window.dispatchEvent(new CustomEvent('ssdk-auth-change', { detail: null }));
      const notification = this.core.getEngine("notification");
      if (notification) {
        notification.show("Logged out successfully", "success");
      }
      
      const isProtected = window.location.pathname.includes("dashboard") || window.location.pathname.includes("admin");
      if (isProtected) {
        window.location.href = (this.core.prefix || ".") + "/index.html";
      } else {
        window.location.reload();
      }
    }
  }

  async resetPassword(email) {
    if (!this.auth) throw new Error("Supabase Auth not loaded");
    const { data, error } = await this.auth.resetPasswordForEmail(email);
    return { data, error };
  }

  // --- Profile Methods ---

  async getProfile() {
    if (!this.currentUser || !this.supabase) return null;
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', this.currentUser.id)
      .single();
    if (error && error.code !== 'PGRST116') console.error("[SupabaseEngine] Get Profile Error", error);
    return data;
  }

  async updateProfile(updates) {
    if (!this.currentUser || !this.supabase) return { data: null, error: new Error("Not authenticated") };
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', this.currentUser.id);
    return { data, error };
  }

  // --- Cloud-Synced Favorites ---

  async getCloudFavorites() {
    if (!this.currentUser || !this.supabase) return [];
    const { data, error } = await this.supabase
      .from('favorites')
      .select('tool_id')
      .eq('user_id', this.currentUser.id)
      .order('created_at', { ascending: false });
    if (error) console.error("[SupabaseEngine] Get Favorites Error", error);
    return data || [];
  }

  async addCloudFavorite(toolId) {
    if (!this.currentUser || !this.supabase) return;
    const { error } = await this.supabase.from('favorites').upsert({
      user_id: this.currentUser.id,
      tool_id: toolId
    });
    if (error) console.error("[SupabaseEngine] Add Favorite Error", error);
  }

  async removeCloudFavorite(toolId) {
    if (!this.currentUser || !this.supabase) return;
    const { error } = await this.supabase.from('favorites')
      .delete()
      .eq('user_id', this.currentUser.id)
      .eq('tool_id', toolId);
    if (error) console.error("[SupabaseEngine] Remove Favorite Error", error);
  }

  // --- Cloud-Synced History ---

  async addHistoryEntry(toolId, category = "", processingTime = 0, inputSize = 0, outputType = "text") {
    if (!this.currentUser || !this.supabase) return;
    const { error } = await this.supabase.from('tool_history').insert({
      user_id: this.currentUser.id,
      tool_id: toolId,
      tool_category: category,
      processing_time_ms: processingTime,
      input_size_bytes: inputSize,
      output_type: outputType
    });
    if (error) console.error("[SupabaseEngine] Add History Error", error);
  }

  async getHistory(limit = 50) {
    if (!this.currentUser || !this.supabase) return [];
    const { data, error } = await this.supabase
      .from('tool_history')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .order('visited_at', { ascending: false })
      .limit(limit);
    if (error) console.error("[SupabaseEngine] Get History Error", error);
    return data || [];
  }

  async clearHistory() {
    if (!this.currentUser || !this.supabase) return;
    const { error } = await this.supabase.from('tool_history')
      .delete()
      .eq('user_id', this.currentUser.id);
    if (error) console.error("[SupabaseEngine] Clear History Error", error);
  }

  // --- Storage Methods ---

  async uploadFile(bucket, path, file) {
    if (!this.supabase) throw new Error("Supabase not loaded");
    const { data, error } = await this.supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    return data;
  }

  getPublicUrl(bucket, path) {
    if (!this.supabase) return "";
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
