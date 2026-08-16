export async function execute(inputs) {
  try {
    const text = inputs.toolInput;
    if (!text) throw new Error("Input is empty.");
    return { toolOutput: btoa(unescape(encodeURIComponent(text))) };
  } catch (err) {
    throw new Error("Encoding failed: " + err.message);
  }
}
export function validate(inputs) { return !!inputs.toolInput; }