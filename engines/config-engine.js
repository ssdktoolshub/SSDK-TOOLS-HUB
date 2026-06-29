// SSDK Config Engine - Manifest Database Loader & Parser

export class ConfigEngine {
  constructor(prefix = ".") {
    this.prefix = prefix;
    this.cache = {};
  }

  /**
   * Loads a JSON config file from the json database.
   */
  async loadJSON(filename) {
    if (this.cache[filename]) {
      return this.cache[filename];
    }
    
    try {
      // Direct relative path resolution based on the depth prefix
      const response = await fetch(`${this.prefix}/json/${filename}`);
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
   */
  async getTools() {
    return await this.loadJSON("tools.json") || [];
  }

  /**
   * Fetches the list of active categories.
   */
  async getCategories() {
    return await this.loadJSON("categories.json") || [];
  }

  /**
   * Fetches FAQ schemas.
   */
  async getFAQ() {
    return await this.loadJSON("faq.json") || [];
  }

  /**
   * Fetches global application configurations.
   */
  async getSettings() {
    return await this.loadJSON("settings.json") || {};
  }

  /**
   * Fetches a specific tool details by its string ID identifier.
   */
  async getToolById(toolId) {
    const tools = await this.getTools();
    return tools.find(t => t.id === toolId) || null;
  }
}
