export async function execute(inputs) {
  const text = inputs.inputData;
  // Assume a default uppercase for simplicity in this wrapper
  return { outputData: text.toUpperCase() };
}
export function validate(inputs) { return true; }
