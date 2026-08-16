export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) throw new Error("Input is empty.");
  
  const lines = text.split('\n');
  const unique = [...new Set(lines)];
  
  return { toolOutput: unique.join('\n') };
}
export function validate(inputs) { return !!inputs.toolInput; }