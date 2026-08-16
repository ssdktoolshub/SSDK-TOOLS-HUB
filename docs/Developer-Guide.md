# SSDK Tools Hub - Developer Guide

Welcome to the SSDK Development ecosystem. Adding a new tool is incredibly fast thanks to the Tool Development Kit (TDK) and the Registry-Driven Architecture.

## 1. Creating a New Tool (The Fast Way)

Do **NOT** manually copy/paste files. Use the TDK CLI tool.

```bash
# Syntax
node scripts/tdk.js "Your Tool Name" "Category Slug"

# Example
node scripts/tdk.js "JSON Formatter" "developer-tools"
```

This command will automatically:
1. Generate `manifests/json-formatter.json` with a unique UUID, SEO, and capabilities.
2. Generate `tools/json-formatter.html` as the UI scaffold.

## 2. Adding Business Logic

By default, the platform looks for standard input/output IDs in your HTML:
- `<textarea id="toolInput"></textarea>`
- `<textarea id="toolOutput"></textarea>`

If your tool uses these, **you don't even need to write JavaScript!** The `ToolEngine` automatically binds them to Drag & Drop, File Uploads, and Export buttons.

For complex logic, create a module:
`modules/json-formatter.js`:
```javascript
export default class JSONFormatter {
  async init(engine) {
    // Setup listeners if needed
  }

  async run(engine) {
    const input = document.getElementById("toolInput").value;
    const output = document.getElementById("toolOutput");
    try {
      output.value = JSON.stringify(JSON.parse(input), null, 2);
      engine.showStatus("✅ Success!", false);
    } catch (e) {
      engine.showStatus("❌ Invalid JSON", true);
    }
  }
}
```

## 3. Quality Control (DX Toolkit)

Before submitting your code, run the Quality Control Validator:

```bash
node scripts/dx-toolkit.js
```

This will automatically scan every manifest for:
- Missing Icons
- Broken Links
- Duplicate UUIDs
- Missing SEO or FAQs

If it reports `✅ ALL CHECKS PASSED`, your tool is ready for production.

## 4. UI Primitives

Always use `GlassComponents` from `components/glass-components.js` instead of writing custom CSS for standard inputs, toggles, or modals. This ensures theme consistency (Light/Dark mode) automatically.
