// Core Logic for BUN/Creatinine Ratio Calculator
export async function execute(inputs) {
  const nums = (inputs.inputData || '').match(/[\d\.]+/g);
  if (!nums || nums.length < 2) return { outputData: "Please enter BUN and Creatinine values." };
  const bun = parseFloat(nums[0]), cr = parseFloat(nums[1]);
  if (cr === 0) return { outputData: "Creatinine cannot be zero." };
  const ratio = (bun / cr).toFixed(2);
  let status = ratio > 20 ? "High (Prerenal)" : (ratio < 10 ? "Low (Intrarenal)" : "Normal");
  return { outputData: `BUN/Creatinine Ratio: ${ratio}\nStatus: ${status}\nNormal Range: 10 - 20.` };
}
export function validate(inputs) { return !!inputs.inputData; }
