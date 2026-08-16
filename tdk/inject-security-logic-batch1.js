const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/security');

const implementations = {
  "password-generator": `
export async function execute(inputs) {
  const length = parseInt(inputs.length) || 16;
  const complexity = inputs.options || "complex";
  
  let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  if (complexity === "complex") charset += "!@#$%^&*()_+~|}{[]:;?><,./-=";
  if (complexity === "hex") charset = "0123456789ABCDEF";

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length];
  }

  return { toolOutput: result };
}
export function validate(inputs) { return true; }
`,
  "random-string-generator": `
export async function execute(inputs) {
  const length = parseInt(inputs.length) || 16;
  const complexity = inputs.options || "complex";
  
  let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  if (complexity === "complex") charset += "!@#$%^&*()_+~|}{[]:;?><,./-=";
  if (complexity === "hex") charset = "0123456789ABCDEF";

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length];
  }

  return { toolOutput: result };
}
export function validate(inputs) { return true; }
`,
  "random-number-generator": `
export async function execute(inputs) {
  const length = parseInt(inputs.length) || 16; // treating as max digits
  
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  
  // Convert to a string and pad or slice to length
  let numStr = array[0].toString();
  while(numStr.length < length) {
      const extra = new Uint32Array(1);
      window.crypto.getRandomValues(extra);
      numStr += extra[0].toString();
  }
  
  return { toolOutput: numStr.substring(0, length) };
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
