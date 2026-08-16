const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/developer');

const implementations = {
  "case-converter": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) throw new Error("Input is empty.");
  
  // By default do upper case. Can enhance with UI buttons later.
  return { toolOutput: text.toUpperCase() + "\\n\\n---\\nLOWERCASE:\\n" + text.toLowerCase() };
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "whitespace-remover": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) throw new Error("Input is empty.");
  return { toolOutput: text.replace(/\\s+/g, '') };
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "duplicate-line-remover": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) throw new Error("Input is empty.");
  
  const lines = text.split('\\n');
  const unique = [...new Set(lines)];
  
  return { toolOutput: unique.join('\\n') };
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "sort-lines": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) throw new Error("Input is empty.");
  
  const lines = text.split('\\n');
  lines.sort((a, b) => a.localeCompare(b));
  
  return { toolOutput: lines.join('\\n') };
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "reverse-text": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) throw new Error("Input is empty.");
  return { toolOutput: text.split('').reverse().join('') };
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "word-counter": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Words: 0\\nCharacters: 0\\nLines: 0" };
  
  const words = text.trim().split(/\\s+/).filter(w => w.length > 0).length;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\\s+/g, '').length;
  const lines = text.split('\\n').length;
  
  return { toolOutput: \`Words: \${words}\\nCharacters (with spaces): \${chars}\\nCharacters (no spaces): \${charsNoSpaces}\\nLines: \${lines}\` };
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
