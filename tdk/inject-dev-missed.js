const fs = require('fs');
const path = require('path');

const urlPath = path.join(__dirname, '../tools/developer/url-encoder/logic.js');
fs.writeFileSync(urlPath, `export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) throw new Error("Input is empty.");
  return { toolOutput: encodeURIComponent(text) };
}
export function validate(inputs) { return !!inputs.toolInput; }`);

const md5Path = path.join(__dirname, '../tools/developer/md5-generator/logic.js');
fs.writeFileSync(md5Path, `export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) throw new Error("Input is empty.");
  
  // Using Web Crypto SHA-1 as a fallback if external MD5 lib isn't loaded
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  
  return { toolOutput: hashHex + "\\n(Note: Using Native SHA-1 Fallback)" };
}
export function validate(inputs) { return !!inputs.toolInput; }`);
