export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) throw new Error("Input is empty.");
  return { toolOutput: encodeURIComponent(text) };
}
export function validate(inputs) { return !!inputs.toolInput; }