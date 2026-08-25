// SSDK PDF Engine - Centralized Service for PDF Upload, Processing, and Download
// Provides common architecture for 54+ PDF Tools leveraging pdf-lib for client-side processing.

export class PDFEngine {
  constructor() {
    this.core = null;
    this.activeFiles = []; // Array of { file, arrayBuffer }
    this.pdfLibLoaded = false;
    
    // UI Elements
    this.container = null;
  }

  async init(core) {
    this.core = core;
    console.log("[PDFEngine] Initialized for unified PDF processing.");
  }

  /**
   * Mounts the PDF Processing UI into the Universal Tool Template.
   */
  mountUI(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="pdf-workspace" style="display: flex; flex-direction: column; gap: 20px; align-items: center; width: 100%;">
        
        <!-- Upload Zone -->
        <div id="pdf-upload-zone" class="glass-card upload-zone" style="border: 2px dashed var(--border-color); padding: 40px; text-align: center; cursor: pointer; width: 100%; border-radius: 12px; transition: all 0.3s ease;">
          <h3 style="margin-bottom: 10px;">Drag & Drop PDFs Here</h3>
          <p style="color: var(--text-secondary); margin-bottom: 20px;">or click to browse</p>
          <input type="file" id="pdf-file-input" accept="application/pdf" style="display: none;" multiple>
          <button class="btn btn-primary" onclick="document.getElementById('pdf-file-input').click()">Choose Files</button>
        </div>

        <!-- Preview & Action Zone (Hidden by default) -->
        <div id="pdf-preview-zone" class="glass-card" style="display: none; width: 100%; text-align: left; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 15px; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
             <h4>Loaded Documents (<span id="pdf-count-text">0</span>)</h4>
             <div>
               <button id="btn-add-more-pdfs" class="btn btn-ghost btn-sm" onclick="document.getElementById('pdf-file-input').click()">+ Add More</button>
               <button id="btn-reset-pdfs" class="btn btn-ghost btn-sm" style="color: var(--danger-color);">Reset All</button>
             </div>
          </div>
          
          <ul id="pdf-file-list" style="list-style: none; padding: 0; margin: 0 0 20px 0; max-height: 200px; overflow-y: auto;">
             <!-- Loaded files listed here -->
          </ul>
          
          <div id="tool-specific-controls" style="width: 100%; display: flex; flex-direction: column; gap: 15px; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
             <!-- Tool Specific Logic injected here -->
          </div>

          <div style="display: flex; justify-content: center; margin-top: 20px;">
             <button id="btn-process-download" class="btn btn-success" style="width: 100%; max-width: 300px;">Process & Download</button>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const dropZone = document.getElementById("pdf-upload-zone");
    const fileInput = document.getElementById("pdf-file-input");
    const resetBtn = document.getElementById("btn-reset-pdfs");

    dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.style.borderColor = "var(--primary-color)"; });
    dropZone.addEventListener("dragleave", () => { dropZone.style.borderColor = "var(--border-color)"; });
    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "var(--border-color)";
      if (e.dataTransfer.files.length) this.handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length) this.handleFiles(e.target.files);
    });

    resetBtn.addEventListener("click", () => this.resetWorkspace());
  }

  async handleFiles(files) {
    if (!files || files.length === 0) return;
    
    // Ensure pdf-lib is loaded
    await this.ensurePdfLib();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== "application/pdf") {
         this.core.getEngine("notification")?.show(`Skipped ${file.name} - Not a PDF`, "warning");
         continue;
      }

      const arrayBuffer = await file.arrayBuffer();
      this.activeFiles.push({ file, arrayBuffer });
    }

    if (this.activeFiles.length > 0) {
      this.renderFileList();
      this.showWorkspace();
      this.core.getEngine("notification")?.show(`Loaded ${this.activeFiles.length} PDF(s)`, "success");
      
      // Notify tool that files are ready
      document.dispatchEvent(new CustomEvent("ssdk:pdfLoaded", { detail: { files: this.activeFiles } }));
    }
  }

  renderFileList() {
    const list = document.getElementById("pdf-file-list");
    list.innerHTML = "";
    this.activeFiles.forEach((item, index) => {
      const sizeStr = (item.file.size / 1024 / 1024).toFixed(2) + " MB";
      list.innerHTML += `
        <li style="display:flex; justify-content:space-between; padding:8px 10px; background: rgba(255,255,255,0.05); margin-bottom: 5px; border-radius: 4px;">
           <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80%;">${item.file.name}</span>
           <span style="color:var(--text-muted); font-size: 0.85rem;">${sizeStr}</span>
        </li>
      `;
    });
    document.getElementById("pdf-count-text").textContent = this.activeFiles.length;
  }

  showWorkspace() {
    document.getElementById("pdf-upload-zone").style.display = "none";
    document.getElementById("pdf-preview-zone").style.display = "flex";
  }

  resetWorkspace() {
    this.activeFiles = [];
    document.getElementById("pdf-upload-zone").style.display = "block";
    document.getElementById("pdf-preview-zone").style.display = "none";
    document.getElementById("pdf-file-input").value = "";
    document.dispatchEvent(new CustomEvent("ssdk:pdfReset"));
  }

  /**
   * Helper to download processed byte array
   */
  downloadPdf(uint8Array, filename) {
    const blob = new Blob([uint8Array], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.core.getEngine("notification")?.show(`Downloaded ${filename}`, "success");
  }

  /**
   * Dynamically injects pdf-lib from CDN only when needed.
   */
  ensurePdfLib() {
    return new Promise((resolve, reject) => {
      if (this.pdfLibLoaded || window.PDFLib) {
        this.pdfLibLoaded = true;
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js";
      script.onload = () => {
        this.pdfLibLoaded = true;
        console.log("[PDFEngine] pdf-lib loaded successfully");
        resolve();
      };
      script.onerror = () => reject(new Error("Failed to load pdf-lib"));
      document.head.appendChild(script);
    });
  }
}
