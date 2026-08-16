export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text." };
  return { toolOutput: text.split('').reverse().join('') };
}
export function validate(inputs) { return true; }
