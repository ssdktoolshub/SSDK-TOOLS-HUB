// Core Logic for Remove HTML Tags
export async function execute(inputs) {
  const text = inputs.toolInput;
  if (!text) return { toolOutput: "Please enter text to process." };
  return { toolOutput: text };
}
export function validate(inputs) { return true; }
