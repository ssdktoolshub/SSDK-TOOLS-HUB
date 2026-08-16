const fs = require('fs');
const path = require('path');

const toolsJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../core/registry/tools.json'), 'utf8'));
const toolsDir = path.join(__dirname, '../tools');
const dirs = fs.readdirSync(toolsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

const map = {};

for (const tool of toolsJson) {
  let foundDir = null;
  for (const dir of dirs) {
    if (fs.existsSync(path.join(toolsDir, dir, tool.id))) {
      foundDir = dir;
      break;
    }
  }
  if (foundDir) {
    map[tool.id] = foundDir;
  }
}

fs.writeFileSync(path.join(__dirname, '../core/registry/tool-folder-map.json'), JSON.stringify(map, null, 2));
console.log("Generated tool-folder-map.json");
