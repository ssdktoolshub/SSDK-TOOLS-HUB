// SSDK Image Engine - Centralized Service for Image Upload, Canvas Processing, and Download
// Provides common architecture for all 66+ Image Tools to ensure zero code duplication.

export class ImageEngine {
  constructor() {
    this.core = null;
    this.activeImage = null; // HTMLImageElement
    this.activeFileName = "";
    this.activeFileType = "";
    
    // UI Elements
    this.container = null;
    this.previewCanvas = null;
    this.ctx = null;
  }

  async init(core) {
    this.core = core;
    console.log("[ImageEngine] Initialized for unified image processing.");
  }

  /**
   * Mounts the Image Processing UI into the Universal Tool Template.
   */
  mountUI(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="image-workspace" style="display: flex; flex-direction: column; gap: 20px; align-items: center; width: 100%;">
        
        <!-- Upload Zone -->
        <div id="image-upload-zone" class="glass-card upload-zone" style="border: 2px dashed var(--border-color); padding: 40px; text-align: center; cursor: pointer; width: 100%; border-radius: 12px; transition: all 0.3s ease;">
          <h3 style="margin-bottom: 10px;">Drag & Drop Image Here</h3>
          <p style="color: var(--text-secondary); margin-bottom: 20px;">or click to browse, or paste from clipboard (Ctrl+V)</p>
          <input type="file" id="image-file-input" accept="image/*" style="display: none;" multiple>
          <button class="btn btn-primary" onclick="document.getElementById('image-file-input').click()">Choose File</button>
        </div>

        <!-- Preview Zone (Hidden by default) -->
        <div id="image-preview-zone" class="glass-card" style="display: none; width: 100%; text-align: center; flex-direction: column; align-items: center;">
          <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 15px; align-items: center;">
             <h4 id="image-info-text">No Image</h4>
             <div>
               <button id="btn-reset-img" class="btn btn-ghost btn-sm">Reset</button>
               <button id="btn-zoom-in" class="btn btn-ghost btn-sm">Zoom In</button>
             </div>
          </div>
          <div style="max-width: 100%; overflow: auto; border: 1px solid var(--border-color); border-radius: 8px; background: rgba(0,0,0,0.2);">
             <canvas id="image-processing-canvas" style="max-width: 100%; height: auto; display: block;"></canvas>
          </div>
        </div>
        
        <!-- Action Zone (Hidden by default) -->
        <div id="image-action-zone" class="glass-card" style="display: none; width: 100%; justify-content: center; gap: 15px;">
           <!-- Tool specific controls will be injected here -->
           <div id="tool-specific-controls" style="width: 100%; display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;"></div>
           <button id="btn-process-download" class="btn btn-success" style="width: 100%; max-width: 300px; margin-top: 15px;">Process & Download</button>
        </div>
      </div>
    `;

    this.previewCanvas = document.getElementById("image-processing-canvas");
    this.ctx = this.previewCanvas.getContext("2d", { willReadFrequently: true });
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    const dropZone = document.getElementById("image-upload-zone");
    const fileInput = document.getElementById("image-file-input");
    const resetBtn = document.getElementById("btn-reset-img");

    // Drag and Drop
    dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.style.borderColor = "var(--primary-color)"; });
    dropZone.addEventListener("dragleave", () => { dropZone.style.borderColor = "var(--border-color)"; });
    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "var(--border-color)";
      if (e.dataTransfer.files.length) this.handleFiles(e.dataTransfer.files);
    });

    // File Input
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length) this.handleFiles(e.target.files);
    });

    // Clipboard Paste
    document.addEventListener("paste", (e) => {
      if (!this.container || this.container.offsetParent === null) return;
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (let item of items) {
        if (item.type.indexOf("image") === 0) {
          const blob = item.getAsFile();
          this.handleFiles([blob]);
        }
      }
    });

    // Reset
    resetBtn.addEventListener("click", () => this.resetWorkspace());
  }

  handleFiles(files) {
    if (!files || files.length === 0) return;
    const file = files[0]; // For now, handle single. Batch logic can loop.
    if (!file.type.startsWith("image/")) {
       this.core.getEngine("notification")?.show("Please select a valid image file.", "error");
       return;
    }

    this.activeFileName = file.name || "pasted_image.png";
    this.activeFileType = file.type;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.activeImage = img;
        this.renderToCanvas(img);
        this.showWorkspace();
        this.core.getEngine("notification")?.show("Image loaded successfully.", "success");
        
        // Trigger generic "imageLoaded" event for tool-specific logic
        document.dispatchEvent(new CustomEvent("ssdk:imageLoaded", { detail: { img: img, file: file } }));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  renderToCanvas(img) {
    if (!this.previewCanvas || !this.ctx) return;
    this.previewCanvas.width = img.width;
    this.previewCanvas.height = img.height;
    this.ctx.drawImage(img, 0, 0);
    document.getElementById("image-info-text").textContent = `${this.activeFileName} (${img.width}x${img.height}px)`;
  }

  showWorkspace() {
    document.getElementById("image-upload-zone").style.display = "none";
    document.getElementById("image-preview-zone").style.display = "flex";
    document.getElementById("image-action-zone").style.display = "flex";
  }

  resetWorkspace() {
    this.activeImage = null;
    this.activeFileName = "";
    document.getElementById("image-upload-zone").style.display = "block";
    document.getElementById("image-preview-zone").style.display = "none";
    document.getElementById("image-action-zone").style.display = "none";
    this.ctx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
    
    // Clear the file input
    document.getElementById("image-file-input").value = "";
    document.dispatchEvent(new CustomEvent("ssdk:imageReset"));
  }

  /**
   * Helper to download the current canvas content.
   */
  downloadCanvas(filename, format = "image/png", quality = 0.9) {
    if (!this.previewCanvas) return;
    const link = document.createElement('a');
    link.download = filename;
    link.href = this.previewCanvas.toDataURL(format, quality);
    link.click();
    this.core.getEngine("notification")?.show(`Downloaded ${filename}`, "success");
  }
}
