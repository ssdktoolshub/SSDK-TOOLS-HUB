const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/text');

const implementations = {
  "uppercase": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text." };
  return { toolOutput: text.toUpperCase() };
}
export function validate(inputs) { return true; }
`,
  "lowercase": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text." };
  return { toolOutput: text.toLowerCase() };
}
export function validate(inputs) { return true; }
`,
  "title-case": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text." };
  
  const toTitleCase = (str) => {
    return str.replace(/\\w\\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
  
  return { toolOutput: toTitleCase(text) };
}
export function validate(inputs) { return true; }
`,
  "reverse-text": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text." };
  return { toolOutput: text.split('').reverse().join('') };
}
export function validate(inputs) { return true; }
`,
  "reverse-words": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text." };
  return { toolOutput: text.split(' ').reverse().join(' ') };
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
