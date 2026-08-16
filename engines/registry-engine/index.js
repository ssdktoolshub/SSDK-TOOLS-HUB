// SSDK Registry Engine
// Responsible for loading and serving registry JSONs (tools, categories, collections, synonyms, aliases)

export class RegistryEngine {
  constructor() {
    this.prefix = window.SSDKCore?.prefix || ".";
    this.cache = {};
  }

  async loadJSON(filename) {
    if (this.cache[filename]) {
      return this.cache[filename];
    }
    try {
      const response = await fetch(`${this.prefix}/registry/${filename}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status} loading ${filename}`);
      }
      const data = await response.json();
      this.cache[filename] = data;
      return data;
    } catch (e) {
      console.error(`[RegistryEngine] Failed to load [${filename}]:`, e);
      return null;
    }
  }

  async getTools() {
    return await this.loadJSON("tools.json") || [];
  }

  async getCategories() {
    return await this.loadJSON("categories.json") || [];
  }

  async getCollections() {
    return await this.loadJSON("collections.json") || [];
  }

  async getAliases() {
    return await this.loadJSON("aliases.json") || {};
  }

  async getSynonyms() {
    return await this.loadJSON("synonyms.json") || {};
  }

  async getTags() {
    return await this.loadJSON("tags.json") || [];
  }
}
