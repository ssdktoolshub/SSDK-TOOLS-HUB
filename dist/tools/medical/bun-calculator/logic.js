export async function execute(inputs) {
  const nums = (inputs.inputData || '').match(/[\d\.]+/g);
  if (!nums) return { outputData: "Please enter a valid Urea value to calculate BUN." };
  const urea = parseFloat(nums[0]);
  const bun = (urea / 2.14).toFixed(2);
  return { outputData: `Calculated BUN: ${bun} mg/dL (from Urea: ${urea})\nNormal BUN Range: 6 - 20 mg/dL.` };
}
export function validate(inputs) { return !!inputs.inputData; }
