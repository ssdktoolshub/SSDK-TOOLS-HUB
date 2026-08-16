// Core Logic for Globulin Calculator
export async function execute(inputs) {
  const nums = (inputs.inputData || '').match(/[\d\.]+/g);
  if (!nums || nums.length < 2) return { outputData: "Please enter Total Protein and Albumin values (g/dL)." };
  const tp = parseFloat(nums[0]), alb = parseFloat(nums[1]);
  const glob = (tp - alb).toFixed(2);
  let status = glob < 2.0 ? "Low" : (glob > 3.5 ? "High" : "Normal");
  return { outputData: `Calculated Globulin: ${glob} g/dL\nStatus: ${status}\nNormal Range: 2.0 - 3.5 g/dL.` };
}
export function validate(inputs) { return !!inputs.inputData; }
