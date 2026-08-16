export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text." };
  return { toolOutput: text.toUpperCase() };
}
export function validate(inputs) { return true; }