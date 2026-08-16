// SSDK Search Engine — Production-Grade Search, Discovery & Indexing Architecture
// Supports multi-word tokenization, category-aware ranking, typo tolerance, universal synonyms, and sub-millisecond caching.

export class SearchEngine {
  constructor() {
    this.core = null;
    this.historyKey = "ssdk-recent-searches";
    this.searchIndex = null;
    this.toolsCache = null;
    this.synonymMap = this.buildSynonymDictionary();
  }

  async init(core) {
    this.core = core;
    console.log("[SearchEngine] Initializing Production Search Engine with 967-Tool Index...");
    await this.buildIndex();
  }

  /**
   * Pre-indexes tools for instant sub-millisecond search execution.
   */
  async buildIndex() {
    try {
      const config = this.core ? this.core.getEngine("config") : null;
      let tools = [];
      if (config && typeof config.getTools === "function") {
        tools = await config.getTools();
      } else if (typeof window !== "undefined" && window.SSDKCore && window.SSDKCore.getEngine("config")) {
        tools = await window.SSDKCore.getEngine("config").getTools();
      }

      this.toolsCache = tools;
      this.searchIndex = tools.map(tool => {
        const nameTokens = this.tokenize(tool.name || "");
        const descTokens = this.tokenize(tool.description || "");
        const catTokens = this.tokenize(tool.category || "");
        const subcatTokens = this.tokenize(tool.subcategory || "");
        const tagTokens = Array.isArray(tool.tags) ? tool.tags.flatMap(t => this.tokenize(t)) : [];
        const kwTokens = Array.isArray(tool.keywords) ? tool.keywords.flatMap(k => this.tokenize(k)) : [];
        const aliasTokens = Array.isArray(tool.aliases) ? tool.aliases.flatMap(a => this.tokenize(a)) : [];

        return {
          id: tool.id,
          tool,
          normalizedName: this.normalizeText(tool.name || ""),
          normalizedCat: this.normalizeText(tool.category || ""),
          normalizedSubcat: this.normalizeText(tool.subcategory || ""),
          normalizedDesc: this.normalizeText(tool.description || ""),
          nameTokens,
          descTokens,
          catTokens,
          subcatTokens,
          allTokens: new Set([...nameTokens, ...descTokens, ...catTokens, ...subcatTokens, ...tagTokens, ...kwTokens, ...aliasTokens]),
          aliases: (tool.aliases || []).map(a => this.normalizeText(a)),
          tags: (tool.tags || []).map(t => this.normalizeText(t)),
          keywords: (tool.keywords || []).map(k => this.normalizeText(k))
        };
      });
      console.log(`[SearchEngine] Successfully indexed ${this.searchIndex.length} tools.`);
    } catch (e) {
      console.warn("[SearchEngine] Pre-indexing deferred", e);
    }
  }

  /**
   * Universal Multilingual Text Normalization
   */
  normalizeText(text) {
    if (!text) return "";
    return String(text)
      .normalize("NFC")
      .toLowerCase()
      .replace(/[_\-\/\\,.:;!?'"()[\]{}]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Tokenizes string into unique words/terms
   */
  tokenize(text) {
    const norm = this.normalizeText(text);
    if (!norm) return [];
    return norm.split(" ").filter(t => t.length > 0);
  }

  /**
   * Comprehensive Synonym & Search Alias Dictionary
   */
  buildSynonymDictionary() {
    return {
      // Image & Photos
      "photo": "image",
      "photos": "image",
      "pic": "image",
      "pics": "image",
      "picture": "image",
      "pictures": "image",
      "img": "image",
      "imgs": "image",
      "remove bg": "background remover",
      "bg remover": "background remover",
      "compress image": "image compressor",
      "shrink image": "image compressor",
      "reduce image size": "image compressor",
      "image size reducer": "image compressor",
      "image optimizer": "image compressor",
      "resize image": "image resizer",
      "image dimension": "image resizer",
      "crop photo": "crop image",
      "jpg to png": "jpg to png",
      "png to jpg": "png to jpg",
      "webp converter": "webp to png",
      
      // PDF & Documents
      "document": "pdf",
      "docs": "pdf",
      "doc": "pdf",
      "join pdf": "merge pdf",
      "combine pdf": "merge pdf",
      "merge pdfs": "merge pdf",
      "pdf combiner": "merge pdf",
      "pdf joiner": "merge pdf",
      "split pdf": "split pdf",
      "cut pdf": "split pdf",
      "separate pdf": "split pdf",
      "shrink pdf": "compress scanned pdf",
      "compress pdf": "compress scanned pdf",
      "pdf reducer": "compress scanned pdf",
      "lock pdf": "protect pdf",
      "pdf password": "add password",

      // Code & Developer
      "compres": "compress",
      "json": "json formatter",
      "json validator": "json formatter",
      "json pretty": "json formatter",
      "beautify json": "json formatter",
      "minify json": "json minifier",
      "compact json": "json minifier",
      "base64": "base64 encode decode",
      "base 64": "base64 encode decode",
      "b64": "base64 encode decode",
      "regex": "regex tester",
      "regular expression": "regex tester",
      "python": "python wasm runner",
      "py": "python wasm runner",
      "javascript": "javascript formatter",
      "js": "javascript formatter",
      "html": "html formatter",
      "css": "css formatter",
      "code": "developer",
      "jwt": "jwt decoder",
      "token": "jwt decoder",

      // Medical & Laboratory
      "lab": "medical",
      "medical": "medical",
      "health": "medical",
      "cbc": "cbc report analyzer",
      "blood count": "cbc report analyzer",
      "blood": "medical",
      "sugar": "blood sugar report analyzer",
      "glucose": "fasting sugar analyzer",
      "diabetes": "diabetes risk estimator",
      "hba1c": "hba1c calculator",
      "thyroid": "tsh analyzer",
      "tsh": "tsh analyzer",
      "kidney": "kidney function report analyzer",
      "egfr": "egfr calculator",
      "creatinine": "creatinine analyzer",
      "liver": "liver function report analyzer",
      "sgot": "ast sgot analyzer",
      "sgpt": "alt sgpt analyzer",
      "lipid": "lipid profile report analyzer",
      "cholesterol": "total cholesterol analyzer",
      "ldl": "ldl calculator",
      "urine": "urine routine analyzer",
      "urinalysis": "urine routine analyzer",
      "iron": "serum iron analyzer",
      "vitamin d": "vitamin d analyzer",
      "vitamin b12": "vitamin b12 analyzer",
      "bmi": "bmi calculator",
      "gcs": "gcs calculator",
      "coma": "gcs calculator",

      // Utilities & Web
      "qr": "qr code generator",
      "qr code": "qr code generator",
      "barcode": "qr code generator",
      "pass": "password generator",
      "password": "password generator",
      "hash": "hash generator",
      "md5": "hash generator",
      "sha256": "hash generator",
      "word count": "word counter",
      "words": "word counter",
      "chars": "word counter",
      "character counter": "word counter",
      "unit": "unit converters",
      "converter": "unit converters",
      "calc": "calculator",
      "calculator": "calculator",
      "emi": "emi calculator",
      "loan": "car loan calculator",
      "interest": "simple interest calculator",
      "compound interest": "compound interest calculator",
      "roi": "roi calculator",
      "percentage": "percentage calc",
      "color": "color picker",
      "hex to rgb": "hex to rgb",
      "rgb to hex": "rgb to cmyk",
      "gradient": "gradient generator",
      "palette": "color palette generator",
      "age": "age calculator",
      "dob": "age calculator",
      "time": "timezone converter",
      "date": "date difference",
      "timestamp": "unix timestamp converter",
      "meta": "meta tag generator",
      "sitemap": "sitemap generator",
      "robots": "robots txt generator",
      "dns": "dns lookup",
      "whois": "whois lookup",
      "ping": "ping tool",
      "ssl": "ssl checker"
    };
  }

  /**
   * Calculates Levenshtein edit distance between two strings for typo recovery.
   */
  getLevenshteinDistance(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;

    const row = [];
    for (let i = 0; i <= b.length; i++) row[i] = i;

    for (let i = 1; i <= a.length; i++) {
      let prev = i;
      for (let j = 1; j <= b.length; j++) {
        let val;
        if (a[i - 1] === b[j - 1]) {
          val = row[j - 1];
        } else {
          val = Math.min(row[j - 1] + 1, prev + 1, row[j] + 1);
        }
        row[j - 1] = prev;
        prev = val;
      }
      row[b.length] = prev;
    }
    return row[b.length];
  }

  /**
   * Main Production Search Function with Multi-Tier Ranking
   */
  async search(rawQuery = "", filters = {}) {
    const q = this.normalizeText(rawQuery);
    
    // Ensure index is ready
    if (!this.searchIndex || !this.searchIndex.length) {
      await this.buildIndex();
    }

    let indexedItems = this.searchIndex || [];

    // Apply category / type filters if requested
    if (filters.category && filters.category !== "all") {
      const catFilter = this.normalizeText(filters.category);
      indexedItems = indexedItems.filter(item => 
        item.normalizedCat.includes(catFilter) || 
        item.normalizedSubcat.includes(catFilter) ||
        (item.tool.categorySlug && item.tool.categorySlug === catFilter)
      );
    }
    if (filters.type && filters.type !== "all") {
      indexedItems = indexedItems.filter(item => item.tool.type === filters.type);
    }

    if (!q) {
      return indexedItems.map(item => item.tool);
    }

    const queryTokens = this.tokenize(q);
    const synonymExpansion = this.synonymMap[q] || null;
    const synonymTokens = synonymExpansion ? this.tokenize(synonymExpansion) : [];

    // Detect if query mentions a primary category
    const categoryHints = {
      "image": ["image", "photo", "pic", "media"],
      "pdf": ["pdf", "document"],
      "developer": ["developer", "code", "dev", "json", "base64", "regex"],
      "medical": ["medical", "health", "clinical", "lab", "blood", "sugar", "cbc"],
      "calculator": ["calculator", "calc", "math", "emi", "loan"],
      "text": ["text", "word", "string", "case"],
      "color": ["color", "hex", "rgb", "hsl", "gradient", "palette"],
      "seo": ["seo", "meta", "sitemap", "robots"],
      "security": ["security", "password", "hash", "encrypt"],
      "video": ["video", "mp4", "webm"],
      "audio": ["audio", "mp3", "sound"],
      "finance": ["finance", "roi", "interest", "tax", "money"],
      "unit": ["unit", "converter", "metric"]
    };

    let targetCategoryHint = null;
    for (const [catName, keywords] of Object.entries(categoryHints)) {
      if (keywords.some(kw => q.includes(kw))) {
        targetCategoryHint = catName;
        break;
      }
    }

    // Score and Rank
    const scoredResults = indexedItems.map(item => {
      let score = 0;
      const name = item.normalizedName;
      const desc = item.normalizedDesc;
      const cat = item.normalizedCat;
      const sub = item.normalizedSubcat;
      const toolId = item.id.toLowerCase();

      // 1. EXACT ID OR EXACT NAME MATCH (Highest Priority)
      if (name === q || toolId === q) {
        score += 2000;
      } else if (name.startsWith(q)) {
        score += 1200;
      } else if (name.includes(q)) {
        score += 900;
      }

      // 2. MULTI-WORD PHRASE & TOKEN OVERLAP
      let matchedTokens = 0;
      for (const token of queryTokens) {
        if (item.nameTokens.includes(token)) {
          score += 350;
          matchedTokens++;
        } else if (item.nameTokens.some(nt => nt.startsWith(token))) {
          score += 250;
          matchedTokens++;
        } else if (item.aliases.some(a => a.includes(token))) {
          score += 200;
          matchedTokens++;
        } else if (item.keywords.some(k => k.includes(token)) || item.tags.some(t => t.includes(token))) {
          score += 150;
          matchedTokens++;
        } else if (desc.includes(token)) {
          score += 80;
        }
      }

      // Full token coverage multiplier
      if (queryTokens.length > 1 && matchedTokens === queryTokens.length) {
        score += 600; // Major boost if all words appear in the tool's metadata
      }

      // 3. SYNONYM EXPANSION BOOST
      if (synonymExpansion) {
        if (name === synonymExpansion || name.includes(synonymExpansion)) {
          score += 500;
        } else if (cat.includes(synonymExpansion) || sub.includes(synonymExpansion)) {
          score += 300;
        } else if (synonymTokens.some(st => item.nameTokens.includes(st))) {
          score += 250;
        }
      }

      // 4. CATEGORY CONTEXT BOOST
      if (targetCategoryHint) {
        if (cat.includes(targetCategoryHint) || (item.tool.categorySlug && item.tool.categorySlug.includes(targetCategoryHint))) {
          score += 300;
        }
      }

      // 5. FUZZY TYPO MATCHING (for queries >= 3 chars with low/no direct matches)
      if (score === 0 && q.length >= 3) {
        for (const token of queryTokens) {
          for (const nameToken of item.nameTokens) {
            const dist = this.getLevenshteinDistance(token, nameToken);
            const maxAllowed = token.length <= 4 ? 1 : 2;
            if (dist <= maxAllowed) {
              score += (200 - (dist * 60));
            }
          }
        }
      }

      // 6. POPULARITY / FEATURED TIEBREAKER
      if (item.tool.featured) score += 20;
      if (item.tool.popular) score += 15;
      if (item.tool.trending) score += 10;

      return { tool: item.tool, score };
    });

    return scoredResults
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.tool);
  }

  /**
   * Typo recovery suggestions when search returns zero or few results.
   */
  async getTypoSuggestions(rawQuery) {
    const q = this.normalizeText(rawQuery);
    if (!q || q.length < 2) return [];
    
    if (!this.searchIndex) await this.buildIndex();
    const suggestions = [];

    // 1. Check synonym dictionary
    if (this.synonymMap[q]) {
      suggestions.push({ name: this.synonymMap[q], dist: 0 });
    }

    // 2. Fuzzy match against all tool names
    for (const item of (this.searchIndex || [])) {
      const name = item.normalizedName;
      const dist = this.getLevenshteinDistance(q, name);
      const maxAllowed = q.length <= 4 ? 1 : (q.length <= 8 ? 2 : 3);
      if (dist <= maxAllowed) {
        suggestions.push({ name: item.tool.name, dist });
      }
    }

    return suggestions
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 4)
      .map(s => s.name);
  }

  /**
   * Returns top autocomplete suggestions with metadata.
   */
  async getSuggestions(rawQuery, limit = 6) {
    const q = this.normalizeText(rawQuery);
    if (!q || q.length < 2) return [];
    const list = await this.search(q);
    return list.slice(0, limit).map(t => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      category: t.category,
      url: t.url,
      description: t.description
    }));
  }

  getRecentSearches() {
    try {
      if (typeof localStorage === "undefined") return [];
      const stored = localStorage.getItem(this.historyKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  addRecentSearch(query) {
    const clean = String(query || "").trim();
    if (!clean || clean.length < 2 || typeof localStorage === "undefined") return;

    let list = this.getRecentSearches();
    list = list.filter(q => q.toLowerCase() !== clean.toLowerCase());
    list.unshift(clean);

    if (list.length > 8) {
      list.pop();
    }
    localStorage.setItem(this.historyKey, JSON.stringify(list));
  }

  removeRecentSearch(query) {
    if (typeof localStorage === "undefined") return;
    let list = this.getRecentSearches();
    list = list.filter(q => q.toLowerCase() !== query.toLowerCase());
    localStorage.setItem(this.historyKey, JSON.stringify(list));
  }

  clearRecentSearches() {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(this.historyKey);
  }
}
