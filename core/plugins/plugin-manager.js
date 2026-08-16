// SSDK Enterprise Plugin Manager
// Abstracts dynamic loading and lifecycle of community plugins

export class PluginManager {
  constructor() {
    this.core = null;
    this.plugins = new Map();
    this.isEnabled = false;
  }

  async init(core) {
    this.core = core;
    const featureEngine = this.core.getEngine("feature");
    this.isEnabled = featureEngine && featureEngine.isEnabled("plugins_enabled");
    
    if (!this.isEnabled) {
      if (this.core.getEngine("logger")) {
        this.core.getEngine("logger").info("PluginManager", "Plugins are disabled via configuration. Bypassing init.");
      }
      return;
    }
    
    if (this.core.getEngine("logger")) {
      this.core.getEngine("logger").info("PluginManager", "Initializing Modular Plugin System...");
    }
  }

  registerPlugin(manifest) {
    if (!this.isEnabled) return false;
    this.plugins.set(manifest.id, manifest);
    return true;
  }

  /**
   * Extension point for external tools
   */
  registerTools(toolsArray) {
    if (!this.isEnabled) return;
    // Inject into ConfigEngine tool registry dynamically
    const configEngine = this.core.getEngine("config");
    if (configEngine) {
      // Future logic: configEngine.appendDynamicTools(toolsArray);
    }
  }

  registerComponents(componentsArray) {}
  registerCommands(commandsArray) {}
  registerThemes(themesArray) {}
  
  getEnabledPlugins() {
    return Array.from(this.plugins.values()).filter(p => p.enabled);
  }
}
