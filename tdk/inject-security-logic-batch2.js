const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/security');

const implementations = {
  "sha256-generator": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text." };

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Use native Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return { toolOutput: hashHex };
}
export function validate(inputs) { return true; }
`,
  "sha512-generator": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text." };

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Use native Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return { toolOutput: hashHex };
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
