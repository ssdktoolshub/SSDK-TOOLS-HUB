export async function execute(inputs = {}) {
  const text = inputs.toolInput || inputs.json || inputs.input || inputs.text || "";
  if (!text.trim()) {
    return { toolOutput: '{"example":"Enter valid JSON to minify"}' };
  }
  try {
    const parsed = JSON.parse(text);
    return { toolOutput: JSON.stringify(parsed) };
  } catch (err) {
    return { toolOutput: "Invalid JSON: " + err.message };
  }
}
export function validate(inputs) { return true; }
