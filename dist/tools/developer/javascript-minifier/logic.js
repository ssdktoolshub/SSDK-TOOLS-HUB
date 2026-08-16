export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter JavaScript code." };
  const minified = text
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multiline comments
    .replace(/\/\/.*$/gm, '') // Remove single line comments
    .replace(/\s*([=+\-*\/{}():;,])\s*/g, '$1') // Remove spaces around operators
    .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
    .trim();
  return { toolOutput: minified };
}
export function validate(inputs) { return true; }