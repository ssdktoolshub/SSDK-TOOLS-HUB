const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/color');

const implementations = {
  "hex-to-rgb": `
export async function execute(inputs) {
  const hex = inputs.toolInput ? inputs.toolInput.replace('#', '') : '';
  if (!hex || (hex.length !== 3 && hex.length !== 6)) return { toolOutput: "Please enter a valid HEX code (e.g. #FF5733)." };
  
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  
  return { toolOutput: \`rgb(\${r}, \${g}, \${b})\` };
}
export function validate(inputs) { return true; }
`,
  "rgb-to-hex": `
export async function execute(inputs) {
  const rgb = inputs.toolInput;
  if (!rgb) return { toolOutput: "Please enter RGB values (e.g. 255, 87, 51 or rgb(255, 87, 51))." };
  
  const match = rgb.match(/\\d+/g);
  if (!match || match.length < 3) return { toolOutput: "Invalid RGB format." };
  
  const r = parseInt(match[0]);
  const g = parseInt(match[1]);
  const b = parseInt(match[2]);
  
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  
  return { toolOutput: "#" + toHex(r) + toHex(g) + toHex(b) };
}
export function validate(inputs) { return true; }
`,
  "hex-to-hsl": `
export async function execute(inputs) {
  const hex = inputs.toolInput ? inputs.toolInput.replace('#', '') : '';
  if (!hex || (hex.length !== 3 && hex.length !== 6)) return { toolOutput: "Please enter a valid HEX code." };
  
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255;
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255;
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255;
  } else {
    r = parseInt(hex.substring(0, 2), 16) / 255;
    g = parseInt(hex.substring(2, 4), 16) / 255;
    b = parseInt(hex.substring(4, 6), 16) / 255;
  }
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return { toolOutput: \`hsl(\${Math.round(h * 360)}, \${Math.round(s * 100)}%, \${Math.round(l * 100)}%)\` };
}
export function validate(inputs) { return true; }
`,
  "hsl-to-hex": `
export async function execute(inputs) {
  const hsl = inputs.toolInput;
  if (!hsl) return { toolOutput: "Please enter HSL values (e.g. 11, 100%, 60% or hsl(11, 100%, 60%))." };
  
  const match = hsl.match(/[\\d.]+/g);
  if (!match || match.length < 3) return { toolOutput: "Invalid HSL format." };
  
  let h = parseFloat(match[0]) / 360;
  let s = parseFloat(match[1]) / 100;
  let l = parseFloat(match[2]) / 100;
  
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = (c) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  
  return { toolOutput: "#" + toHex(r) + toHex(g) + toHex(b) };
}
export function validate(inputs) { return true; }
`
};

Object.keys(implementations).forEach(slug => {
  const p = path.join(toolsPath, slug, 'logic.js');
  if (fs.existsSync(path.join(toolsPath, slug))) {
    fs.writeFileSync(p, implementations[slug].trim());
    console.log("Wrote " + p);
  }
});
