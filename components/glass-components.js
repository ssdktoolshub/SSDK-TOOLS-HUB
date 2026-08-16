// SSDK Component Library - Reusable Glassmorphic UI Components with Accessibility & Validation
// Built for professional, responsive configurations supporting 1000+ tools.

export class GlassComponents {
  
  /**
   * Generates a glassmorphic textarea wrapper.
   */
  static createTextarea(id, placeholder = "Enter input...", label = "", rows = 6, required = false, validator = null) {
    const wrap = document.createElement("div");
    wrap.className = "field-grid-1";
    
    const uniqueErrorId = `${id}-error`;

    if (label) {
      const lbl = document.createElement("label");
      lbl.className = "field-label";
      lbl.htmlFor = id;
      lbl.innerHTML = `${label}${required ? ' <span class="required-star" aria-hidden="true">*</span>' : ''}`;
      wrap.appendChild(lbl);
    }
    
    const textarea = document.createElement("textarea");
    textarea.id = id;
    textarea.className = "field-input";
    textarea.style.minHeight = "150px";
    textarea.placeholder = placeholder;
    textarea.rows = rows;
    textarea.required = required;
    textarea.setAttribute("aria-label", label || placeholder);
    textarea.setAttribute("aria-invalid", "false");
    textarea.setAttribute("aria-describedby", uniqueErrorId);
    
    const errorEl = document.createElement("span");
    errorEl.id = uniqueErrorId;
    errorEl.className = "field-error-msg";
    errorEl.style.display = "none";
    errorEl.style.color = "#ff6b6b";
    errorEl.style.fontSize = "0.75rem";
    errorEl.style.marginTop = "4px";
    errorEl.setAttribute("aria-live", "polite");

    if (validator) {
      textarea.addEventListener("input", () => {
        const val = textarea.value;
        const err = validator(val);
        if (err) {
          textarea.setAttribute("aria-invalid", "true");
          errorEl.textContent = err;
          errorEl.style.display = "block";
        } else {
          textarea.setAttribute("aria-invalid", "false");
          errorEl.style.display = "none";
        }
      });
    }

    wrap.appendChild(textarea);
    wrap.appendChild(errorEl);
    return wrap;
  }

  /**
   * Generates a standard glassmorphic input text field.
   */
  static createInput(id, type = "text", placeholder = "", label = "", defaultValue = "", required = false, validator = null) {
    const wrap = document.createElement("div");
    wrap.className = "field-grid-1";
    
    const uniqueErrorId = `${id}-error`;

    if (label) {
      const lbl = document.createElement("label");
      lbl.className = "field-label";
      lbl.htmlFor = id;
      lbl.innerHTML = `${label}${required ? ' <span class="required-star" aria-hidden="true">*</span>' : ''}`;
      wrap.appendChild(lbl);
    }
    
    const input = document.createElement("input");
    input.id = id;
    input.type = type;
    input.className = "field-input";
    input.placeholder = placeholder;
    input.value = defaultValue;
    input.required = required;
    input.setAttribute("aria-label", label || placeholder);
    input.setAttribute("aria-invalid", "false");
    input.setAttribute("aria-describedby", uniqueErrorId);
    
    const errorEl = document.createElement("span");
    errorEl.id = uniqueErrorId;
    errorEl.className = "field-error-msg";
    errorEl.style.display = "none";
    errorEl.style.color = "#ff6b6b";
    errorEl.style.fontSize = "0.75rem";
    errorEl.style.marginTop = "4px";
    errorEl.setAttribute("aria-live", "polite");

    if (validator) {
      input.addEventListener("input", () => {
        const val = input.value;
        const err = validator(val);
        if (err) {
          input.setAttribute("aria-invalid", "true");
          errorEl.textContent = err;
          errorEl.style.display = "block";
        } else {
          input.setAttribute("aria-invalid", "false");
          errorEl.style.display = "none";
        }
      });
    }

    wrap.appendChild(input);
    wrap.appendChild(errorEl);
    return wrap;
  }

  /**
   * Generates a dropdown select field.
   */
  static createSelect(id, options = [], label = "", defaultValue = "") {
    const wrap = document.createElement("div");
    wrap.className = "field-grid-1";
    
    if (label) {
      const lbl = document.createElement("label");
      lbl.className = "field-label";
      lbl.htmlFor = id;
      lbl.textContent = label;
      wrap.appendChild(lbl);
    }
    
    const select = document.createElement("select");
    select.id = id;
    select.className = "field-input select-input";
    select.setAttribute("aria-label", label);
    
    options.forEach(opt => {
      const option = document.createElement("option");
      option.value = typeof opt === "string" ? opt : opt.value;
      option.textContent = typeof opt === "string" ? opt : opt.text;
      if (option.value === defaultValue) {
        option.selected = true;
      }
      select.appendChild(option);
    });
    
    wrap.appendChild(select);
    return wrap;
  }

  /**
   * Generates an interactive slider with dynamic values.
   */
  static createSlider(id, min = 0, max = 100, step = 1, defaultValue = 50, label = "") {
    const wrap = document.createElement("div");
    wrap.className = "field-grid-1 slider-wrap";
    
    const labelRow = document.createElement("div");
    labelRow.style.display = "flex";
    labelRow.style.justifyContent = "space-between";
    labelRow.style.alignItems = "center";
    labelRow.style.marginBottom = "4px";
    
    if (label) {
      const lbl = document.createElement("label");
      lbl.className = "field-label";
      lbl.htmlFor = id;
      lbl.textContent = label;
      labelRow.appendChild(lbl);
    }
    
    const valBadge = document.createElement("span");
    valBadge.className = "slider-value-badge";
    valBadge.id = `${id}-val-badge`;
    valBadge.textContent = defaultValue;
    labelRow.appendChild(valBadge);
    
    wrap.appendChild(labelRow);
    
    const slider = document.createElement("input");
    slider.id = id;
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = defaultValue;
    slider.className = "slider-input";
    slider.setAttribute("aria-valuemin", min);
    slider.setAttribute("aria-valuemax", max);
    slider.setAttribute("aria-valuenow", defaultValue);
    
    slider.addEventListener("input", (e) => {
      valBadge.textContent = e.target.value;
      slider.setAttribute("aria-valuenow", e.target.value);
    });
    
    wrap.appendChild(slider);
    return wrap;
  }

  /**
   * Generates a togglable switch checkbox.
   */
  static createSwitch(id, label = "", checked = false) {
    const wrap = document.createElement("div");
    wrap.className = "switch-container";
    wrap.style.display = "flex";
    wrap.style.alignItems = "center";
    wrap.style.gap = "10px";
    wrap.style.margin = "8px 0";
    
    const input = document.createElement("input");
    input.id = id;
    input.type = "checkbox";
    input.checked = checked;
    input.className = "switch-input";
    input.style.display = "none";
    
    const switchLabel = document.createElement("label");
    switchLabel.htmlFor = id;
    switchLabel.className = "switch-slider-label";
    switchLabel.setAttribute("tabindex", "0");
    switchLabel.setAttribute("role", "switch");
    switchLabel.setAttribute("aria-checked", checked ? "true" : "false");
    switchLabel.setAttribute("aria-label", label);

    const toggleState = () => {
      input.checked = !input.checked;
      switchLabel.setAttribute("aria-checked", input.checked ? "true" : "false");
      input.dispatchEvent(new Event("change"));
    };

    switchLabel.addEventListener("click", (e) => {
      e.preventDefault();
      toggleState();
    });

    switchLabel.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggleState();
      }
    });
    
    const textLabel = document.createElement("span");
    textLabel.className = "field-label";
    textLabel.style.margin = "0";
    textLabel.textContent = label;
    
    wrap.appendChild(input);
    wrap.appendChild(switchLabel);
    wrap.appendChild(textLabel);
    return wrap;
  }

  /**
   * Generates a Drag & Drop Upload Zone area with rich feedback and accessibility.
   */
  static createUploadZone(id, fileTypes = "*", label = "Drop your files here") {
    const zone = document.createElement("div");
    zone.id = id;
    zone.className = "upload-drop-zone";
    zone.setAttribute("tabindex", "0");
    zone.setAttribute("role", "button");
    zone.setAttribute("aria-label", label);
    
    const icon = document.createElement("div");
    icon.className = "upload-drop-zone-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "☁️";

    const text = document.createElement("p");
    text.className = "upload-zone-text";
    text.textContent = label;

    const subtext = document.createElement("p");
    subtext.className = "upload-zone-subtext";
    subtext.textContent = "or click to browse from device";

    const chipsContainer = document.createElement("div");
    chipsContainer.className = "upload-format-chips";

    if (fileTypes && fileTypes !== "*") {
      const types = fileTypes.split(",").map(t => t.trim().replace(/^\./, "").toUpperCase());
      types.slice(0, 5).forEach(ext => {
        const chip = document.createElement("span");
        chip.className = "format-chip";
        chip.textContent = ext;
        chipsContainer.appendChild(chip);
      });
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = `${id}-file-input`;
    fileInput.accept = fileTypes;
    fileInput.style.display = "none";

    const selectedFileContainer = document.createElement("div");
    selectedFileContainer.id = `${id}-selected-info`;
    selectedFileContainer.style.display = "none";
    
    zone.appendChild(icon);
    zone.appendChild(text);
    zone.appendChild(subtext);
    if (chipsContainer.children.length) zone.appendChild(chipsContainer);
    zone.appendChild(selectedFileContainer);
    zone.appendChild(fileInput);
    
    const formatBytes = (bytes) => {
      if (!bytes || bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const updateSelectedUI = (file) => {
      if (!file) {
        selectedFileContainer.style.display = "none";
        selectedFileContainer.innerHTML = "";
        zone.classList.remove("accepted");
        return;
      }
      zone.classList.add("accepted");
      selectedFileContainer.style.display = "block";
      selectedFileContainer.innerHTML = `
        <div class="selected-file-chip">
          <span>📄</span>
          <strong>${file.name}</strong>
          <span class="selected-file-size">(${formatBytes(file.size)})</span>
          <button type="button" class="file-clear-btn" title="Remove file" aria-label="Remove selected file">&times;</button>
        </div>
      `;

      const clearBtn = selectedFileContainer.querySelector(".file-clear-btn");
      if (clearBtn) {
        clearBtn.onclick = (e) => {
          e.stopPropagation();
          fileInput.value = "";
          updateSelectedUI(null);
          fileInput.dispatchEvent(new Event("change"));
        };
      }
    };

    // Drag/Drop visual feedback
    let dragCounter = 0;

    zone.addEventListener("dragenter", (e) => {
      e.preventDefault();
      dragCounter++;
      zone.classList.add("dragover", "dragging");
    });

    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("dragover", "dragging");
    });
    
    zone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        dragCounter = 0;
        zone.classList.remove("dragover", "dragging");
      }
    });
    
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      dragCounter = 0;
      zone.classList.remove("dragover", "dragging");
      if (e.dataTransfer && e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        updateSelectedUI(e.dataTransfer.files[0]);
        fileInput.dispatchEvent(new Event("change"));
      }
    });
    
    zone.addEventListener("click", () => {
      fileInput.click();
    });

    zone.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        fileInput.click();
      }
    });

    fileInput.addEventListener("change", () => {
      if (fileInput.files && fileInput.files.length) {
        updateSelectedUI(fileInput.files[0]);
      } else {
        updateSelectedUI(null);
      }
    });
    
    return zone;
  }

  /**
   * Generates a reusable action button (Copy, Download, Clear, Reset, Run)
   */
  static createActionButton(id, icon, text, variant = "primary", onClick = null) {
    const btn = document.createElement("button");
    btn.id = id;
    btn.className = `btn btn-${variant}`;
    btn.innerHTML = `<span class="btn-icon-inside" aria-hidden="true">${icon}</span> ${text}`;
    if (onClick) {
      btn.onclick = onClick;
    }
    return btn;
  }

  /**
   * Generates a standard result card
   */
  static createResultCard(id, title, initialContent = "") {
    const card = document.createElement("div");
    card.id = id;
    card.className = "content-card result-card";
    
    if (title) {
      const header = document.createElement("h3");
      header.textContent = title;
      card.appendChild(header);
    }
    
    const content = document.createElement("div");
    content.className = "result-content";
    content.innerHTML = initialContent;
    card.appendChild(content);
    
    return card;
  }

  /**
   * Generates a toast notification
   */
  static createToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    return toast;
  }

  /**
   * Generates a modal dialog
   */
  static createModal(id, title, contentEl) {
    const overlay = document.createElement("div");
    overlay.id = id;
    overlay.className = "modal-overlay";
    
    const modal = document.createElement("div");
    modal.className = "modal-content";
    
    const header = document.createElement("div");
    header.className = "modal-header";
    const titleEl = document.createElement("h3");
    titleEl.textContent = title;
    
    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close-btn";
    closeBtn.innerHTML = "&times;";
    closeBtn.onclick = () => overlay.remove();
    
    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    
    const body = document.createElement("div");
    body.className = "modal-body";
    body.appendChild(contentEl);
    
    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);
    
    return overlay;
  }

  /**
   * Generates a skeleton loader
   */
  static createSkeleton(width = "100%", height = "20px") {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton-loader";
    skeleton.style.width = width;
    skeleton.style.height = height;
    return skeleton;
  }

  /**
   * Generates a tabbed navigation interface
   */
  static createTabs(id, tabsList = []) {
    const wrap = document.createElement("div");
    wrap.id = id;
    wrap.className = "tabs-wrapper";
    
    const header = document.createElement("div");
    header.className = "tabs-header";
    header.style.display = "flex";
    header.style.gap = "8px";
    header.style.marginBottom = "16px";
    
    const contentArea = document.createElement("div");
    contentArea.className = "tabs-content-area";
    
    tabsList.forEach((t, i) => {
      const btn = document.createElement("button");
      btn.className = `btn ${i === 0 ? 'primary' : 'ghost'} tab-btn`;
      btn.textContent = t.label;
      btn.onclick = () => {
        header.querySelectorAll(".tab-btn").forEach(b => {
          b.classList.remove("primary");
          b.classList.add("ghost");
        });
        btn.classList.remove("ghost");
        btn.classList.add("primary");
        contentArea.querySelectorAll(".tab-pane").forEach(p => p.style.display = "none");
        const activePane = document.getElementById(`${id}-pane-${i}`);
        if (activePane) activePane.style.display = "block";
      };
      header.appendChild(btn);
      
      const pane = document.createElement("div");
      pane.id = `${id}-pane-${i}`;
      pane.className = "tab-pane";
      pane.style.display = i === 0 ? "block" : "none";
      if (t.content) {
        if (typeof t.content === "string") pane.innerHTML = t.content;
        else pane.appendChild(t.content);
      }
      contentArea.appendChild(pane);
    });
    
    wrap.appendChild(header);
    wrap.appendChild(contentArea);
    return wrap;
  }

  /**
   * Generates an interactive accordion list (for FAQ or details)
   */
  static createAccordion(id, items = []) {
    const wrap = document.createElement("div");
    wrap.id = id;
    wrap.className = "accordion-wrapper";
    
    items.forEach((item, index) => {
      const accItem = document.createElement("div");
      accItem.className = "faq-item";
      accItem.innerHTML = `
        <div class="faq-q" tabindex="0" role="button" aria-expanded="false">${item.title || item.q}<span>＋</span></div>
        <div class="faq-a" style="max-height:0; overflow:hidden; transition: max-height 0.3s ease, padding 0.3s ease;">${item.content || item.a}</div>
      `;
      
      const q = accItem.querySelector(".faq-q");
      const a = accItem.querySelector(".faq-a");
      const toggle = () => {
        const isOpen = accItem.classList.toggle("open");
        q.setAttribute("aria-expanded", isOpen ? "true" : "false");
        a.style.maxHeight = isOpen ? "300px" : "0";
        a.style.padding = isOpen ? "12px 22px 16px" : "0 22px";
      };
      
      q.onclick = toggle;
      q.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } };
      wrap.appendChild(accItem);
    });
    
    return wrap;
  }

  /**
   * Generates a badge indicator
   */
  static createBadge(text, variant = "info") {
    const badge = document.createElement("span");
    badge.className = `cnt badge-${variant}`;
    badge.textContent = text;
    return badge;
  }

  /**
   * Generates a tag element
   */
  static createTag(text, onClick = null) {
    const tag = document.createElement("span");
    tag.className = "tag-pill";
    tag.style.background = "var(--card-bg-hover)";
    tag.style.border = "1px solid var(--border-color)";
    tag.style.color = "var(--accent-color)";
    tag.style.padding = "4px 12px";
    tag.style.borderRadius = "20px";
    tag.style.fontSize = "0.75rem";
    tag.style.fontWeight = "600";
    tag.style.cursor = onClick ? "pointer" : "default";
    tag.textContent = text;
    if (onClick) tag.onclick = onClick;
    return tag;
  }

  /**
   * Generates the Universal Command Palette Search Modal
   */
  static createSearchModal() {
    const overlay = document.createElement("div");
    overlay.id = "globalSearchModal";
    overlay.className = "modal-overlay search-modal-overlay";
    overlay.style.display = "none";
    
    overlay.innerHTML = `
      <div class="search-modal-container">
        <div class="search-modal-header">
          <span class="search-icon">🔍</span>
          <input type="text" id="cmdSearchInput" placeholder="Search 150+ tools, categories, pages... (Ctrl + K)" autocomplete="off">
          <button class="cmd-clear-btn" id="cmdClearInput" style="display:none;">✕</button>
          <span class="cmd-shortcut-badge">ESC</span>
        </div>

        <div class="search-modal-filters">
          <button class="filter-chip active" data-filter="all">All</button>
          <button class="filter-chip" data-filter="image">🖼 Image</button>
          <button class="filter-chip" data-filter="pdf">📄 PDF</button>
          <button class="filter-chip" data-filter="dev">🛠 Dev</button>
          <button class="filter-chip" data-filter="medical">🩺 Medical</button>
          <button class="filter-chip" data-filter="ai">⚡ AI</button>
        </div>

        <div class="search-modal-body" id="cmdSearchBody">
          <!-- Autocomplete results, typos, recent & popular searches -->
          <div class="cmd-section" id="cmdTypoSection" style="display:none;">
            <div class="cmd-section-title">Did you mean?</div>
            <div id="cmdTypoResults" class="cmd-results-list"></div>
          </div>

          <div class="cmd-section" id="cmdResultsSection" style="display:none;">
            <div class="cmd-section-title">Tools</div>
            <div id="cmdResultsList" class="cmd-results-list"></div>
          </div>

          <div class="cmd-section" id="cmdEmptySection" style="display:none; text-align:center; padding:28px 16px;">
            <div style="font-size:2rem; margin-bottom:8px;">🔍</div>
            <div style="font-weight:600; font-size:1rem; color:var(--color-foreground, #F8FAFC); margin-bottom:4px;">No tools found.</div>
            <p style="color:var(--color-muted, #94A3B8); font-size:0.875rem; margin-bottom:16px;">Try another search or browse categories.</p>
            <a href="index.html#tools" class="btn btn-sm btn-primary" id="cmdBrowseCatBtn" style="display:inline-flex; align-items:center; gap:6px; text-decoration:none;">Browse Categories</a>
          </div>

          <div class="cmd-section" id="cmdRecentSection">
            <div class="cmd-section-title">
              <span>🕒 Recent Searches</span>
              <button id="cmdClearRecentBtn" class="btn-text-sm">Clear</button>
            </div>
            <div id="cmdRecentList" class="cmd-tags-row"></div>
          </div>

          <div class="cmd-section" id="cmdPopularSection">
            <div class="cmd-section-title">🔥 Popular Searches</div>
            <div id="cmdPopularList" class="cmd-tags-row">
              <span class="cmd-tag">BMI Calculator</span>
              <span class="cmd-tag">Image Compressor</span>
              <span class="cmd-tag">PDF Compress</span>
              <span class="cmd-tag">QR Code</span>
              <span class="cmd-tag">Troponin</span>
              <span class="cmd-tag">Case Converter</span>
            </div>
          </div>
        </div>

        <div class="search-modal-footer">
          <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Select</span>
          <span><kbd>ESC</kbd> Close</span>
        </div>
      </div>
    `;
    return overlay;
  }
    
  /**
   * Generates the Universal Social Share Overlay Modal
   */
  static createShareModal(title = "SSDK Tool", url = window.location.href) {
    const encTitle = encodeURIComponent(title);
    const encUrl = encodeURIComponent(url);
    
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay share-modal-overlay";
    
    const content = document.createElement("div");
    content.className = "modal-content share-modal-content";
    content.style.maxWidth = "460px";
    
    content.innerHTML = `
      <div class="modal-header">
        <h3>🔗 Share ${title}</h3>
        <button class="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body" style="padding-top: 15px;">
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;">Share this free online tool with friends and colleagues:</p>
        
        <div class="share-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
          <a href="https://api.whatsapp.com/send?text=${encTitle}%20${encUrl}" target="_blank" class="share-btn-item" style="background: rgba(37, 211, 102, 0.15); border: 1px solid rgba(37, 211, 102, 0.4); color: #25D366; text-decoration: none; padding: 10px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; text-align: center;">💬 WhatsApp</a>
          <a href="https://t.me/share/url?url=${encUrl}&text=${encTitle}" target="_blank" class="share-btn-item" style="background: rgba(0, 136, 204, 0.15); border: 1px solid rgba(0, 136, 204, 0.4); color: #0088cc; text-decoration: none; padding: 10px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; text-align: center;">✈️ Telegram</a>
          <a href="https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}" target="_blank" class="share-btn-item" style="background: rgba(29, 161, 242, 0.15); border: 1px solid rgba(29, 161, 242, 0.4); color: #1DA1F2; text-decoration: none; padding: 10px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; text-align: center;">🐦 X / Twitter</a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encUrl}" target="_blank" class="share-btn-item" style="background: rgba(24, 119, 242, 0.15); border: 1px solid rgba(24, 119, 242, 0.4); color: #1877F2; text-decoration: none; padding: 10px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; text-align: center;">📘 Facebook</a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}" target="_blank" class="share-btn-item" style="background: rgba(10, 102, 194, 0.15); border: 1px solid rgba(10, 102, 194, 0.4); color: #0A66C2; text-decoration: none; padding: 10px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; text-align: center;">🔗 LinkedIn</a>
          <a href="mailto:?subject=${encTitle}&body=Check%20out%20this%20tool:%20${encUrl}" class="share-btn-item" style="background: rgba(234, 67, 53, 0.15); border: 1px solid rgba(234, 67, 53, 0.4); color: #ea4335; text-decoration: none; padding: 10px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; text-align: center;">✉️ Email</a>
        </div>

        <div style="display: flex; gap: 8px;">
          <input type="text" readonly value="${url}" id="shareModalUrlInput" style="flex: 1; padding: 8px 12px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-primary); font-size: 0.85rem; outline: none;">
          <button id="copyShareModalUrlBtn" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.85rem;">📋 Copy Link</button>
        </div>
      </div>
    `;

    const closeBtn = content.querySelector(".modal-close-btn");
    closeBtn.onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    const copyBtn = content.querySelector("#copyShareModalUrlBtn");
    const input = content.querySelector("#shareModalUrlInput");
    copyBtn.onclick = () => {
      input.select();
      navigator.clipboard.writeText(url);
      copyBtn.textContent = "✅ Copied!";
      setTimeout(() => copyBtn.textContent = "📋 Copy Link", 2000);
    };

    overlay.appendChild(content);
    return overlay;
  }

  /**
   * Generates a Rating & Reviews Widget
   */
  static createRatingWidget(rating = 4.9, count = 128) {
    const wrap = document.createElement("div");
    wrap.className = "rating-widget";
    wrap.style.display = "inline-flex";
    wrap.style.alignItems = "center";
    wrap.style.gap = "8px";
    wrap.style.fontSize = "0.85rem";
    wrap.style.fontWeight = "700";
    wrap.style.color = "var(--warning-color, #f59e0b)";
    
    wrap.innerHTML = `
      <span>${rating.toFixed(1)}</span>
      <span>★★★★★</span>
      <span style="color: var(--text-muted); font-weight: 500;">(${count} reviews)</span>
    `;
    return wrap;
  }

  /**
   * Generates the Floating AI Chat Assistant Widget
   */
  static createAIChatWidget(coreInstance) {
    const wrap = document.createElement("div");
    wrap.id = "ssdkAiChatWidget";
    wrap.style.position = "fixed";
    wrap.style.bottom = "24px";
    wrap.style.right = "24px";
    wrap.style.zIndex = "999";

    wrap.innerHTML = `
      <button id="aiChatToggleBtn" style="width: 54px; height: 54px; border-radius: 50%; background: var(--grad); border: none; color: #fff; font-size: 1.5rem; cursor: pointer; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4); display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease;">
        🤖
      </button>

      <div id="aiChatBox" style="display: none; position: absolute; bottom: 68px; right: 0; width: 340px; height: 440px; background: rgba(17, 23, 38, 0.95); border: 1px solid var(--border-color); border-radius: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.5); backdrop-filter: blur(16px); flex-direction: column; overflow: hidden; animation: fadeIn 0.3s ease;">
        <div style="padding: 14px 18px; background: var(--card-bg-hover); border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>🤖</span>
            <strong style="font-size: 0.95rem; color: var(--text-primary);">SSDK AI Assistant</strong>
          </div>
          <button id="aiChatCloseBtn" style="background: none; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer;">✕</button>
        </div>

        <div id="aiChatMessages" style="flex: 1; padding: 14px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; font-size: 0.85rem;">
          <div style="background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.3); color: var(--text-primary); padding: 10px 14px; border-radius: 12px; max-width: 90%;">
            Hello! 👋 I am your SSDK AI Assistant. Ask me to find tools, explain features, or write master prompts!
          </div>
        </div>

        <div style="padding: 10px 14px; background: var(--card-bg-hover); border-top: 1px solid var(--border-color); display: flex; gap: 8px;">
          <input type="text" id="aiChatInput" placeholder="Ask AI assistant..." style="flex: 1; padding: 8px 12px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-primary); font-size: 0.85rem; outline: none;">
          <button id="aiChatSendBtn" class="btn btn-primary" style="padding: 8px 14px; font-size: 0.85rem;">Send</button>
        </div>
      </div>
    `;

    setTimeout(() => {
      const toggleBtn = wrap.querySelector("#aiChatToggleBtn");
      const chatBox = wrap.querySelector("#aiChatBox");
      const closeBtn = wrap.querySelector("#aiChatCloseBtn");
      const sendBtn = wrap.querySelector("#aiChatSendBtn");
      const input = wrap.querySelector("#aiChatInput");
      const msgs = wrap.querySelector("#aiChatMessages");

      toggleBtn.onclick = () => {
        const isHidden = chatBox.style.display === "none";
        chatBox.style.display = isHidden ? "flex" : "none";
      };
      closeBtn.onclick = () => chatBox.style.display = "none";

      const handleSend = async () => {
        const val = input.value.trim();
        if (!val) return;
        
        // Append user message
        const uDiv = document.createElement("div");
        uDiv.style.alignSelf = "flex-end";
        uDiv.style.background = "var(--grad)";
        uDiv.style.color = "#fff";
        uDiv.style.padding = "8px 12px";
        uDiv.style.borderRadius = "12px";
        uDiv.style.maxWidth = "85%";
        uDiv.textContent = val;
        msgs.appendChild(uDiv);
        input.value = "";
        msgs.scrollTop = msgs.scrollHeight;

        // Query AI engine
        const aiEngine = coreInstance.getEngine("ai");
        if (aiEngine) {
          const res = await aiEngine.chat(val);
          const aiDiv = document.createElement("div");
          aiDiv.style.background = "rgba(124, 58, 237, 0.15)";
          aiDiv.style.border = "1px solid rgba(124, 58, 237, 0.3)";
          aiDiv.style.color = "var(--text-primary)";
          aiDiv.style.padding = "10px 14px";
          aiDiv.style.borderRadius = "12px";
          aiDiv.style.maxWidth = "90%";
          aiDiv.innerHTML = res.reply;
          msgs.appendChild(aiDiv);
          msgs.scrollTop = msgs.scrollHeight;
        }
      };

      sendBtn.onclick = handleSend;
      input.onkeydown = (e) => { if (e.key === "Enter") handleSend(); };
    }, 100);

    return wrap;
  }

  /**
   * Generates a Toast notification.
   */
  static createToast(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    
    // Default styling if no external CSS exists
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "8px";
    toast.style.background = type === "error" ? "#ff4757" : type === "success" ? "#2ed573" : "rgba(255,255,255,0.1)";
    toast.style.color = "#fff";
    toast.style.backdropFilter = "blur(10px)";
    toast.style.border = "1px solid rgba(255,255,255,0.2)";
    toast.style.zIndex = "9999";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });
    
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /**
   * Generates a Modal Dialog.
   */
  static createModal(title, contentElement, onClose = null) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.5)";
    overlay.style.backdropFilter = "blur(5px)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "9998";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.3s ease";
    
    const modal = document.createElement("div");
    modal.className = "modal-content glass-panel";
    modal.style.background = "rgba(25,25,35,0.85)";
    modal.style.padding = "24px";
    modal.style.borderRadius = "12px";
    modal.style.minWidth = "300px";
    modal.style.maxWidth = "90%";
    modal.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
    
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.marginBottom = "16px";
    
    const titleEl = document.createElement("h3");
    titleEl.textContent = title;
    titleEl.style.margin = "0";
    titleEl.style.color = "#fff";
    
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "#fff";
    closeBtn.style.fontSize = "24px";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.remove();
        if (onClose) onClose();
      }, 300);
    };
    
    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    modal.appendChild(header);
    modal.appendChild(contentElement);
    overlay.appendChild(modal);
    
    document.body.appendChild(overlay);
    
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
    });
    
    return overlay;
  }

  /**
   * Generates a Skeleton Loader block.
   */
  static createSkeleton(width = "100%", height = "20px", borderRadius = "4px") {
    const skel = document.createElement("div");
    skel.className = "skeleton-loader";
    skel.style.width = width;
    skel.style.height = height;
    skel.style.borderRadius = borderRadius;
    skel.style.background = "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)";
    skel.style.backgroundSize = "200% 100%";
    skel.style.animation = "shimmer 1.5s infinite";
    
    // Add shimmer animation if not exists
    if (!document.getElementById("shimmer-style")) {
      const style = document.createElement("style");
      style.id = "shimmer-style";
      style.textContent = `@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`;
      document.head.appendChild(style);
    }
    
    return skel;
  }

  /**
   * Generates Pagination controls.
   */
  static createPagination(currentPage, totalPages, onPageChange) {
    const wrap = document.createElement("div");
    wrap.className = "pagination-wrap";
    wrap.style.display = "flex";
    wrap.style.gap = "8px";
    wrap.style.justifyContent = "center";
    wrap.style.marginTop = "20px";
    
    const createBtn = (text, page, disabled) => {
      const btn = document.createElement("button");
      btn.textContent = text;
      btn.className = `glass-btn ${disabled ? 'disabled' : ''} ${page === currentPage ? 'active' : ''}`;
      if (page === currentPage) {
        btn.style.background = "rgba(100,100,255,0.3)";
      }
      btn.disabled = disabled;
      if (!disabled) {
        btn.onclick = () => onPageChange(page);
      }
      return btn;
    };
    
    wrap.appendChild(createBtn("Prev", currentPage - 1, currentPage <= 1));
    
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
       wrap.appendChild(createBtn(i.toString(), i, false));
    }
    
    wrap.appendChild(createBtn("Next", currentPage + 1, currentPage >= totalPages));
    return wrap;
  }

  /**
   * Generates Breadcrumb navigation.
   */
  static createBreadcrumb(paths) {
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Breadcrumb");
    const ol = document.createElement("ol");
    ol.style.listStyle = "none";
    ol.style.display = "flex";
    ol.style.gap = "8px";
    ol.style.padding = "0";
    ol.style.margin = "0";
    
    paths.forEach((path, idx) => {
      const li = document.createElement("li");
      if (idx === paths.length - 1) {
        li.textContent = path.name;
        li.style.color = "rgba(255,255,255,0.6)";
        li.setAttribute("aria-current", "page");
      } else {
        const a = document.createElement("a");
        a.href = path.url;
        a.textContent = path.name;
        a.style.color = "#fff";
        a.style.textDecoration = "none";
        li.appendChild(a);
        
        const sep = document.createElement("span");
        sep.textContent = " / ";
        sep.style.color = "rgba(255,255,255,0.4)";
        li.appendChild(sep);
      }
      ol.appendChild(li);
    });
    
    nav.appendChild(ol);
    return nav;
  }
}




