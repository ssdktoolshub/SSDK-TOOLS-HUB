const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/image');

const implementations = {
  "image-compressor": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", (e) => {
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = '<label>Quality (0-100%): <input type="range" id="comp-quality" min="1" max="100" value="80"></label>';
    
    document.getElementById("btn-process-download").onclick = () => {
      const q = document.getElementById("comp-quality").value / 100;
      core.getEngine("image").downloadCanvas("compressed.jpeg", "image/jpeg", q);
    };
  });
}
`,
  "image-resizer": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", (e) => {
    const img = e.detail.img;
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = \`
      <label>Width: <input type="number" id="rz-w" value="\${img.width}"></label>
      <label>Height: <input type="number" id="rz-h" value="\${img.height}"></label>
      <button id="btn-apply-resize" class="btn btn-primary btn-sm">Apply Resize</button>
    \`;
    
    const engine = core.getEngine("image");
    
    document.getElementById("btn-apply-resize").onclick = () => {
      const w = parseInt(document.getElementById("rz-w").value);
      const h = parseInt(document.getElementById("rz-h").value);
      const cvs = engine.previewCanvas;
      const ctx = engine.ctx;
      
      const tempCvs = document.createElement("canvas");
      tempCvs.width = w; tempCvs.height = h;
      tempCvs.getContext("2d").drawImage(engine.activeImage, 0, 0, w, h);
      
      cvs.width = w; cvs.height = h;
      ctx.drawImage(tempCvs, 0, 0);
      document.getElementById("image-info-text").textContent = \`Resized (\${w}x\${h}px)\`;
    };

    document.getElementById("btn-process-download").onclick = () => {
      engine.downloadCanvas("resized.png");
    };
  });
}
`,
  "jpg-to-png": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    document.getElementById("btn-process-download").onclick = () => {
      core.getEngine("image").downloadCanvas("converted.png", "image/png");
    };
  });
}
`,
  "png-to-jpg": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    document.getElementById("btn-process-download").onclick = () => {
      core.getEngine("image").downloadCanvas("converted.jpg", "image/jpeg", 0.9);
    };
  });
}
`,
  "png-to-webp": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    document.getElementById("btn-process-download").onclick = () => {
      core.getEngine("image").downloadCanvas("converted.webp", "image/webp", 0.9);
    };
  });
}
`,
  "webp-to-png": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    document.getElementById("btn-process-download").onclick = () => {
      core.getEngine("image").downloadCanvas("converted.png", "image/png");
    };
  });
}
`,
  "webp-to-jpg": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    document.getElementById("btn-process-download").onclick = () => {
      core.getEngine("image").downloadCanvas("converted.jpg", "image/jpeg", 0.9);
    };
  });
}
`,
  "jpg-to-webp": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", () => {
    document.getElementById("btn-process-download").onclick = () => {
      core.getEngine("image").downloadCanvas("converted.webp", "image/webp", 0.9);
    };
  });
}
`,
  "brightness": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", (e) => {
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = '<label>Brightness: <input type="range" id="fl-bright" min="0" max="200" value="100">%</label>';
    
    const engine = core.getEngine("image");
    document.getElementById("fl-bright").addEventListener("input", (ev) => {
      const cvs = engine.previewCanvas;
      const ctx = engine.ctx;
      ctx.filter = \`brightness(\${ev.target.value}%)\`;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.drawImage(engine.activeImage, 0, 0);
    });

    document.getElementById("btn-process-download").onclick = () => {
      engine.downloadCanvas("brightness_adjusted.png");
    };
  });
}
`,
  "contrast": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", (e) => {
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = '<label>Contrast: <input type="range" id="fl-contrast" min="0" max="200" value="100">%</label>';
    
    const engine = core.getEngine("image");
    document.getElementById("fl-contrast").addEventListener("input", (ev) => {
      const cvs = engine.previewCanvas;
      const ctx = engine.ctx;
      ctx.filter = \`contrast(\${ev.target.value}%)\`;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.drawImage(engine.activeImage, 0, 0);
    });

    document.getElementById("btn-process-download").onclick = () => {
      engine.downloadCanvas("contrast_adjusted.png");
    };
  });
}
`,
  "rotate-image": `
export async function execute() {}
export function validate() { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", (e) => {
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = \`
      <button id="btn-rot-left" class="btn btn-primary btn-sm">Rotate -90°</button>
      <button id="btn-rot-right" class="btn btn-primary btn-sm">Rotate +90°</button>
    \`;
    
    const engine = core.getEngine("image");
    let currentAngle = 0;

    const applyRotation = (angle) => {
      currentAngle = (currentAngle + angle) % 360;
      const cvs = engine.previewCanvas;
      const ctx = engine.ctx;
      const img = engine.activeImage;
      
      // Swap dimensions if rotated 90 or 270
      if (currentAngle === 90 || currentAngle === -270 || currentAngle === 270 || currentAngle === -90) {
        cvs.width = img.height;
        cvs.height = img.width;
      } else {
        cvs.width = img.width;
        cvs.height = img.height;
      }

      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.save();
      ctx.translate(cvs.width/2, cvs.height/2);
      ctx.rotate(currentAngle * Math.PI / 180);
      ctx.drawImage(img, -img.width/2, -img.height/2);
      ctx.restore();
    };

    document.getElementById("btn-rot-left").onclick = () => applyRotation(-90);
    document.getElementById("btn-rot-right").onclick = () => applyRotation(90);

    document.getElementById("btn-process-download").onclick = () => {
      engine.downloadCanvas("rotated.png");
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
