const fs = require('fs');
const content = fs.readFileSync('docs/tool-functionality-report.md', 'utf8');

const lines = content.split('\n');
const items = [];
let inTable = false;

for (const line of lines) {
  if (line.startsWith('|---')) {
    inTable = true;
    continue;
  }
  if (inTable && line.startsWith('|')) {
    const parts = line.split('|').map(s => s.trim());
    if (parts.length > 4) {
      items.push({
        id: parts[1],
        category: parts[2],
        status: parts[3],
        reason: parts[4]
      });
    }
  }
}

const byCategory = {};
for (const item of items) {
  if (!byCategory[item.category]) byCategory[item.category] = [];
  byCategory[item.category].push(item);
}

for (const [cat, tools] of Object.entries(byCategory)) {
  console.log(`\n=== ${cat.toUpperCase()} (${tools.length}) ===`);
  console.log(tools.map(t => t.id).join(', '));
}
