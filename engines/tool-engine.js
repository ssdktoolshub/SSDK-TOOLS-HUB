// SSDK Tool Engine - Loads configurations, renders layouts, and runs tool actions

import { GlassComponents } from "../components/glass-components.js";

export class ToolEngine {
  constructor() {
    this.core = null;
    this.activeTool = null;
    this.activeModule = null;
  }

  async init(core) {
    this.core = core;
  }

  /**
   * Loads a specific tool configuration and bootstraps its HTML template shell.
   */
  async loadTool(toolId) {
    const configEngine = this.core.getEngine("config");
    const tool = await configEngine.getToolById(toolId);
    if (!tool) {
      console.error(`[ToolEngine] Tool ID not found: ${toolId}`);
      return;
    }

    this.activeTool = tool;
    
    // Add visited log event
    const historyEngine = this.core.getEngine("history");
    if (historyEngine) historyEngine.addVisited(tool);

    // Apply SEO metadata
    const seoEngine = this.core.getEngine("seo");
    if (seoEngine) seoEngine.updateMetadata(tool);

    // Check if the page is a legacy HTML tool with its own UI
    const isLegacyToolPage = document.querySelector(".tool-playground") !== null;

    if (!isLegacyToolPage) {
      // Fetch the universal tool template HTML
      const templateHTML = await this.fetchTemplate();
      const container = document.body;
      
      // Preserve header and footer scripts but replace the main content area
      const contentWrap = document.createElement("div");
      contentWrap.innerHTML = templateHTML;
      
      // Mount the template parts into the DOM
      const mainPage = contentWrap.querySelector("main");
      const existingMain = document.querySelector("main.page");
      if (existingMain) {
        existingMain.replaceWith(mainPage);
      } else {
        container.appendChild(mainPage);
      }

      this.populateMetaInfo(tool);
      this.setupControlButtons();
      await this.mountToolComponents(tool);
      await this.loadToolModule(tool);
    }

    this.loadRelatedTools(tool);
    this.loadFAQ(tool);
  }

  async fetchTemplate() {
    const response = await fetch(`${this.core.prefix}/templates/tool-template.html`);
    return await response.text();
  }

  populateMetaInfo(tool) {
    document.getElementById("tool-title").textContent = tool.name;
    document.getElementById("tool-description").textContent = tool.description;
    document.getElementById("tool-breadcrumb-name").textContent = tool.name;
    document.getElementById("cat-breadcrumb-link").textContent = tool.category;
    
    // Handle Favorites state
    const favBtn = document.getElementById("tool-fav-btn");
    const favEngine = this.core.getEngine("favorites");
    if (favBtn && favEngine) {
      const isFav = favEngine.isFavorite(tool.id);
      favBtn.classList.toggle("on", isFav);
      favBtn.onclick = async () => {
        await favEngine.toggleFavorite(tool);
        favBtn.classList.toggle("on", favEngine.isFavorite(tool.id));
      };
    }
  }

  setupControlButtons() {
    const runBtn = document.getElementById("btn-run-action");
    const clearBtn = document.getElementById("btn-clear-action");
    const copyBtn = document.getElementById("btn-copy-output");
    const downloadBtn = document.getElementById("btn-download-output");

    if (runBtn) runBtn.onclick = () => this.runTool();
    if (clearBtn) {
      clearBtn.onclick = () => {
        this.clearInputs();
        this.clearOutputs();
      };
    }

    if (copyBtn) {
      copyBtn.onclick = () => {
        const text = this.getOutputContent();
        if (text) {
          navigator.clipboard.writeText(text);
          this.showStatus("📋 Output copied to clipboard!");
        } else {
          this.showStatus("❌ No output to copy.", true);
        }
      };
    }

    if (downloadBtn) {
      downloadBtn.onclick = () => this.downloadOutput();
    }
  }

  async mountToolComponents(tool) {
    const inputsContainer = document.getElementById("tool-inputs-container");
    const optionsContainer = document.getElementById("tool-options-container");
    const outputsContainer = document.getElementById("tool-outputs-container");

    inputsContainer.innerHTML = "";
    optionsContainer.innerHTML = "";
    outputsContainer.innerHTML = "";

    // Default template containers if not overridden by the custom JS module
    inputsContainer.appendChild(GlassComponents.createTextarea("toolInput", "Enter text or raw configurations here...", "Input Payload"));
    outputsContainer.appendChild(GlassComponents.createTextarea("toolOutput", "Processed output will appear here...", "Output Result"));
    
    // Setup generic dynamic placeholder elements
    const outputBox = document.getElementById("toolOutput");
    if (outputBox) outputBox.readOnly = true;
  }

  async loadToolModule(tool) {
    try {
      const modulePath = `${this.core.prefix}/modules/${tool.id}.js`;
      const { default: ToolModule } = await import(modulePath);
      this.activeModule = new ToolModule();
      if (typeof this.activeModule.init === "function") {
        await this.activeModule.init(this);
      }
      console.log(`[ToolEngine] Module loaded: ${tool.id}`);
    } catch (e) {
      console.warn(`[ToolEngine] No custom module logic found at /modules/${tool.id}.js. Running default upper-casing fallback.`, e);
      this.activeModule = null;
    }
  }

  async runTool() {
    this.showProgress(true);
    this.hideStatus();

    try {
      if (this.activeModule && typeof this.activeModule.run === "function") {
        await this.activeModule.run(this);
      } else {
        // Fallback processing uppercase transformation
        const inputVal = document.getElementById("toolInput").value;
        const result = inputVal.toUpperCase();
        document.getElementById("toolOutput").value = result;
        this.showStatus("✅ Processed successfully!");
      }
    } catch (e) {
      console.error(e);
      this.showStatus(`❌ Execution Error: ${e.message}`, true);
    } finally {
      this.showProgress(false);
    }
  }

  getOutputContent() {
    const outputEl = document.getElementById("toolOutput");
    if (outputEl) {
      return outputEl.value || outputEl.textContent || "";
    }
    return "";
  }

  downloadOutput() {
    const text = this.getOutputContent();
    if (!text) {
      this.showStatus("❌ Nothing to download.", true);
      return;
    }
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${this.activeTool.id}-output.txt`;
    link.click();
    this.showStatus("📥 File downloaded successfully!");
  }

  clearInputs() {
    document.querySelectorAll(".field-input").forEach(i => {
      if (i.tagName === "INPUT" || i.tagName === "TEXTAREA") {
        i.value = "";
      }
    });
  }

  clearOutputs() {
    const output = document.getElementById("toolOutput");
    if (output) {
      if (output.tagName === "TEXTAREA") output.value = "";
      else output.textContent = "";
    }
    this.hideStatus();
  }

  showProgress(show, text = "Processing data...") {
    const el = document.getElementById("tool-progress");
    if (el) {
      el.style.display = show ? "flex" : "none";
      document.getElementById("progress-text").textContent = text;
    }
  }

  showStatus(text, isError = false) {
    const badge = document.getElementById("tool-status-badge");
    if (badge) {
      badge.style.display = "block";
      badge.textContent = text;
      badge.className = `status-badge ${isError ? "error" : "success"}`;
    }
  }

  hideStatus() {
    const badge = document.getElementById("tool-status-badge");
    if (badge) badge.style.display = "none";
  }

  async loadRelatedTools(tool) {
    const grid = document.getElementById("related-tools-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const config = this.core.getEngine("config");
    const tools = await config.getTools();
    const related = tools
      .filter(t => t.category === tool.category && t.id !== tool.id)
      .slice(0, 4);

    related.forEach(t => {
      const card = document.createElement("a");
      card.className = "card show";
      card.href = t.url;
      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
          <span class="icon">${t.icon}</span>
          <h3>${t.name}</h3>
        </div>
        <p>${t.description}</p>
      `;
      grid.appendChild(card);
    });
  }

  async loadFAQ(tool) {
    const list = document.getElementById("tool-faq-accordion");
    if (!list) return;
    list.innerHTML = "";

    const config = this.core.getEngine("config");
    const siteFAQ = await config.getFAQ();
    
    // Construct local FAQ entries specific to this tool if defined, or use site-wide FAQs
    const faqs = tool.faq || siteFAQ.slice(0, 3);
    
    faqs.forEach(item => {
      const faqItem = document.createElement("div");
      faqItem.className = "faq-item";
      faqItem.innerHTML = `
        <div class="faq-q">${item.q}<span>＋</span></div>
        <div class="faq-a">${item.a}</div>
      `;
      
      const q = faqItem.querySelector(".faq-q");
      q.onclick = () => {
        const isOpen = faqItem.classList.toggle("open");
        const a = faqItem.querySelector(".faq-a");
        a.style.maxHeight = isOpen ? "250px" : "0";
        a.style.padding = isOpen ? "0 22px 16px" : "0 22px";
      };
      
      list.appendChild(faqItem);
    });
  }
}
