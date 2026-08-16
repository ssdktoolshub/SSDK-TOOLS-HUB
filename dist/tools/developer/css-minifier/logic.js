export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter CSS code." };
  const minified = text
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s*([{},:;])\s*/g, '$1') // Remove spaces around delimiters
    .replace(/;}/g, '}') // Remove trailing semicolons
    .trim();
  return { toolOutput: minified };
}
export function validate(inputs) { return true; }