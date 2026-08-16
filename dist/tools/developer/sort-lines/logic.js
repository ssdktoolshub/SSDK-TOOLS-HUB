export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) throw new Error("Input is empty.");
  
  const lines = text.split('\n');
  lines.sort((a, b) => a.localeCompare(b));
  
  return { toolOutput: lines.join('\n') };
}
export function validate(inputs) { return !!inputs.toolInput; }