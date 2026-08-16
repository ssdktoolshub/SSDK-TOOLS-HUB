export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  const eag = 28.7 * v - 46.7;
  return { outputData: `HbA1c: ${v}% => eAG: ${eag.toFixed(2)} mg/dL` };
}
export function validate(inputs) { return !!inputs.inputData; }
