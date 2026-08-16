const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'tools', '_template');

if (!fs.existsSync(templatePath)) {
  fs.mkdirSync(templatePath, { recursive: true });
}

fs.writeFileSync(path.join(templatePath, 'index.html'), `<!-- Standardized Universal Tool Template -->
<div id="tool-container">
  <h2>Tool Name</h2>
  <div id="tool-ui"></div>
</div>
<script type="module" src="./tool.js"></script>
`);

fs.writeFileSync(path.join(templatePath, 'tool.js'), `export class ToolController {
  init() {
    console.log("Tool initialized");
  }
}
`);

fs.writeFileSync(path.join(templatePath, 'tool.css'), `/* Tool Specific Styles */
#tool-container {
  padding: 20px;
}
`);

fs.writeFileSync(path.join(templatePath, 'tool.json'), `{
  "id": "template-tool",
  "name": "Template Tool",
  "version": "1.0.0",
  "main": "tool.js",
  "ui": {
    "inputs": []
  }
}
`);

fs.writeFileSync(path.join(templatePath, 'README.md'), `# Tool Template
This is the new standardized V3 tool folder structure.
- \`index.html\`: The localized DOM structure.
- \`tool.js\`: The isolated controller logic.
- \`tool.css\`: Isolated scoped styling.
- \`tool.json\`: The manifest definition for this tool.
`);

console.log("✅ Tool Template created.");
