const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/image');

const implementations = {
  "color-picker": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = \`
      <div style="display:flex; flex-direction:column; align-items:center; gap: 10px;">
        <p style="color:var(--text-muted);">Click anywhere on the image to pick a color.</p>
        <div id="cp-result" style="display:flex; align-items:center; gap: 15px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px;">
           <div id="cp-swatch" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid white; background: transparent;"></div>
           <div>
             <div id="cp-hex">HEX: --</div>
             <div id="cp-rgb">RGB: --</div>
           </div>
        </div>
      </div>
    \`;
    
    document.getElementById("btn-process-download").style.display = "none"; // Not needed for color picker

    const engine = core.getEngine("image");
    const cvs = engine.previewCanvas;
    const ctx = engine.ctx;

    cvs.style.cursor = "crosshair";

    cvs.onclick = (e) => {
      const rect = cvs.getBoundingClientRect();
      // Calculate scale in case CSS resizes the canvas
      const scaleX = cvs.width / rect.width;
      const scaleY = cvs.height / rect.height;

      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const r = pixel[0], g = pixel[1], b = pixel[2];
      
      const rgb = \`rgb(\${r}, \${g}, \${b})\`;
      const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
      
      document.getElementById("cp-swatch").style.background = rgb;
      document.getElementById("cp-hex").textContent = \`HEX: \${hex}\`;
      document.getElementById("cp-rgb").textContent = \`RGB: \${rgb}\`;

      // Copy to clipboard
      navigator.clipboard.writeText(hex).then(() => {
         core.getEngine("notification")?.show(\`Copied \${hex} to clipboard!\`, "success");
      });
    };
  });
}
`,
  "exif-viewer": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", (e) => {
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = \`<div id="exif-data" style="width: 100%; text-align: left; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; font-family: monospace; max-height: 300px; overflow-y: auto;">Extracting EXIF data...</div>\`;
    document.getElementById("btn-process-download").style.display = "none";

    // Dynamically load exifr
    if (!window.exifr) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/exifr/dist/full.umd.js";
      script.onload = () => extractExif(e.detail.file);
      document.head.appendChild(script);
    } else {
      extractExif(e.detail.file);
    }

    async function extractExif(file) {
      try {
        const output = document.getElementById("exif-data");
        const exif = await window.exifr.parse(file, true);
        if (exif && Object.keys(exif).length > 0) {
          let html = "<ul style='list-style:none; padding:0; margin:0;'>";
          for (const key in exif) {
            // Filter out complex objects for simple display
            if (typeof exif[key] !== "object") {
               html += \`<li><strong style="color:var(--primary-color)">\${key}:</strong> \${exif[key]}</li>\`;
            }
          }
          html += "</ul>";
          output.innerHTML = html;
        } else {
          output.innerHTML = "No EXIF data found in this image.";
        }
      } catch (err) {
        document.getElementById("exif-data").innerHTML = "Error extracting EXIF data. This image format might not be supported.";
      }
    }
  });
}
`,
  "exif-remover": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = \`<p style="color:var(--text-muted);">Drawing the image onto a clean Canvas automatically strips all EXIF metadata. Just click Download to save the clean version.</p>\`;
    
    document.getElementById("btn-process-download").onclick = () => {
      // By default, toDataURL strips EXIF data.
      core.getEngine("image").downloadCanvas("cleaned-no-exif.jpg", "image/jpeg", 0.95);
    };
  });
}
`,
  "image-watermark": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = \`
      <div style="display: flex; gap: 10px; width: 100%; max-width: 500px;">
         <input type="text" id="wm-text" class="input" placeholder="Enter Watermark Text" value="SSDK Tools Hub" style="flex:1;">
         <select id="wm-pos" class="input" style="width: 120px;">
           <option value="br">Bottom Right</option>
           <option value="bl">Bottom Left</option>
           <option value="c">Center</option>
         </select>
         <button id="btn-apply-wm" class="btn btn-primary">Apply</button>
      </div>
    \`;
    
    const engine = core.getEngine("image");
    
    document.getElementById("btn-apply-wm").onclick = () => {
      const text = document.getElementById("wm-text").value;
      const pos = document.getElementById("wm-pos").value;
      const cvs = engine.previewCanvas;
      const ctx = engine.ctx;
      
      // Reset canvas to original image before applying watermark again
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.drawImage(engine.activeImage, 0, 0);

      const fontSize = Math.max(20, Math.floor(cvs.width * 0.05));
      ctx.font = \`bold \${fontSize}px sans-serif\`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 5;

      let x, y;
      const metrics = ctx.measureText(text);
      
      if (pos === "br") {
        x = cvs.width - metrics.width - 20;
        y = cvs.height - 20;
      } else if (pos === "bl") {
        x = 20;
        y = cvs.height - 20;
      } else {
        x = (cvs.width - metrics.width) / 2;
        y = (cvs.height + fontSize) / 2;
      }
      
      ctx.fillText(text, x, y);
    };

    document.getElementById("btn-process-download").onclick = () => {
      engine.downloadCanvas("watermarked.png");
    };
  });
}
`
};

Object.keys(implementations).forEach(slug => {
  const p = path.join(toolsPath, slug, 'logic.js');
  if (fs.existsSync(path.join(toolsPath, slug))) {
    fs.writeFileSync(p, implementations[slug].trim());
    console.log("Wrote " + p);
  }
});
