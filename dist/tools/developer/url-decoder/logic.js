export async function execute(inputs) {
  try {
    const text = inputs.toolInput;
    if (!text) throw new Error("Input is empty.");
    return { toolOutput: decodeURIComponent(text) };
  } catch (err) {
    throw new Error("Decoding failed: " + err.message);
  }
}
export function validate(inputs) { return !!inputs.toolInput; }