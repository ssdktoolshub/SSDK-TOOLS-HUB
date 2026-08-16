export async function execute(inputs) {
  const v = parseFloat(inputs.inputData);
  if (isNaN(v)) return { outputData: "Invalid input" };
  const a1c = (v + 46.7) / 28.7;
  return { outputData: `eAG: ${v} mg/dL => HbA1c: ${a1c.toFixed(2)}%` };
}
export function validate(inputs) { return !!inputs.inputData; }
