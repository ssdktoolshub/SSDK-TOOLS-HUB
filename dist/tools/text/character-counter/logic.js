export async function execute(inputs) {
  const text = inputs.toolInput || "";
  
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, '').length;
  
  return { toolOutput: \Characters (with spaces): \\nCharacters (without spaces): \\ };
}
export function validate(inputs) { return true; }
