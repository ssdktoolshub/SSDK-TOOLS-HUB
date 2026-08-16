export async function execute(inputs) {
  const nums = (inputs.inputData || '').match(/[\d\.]+/g);
  if (!nums) return { outputData: "Please enter a valid Blood Urea value (mg/dL)." };
  const urea = parseFloat(nums[0]);
  let status = urea < 7 ? "Low" : (urea > 20 ? "High" : "Normal");
  return { outputData: `Blood Urea: ${urea} mg/dL\nStatus: ${status}\nNormal Range: 7 - 20 mg/dL.` };
}
export function validate(inputs) { return !!inputs.inputData; }
