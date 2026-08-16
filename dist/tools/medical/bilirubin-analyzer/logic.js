// Core Logic for Bilirubin Analyzer (Total, Direct, Indirect)
export async function execute(inputs) {
  const nums = (inputs.inputData || '').match(/[\d\.]+/g);
  if (!nums) return { outputData: "Please enter a valid Total Bilirubin value (mg/dL)." };
  const bili = parseFloat(nums[0]);
  let status = bili < 0.1 ? "Low" : (bili > 1.2 ? "High (Jaundice risk)" : "Normal");
  return { outputData: `Total Bilirubin: ${bili} mg/dL\nStatus: ${status}\nNormal Range: 0.1 - 1.2 mg/dL.` };
}
export function validate(inputs) { return !!inputs.inputData; }
