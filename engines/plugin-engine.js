// SSDK Plugin Engine - Handles sandboxed executions of third-party modular tool plugins

export class PluginEngine {
  constructor() {
    this.core = null;
    this.activePlugins = new Map();
  }

  async init(core) {
    this.core = core;
  }

  /**
   * Mounts and executes a plugin dynamically inside a sandbox iframe.
   */
  async mountPlugin(pluginId, manifestUrl, containerElement) {
    console.log(`[PluginEngine] Mounting plugin [${pluginId}] from: ${manifestUrl}`);
    
    try {
      const response = await fetch(manifestUrl);
      if (!response.ok) throw new Error("Could not load plugin manifest");
      const manifest = await response.json();

      // Create sandboxed frame to run the script securely
      const iframe = document.createElement("iframe");
      iframe.id = `ssdk-plugin-${pluginId}`;
      iframe.className = "ssdk-plugin-frame";
      iframe.sandbox = "allow-scripts allow-downloads";
      iframe.style.width = "100%";
      iframe.style.height = "500px";
      iframe.style.border = "none";
      iframe.style.background = "transparent";

      containerElement.appendChild(iframe);

      // Write sandbox boilerplate page and load manifest logic
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { margin: 0; color: #fff; font-family: sans-serif; background: transparent; }
            #container { padding: 20px; }
          </style>
        </head>
        <body>
          <div id="container">
            <h4>${manifest.name} Sandbox</h4>
            <div id="root"></div>
          </div>
          <script src="${manifest.script}"></script>
        </body>
        </html>
      `);
      doc.close();

      this.activePlugins.set(pluginId, { iframe, manifest });
      return true;
    } catch (e) {
      console.error(`[PluginEngine] Mounting plugin failed:`, e);
      return false;
    }
  }

  unmountPlugin(pluginId) {
    const p = this.activePlugins.get(pluginId);
    if (p && p.iframe) {
      p.iframe.remove();
      this.activePlugins.delete(pluginId);
    }
  }
}
