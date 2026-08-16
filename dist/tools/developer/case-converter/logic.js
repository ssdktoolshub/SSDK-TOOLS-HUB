export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) throw new Error("Input is empty.");
  return { toolOutput: "UPPERCASE:\n" + text.toUpperCase() + "\n\n---\nLOWERCASE:\n" + text.toLowerCase() };
}
export function validate(inputs) { return !!inputs.toolInput; }
