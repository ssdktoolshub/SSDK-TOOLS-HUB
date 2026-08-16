// SSDK Recommendation Engine — Production Discovery & Tool Correlation System
// Calculates high-relevance related tools, alternative toolkits, and contextual discovery.

export class RecommendationEngine {
  constructor() {
    this.core = null;
    this.toolsCache = null;
  }

  async init(core) {
    this.core = core;
    console.log("[RecommendationEngine] Initialized Production Discovery & Recommendation Engine.");
  }

  async getTools() {
    if (this.toolsCache && this.toolsCache.length) return this.toolsCache;
    const config = this.core ? this.core.getEngine("config") : null;
    if (config && typeof config.getTools === "function") {
      this.toolsCache = await config.getTools();
    } else if (typeof window !== "undefined" && window.SSDKCore && window.SSDKCore.getEngine("config")) {
      this.toolsCache = await window.SSDKCore.getEngine("config").getTools();
    }
    return this.toolsCache || [];
  }

  /**
   * Get dynamic recommendations for a specific tool.
   * Ranks tools based on multi-dimensional similarity heuristics.
   */
  async getRelatedTools(sourceTool, limit = 4) {
    if (!sourceTool) return [];
    const allTools = await this.getTools();
    if (!allTools || !allTools.length) return [];

    const sourceCat = (sourceTool.category || "").toLowerCase();
    const sourceSubcat = (sourceTool.subcategory || "").toLowerCase();
    const sourceTags = Array.isArray(sourceTool.tags) ? sourceTool.tags.map(t => t.toLowerCase()) : [];
    const sourceKeywords = Array.isArray(sourceTool.keywords) ? sourceTool.keywords.map(k => k.toLowerCase()) : [];
    const sourceNameTokens = (sourceTool.name || "").toLowerCase().split(/[\s-]+/);

    const scoredTools = allTools
      .filter(t => t.id !== sourceTool.id) // Exclude self
      .map(tool => {
        let score = 0;
        const toolCat = (tool.category || "").toLowerCase();
        const toolSubcat = (tool.subcategory || "").toLowerCase();
        const toolTags = Array.isArray(tool.tags) ? tool.tags.map(t => t.toLowerCase()) : [];
        const toolKeywords = Array.isArray(tool.keywords) ? tool.keywords.map(k => k.toLowerCase()) : [];
        const toolNameTokens = (tool.name || "").toLowerCase().split(/[\s-]+/);

        // 1. Same Primary Category
        if (toolCat === sourceCat && toolCat.length > 0) {
          score += 120;
        }

        // 2. Same Subcategory
        if (toolSubcat === sourceSubcat && toolSubcat.length > 0) {
          score += 80;
        }

        // 3. Shared Name Tokens (e.g., "PDF" in "PDF Merge" and "PDF Split")
        const sharedNameTokens = toolNameTokens.filter(token => 
          token.length > 2 && sourceNameTokens.includes(token)
        );
        score += (sharedNameTokens.length * 35);

        // 4. Tag Overlap
        if (toolTags.length && sourceTags.length) {
          const overlap = toolTags.filter(t => sourceTags.includes(t));
          score += (overlap.length * 25);
        }

        // 5. Keyword Overlap
        if (toolKeywords.length && sourceKeywords.length) {
          const overlap = toolKeywords.filter(k => sourceKeywords.includes(k));
          score += (overlap.length * 20);
        }

        // 6. Media / Type Match
        if (tool.type && sourceTool.type && tool.type === sourceTool.type) {
          score += 15;
        }

        // 7. Popularity / Featured Boost
        if (tool.featured) score += 10;
        if (tool.popular) score += 5;

        return { tool, score };
      });

    return scoredTools
      .filter(st => st.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(st => st.tool);
  }

  /**
   * Get contextual recommendations based on recent tools and current session activity.
   */
  async getRecommendedForUser(recentToolIds = [], limit = 6) {
    const allTools = await this.getTools();
    if (!allTools || !allTools.length) return [];

    if (!recentToolIds || recentToolIds.length === 0) {
      // Return top featured & popular tools
      return allTools
        .filter(t => t.featured || t.popular)
        .slice(0, limit);
    }

    const recentTools = allTools.filter(t => recentToolIds.includes(t.id));
    const recentCategories = new Set(recentTools.map(t => t.category));

    // Recommend complementary tools from the same categories
    const candidates = allTools
      .filter(t => !recentToolIds.includes(t.id))
      .map(tool => {
        let score = 0;
        if (recentCategories.has(tool.category)) score += 50;
        if (tool.featured) score += 30;
        if (tool.popular) score += 20;
        return { tool, score };
      });

    return candidates
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(c => c.tool);
  }
}
