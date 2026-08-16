const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/text');

const implementations = {
  "trim-spaces": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text." };
  
  // Trims leading/trailing and reduces multiple spaces to a single space
  const trimmed = text.trim().replace(/\\s{2,}/g, ' ');
  return { toolOutput: trimmed };
}
export function validate(inputs) { return true; }
`,
  "remove-empty-lines": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text." };
  
  const cleaned = text.split('\\n').filter(line => line.trim().length > 0).join('\\n');
  return { toolOutput: cleaned };
}
export function validate(inputs) { return true; }
`,
  "remove-duplicate-lines": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text." };
  
  const lines = text.split('\\n');
  const unique = [...new Set(lines)];
  
  return { toolOutput: unique.join('\\n') };
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
