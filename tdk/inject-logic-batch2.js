const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/image');

const implementations = {
  "grayscale": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    const engine = core.getEngine("image");
    const cvs = engine.previewCanvas;
    const ctx = engine.ctx;
    
    ctx.filter = "grayscale(100%)";
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(engine.activeImage, 0, 0);

    document.getElementById("btn-process-download").onclick = () => {
      engine.downloadCanvas("grayscale.png");
    };
  });
}
`,
  "sepia": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    const engine = core.getEngine("image");
    const cvs = engine.previewCanvas;
    const ctx = engine.ctx;
    
    ctx.filter = "sepia(100%)";
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(engine.activeImage, 0, 0);

    document.getElementById("btn-process-download").onclick = () => {
      engine.downloadCanvas("sepia.png");
    };
  });
}
`,
  "invert-colors": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    const engine = core.getEngine("image");
    const cvs = engine.previewCanvas;
    const ctx = engine.ctx;
    
    ctx.filter = "invert(100%)";
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(engine.activeImage, 0, 0);

    document.getElementById("btn-process-download").onclick = () => {
      engine.downloadCanvas("inverted.png");
    };
  });
}
`,
  "blur": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = '<label>Blur Amount: <input type="range" id="fl-blur" min="0" max="20" value="5"> px</label>';
    
    const engine = core.getEngine("image");
    const applyBlur = () => {
      const val = document.getElementById("fl-blur").value;
      const cvs = engine.previewCanvas;
      const ctx = engine.ctx;
      ctx.filter = \`blur(\${val}px)\`;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.drawImage(engine.activeImage, 0, 0);
    };

    document.getElementById("fl-blur").addEventListener("input", applyBlur);
    applyBlur(); // Initial apply

    document.getElementById("btn-process-download").onclick = () => {
      engine.downloadCanvas("blurred.png");
    };
  });
}
`,
  "saturation": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = '<label>Saturation: <input type="range" id="fl-sat" min="0" max="300" value="150">%</label>';
    
    const engine = core.getEngine("image");
    const applySat = () => {
      const val = document.getElementById("fl-sat").value;
      const cvs = engine.previewCanvas;
      const ctx = engine.ctx;
      ctx.filter = \`saturate(\${val}%)\`;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.drawImage(engine.activeImage, 0, 0);
    };

    document.getElementById("fl-sat").addEventListener("input", applySat);
    applySat();

    document.getElementById("btn-process-download").onclick = () => {
      engine.downloadCanvas("saturation.png");
    };
  });
}
`,
  "hue": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = '<label>Hue Rotate: <input type="range" id="fl-hue" min="-180" max="180" value="90"> deg</label>';
    
    const engine = core.getEngine("image");
    const applyHue = () => {
      const val = document.getElementById("fl-hue").value;
      const cvs = engine.previewCanvas;
      const ctx = engine.ctx;
      ctx.filter = \`hue-rotate(\${val}deg)\`;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.drawImage(engine.activeImage, 0, 0);
    };

    document.getElementById("fl-hue").addEventListener("input", applyHue);
    applyHue();

    document.getElementById("btn-process-download").onclick = () => {
      engine.downloadCanvas("hue.png");
    };
  });
}
`,
  "social-media-image-resizer": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = \`
      <select id="social-preset" class="input">
        <option value="1080x1080">Instagram Post (1080x1080)</option>
        <option value="1080x1920">Instagram Story (1080x1920)</option>
        <option value="1200x630">Facebook Post (1200x630)</option>
        <option value="1200x675">Twitter Post (1200x675)</option>
        <option value="1280x720">YouTube Thumbnail (1280x720)</option>
      </select>
      <button id="btn-apply-social" class="btn btn-primary btn-sm">Resize & Crop</button>
    \`;
    
    const engine = core.getEngine("image");
    
    document.getElementById("btn-apply-social").onclick = () => {
      const val = document.getElementById("social-preset").value.split("x");
      const targetW = parseInt(val[0]);
      const targetH = parseInt(val[1]);
      
      const cvs = engine.previewCanvas;
      const ctx = engine.ctx;
      const img = engine.activeImage;
      
      // Calculate cover crop
      const imgRatio = img.width / img.height;
      const targetRatio = targetW / targetH;
      let drawW, drawH, offsetX = 0, offsetY = 0;

      if (imgRatio > targetRatio) {
        drawH = targetH;
        drawW = img.width * (targetH / img.height);
        offsetX = (targetW - drawW) / 2;
      } else {
        drawW = targetW;
        drawH = img.height * (targetW / img.width);
        offsetY = (targetH - drawH) / 2;
      }

      cvs.width = targetW;
      cvs.height = targetH;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      document.getElementById("image-info-text").textContent = \`Resized to \${targetW}x\${targetH}px\`;
    };

    document.getElementById("btn-process-download").onclick = () => {
      engine.downloadCanvas("social-ready.png");
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
