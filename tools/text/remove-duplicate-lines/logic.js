export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text." };
  
  const lines = text.split('\n');
  const unique = [...new Set(lines)];
  
  return { toolOutput: unique.join('\n') };
}
export function validate(inputs) { return true; }