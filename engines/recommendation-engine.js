// SSDK Recommendation Engine - Ranks and offers related tools suggestions

export class RecommendationEngine {
  constructor() {
    this.core = null;
  }

  async init(core) {
    this.core = core;
  }

  /**
   * Generates recommendation metrics for a specific tool.
   */
  async getRecommendations(toolId, limit = 4) {
    const config = this.core.getEngine("config");
    const allTools = await config.getTools();
    const sourceTool = allTools.find(t => t.id === toolId);
    
    if (!sourceTool) return allTools.slice(0, limit);

    // Score other tools
    const scored = allTools
      .filter(t => t.id !== toolId)
      .map(t => {
        let score = 0;
        
        // Match category
        if (t.category === sourceTool.category) {
          score += 50;
        }

        // Match type (JS / Python / AI)
        if (t.type === sourceTool.type) {
          score += 15;
        }

        // Fuzzy tag overlapping checks
        if (t.keywords && sourceTool.keywords) {
          const overlap = t.keywords.filter(k => sourceTool.keywords.includes(k));
          score += overlap.length * 10;
        }

        return { tool: t, score };
      });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(s => s.tool)
      .slice(0, limit);
  }
}
