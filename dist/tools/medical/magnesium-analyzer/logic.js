// Core Logic for Magnesium Analyzer
export async function execute(inputs) {
  const nums = (inputs.inputData || '').match(/[\d\.]+/g);
  if (!nums) return { outputData: "Please enter a valid Magnesium value (mg/dL)." };
  const mg = parseFloat(nums[0]);
  let status = mg < 1.7 ? "Low (Hypomagnesemia)" : (mg > 2.2 ? "High (Hypermagnesemia)" : "Normal");
  return { outputData: `Magnesium: ${mg} mg/dL\nStatus: ${status}\nNormal Range: 1.7 - 2.2 mg/dL.` };
}
export function validate(inputs) { return !!inputs.inputData; }
