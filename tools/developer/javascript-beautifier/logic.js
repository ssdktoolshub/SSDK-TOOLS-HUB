export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter JavaScript code." };
  let formatted = text
    .replace(/\s*([{}])\s*/g, '\n$1\n')
    .replace(/\s*;\s*/g, ';\n')
    .replace(/\n+/g, '\n');
  return { toolOutput: formatted };
}
export function validate(inputs) { return true; }