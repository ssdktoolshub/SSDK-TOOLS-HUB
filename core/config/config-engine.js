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
   * Merges static registry with dynamic admin-created custom tools.
   */
  async getTools() {
    let baseTools = [];
    if (this.cache["tools.json"]) {
      baseTools = this.cache["tools.json"];
    } else {
      const tools = await this.loadJSON("tools.json", false);
      baseTools = Array.isArray(tools) ? tools : [];
    }

    try {
      const customTools = JSON.parse(localStorage.getItem("ssdk_custom_tools") || "[]");
      if (Array.isArray(customTools) && customTools.length > 0) {
        const map = new Map();
        baseTools.forEach(t => map.set(t.id, t));
        customTools.forEach(t => map.set(t.id, t));
        return Array.from(map.values());
      }
    } catch (e) {
      console.warn("[ConfigEngine] Could not read custom tools from storage:", e);
    }
    return baseTools;
  }

  /**
   * Fetches the list of active categories.
   * Merges static registry with dynamic admin-created custom categories.
   */
  async getCategories() {
    let baseCats = [];
    if (this.cache["categories.json"]) {
      baseCats = this.cache["categories.json"];
    } else {
      const categories = await this.loadJSON("categories.json", false);
      baseCats = Array.isArray(categories) ? categories : [];
    }

    try {
      const customCats = JSON.parse(localStorage.getItem("ssdk_custom_categories") || "[]");
      if (Array.isArray(customCats) && customCats.length > 0) {
        const map = new Map();
        baseCats.forEach(c => map.set(c.id || c.name, c));
        customCats.forEach(c => map.set(c.id || c.name, c));
        return Array.from(map.values());
      }
    } catch (e) {
      console.warn("[ConfigEngine] Could not read custom categories from storage:", e);
    }
    return baseCats;
  }

  /**
   * Saves a newly created or edited custom tool from the Admin Panel.
   */
  saveCustomTool(tool) {
    try {
      const customTools = JSON.parse(localStorage.getItem("ssdk_custom_tools") || "[]");
      const idx = customTools.findIndex(t => t.id === tool.id);
      if (idx >= 0) {
        customTools[idx] = tool;
      } else {
        customTools.unshift(tool);
      }
      localStorage.setItem("ssdk_custom_tools", JSON.stringify(customTools));
      delete this.cache["tools.json"];
      if (this.core && this.core.getEngine("search")) {
        this.core.getEngine("search").buildIndex();
      }
      return true;
    } catch (e) {
      console.error("[ConfigEngine] Failed to save custom tool:", e);
      return false;
    }
  }

  /**
   * Deletes a custom tool from browser storage.
   */
  deleteCustomTool(toolId) {
    try {
      const customTools = JSON.parse(localStorage.getItem("ssdk_custom_tools") || "[]");
      const filtered = customTools.filter(t => t.id !== toolId);
      localStorage.setItem("ssdk_custom_tools", JSON.stringify(filtered));
      delete this.cache["tools.json"];
      if (this.core && this.core.getEngine("search")) {
        this.core.getEngine("search").buildIndex();
      }
      return true;
    } catch (e) {
      console.error("[ConfigEngine] Failed to delete custom tool:", e);
      return false;
    }
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
