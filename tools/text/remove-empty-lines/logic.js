export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text." };
  
  const cleaned = text.split('\n').filter(line => line.trim().length > 0).join('\n');
  return { toolOutput: cleaned };
}
export function validate(inputs) { return true; }