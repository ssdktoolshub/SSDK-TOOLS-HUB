// SSDK Capability Engine - Dynamic Workspace Adaptability
// Manages and adapts UI elements according to the features declared in tool manifests.

export class CapabilityEngine {
  constructor() {
    this.core = null;
  }

  async init(core) {
    this.core = core;
    console.log("[CapabilityEngine] Loaded capability adapter engine.");
  }

  /**
   * Adapts the tool page interface elements dynamically based on manifest capabilities.
   */
  adaptInterface(tool) {
    const caps = tool.capabilities || {
      dragDrop: true,
      clipboard: true,
      download: true,
      share: true,
      offline: true,
      print: true,
      fullscreen: true
    };

    // Toggle dynamic visibility of capabilities on the page
    const copyBtn = document.getElementById("btn-copy-output");
    const downloadBtn = document.getElementById("btn-download-output");
    const shareBtn = document.getElementById("btn-share-output");
    const printBtn = document.getElementById("btn-print-action");
    const fullscreenBtn = document.getElementById("btn-fullscreen-action");

    if (copyBtn) copyBtn.style.display = caps.clipboard !== false ? "inline-flex" : "none";
    if (downloadBtn) downloadBtn.style.display = caps.download !== false ? "inline-flex" : "none";
    if (shareBtn) shareBtn.style.display = caps.share !== false ? "inline-flex" : "none";
    if (printBtn) printBtn.style.display = caps.print ? "inline-flex" : "none";
    if (fullscreenBtn) fullscreenBtn.style.display = caps.fullscreen ? "inline-flex" : "none";
    
    // Adapt drag and drop zones
    const uploadZone = document.getElementById("upload-zone-slot");
    if (uploadZone) {
      uploadZone.style.display = caps.dragDrop !== false ? "block" : "none";
    }
  }
}
