// SSDK Search Engine
// Supports fuzzy matching, typos, synonyms, aliases, tags, descriptions

export class SearchEngine {
  constructor() {
    this.core = window.SSDKCore;
  }

  async init() {
    this.registry = this.core ? (this.core.getEngine("config") || this.core.getEngine("registry")) : null;
    if (this.registry) {
      this.tools = await this.registry.getTools();
      this.aliases = typeof this.registry.getAliases === 'function' ? await this.registry.getAliases() : [];
      this.synonyms = typeof this.registry.getSynonyms === 'function' ? await this.registry.getSynonyms() : [];
      this.tags = typeof this.registry.getTags === 'function' ? await this.registry.getTags() : [];
    }
  }

  // Basic Levenshtein distance for typo tolerance
  levenshtein(a, b) {
    const matrix = [];
    let i;
    for (i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    let j;
    for (j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            Math.min(matrix[i][j - 1] + 1, // insertion
                     matrix[i - 1][j] + 1) // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  expandQuery(query) {
    let terms = query.toLowerCase().split(/\s+/);
    let expanded = new Set(terms);
    
    // Apply aliases
    terms.forEach(t => {
      if (this.aliases[t]) {
        expanded.add(this.aliases[t]);
      }
    });

    // Apply synonyms
    for (const [key, values] of Object.entries(this.synonyms)) {
      if (terms.includes(key)) {
        values.forEach(v => expanded.add(v));
      }
      values.forEach(v => {
        if (terms.includes(v)) expanded.add(key);
      });
    }

    return Array.from(expanded).join(" ");
  }

  search(rawQuery) {
    if (!rawQuery || rawQuery.trim() === "") return this.tools;
    
    const query = this.expandQuery(rawQuery.toLowerCase());
    const queryTerms = query.split(/\s+/);
    
    const results = this.tools.map(tool => {
      let score = 0;
      const searchableText = `${tool.name} ${tool.category} ${tool.description} ${(tool.keywords || []).join(" ")}`.toLowerCase();
      
      queryTerms.forEach(term => {
        if (searchableText.includes(term)) {
          score += 10; // Exact/partial match
        } else {
          // Typo checking
          const words = searchableText.split(/\s+/);
          words.forEach(word => {
            if (Math.abs(word.length - term.length) <= 2) {
              const distance = this.levenshtein(term, word);
              if (distance === 1) score += 5; // Slight typo
              else if (distance === 2) score += 2; // Heavier typo
            }
          });
        }
      });
      
      return { tool, score };
    });

    // Sort by score descending and filter out 0 scores
    return results
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.tool);
  }
}
