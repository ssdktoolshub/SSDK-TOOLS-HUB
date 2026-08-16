// Core Logic for A/G Ratio Calculator
export async function execute(inputs) {
  const nums = (inputs.inputData || '').match(/[\d\.]+/g);
  if (!nums || nums.length < 2) return { outputData: "Please enter Albumin and Globulin values (g/dL)." };
  const alb = parseFloat(nums[0]), glob = parseFloat(nums[1]);
  if (glob === 0) return { outputData: "Globulin cannot be zero." };
  const ratio = (alb / glob).toFixed(2);
  let status = ratio < 1.1 ? "Low" : (ratio > 2.5 ? "High" : "Normal");
  return { outputData: `A/G Ratio: ${ratio}\nStatus: ${status}\nNormal Range: 1.1 - 2.5.` };
}
export function validate(inputs) { return !!inputs.inputData; }
