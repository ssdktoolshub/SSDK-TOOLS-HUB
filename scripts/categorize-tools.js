const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_DIR = path.join(ROOT_DIR, 'tools');
const REGISTRY_DIR = path.join(ROOT_DIR, 'registry');

const toolsJsonPath = path.join(REGISTRY_DIR, 'tools.json');
let toolsArray = [];

if (fs.existsSync(toolsJsonPath)) {
  toolsArray = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));
} else {
  console.log("No tools.json found in registry!");
  process.exit(1);
}

let movedCount = 0;

toolsArray.forEach(tool => {
  if (!tool.category) return;
  
  let catFolder = tool.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  if (catFolder.includes('image') || catFolder.includes('photo')) catFolder = 'image';
  else if (catFolder.includes('pdf')) catFolder = 'pdf';
  else if (catFolder.includes('text') || catFolder.includes('word')) catFolder = 'text';
  else if (catFolder.includes('developer') || catFolder.includes('code')) catFolder = 'developer';
  else if (catFolder.includes('seo')) catFolder = 'seo';
  else if (catFolder.includes('ai')) catFolder = 'ai';
  else if (catFolder.includes('calculator') || catFolder.includes('math')) catFolder = 'calculator';
  else if (catFolder.includes('medical') || catFolder.includes('health')) catFolder = 'medical';
  else if (catFolder.includes('video')) catFolder = 'video';
  else if (catFolder.includes('audio')) catFolder = 'audio';
  else catFolder = 'utility';

  const targetDir = path.join(TOOLS_DIR, catFolder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Check for tools/[tool.id].html
  const oldPath = path.join(TOOLS_DIR, `${tool.id}.html`);
  const newPath = path.join(targetDir, `${tool.id}.html`);

  if (fs.existsSync(oldPath)) {
    // Read the file and update relative paths since we are moving it one level deeper
    let content = fs.readFileSync(oldPath, 'utf8');
    content = content.replace(/href="\.\.\//g, 'href="../../');
    content = content.replace(/src="\.\.\//g, 'src="../../');
    
    fs.writeFileSync(newPath, content);
    fs.unlinkSync(oldPath);
    movedCount++;
  }
});

// There might be some HTML files in tools/ that are not strictly matching tool.id but tool.url.
// E.g. "word-counter" manifest ID -> "word-count.html" file.
// So let's also scan the tools/ directory for remaining html files and put them in 'utility'.
const remainingFiles = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith('.html'));
const utilityDir = path.join(TOOLS_DIR, 'utility');
if (remainingFiles.length > 0 && !fs.existsSync(utilityDir)) {
  fs.mkdirSync(utilityDir, { recursive: true });
}

remainingFiles.forEach(file => {
  const oldPath = path.join(TOOLS_DIR, file);
  const newPath = path.join(utilityDir, file);
  let content = fs.readFileSync(oldPath, 'utf8');
  content = content.replace(/href="\.\.\//g, 'href="../../');
  content = content.replace(/src="\.\.\//g, 'src="../../');
  
  fs.writeFileSync(newPath, content);
  fs.unlinkSync(oldPath);
  movedCount++;
});

console.log(`Successfully categorized tools!`);
console.log(`Moved and path-fixed ${movedCount} HTML files into subdirectories.`);
