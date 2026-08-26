// SSDK Config Engine - Manifest Database Loader & Parser
// Configures and caches database objects from the /assets/json/ store, merging Firestore items.

export class ConfigEngine {
  constructor(prefix = ".") {
    this.prefix = prefix;
    this.cache = {};
  }

  async loadJSON(filename, isConfig = false) {
    if (this.cache[filename]) {
      return this.cache[filename];
    }
    
    try {
      const folder = isConfig ? 'configs' : 'core/registry';
      const response = await fetch(`${this.prefix}/${folder}/${filename}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status} loading ${filename}`);
      }
      const data = await response.json();
      this.cache[filename] = data;
      return data;
    } catch (e) {
      console.error(`[ConfigEngine] Failed to load JSON manifest [${filename}]:`, e);
      return null;
    }
  }

  /**
   * Fetches the entire tools registry index database.
   * Instant 0ms load directly from static registry with local memory cache.
   */
  async getTools() {
    if (this.cache["tools.json"]) {
      return this.cache["tools.json"];
    }
    const tools = await this.loadJSON("tools.json", false);
    return Array.isArray(tools) ? tools : [];
  }

  /**
   * Fetches the list of active categories.
   * Instant 0ms load directly from static registry with local memory cache.
   */
  async getCategories() {
    if (this.cache["categories.json"]) {
      return this.cache["categories.json"];
    }
    const categories = await this.loadJSON("categories.json", false);
    return Array.isArray(categories) ? categories : [];
  }

  /**
   * Fetches FAQ schemas.
   */
  async getFAQ() {
    return await this.loadJSON("faq.json") || [];
  }

  /**
   * Fetches global application configurations and resolves active environment.
   */
  async getSettings() {
    if (!this.settings) {
      this.settings = await this.loadJSON("app.json", true) || {};
      this.resolveEnvironment();
    }
    return this.settings;
  }

  /**
   * Detects active environment based on hostname matching.
   */
  resolveEnvironment() {
    this.env = "production";
    const host = window.location.hostname;
    
    if (this.settings && this.settings.environments) {
      for (const [envName, envConfig] of Object.entries(this.settings.environments)) {
        if (envConfig.hostnames && envConfig.hostnames.includes(host)) {
          this.env = envName;
          this.envConfig = envConfig;
          break;
        }
      }
      if (!this.envConfig) this.envConfig = this.settings.environments["production"];
    }
  }

  getEnv() { return this.env || "production"; }
  getEnvConfig() { return this.envConfig || {}; }
  
  getApiUrl(endpoint) {
    // Enterprise Production API URL
    const base = "https://ssdk-backend.onrender.com/api/v1";
    
    const endpoints = {
      tools: `${base}/tools`,
      categories: `${base}/categories`,
      admin: `${base}/admin`,
      medical: `${base}/medical`,
      ai: `${base}/ai`
    };
    return endpoints[endpoint] || null;
  }

  isFeatureEnabled(flag) {
    return this.settings?.features?.[flag] === true;
  }

  getThemeConfig() {
    return this.settings?.theme || {};
  }

  getSeoDefaults() {
    return this.settings?.seo || {};
  }

  // ==========================================
  // SaaS Auth API Connectors (JWT Integration)
  // ==========================================
  
  async login(email, password) {
    const apiUrl = this.getApiUrl("auth");
    if (!apiUrl) throw new Error("Auth API not configured.");
    
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData
    });
    
    if (!response.ok) throw new Error("Invalid credentials");
    
    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem("ssdk_jwt", data.access_token);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem("ssdk_jwt");
    // Trigger router reload or event
    if (this.core && this.core.getEngine("notification")) {
      this.core.getEngine("notification").show("Logged out successfully.", "info");
    }
  }

  getSessionToken() {
    return localStorage.getItem("ssdk_jwt") || null;
  }

  /**
   * Fetches the navigation schema.
   */
  async getNavigation() {
    return await this.loadJSON("navigation.json") || [];
  }

  /**
   * Fetches a specific tool details by its string ID identifier.
   */
  async getToolById(toolId) {
    const tools = await this.getTools();
    return tools.find(t => t.id === toolId || t.url === `tools/${toolId}.html` || t.url.endsWith(`/${toolId}.html`)) || null;
  }
}
export default ConfigEngine;
