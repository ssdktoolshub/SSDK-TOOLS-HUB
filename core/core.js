// SSDK Core Engine Orchestrator

import { ConfigEngine } from "../engines/config-engine.js";

export class CoreEngine {
  constructor() {
    this.prefix = this.determineDepth();
    this.config = new ConfigEngine(this.prefix);
    this.engines = {
      config: this.config
    };
  }

  /**
   * Calculates directory depth dynamically for asset linking.
   */
  determineDepth() {
    const path = window.location.pathname;
    if (path.includes("/pages/") || path.includes("/tools/") || path.includes("/categories/")) {
      return "..";
    }
    return ".";
  }

  /**
   * Registers a sub-engine module.
   */
  registerEngine(name, engineInstance) {
    this.engines[name] = engineInstance;
    console.log(`[CoreEngine] Sub-engine registered: ${name}`);
  }

  /**
   * Bootstraps all active sub-engines in a strict, dependency-safe sequence.
   */
  async init() {
    console.log("[CoreEngine] Initializing SSDK Core in safe sequence...");
    
    // 1. Initialize Theme first to apply custom properties before paint
    if (this.engines["theme"]) {
      await this.engines["theme"].init(this);
    }

    // 2. Initialize all data caching and helper utility engines
    const baseEngines = ["history", "favorites", "analytics", "notification", "recommendation", "firebase", "python", "ai", "plugin", "update", "search", "seo", "tool"];
    for (const name of baseEngines) {
      const engine = this.engines[name];
      if (engine && typeof engine.init === "function") {
        await engine.init(this);
      }
    }

    // 3. Initialize Homepage rendering engine
    if (this.engines["homepage"]) {
      await this.engines["homepage"].init(this);
    }

    // 4. Initialize Router last once all modules are ready
    if (this.engines["router"]) {
      await this.engines["router"].init(this);
    }

    console.log("[CoreEngine] SSDK Core fully booted.");
  }

  /**
   * Retrieval helper for engines.
   */
  getEngine(name) {
    return this.engines[name] || null;
  }
}
