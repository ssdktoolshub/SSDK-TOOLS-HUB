const fs = require('fs');
const path = require('path');

const toolsJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../core/registry/tools.json'), 'utf8'));
const toolsDir = path.join(__dirname, '../tools');
const dirs = fs.readdirSync(toolsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

function getSlug(cat) {
  // Remove emojis and special chars at start, lower case
  let slug = cat.replace(/^[\uD800-\uDBFF\uDC00-\uDFFF\u200D\uFE0F\u2600-\u27BF\s]+/, '').toLowerCase();
  // Replace & with and
  slug = slug.replace(/&/g, 'and');
  // Remove non-alphanumeric, replace spaces with dashes
  slug = slug.replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
  // Remove trailing -tools
  if (slug.endsWith('-tools')) {
    slug = slug.replace(/-tools$/, '');
  }
  return slug;
}

const map = {};
const unmapped = new Set();

for (const tool of toolsJson) {
  const catSlug = getSlug(tool.category);
  
  // Try exact match
  if (dirs.includes(catSlug)) {
    map[tool.category] = catSlug;
  } else if (dirs.includes(catSlug + 's')) { // e.g. calculator -> calculators (not usually the case)
    map[tool.category] = catSlug + 's';
  } else {
    // We'll have to find by checking where the tool actually is
    // Let's find the tool folder by searching dirs
    let foundDir = null;
    for (const dir of dirs) {
      if (fs.existsSync(path.join(toolsDir, dir, tool.id))) {
        foundDir = dir;
        break;
      }
    }
    if (foundDir) {
      map[tool.category] = foundDir;
    } else {
      unmapped.add(tool.id);
    }
  }
}

console.log("Mapping:");
for (const [k, v] of Object.entries(map)) {
  console.log(`"${k}" -> "${v}"`);
}
if (unmapped.size > 0) {
  console.log("Unmapped tools:", [...unmapped]);
}
