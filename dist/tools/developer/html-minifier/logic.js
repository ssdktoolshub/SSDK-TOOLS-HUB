export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter HTML code." };
  // Basic regex minification
  const minified = text
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/>\s+</g, '><') // Remove space between tags
    .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
    .trim();
  return { toolOutput: minified };
}
export function validate(inputs) { return true; }