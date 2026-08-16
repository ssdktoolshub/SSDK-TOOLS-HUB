// Core Logic for HDL Analyzer
export async function execute(inputs) {
  const nums = (inputs.inputData || '').match(/[\d\.]+/g);
  if (!nums) return { outputData: "Please enter a valid HDL Cholesterol value (mg/dL). Optional: male=1, female=2" };
  const hdl = parseFloat(nums[0]);
  const isFemale = nums[1] == '2';
  const cutoff = isFemale ? 50 : 40;
  let status = hdl < cutoff ? "Low (Higher Risk)" : (hdl >= 60 ? "High (Protective)" : "Normal");
  return { outputData: `HDL Cholesterol: ${hdl} mg/dL\nStatus: ${status}\nNormal: > ${cutoff} mg/dL.` };
}
export function validate(inputs) { return !!inputs.inputData; }
