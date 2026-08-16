export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text." };
  
  // Trims leading/trailing and reduces multiple spaces to a single space
  const trimmed = text.trim().replace(/\s{2,}/g, ' ');
  return { toolOutput: trimmed };
}
export function validate(inputs) { return true; }