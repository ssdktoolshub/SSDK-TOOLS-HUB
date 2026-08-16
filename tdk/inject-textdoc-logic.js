const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/text');

const implementations = {
  "word-counter": `
export async function execute(inputs) {
  const text = inputs.toolInput || "";
  if (!text.trim()) return { toolOutput: "Word Count: 0" };

  const words = text.trim().split(/\\s+/).length;
  return { toolOutput: \`Word Count: \${words}\` };
}
export function validate(inputs) { return true; }
`,
  "character-counter": `
export async function execute(inputs) {
  const text = inputs.toolInput || "";
  
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\\s/g, '').length;
  
  return { toolOutput: \`Characters (with spaces): \${charsWithSpaces}\\nCharacters (without spaces): \${charsWithoutSpaces}\` };
}
export function validate(inputs) { return true; }
`,
  "reading-time-calculator": `
export async function execute(inputs) {
  const text = inputs.toolInput || "";
  if (!text.trim()) return { toolOutput: "Estimated Reading Time: 0 minutes" };

  const words = text.trim().split(/\\s+/).length;
  const wpm = 225; // Average adult reading speed
  const minutes = Math.ceil(words / wpm);

  return { toolOutput: \`Estimated Reading Time: \${minutes} minute(s) (\${words} words at 225 WPM)\` };
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
