// Core Logic for Alkaline Phosphatase (ALP) Analyzer
export async function execute(inputs) {
  const nums = (inputs.inputData || '').match(/[\d\.]+/g);
  if (!nums) return { outputData: "Please enter a valid ALP value (U/L)." };
  const alp = parseFloat(nums[0]);
  let status = alp < 44 ? "Low" : (alp > 147 ? "High" : "Normal");
  return { outputData: `ALP: ${alp} U/L\nStatus: ${status}\nNormal Range: 44 - 147 U/L.` };
}
export function validate(inputs) { return !!inputs.inputData; }
