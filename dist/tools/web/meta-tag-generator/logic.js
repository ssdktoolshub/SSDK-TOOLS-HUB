export async function execute(inputs) {
  const title = inputs.inputData || 'Default Title';
  return { outputData: \<meta name="title" content="\">\ };
}
export function validate(inputs) { return true; }
