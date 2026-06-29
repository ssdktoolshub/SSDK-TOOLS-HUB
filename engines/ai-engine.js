// SSDK AI Engine - Coordinates Natural Language Processing and Generation API actions

export class AIEngine {
  constructor() {
    this.core = null;
  }

  async init(core) {
    this.core = core;
  }

  /**
   * Generates text summary using extractive frequency-based scoring (client fallback)
   * or routes to LLM backend if online.
   */
  async summarize(text, options = {}) {
    const pythonEngine = this.core.getEngine("python");
    
    // Check if offline/local-fallback is preferred or if server is unavailable
    if (options.localOnly || window.location.protocol === "file:") {
      return this.localExtractiveSummarizer(text, options.sentences || 3);
    }
    
    // Call server AI endpoint
    try {
      const response = await pythonEngine.runBackendTask("/api/v1/ai/summarize", {
        text,
        ratio: options.ratio || 0.3,
        extract_entities: options.extractEntities || false
      });
      return response.summary;
    } catch (e) {
      console.warn("[AIEngine] Backend AI failed. Running client-side fallback summary.", e);
      return this.localExtractiveSummarizer(text, options.sentences || 3);
    }
  }

  /**
   * Generates template copywriting texts.
   */
  async generateText(prompt, tone = "professional", type = "blog-intro") {
    const pythonEngine = this.core.getEngine("python");
    
    try {
      const response = await pythonEngine.runBackendTask("/api/v1/ai/generate", {
        prompt,
        tone,
        type
      });
      return response.text;
    } catch (e) {
      console.warn("[AIEngine] Backend text generation failed. Running local template compiler.");
      return this.localTemplateWriter(prompt, tone, type);
    }
  }

  /**
   * Client-side NLP extractive summarization.
   */
  localExtractiveSummarizer(text, numSentences = 3) {
    if (!text.trim()) return "";
    
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    if (sentences.length <= numSentences) return text;

    // Build word frequency map
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const stopWords = new Set(["the", "and", "a", "of", "to", "is", "in", "it", "that", "this", "for", "on", "with", "as", "at", "by", "an", "be", "was", "are", "or"]);
    
    const freqs = {};
    words.forEach(w => {
      if (!stopWords.has(w)) {
        freqs[w] = (freqs[w] || 0) + 1;
      }
    });

    // Score sentences based on word frequencies
    const scored = sentences.map(s => {
      const sWords = s.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      let score = 0;
      sWords.forEach(w => {
        score += freqs[w] || 0;
      });
      return { sentence: s, score };
    });

    // Sort and grab top sentences in original chronological order
    const topScored = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, numSentences);

    return sentences
      .filter(s => topScored.some(t => t.sentence === s))
      .join(" ")
      .trim();
  }

  localTemplateWriter(prompt, tone, type) {
    // Basic local rule-based generation templates
    return `[SSDK AI Local fallback writer]
Tone: ${tone}
Type: ${type}
Based on: "${prompt}"

This is a premium, rule-based text compiler generated locally inside your web browser. When SSDK Tools Hub is connected to its FastAPI server, this section automatically links to LLM generative APIs for custom articles, blog posts, and copy writing.`;
  }
}
