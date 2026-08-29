// SSDK Tool Engine - Universal Config-Driven Execution Engine
// Supports dynamic JSON-driven UI rendering, custom ES modules, feature toggles, and tool discovery.

import { GlassComponents } from "../components/glass-components.js";

export class ToolEngine {
  constructor() {
    this.core = null;
    this.activeTool = null;
    this.activeModule = null;
  }

  async init(core) {
    this.core = core;
    console.log("[ToolEngine] Universal Tool Engine ready.");
  }

  /**
   */
  async loadTool(toolId) {
    const registry = this.core.getEngine("config") || this.core.getEngine("registry");
    
    // First try to fetch the manifest
    let manifest;
    try {
      const res = await fetch(`${this.core.prefix}/core/registry/manifests/${toolId}.json`);
      if (res.ok) {
        manifest = await res.json();
      }
    } catch (e) {
      console.warn("Manifest not found via HTTP", e);
    }
    
    // Fallback to registry tool data
    const tools = await registry.getTools();
    const tool = tools.find(t => t.id === toolId);
    
    if (!tool && !manifest) {
      console.error(`[ToolEngine] Tool ID not found: ${toolId}`);
      this.core.getEngine("notification")?.show(`Tool not found: ${toolId}`, "error");
      return;
    }

    // Merge manifest into tool data if available
    this.activeTool = { ...tool, ...manifest };
    
    // Add visited log event to HistoryEngine
    const historyEngine = this.core.getEngine("history");
    if (historyEngine) {
      historyEngine.addVisited(tool);
    }

    // Add Category Usage log
    const analytics = this.core.getEngine("analytics");
    if (analytics) {
      analytics.logCategoryUsage(tool.category);
    }

    // Apply SEO metadata
    const seoEngine = this.core.getEngine("seo");
    if (seoEngine) {
      seoEngine.updateMetadata(tool);
    }

    // Fetch universal tool template HTML
    const templateHTML = await this.fetchTemplate();
    const container = document.body;
    
    // Replace main content area
    const contentWrap = document.createElement("div");
    contentWrap.innerHTML = templateHTML;
    
    const mainPage = contentWrap.querySelector("main");
    const existingMain = document.querySelector("main.page");
    if (existingMain) {
      existingMain.replaceWith(mainPage);
    } else {
      container.appendChild(mainPage);
    }

    this.populateMetaInfo(tool);
    this.applyFeatureToggles(tool);
    this.setupControlButtons();
    await this.mountToolComponents(tool);

    // Dynamic UI Adaptation
    const capEngine = this.core.getEngine("capability");
    if (capEngine) capEngine.adaptInterface(tool);

    // Chaining pipeline data load
    const workflowEngine = this.core.getEngine("workflow");
    if (workflowEngine) {
      workflowEngine.renderWorkflowActionBar("workflow-chaining-panel", tool.id);
    }

    await this.loadToolModule(tool);
    this.loadHistoryDisplay();
    this.loadRelatedTools(tool);
    this.loadFAQ(tool);
    await this.loadPrevNextTools(tool);
    this.loadSEOContentBlocks(tool);

    // Trigger theme variables reinforcement
    const themeEngine = this.core.getEngine("theme");
    if (themeEngine) {
      themeEngine.initScrollAnimations();
    }
  }

  async fetchTemplate() {
    try {
      const response = await fetch(`${this.core.prefix}/templates/tool-template.html`);
      const fullHtml = await response.text();
      
      // Extract just the <main> block so we don't duplicate html/head tags in pages/tool.html
      const parser = new DOMParser();
      const doc = parser.parseFromString(fullHtml, 'text/html');
      const main = doc.querySelector('main');
      return main ? main.outerHTML : fullHtml;
    } catch (e) {
      console.error("Failed to fetch template", e);
      return `<main class="page"><h3>Failed to load template</h3></main>`;
    }
  }

  loadSEOContentBlocks(tool) {
    const seoContainer = document.getElementById("seo-dynamic-blocks");
    if (!seoContainer) return;

    const vTag = document.getElementById("tool-version-tag");
    const uTag = document.getElementById("tool-updated-tag");
    if (vTag) vTag.textContent = tool.version || "2.0.0";
    if (uTag) uTag.textContent = tool.lastUpdated || "2026-07-22";

    const useCases = tool.useCases || [
      `Streamline ${tool.category} workflows directly in browser.`,
      `Process payloads with 100% privacy and zero server data storage.`,
      `Export results instantly across mobile, tablet, and desktop displays.`
    ];

    const tips = tool.tips || [
      "Use keyboard shortcuts (Ctrl+K) for instant tool switching.",
      "Clear workspace after completing actions to keep memory optimal.",
      "Bookmark this utility to access it offline via Service Worker caching."
    ];

    seoContainer.innerHTML = `
      <div>
        <h3 style="color: var(--accent-color); margin-bottom: 8px;">💡 Common Use Cases</h3>
        <ul style="padding-left: 20px; color: var(--text-muted); line-height: 1.7; font-size: 0.9rem;">
          ${useCases.map(u => `<li>${u}</li>`).join("")}
        </ul>
      </div>

      <div style="margin-top: 12px;">
        <h3 style="color: var(--accent-color); margin-bottom: 8px;">🔥 Tips &amp; Best Practices</h3>
        <ul style="padding-left: 20px; color: var(--text-muted); line-height: 1.7; font-size: 0.9rem;">
          ${tips.map(t => `<li>${t}</li>`).join("")}
        </ul>
      </div>
    `;
  }


  populateMetaInfo(tool) {
    const iconEl = document.getElementById("tool-hero-icon");
    if (iconEl && tool.icon) iconEl.textContent = tool.icon;

    const catBadge = document.getElementById("tool-cat-badge");
    if (catBadge && tool.category) catBadge.textContent = tool.category;

    document.getElementById("tool-title").textContent = tool.name;
    document.getElementById("tool-description").textContent = tool.description;
    
    const infoTitle = document.getElementById("info-tool-title");
    const infoDesc = document.getElementById("info-tool-description");
    if (infoTitle) infoTitle.textContent = tool.name;
    if (infoDesc) infoDesc.textContent = tool.longDescription || tool.description;

    document.getElementById("tool-breadcrumb-name").textContent = tool.name;
    document.getElementById("cat-breadcrumb-link").textContent = tool.category;
    document.getElementById("cat-breadcrumb-link").href = `${this.core.prefix}/index.html#tools`;
    
    document.getElementById("cat-breadcrumb-link").onclick = (e) => {
      e.preventDefault();
      sessionStorage.setItem("ssdk-open-category", tool.category);
      window.location.href = `${this.core.prefix}/index.html`;
    };

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

  /**
   * Applies feature flags defined in tool.features or tool schema
   */
  applyFeatureToggles(tool) {
    const features = tool.features || {
      hasCopy: true,
      hasDownload: true,
      hasClear: true,
      hasShare: true,
      hasUpload: tool.type === "image" || tool.type === "pdf" || tool.type === "file",
      showFAQ: true,
      showHowTo: true,
      showAbout: true,
      showRelated: true
    };

    const copyBtn = document.getElementById("btn-copy-output");
    const downloadBtn = document.getElementById("btn-download-output");
    const shareBtn = document.getElementById("btn-share-output");
    const clearBtn = document.getElementById("btn-clear-action");

    if (copyBtn) copyBtn.style.display = features.hasCopy !== false ? "inline-flex" : "none";
    if (downloadBtn) downloadBtn.style.display = features.hasDownload !== false ? "inline-flex" : "none";
    if (shareBtn) shareBtn.style.display = features.hasShare !== false ? "inline-flex" : "none";
    if (clearBtn) clearBtn.style.display = features.hasClear !== false ? "inline-flex" : "none";

    // Strictly enforce manifest-driven UI visibility for major page sections
    const faqSection = document.querySelector(".faq-section");
    const howToSection = document.querySelector(".tool-how-to-use");
    const infoSection = document.querySelector(".tool-info-section");
    const relatedSection = document.querySelector(".meta-relations-grid");

    if (faqSection) faqSection.style.display = features.showFAQ === false ? "none" : "block";
    if (howToSection) howToSection.style.display = features.showHowTo === false ? "none" : "block";
    if (infoSection) infoSection.style.display = features.showAbout === false ? "none" : "block";
    if (relatedSection) relatedSection.style.display = features.showRelated === false ? "none" : "grid";
  }

  setupControlButtons() {
    const runBtn = document.getElementById("btn-run-action");
    const clearBtn = document.getElementById("btn-clear-action");
    const copyBtn = document.getElementById("btn-copy-output");
    const downloadBtn = document.getElementById("btn-download-output");
    const shareBtn = document.getElementById("btn-share-output");
    const sharePageBtn = document.getElementById("btn-share-page");

    if (runBtn) runBtn.onclick = () => this.runTool();
    if (clearBtn) {
      clearBtn.onclick = () => {
        this.clearInputs();
        this.clearOutputs();
        this.core.getEngine("notification")?.show("Workspace cleared", "info");
      };
    }

    if (copyBtn) {
      copyBtn.onclick = () => {
        const text = this.getOutputContent();
        if (text) {
          navigator.clipboard.writeText(text);
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = "✓";
          copyBtn.title = "Copied!";
          copyBtn.classList.add("success-flash");
          setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.title = "Copy Output";
            copyBtn.classList.remove("success-flash");
          }, 1800);
          this.core.getEngine("notification")?.show("Output copied to clipboard!", "success");
        } else {
          this.core.getEngine("notification")?.show("No output content to copy.", "warning");
        }
      };
    }

    if (downloadBtn) {
      downloadBtn.onclick = () => this.downloadOutput();
    }

    // Dynamic Action Bar Button Listeners
    const fullscreenBtn = document.getElementById("btn-fullscreen-action");
    if (fullscreenBtn) {
      fullscreenBtn.onclick = () => {
        const playground = document.getElementById("ssdk-playground");
        if (playground) {
          if (!document.fullscreenElement) {
            playground.requestFullscreen().catch(err => {
              console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
          } else {
            document.exitFullscreen();
          }
        }
      };
    }

    const printBtn = document.getElementById("btn-print-action");
    if (printBtn) {
      printBtn.onclick = () => {
        window.print();
      };
    }

    const chainBtn = document.getElementById("btn-chain-action");
    if (chainBtn) {
      chainBtn.onclick = () => {
        const text = this.getOutputContent();
        if (text) {
          const workflow = this.core.getEngine("workflow");
          if (workflow) {
            workflow.setPipelineData(text, this.activeTool.name);
            this.core.getEngine("notification")?.show("Output chained! Go to another tool to paste it.", "success");
          }
        } else {
          this.core.getEngine("notification")?.show("No output content to chain.", "warning");
        }
      };
    }

    const openShare = async () => {
      const modalEl = GlassComponents.createShareModal ? 
        GlassComponents.createShareModal(`${this.activeTool.name} - SSDK Tools Hub`, window.location.href) : null;
      if (modalEl) {
        document.body.appendChild(modalEl);
      } else if (navigator.share) {
        await navigator.share({ title: this.activeTool.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        this.core.getEngine("notification")?.show("Tool URL copied to clipboard!", "success");
      }
    };

    if (shareBtn) shareBtn.onclick = openShare;
    if (sharePageBtn) sharePageBtn.onclick = openShare;
  }

  async mountToolComponents(tool) {
    const inputsContainer = document.getElementById("tool-inputs-container");
    const optionsContainer = document.getElementById("tool-options-container");
    const outputsContainer = document.getElementById("tool-outputs-container");

    inputsContainer.innerHTML = "";
    optionsContainer.innerHTML = "";
    outputsContainer.innerHTML = "";

    // Check if tool has a defined UI schema
    if (tool.schema) {
      if (tool.schema.inputs && Array.isArray(tool.schema.inputs)) {
        tool.schema.inputs.forEach(inp => {
          const el = this.renderSchemaField(inp);
          if (el) inputsContainer.appendChild(el);
        });
      }

      if (tool.schema.options && Array.isArray(tool.schema.options)) {
        tool.schema.options.forEach(opt => {
          const el = this.renderSchemaField(opt);
          if (el) optionsContainer.appendChild(el);
        });
      }

      if (tool.schema.outputs && Array.isArray(tool.schema.outputs)) {
        tool.schema.outputs.forEach(out => {
          const el = this.renderSchemaField(out);
          if (el) {
            const mainField = el.querySelector("textarea, input");
            if (mainField) mainField.readOnly = true;
            outputsContainer.appendChild(el);
          }
        });
      }
    } else if (tool.category && (tool.category.toLowerCase().includes("image") || tool.category.toLowerCase().includes("photo"))) {
      // Dynamic Mount for Image Engine
      inputsContainer.innerHTML = `<div id="image-workspace-mount" style="width: 100%;"></div>`;
      outputsContainer.style.display = "none"; // Handled inside ImageEngine Action Zone
      const imageEngine = this.core.getEngine("image");
      if (imageEngine) {
        imageEngine.mountUI("#image-workspace-mount");
      }
    } else if (tool.category && tool.category.toLowerCase().includes("pdf")) {
      // Dynamic Mount for PDF Engine
      inputsContainer.innerHTML = `<div id="pdf-workspace-mount" style="width: 100%;"></div>`;
      outputsContainer.style.display = "none";
      const pdfEngine = this.core.getEngine("pdf");
      if (pdfEngine) {
        pdfEngine.mountUI("#pdf-workspace-mount");
      }
    } else if (tool.category && (tool.category.toLowerCase().includes("video") || tool.category.toLowerCase().includes("audio"))) {
      // Dynamic Mount for Media Engine (Future FFmpeg WebAssembly Integration)
      inputsContainer.innerHTML = `<div id="media-workspace-mount" style="width: 100%;"></div>`;
      outputsContainer.style.display = "none";
      const mediaEngine = this.core.getEngine("media");
      if (mediaEngine) {
        mediaEngine.mountUI("#media-workspace-mount");
      } else {
        // Fallback if media engine isn't strictly loaded yet, just render a default upload zone
        inputsContainer.innerHTML = `<div style="text-align:center; padding: 40px; border: 2px dashed var(--border); border-radius: 12px; color: var(--text-muted);"><span style="font-size:2rem;">📤</span><br>Media Workspace (FFmpeg WebAssembly Ready)<br><small>Drop files here</small></div>`;
      }
    } else {
      // Default fallbacks
      inputsContainer.appendChild(GlassComponents.createTextarea("toolInput", "Enter payload here...", "Input Payload"));
      outputsContainer.appendChild(GlassComponents.createTextarea("toolOutput", "Result output will appear here...", "Output Result"));
      const outputBox = document.getElementById("toolOutput");
      if (outputBox) outputBox.readOnly = true;
    }
  }

  renderSchemaField(field) {
    const { id, type, label, placeholder, defaultValue, options, min, max, step, fileTypes } = field;
    switch (type) {
      case "textarea":
        return GlassComponents.createTextarea(id, placeholder, label, 6, field.required);
      case "text":
      case "number":
      case "date":
      case "color":
        return GlassComponents.createInput(id, type, placeholder, label, defaultValue, field.required);
      case "select":
        return GlassComponents.createSelect(id, options, label, defaultValue);
      case "slider":
        return GlassComponents.createSlider(id, min, max, step, defaultValue, label);
      case "switch":
        return GlassComponents.createSwitch(id, label, defaultValue === "true" || defaultValue === true);
      case "upload": {
        const zone = GlassComponents.createUploadZone(id, fileTypes, label);
        const fileInput = zone.querySelector("input[type='file']");
        if (fileInput) {
          fileInput.addEventListener("change", () => {
            const analytics = this.core.getEngine("analytics");
            if (analytics && this.activeTool && fileInput.files.length) {
              analytics.logUpload(this.activeTool.id, fileInput.files[0].type || "unknown");
            }
          });
        }
        return zone;
      }
      default:
        return null;
    }
  }

  async getCategoryMap() {
    if (this.categoryMap) return this.categoryMap;
    try {
      const res = await fetch(`${this.core.prefix}/core/registry/tool-folder-map.json`);
      this.categoryMap = await res.json();
    } catch (e) {
      this.categoryMap = {};
    }
    return this.categoryMap;
  }

  async loadToolModule(tool) {
    try {
      const map = await this.getCategoryMap();
      const catSlug = map[tool.id] || tool.category.replace(/^[\uD800-\uDBFF\uDC00-\uDFFF\u200D\uFE0F\u2600-\u27BF\s]+/, '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-tools$/, '');
      const modulePath = `${this.core.prefix}/tools/${catSlug}/${tool.id}/logic.js`;
      const module = await import(modulePath);
      this.activeModule = module;
      if (typeof this.activeModule.init === "function") {
        await this.activeModule.init(this);
      }
      console.log(`[ToolEngine] Tool module loaded: ${modulePath}`);
    } catch (e) {
      console.warn(`[ToolEngine] No module logic found at tools category path for ${tool.id}. Error: ${e.message}`);
      this.activeModule = null;
    }
  }

  async runTool() {
    this.showProgress(true);
    this.hideStatus();
    
    const startTime = performance.now();

    try {
      const rawInputs = {};
      document.querySelectorAll("#tool-inputs-container .field-input, #tool-options-container .field-input").forEach(el => {
        if (el.type === 'file' && el.files.length) {
          rawInputs[el.id || el.name] = el.files[0];
        } else if (el.type === 'checkbox') {
          rawInputs[el.id || el.name] = el.checked;
        } else {
          rawInputs[el.id || el.name] = el.value;
        }
      });

      // Pass along any dropzone file
      if (this.currentFile) rawInputs.imageFile = this.currentFile;
      if (this.currentFile) rawInputs.file = this.currentFile;

      // Sanitize inputs (DOMPurify if available or simple escape)
      const inputs = {};
      for (const [key, value] of Object.entries(rawInputs)) {
        if (typeof value === 'string' && window.DOMPurify) {
          inputs[key] = window.DOMPurify.sanitize(value);
        } else {
          inputs[key] = value;
        }
      }

      if (this.activeModule) {
        if (typeof this.activeModule.validate === "function") {
          const isValid = this.activeModule.validate(inputs);
          if (!isValid) throw new Error("Validation failed. Please check inputs.");
        }

        let result;
        if (typeof this.activeModule.execute === "function") {
          result = await this.activeModule.execute(inputs);
        } else if (typeof this.activeModule.run === "function") {
          result = await this.activeModule.run(inputs);
        } else {
          throw new Error("Module has no execute() or run() function.");
        }

        const outputEl = document.getElementById("toolOutput");
        const outputsContainer = document.getElementById("tool-outputs-container");

        if (result) {
          if (result.toolOutput && outputEl) {
             outputEl.value = result.toolOutput;
          } else if (result.outputData && outputEl) {
             outputEl.value = result.outputData;
          } else if (typeof result === "string" && outputEl) {
             outputEl.value = result;
          } else if (result.outputBlob) {
             // Handle automatic download or file result
             const url = URL.createObjectURL(result.outputBlob);
             const a = document.createElement("a");
             a.href = url;
             a.download = result.filename || `${this.activeTool.id}-output`;
             a.click();
             URL.revokeObjectURL(url);
          } else if (result.htmlPreview && outputsContainer) {
             const cleanHtml = window.DOMPurify ? window.DOMPurify.sanitize(result.htmlPreview) : result.htmlPreview;
             outputsContainer.innerHTML = cleanHtml;
          } else {
             // Try to JSON stringify if it's an object
             if (outputEl && typeof result === "object") {
                outputEl.value = JSON.stringify(result, null, 2);
             }
          }
          this.showStatus("✅ Processed successfully!");
        } else {
          this.showStatus("❌ No output returned.", true);
        }
      } else {
        const inputEl = document.getElementById("toolInput");
        const outputEl = document.getElementById("toolOutput");
        if (inputEl && outputEl) {
          const result = inputEl.value.toUpperCase();
          outputEl.value = result;
          this.showStatus("✅ Processed successfully (Fallback)!");
        } else {
          this.showStatus("❌ Logic missing.", true);
        }
      }
      const outputPane = document.querySelector(".output-pane");
      if (outputPane) outputPane.classList.add("has-result");
    } catch (e) {
      console.error("[ToolEngine] Execution failure:", e);
      this.showStatus(`❌ Error: ${e.message}`, true);
      this.core.getEngine("notification")?.show(`Execution error: ${e.message}`, "error");
    } finally {
      this.showProgress(false);
      const analytics = this.core.getEngine("analytics");
      if (analytics && this.activeTool) {
        analytics.logProcessingTime(this.activeTool.id, startTime);
      }
    }
  }

  getOutputContent() {
    if (this.activeModule && typeof this.activeModule.getOutput === "function") {
      return this.activeModule.getOutput(this);
    }
    
    const defaultOutput = document.getElementById("toolOutput");
    if (defaultOutput) return defaultOutput.value || defaultOutput.textContent || "";

    const outputsContainer = document.getElementById("tool-outputs-container");
    if (outputsContainer) {
      const firstInput = outputsContainer.querySelector("textarea, input");
      if (firstInput) return firstInput.value;
    }
    return "";
  }

  downloadOutput() {
    const text = this.getOutputContent();
    if (!text) {
      this.showStatus("❌ Nothing to download.", true);
      this.core.getEngine("notification")?.show("No output content found to download", "warning");
      return;
    }
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${this.activeTool.id}-output.txt`;
    link.click();
    this.showStatus("📥 File downloaded successfully!");
    this.core.getEngine("notification")?.show("Download triggered", "success");
    
    const analytics = this.core.getEngine("analytics");
    if (analytics && this.activeTool) {
      analytics.logDownload(this.activeTool.id);
    }
  }

  clearInputs() {
    document.querySelectorAll("#tool-inputs-container .field-input, #tool-options-container .field-input").forEach(i => {
      if (i.tagName === "INPUT" || i.tagName === "TEXTAREA") {
        i.value = i.defaultValue || "";
      }
    });
  }

  clearOutputs() {
    document.querySelectorAll("#tool-outputs-container .field-input").forEach(i => {
      if (i.tagName === "INPUT" || i.tagName === "TEXTAREA") {
        i.value = "";
      } else {
        i.textContent = "";
      }
    });
    this.hideStatus();
    const outputPane = document.querySelector(".output-pane");
    if (outputPane) outputPane.classList.remove("has-result");
    const previewContainer = document.getElementById("tool-preview-container");
    if (previewContainer) {
      previewContainer.innerHTML = "";
      previewContainer.style.display = "none";
    }
  }

  showProgress(show, text = "Processing data...") {
    const el = document.getElementById("tool-progress");
    if (el) {
      el.style.display = show ? "flex" : "none";
      const txt = document.getElementById("progress-text");
      if (txt) txt.textContent = text;
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

  loadHistoryDisplay() {
    const list = document.getElementById("tool-history-list");
    if (!list) return;
    list.innerHTML = "";

    const historyEngine = this.core.getEngine("history");
    const historyList = historyEngine ? historyEngine.getHistory() : [];

    if (historyList.length === 0) {
      list.innerHTML = `<p class="empty-msg" style="color: var(--text-muted); font-size: 0.85rem;">No recently visited tools.</p>`;
      return;
    }

    historyList.slice(0, 5).forEach(item => {
      const a = document.createElement("a");
      a.className = "history-item";
      a.href = `${this.core.prefix}/${item.url}`;
      a.style.display = "flex";
      a.style.alignItems = "center";
      a.style.gap = "8px";
      a.style.textDecoration = "none";
      a.style.color = "var(--text)";
      a.style.padding = "6px 10px";
      a.style.borderRadius = "8px";
      a.style.background = "var(--card)";
      a.style.marginBottom = "6px";
      a.style.fontSize = "0.85rem";
      a.innerHTML = `<span class="icon">${item.icon}</span><span>${item.name}</span>`;
      list.appendChild(a);
    });
  }

  async loadRelatedTools(tool) {
    const grid = document.getElementById("related-tools-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const config = this.core.getEngine("config");
    const tools = await config.getTools();
    
    let related = [];
    const recEngine = this.core.getEngine("recommendation");
    if (recEngine) {
      related = await recEngine.getRelatedTools(tool, 4);
    } else {
      related = tools
        .filter(t => t.category === tool.category && t.id !== tool.id)
        .slice(0, 4);
    }

    related.forEach(t => {
      const card = document.createElement("a");
      card.className = "card show";
      card.href = `${this.core.prefix}/${t.url}`;
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

  async loadPrevNextTools(tool) {
    const navWrap = document.getElementById("prev-next-nav");
    if (!navWrap) return;

    const config = this.core.getEngine("config");
    const tools = await config.getTools();
    const catTools = tools.filter(t => t.category === tool.category);
    
    const currentIndex = catTools.findIndex(t => t.id === tool.id);
    const prevTool = currentIndex > 0 ? catTools[currentIndex - 1] : null;
    const nextTool = currentIndex < catTools.length - 1 ? catTools[currentIndex + 1] : null;

    navWrap.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap:16px;">
        ${prevTool ? `
          <a href="${this.core.prefix}/${prevTool.url}" class="btn ghost" style="font-size:0.85rem;">
            ← Previous: ${prevTool.name}
          </a>
        ` : `<span></span>`}
        ${nextTool ? `
          <a href="${this.core.prefix}/${nextTool.url}" class="btn ghost" style="font-size:0.85rem;">
            Next: ${nextTool.name} →
          </a>
        ` : `<span></span>`}
      </div>
    `;
  }

  async loadFAQ(tool) {
    const list = document.getElementById("tool-faq-accordion");
    if (!list) return;
    list.innerHTML = "";

    const config = this.core.getEngine("config");
    const siteFAQ = await config.getFAQ();
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
