// Core Logic for ALT (SGPT) Analyzer
export async function execute(inputs) {
  const nums = (inputs.inputData || '').match(/[\d\.]+/g);
  if (!nums) return { outputData: "Please enter a valid ALT (SGPT) value (U/L)." };
  const alt = parseFloat(nums[0]);
  let status = alt < 7 ? "Low" : (alt > 56 ? "High" : "Normal");
  return { outputData: `ALT (SGPT): ${alt} U/L\nStatus: ${status}\nNormal Range: 7 - 56 U/L.` };
}
export function validate(inputs) { return !!inputs.inputData; }
