// SSDK Platform Bridge Engine
// Abstract environment differences: Web, PWA, Electron, Chrome Extension, Mobile Webview

export class PlatformBridge {
  constructor() {
    this.core = null;
    this.environment = "web"; // web, pwa, electron, extension, ios, android
  }

  async init(core) {
    this.core = core;
    this.detectEnvironment();
    
    if (this.core.getEngine("logger")) {
      this.core.getEngine("logger").info("PlatformBridge", `Detected Runtime Environment: ${this.environment}`);
    }
  }

  detectEnvironment() {
    if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
      this.environment = "electron";
    } else if (typeof chrome !== 'undefined' && chrome.extension) {
      this.environment = "extension";
    } else if (window.matchMedia('(display-mode: standalone)').matches) {
      this.environment = "pwa";
    } else if (window.webkit && window.webkit.messageHandlers) {
      this.environment = "ios";
    } else if (window.AndroidBridge) {
      this.environment = "android";
    } else {
      this.environment = "web";
    }
  }

  /**
   * PWA Install Prompt Logic
   */
  async promptInstall() {
    if (this.environment !== "web") return false;
    // Store deferred prompt globally somewhere
    if (window.deferredPwaPrompt) {
      window.deferredPwaPrompt.prompt();
      const result = await window.deferredPwaPrompt.userChoice;
      window.deferredPwaPrompt = null;
      return result.outcome === "accepted";
    }
    return false;
  }

  /**
   * Universal share intent
   */
  async share(title, text, url) {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return true;
      } catch (e) {
        return false;
      }
    }
    // Fallback copy to clipboard
    navigator.clipboard.writeText(url);
    return false;
  }
}
