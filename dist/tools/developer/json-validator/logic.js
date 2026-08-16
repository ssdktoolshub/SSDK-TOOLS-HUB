export async function execute(inputs) {
  try {
    const text = inputs.toolInput;
    if (!text) return { toolOutput: "Please enter JSON to validate." };
    JSON.parse(text);
    return { toolOutput: "✅ Valid JSON!" };
  } catch (err) {
    return { toolOutput: "❌ Invalid JSON:\n\n" + err.message };
  }
}
export function validate(inputs) { return !!inputs.toolInput; }