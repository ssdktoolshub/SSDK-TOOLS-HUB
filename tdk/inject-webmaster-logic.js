const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'tools');

const implementations = {
  "html-minifier": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter HTML code." };
  // Basic regex minification
  const minified = text
    .replace(/<!--[\\s\\S]*?-->/g, '') // Remove comments
    .replace(/>\\s+</g, '><') // Remove space between tags
    .replace(/\\s{2,}/g, ' ') // Collapse multiple spaces
    .trim();
  return { toolOutput: minified };
}
export function validate(inputs) { return true; }
`,
  "css-minifier": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter CSS code." };
  const minified = text
    .replace(/\\/\\*[\\s\\S]*?\\*\\//g, '') // Remove comments
    .replace(/\\s*([{},:;])\\s*/g, '$1') // Remove spaces around delimiters
    .replace(/;}/g, '}') // Remove trailing semicolons
    .trim();
  return { toolOutput: minified };
}
export function validate(inputs) { return true; }
`,
  "javascript-minifier": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter JavaScript code." };
  const minified = text
    .replace(/\\/\\*[\\s\\S]*?\\*\\//g, '') // Remove multiline comments
    .replace(/\\/\\/.*$/gm, '') // Remove single line comments
    .replace(/\\s*([=+\\-*\\/{}():;,])\\s*/g, '$1') // Remove spaces around operators
    .replace(/\\s{2,}/g, ' ') // Collapse multiple spaces
    .trim();
  return { toolOutput: minified };
}
export function validate(inputs) { return true; }
`,
  "html-beautifier": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter HTML code." };
  let formatted = '', indent = 0;
  text.split(/>\\s*</).forEach(function(node) {
      if (node.match(/^\\/\\w/)) indent = 0; // decrease indent
      formatted += '  '.repeat(indent) + '<' + node + '>\\n';
      if (node.match(/^<?\\w[^>]*[^\\/]$/)) indent = 1; // increase indent
  });
  return { toolOutput: formatted.substring(1, formatted.length - 2) };
}
export function validate(inputs) { return true; }
`,
  "css-beautifier": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter CSS code." };
  let formatted = text
    .replace(/\\s*([{}])\\s*/g, '\\n$1\\n')
    .replace(/\\s*;\\s*/g, ';\\n')
    .replace(/\\n+/g, '\\n');
  return { toolOutput: formatted };
}
export function validate(inputs) { return true; }
`,
  "javascript-beautifier": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter JavaScript code." };
  let formatted = text
    .replace(/\\s*([{}])\\s*/g, '\\n$1\\n')
    .replace(/\\s*;\\s*/g, ';\\n')
    .replace(/\\n+/g, '\\n');
  return { toolOutput: formatted };
}
export function validate(inputs) { return true; }
`
};

Object.keys(implementations).forEach(slug => {
  let p = path.join(rootDir, 'developer', slug, 'logic.js');
  if (!fs.existsSync(path.join(rootDir, 'developer', slug))) {
     p = path.join(rootDir, 'webmaster', slug, 'logic.js');
  }
  
  if (fs.existsSync(path.dirname(p))) {
    fs.writeFileSync(p, implementations[slug].trim());
    console.log("Wrote " + p);
  } else {
    console.log("Could not find folder for " + slug);
  }
});
