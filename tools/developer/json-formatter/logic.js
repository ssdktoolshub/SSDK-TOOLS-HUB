export async function execute(inputs = {}) {
  const text = inputs.toolInput || inputs.json || inputs.input || inputs.text || "";
  if (!text.trim()) {
    return { toolOutput: "{\n  \"example\": \"Enter valid JSON to format\"\n}" };
  }
  try {
    const parsed = JSON.parse(text);
    const indent = parseInt(inputs.indent) || 2;
    return { toolOutput: JSON.stringify(parsed, null, indent) };
  } catch (err) {
    return { toolOutput: "Invalid JSON: " + err.message };
  }
}
export function validate(inputs) { return true; }
