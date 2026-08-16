export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) throw new Error("Input is empty.");
  return { toolOutput: text.split('').reverse().join('') };
}
export function validate(inputs) { return !!inputs.toolInput; }