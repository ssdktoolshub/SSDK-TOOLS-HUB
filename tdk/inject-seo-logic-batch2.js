const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/seo');

const implementations = {
  "meta-length-checker": `
export async function execute(inputs) {
  const title = inputs.title || "";
  const desc = inputs.desc || "";
  
  if (!title && !desc) return { toolOutput: "Please enter a Title and/or Description to check." };

  let output = "";
  if (title) {
    const tLen = title.length;
    let tStatus = "Good";
    if (tLen < 30) tStatus = "Too Short (Aim for 50-60)";
    if (tLen > 60) tStatus = "Too Long (Max 60 recommended)";
    output += \`Title Length: \${tLen} characters [\${tStatus}]\\n\`;
  }
  
  if (desc) {
    const dLen = desc.length;
    let dStatus = "Good";
    if (dLen < 70) dStatus = "Too Short (Aim for 120-155)";
    if (dLen > 160) dStatus = "Too Long (Max 160 recommended)";
    output += \`\\nDescription Length: \${dLen} characters [\${dStatus}]\`;
  }
  
  return { toolOutput: output };
}
export function validate(inputs) { return true; }
`,
  "keyword-density-checker": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text to analyze." };

  const words = text.toLowerCase().match(/\\b\\w+\\b/g);
  if (!words) return { toolOutput: "No words found." };

  const counts = {};
  words.forEach(w => counts[w] = (counts[w] || 0) + 1);
  
  // Exclude common stop words (simplified list)
  const stopwords = ['the','is','in','at','of','on','and','a','to','it','for','with','as','that','by','this','are'];
  
  const sorted = Object.entries(counts)
    .filter(([word]) => !stopwords.includes(word) && word.length > 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  let output = \`Total Words: \${words.length}\\n\\nTop Keywords (excluding stop words):\\n\`;
  sorted.forEach(([word, count]) => {
     const density = ((count / words.length) * 100).toFixed(2);
     output += \`- \${word}: \${count} times (\${density}%)\\n\`;
  });
  
  return { toolOutput: output };
}
export function validate(inputs) { return true; }
`,
  "keyword-extractor": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text to extract keywords." };

  const words = text.toLowerCase().match(/\\b\\w+\\b/g) || [];
  const counts = {};
  words.forEach(w => counts[w] = (counts[w] || 0) + 1);
  
  const stopwords = ['the','is','in','at','of','on','and','a','to','it','for','with','as','that','by','this','are','from','or','an','be'];
  
  const sorted = Object.entries(counts)
    .filter(([word]) => !stopwords.includes(word) && word.length > 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(entry => entry[0]);

  return { toolOutput: sorted.join(', ') };
}
export function validate(inputs) { return true; }
`,
  "slug-generator": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text to generate a slug." };

  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  return { toolOutput: slug };
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "html-minifier": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter HTML to minify." };
  
  // Basic regex minifier. For production, a robust parser is better, but this works for simple cases.
  const minified = text
    .replace(/<!--[\\s\\S]*?-->/g, '') // Remove comments
    .replace(/>\\s+</g, '><') // Remove space between tags
    .replace(/\\n/g, '') // Remove newlines
    .trim();
    
  return { toolOutput: minified };
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "css-minifier": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter CSS to minify." };
  
  const minified = text
    .replace(/\\/\\*[\\s\\S]*?\\*\\//g, '') // Remove comments
    .replace(/\\s+/g, ' ') // Collapse whitespace
    .replace(/\\s*{\\s*/g, '{')
    .replace(/\\s*}\\s*/g, '}')
    .replace(/\\s*:\\s*/g, ':')
    .replace(/\\s*;\\s*/g, ';')
    .trim();
    
  return { toolOutput: minified };
}
export function validate(inputs) { return !!inputs.toolInput; }
`,
  "javascript-minifier": `
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter JavaScript to minify." };
  
  // Basic regex minifier (Removes comments and some whitespace). 
  // WARNING: Regex minification of JS is inherently unsafe for complex code.
  const minified = text
    .replace(/\\/\\*[\\s\\S]*?\\*\\//g, '') // Remove multi-line comments
    .replace(/\\/\\/.*/g, '') // Remove single-line comments
    .replace(/\\s+/g, ' ') // Collapse whitespace
    .replace(/\\s*([{};(),=<>+\\-*/!&|])\\s*/g, '$1') // Collapse space around operators
    .trim();
    
  return { toolOutput: minified };
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
