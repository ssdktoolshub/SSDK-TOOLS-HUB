const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '../tools');
const placeholders = [
  "Processing complete",
  "Processed:",
  "Operation completed",
  "Analysis completed",
  "Successfully processed",
  "toolOutput: \"Please enter input values",
  "dummy",
  "mock",
  "sample",
  "placeholder",
  "demo",
  "fake",
  "coming soon",
  "not implemented"
];

let placeholderCount = 0;
let totalCount = 0;

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.name === 'logic.js') {
      totalCount++;
      const content = fs.readFileSync(fullPath, 'utf8');
      let isPlaceholder = false;
      for (const ph of placeholders) {
        if (content.includes(ph)) {
          isPlaceholder = true;
          break;
        }
      }
      if (isPlaceholder) {
        placeholderCount++;
        // console.log("Placeholder:", fullPath);
      }
    }
  }
}

scanDir(toolsDir);
console.log(`Total tools scanned: ${totalCount}`);
console.log(`Placeholder implementations found: ${placeholderCount}`);
