const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/developer');

const implementations = {
  "json-formatter": `
export async function execute(inputs) {
  try {
    const text = inputs.toolInput;
    if (!text) throw new Error("Input is empty.");
    const parsed = JSON.parse(text);
    return { toolOutput: JSON.stringify(parsed, null, 2) };
  } catch (err) {
    throw new Error("Invalid JSON: " + err.message);
  }
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "json-minifier": `
export async function execute(inputs) {
  try {
    const text = inputs.toolInput;
    if (!text) throw new Error("Input is empty.");
    const parsed = JSON.parse(text);
    return { toolOutput: JSON.stringify(parsed) };
  } catch (err) {
    throw new Error("Invalid JSON: " + err.message);
  }
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "json-validator": `
export async function execute(inputs) {
  try {
    const text = inputs.toolInput;
    if (!text) return { toolOutput: "Please enter JSON to validate." };
    JSON.parse(text);
    return { toolOutput: "✅ Valid JSON!" };
  } catch (err) {
    return { toolOutput: "❌ Invalid JSON:\\n\\n" + err.message };
  }
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "base64-encode": `
export async function execute(inputs) {
  try {
    const text = inputs.toolInput;
    if (!text) throw new Error("Input is empty.");
    return { toolOutput: btoa(unescape(encodeURIComponent(text))) };
  } catch (err) {
    throw new Error("Encoding failed: " + err.message);
  }
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "base64-decode": `
export async function execute(inputs) {
  try {
    const text = inputs.toolInput;
    if (!text) throw new Error("Input is empty.");
    return { toolOutput: decodeURIComponent(escape(atob(text))) };
  } catch (err) {
    throw new Error("Decoding failed. Is it valid Base64? " + err.message);
  }
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "url-encoder": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) throw new Error("Input is empty.");
  return { toolOutput: encodeURIComponent(text) };
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "url-decoder": `
export async function execute(inputs) {
  try {
    const text = inputs.toolInput;
    if (!text) throw new Error("Input is empty.");
    return { toolOutput: decodeURIComponent(text) };
  } catch (err) {
    throw new Error("Decoding failed: " + err.message);
  }
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "uuid-generator": `
export async function execute(inputs) {
  let output = "";
  for(let i=0; i<10; i++) {
    output += crypto.randomUUID() + "\\n";
  }
  return { toolOutput: output.trim() };
}
export function validate(inputs) { return true; }
`,
  "sha256-generator": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) throw new Error("Input is empty.");
  
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  
  return { toolOutput: hashHex };
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "jwt-decoder": `
export async function execute(inputs) {
  try {
    const token = inputs.toolInput;
    if (!token) throw new Error("Input is empty.");
    
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error("Invalid JWT format (must have 3 parts).");
    
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    return { toolOutput: \`HEADER:\\n\${JSON.stringify(header, null, 2)}\\n\\nPAYLOAD:\\n\${JSON.stringify(payload, null, 2)}\` };
  } catch (err) {
    throw new Error("Decoding failed: " + err.message);
  }
}
export function validate(inputs) { return !!inputs.toolInput; }
`
};

Object.keys(implementations).forEach(slug => {
  const p = path.join(toolsPath, slug, 'logic.js');
  if (fs.existsSync(path.join(toolsPath, slug))) {
    fs.writeFileSync(p, implementations[slug].trim());
    console.log("Wrote " + p);
  }
});
