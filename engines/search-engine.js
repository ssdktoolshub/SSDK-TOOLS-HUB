// SSDK Search Engine - Indexes and fuzzy-matches tools dynamically

export class SearchEngine {
  constructor() {
    this.core = null;
    this.historyKey = "ssdk-recent-searches";
  }

  async init(core) {
    this.core = core;
  }

  /**
   * Search tool manifests against query parameters.
   */
  async search(query) {
    const q = query.trim().toLowerCase();
    const config = this.core.getEngine("config");
    const tools = await config.getTools();

    if (!q) return tools;

    // Fuzzy rank scoring
    const results = tools.map(tool => {
      let score = 0;
      const name = tool.name.toLowerCase();
      const desc = tool.description.toLowerCase();
      const cat = tool.category.toLowerCase();
      
      // Strict matching matches
      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 50;
      else if (name.includes(q)) score += 30;

      if (desc.includes(q)) score += 10;
      if (cat.includes(q)) score += 15;

      // Tag/Keyword matches
      if (tool.keywords && Array.isArray(tool.keywords)) {
        tool.keywords.forEach(kw => {
          if (kw.toLowerCase() === q) score += 40;
          else if (kw.toLowerCase().includes(q)) score += 20;
        });
      }

      return { tool, score };
    });

    return results
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.tool);
  }

  /**
   * Returns list of auto-suggestions based on initial letter inputs.
   */
  async getSuggestions(query) {
    const list = await this.search(query);
    return list.slice(0, 5).map(t => t.name);
  }

  getRecentSearches() {
    try {
      const stored = localStorage.getItem(this.historyKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  addRecentSearch(query) {
    const clean = query.trim();
    if (!clean) return;

    let list = this.getRecentSearches();
    list = list.filter(q => q.toLowerCase() !== clean.toLowerCase());
    list.unshift(clean);

    if (list.length > 5) list.pop();
    localStorage.setItem(this.historyKey, JSON.stringify(list));
  }
}
