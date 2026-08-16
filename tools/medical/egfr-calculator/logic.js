export async function execute(inputs) {
  const nums = (inputs.inputData || '').match(/[\d\.]+/g);
  if (!nums || nums.length < 2) return { outputData: "Enter Creatinine (mg/dL) and Age (years). Optional: Female=1, Black=1" };
  const cr = parseFloat(nums[0]), age = parseFloat(nums[1]);
  const isFemale = nums[2] == '1', isBlack = nums[3] == '1';
  let kappa = isFemale ? 0.7 : 0.9;
  let alpha = isFemale ? -0.329 : -0.411;
  let min = Math.min(cr / kappa, 1), max = Math.max(cr / kappa, 1);
  let egfr = 141 * Math.pow(min, alpha) * Math.pow(max, -1.209) * Math.pow(0.993, age);
  if (isFemale) egfr *= 1.018;
  if (isBlack) egfr *= 1.159;
  return { outputData: `Estimated GFR (CKD-EPI): ${egfr.toFixed(2)} mL/min/1.73m²\nNormal > 90.` };
}
export function validate(inputs) { return !!inputs.inputData; }
