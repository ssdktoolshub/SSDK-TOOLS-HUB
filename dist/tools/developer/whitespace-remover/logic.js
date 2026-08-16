export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) throw new Error("Input is empty.");
  return { toolOutput: text.replace(/\s+/g, '') };
}
export function validate(inputs) { return !!inputs.toolInput; }