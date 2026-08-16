// SSDK Enterprise Security Engine
// Handles JWT Validation, RBAC, Input Sanitization, and Rate Limiting

export class SecurityEngine {
  constructor() {
    this.core = null;
    this.session = null;
    this.rateLimits = new Map();
    this.maxRequestsPerMinute = 60; // Default rate limit
  }

  async init(core) {
    this.core = core;
    console.log("[SecurityEngine] Initializing Enterprise Security Layer...");
    
    // Attempt to hydrate session from StorageEngine if available
    const storage = this.core.getEngine("storage");
    if (storage) {
      const storedToken = storage.getItem("ssdk-auth-token");
      if (storedToken) {
        this.validateJWT(storedToken);
      }
    }
  }

  /**
   * Basic JWT parsing and validation (Client-side signature checking is mocked as it usually happens on backend)
   */
  validateJWT(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error("Invalid JWT format");
      
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp * 1000;
      
      if (Date.now() >= exp) {
        console.warn("[SecurityEngine] Token expired.");
        this.session = null;
        return false;
      }
      
      this.session = payload;
      return true;
    } catch (e) {
      console.error("[SecurityEngine] JWT Validation Failed", e);
      return false;
    }
  }

  /**
   * Session Management helper
   */
  getSession() {
    return this.session;
  }

  setSession(token) {
    if (this.validateJWT(token)) {
      const storage = this.core.getEngine("storage");
      if (storage) storage.setItem("ssdk-auth-token", token);
      return true;
    }
    return false;
  }

  clearSession() {
    this.session = null;
    const storage = this.core.getEngine("storage");
    if (storage) storage.removeItem("ssdk-auth-token");
  }

  /**
   * Role Based Access Control (RBAC)
   */
  hasRole(requiredRole) {
    if (!this.session || !this.session.role) return false;
    const roles = Array.isArray(this.session.role) ? this.session.role : [this.session.role];
    return roles.includes(requiredRole) || roles.includes("admin");
  }

  canAccessFeature(featureId) {
    // If it's a completely open platform (Phase 11 Strategy)
    const featureEngine = this.core.getEngine("feature");
    if (featureEngine && featureEngine.flags.isPremiumEnabled === false) {
      return true;
    }
    
    // Otherwise check roles
    if (!this.session) return false;
    return this.hasRole("premium") || this.hasRole("admin");
  }

  /**
   * Input Sanitization against XSS
   */
  sanitizeInput(input) {
    if (typeof input !== "string") return input;
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return input.replace(reg, (match) => (map[match]));
  }

  /**
   * Rate Limiting (Client-side throttling)
   * Prevents spamming API calls from the UI
   */
  checkRateLimit(actionId) {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    
    if (!this.rateLimits.has(actionId)) {
      this.rateLimits.set(actionId, []);
    }
    
    const timestamps = this.rateLimits.get(actionId);
    // Filter timestamps within the last minute
    const recent = timestamps.filter(ts => now - ts < windowMs);
    
    if (recent.length >= this.maxRequestsPerMinute) {
      console.warn(`[SecurityEngine] Rate limit exceeded for action: ${actionId}`);
      return false; // Rate limit exceeded
    }
    
    recent.push(now);
    this.rateLimits.set(actionId, recent);
    return true; // Allowed
  }
}
