// SSDK Feature Engine - Enterprise SaaS Foundation
// Manages Feature Flags and Capability-based Permissions.

export class FeatureEngine {
  constructor() {
    this.core = null;
    this.supabase = null;
    
    // Default Fallback Feature Flags (100% FREE Launch Config)
    this.flags = {
      // Module System Flags
      search_enabled: true,
      blog_enabled: false,
      community_enabled: false,
      developer_platform_enabled: true,
      marketplace_enabled: false,
      plugins_enabled: false,
      authentication_enabled: true,
      storage_enabled: true,
      
      // Monetization & SaaS
      premium_enabled: false,
      payments_enabled: false,
      subscription_enabled: false,
      ads_enabled: false,
      billing_enabled: false,
      api_billing_enabled: false,
      referral_enabled: false,
      affiliate_enabled: false,

      // Platform Apps
      browser_extension_enabled: false,
      desktop_app_enabled: false,
      mobile_app_enabled: false,

      // AI Features
      ai_enabled: true, // Basic local AI is enabled
      premium_ai_enabled: false,
      
      // Legacy flags
      all_tools_free: true,
      api_keys_enabled: true,
      cloud_storage_enabled: false,
      team_workspace_enabled: false,
      priority_processing_enabled: false,
      beta_tools_enabled: false,
      maintenance_mode: false,
      public_api_enabled: true
    };
  }

  async init(core) {
    this.core = core;
    const supabaseEngine = this.core.getEngine("supabase");
    if (supabaseEngine) {
      this.supabase = supabaseEngine.supabase;
      // Fetch platform settings from DB to override local defaults if DB is active
      await this.fetchRemoteFlags();
    }
    
    console.log("[FeatureEngine] SaaS Feature Flags Initialized:", this.flags);
    this.applyUIVisibilityRules();
  }

  async fetchRemoteFlags() {
    if (!this.supabase) return;
    try {
      const { data, error } = await this.supabase
        .from("platform_settings")
        .select("*")
        .eq("id", "feature_flags")
        .single();
        
      if (data && data.value) {
        this.flags = { ...this.flags, ...data.value };
      }
    } catch (e) {
      console.warn("[FeatureEngine] Remote flags fetch failed, using local defaults.");
    }
  }

  /**
   * Evaluates if a feature flag is enabled globally.
   */
  isEnabled(flagKey) {
    return this.flags[flagKey] === true;
  }

  /**
   * Capability-based Permission Engine.
   * Checks if the CURRENT USER has permission to perform an action.
   */
  can(capability, userProfile = null) {
    // If premium features are globally disabled, grant access (100% Free Mode)
    if (!this.flags.premium_enabled) {
      return true;
    }

    // In a premium active state, logic depends on capability and user profile
    const plan = userProfile ? (userProfile.plan || "FREE") : "FREE";
    const isAdmin = userProfile && (userProfile.role === "admin" || userProfile.role === "super_admin");

    if (isAdmin) return true;

    switch (capability) {
      case "can_use_ai":
        return plan !== "FREE" || this.flags.all_tools_free;
      case "can_use_api":
        return this.flags.public_api_enabled;
      case "can_use_cloud_storage":
        return this.flags.cloud_storage_enabled && plan !== "FREE";
      case "can_priority_processing":
        return this.flags.priority_processing_enabled && plan !== "FREE";
      default:
        return true; // Default allow for unknown capabilities
    }
  }

  /**
   * Modifies the UI based on global feature flags.
   */
  applyUIVisibilityRules() {
    // Wait for DOM to settle
    setTimeout(() => {
      // 1. Hide Premium UI Elements if Premium is disabled
      if (!this.flags.premium_enabled) {
        document.querySelectorAll(".premium-only").forEach(el => el.style.display = "none");
        document.querySelectorAll("[data-premium-required]").forEach(el => el.style.display = "none");
      }

      // 2. Hide Ads if Ads are disabled
      if (!this.flags.ads_enabled) {
        document.querySelectorAll(".ad-container").forEach(el => el.style.display = "none");
      }

      // 3. Maintenance Mode
      if (this.flags.maintenance_mode) {
        console.warn("[FeatureEngine] PLATFORM IS IN MAINTENANCE MODE");
      }
    }, 200);
  }
}
