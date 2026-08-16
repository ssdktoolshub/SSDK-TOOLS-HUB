// Core Logic for AST (SGOT) Analyzer
export async function execute(inputs) {
  const nums = (inputs.inputData || '').match(/[\d\.]+/g);
  if (!nums) return { outputData: "Please enter a valid AST (SGOT) value (U/L)." };
  const ast = parseFloat(nums[0]);
  let status = ast < 8 ? "Low" : (ast > 48 ? "High" : "Normal");
  return { outputData: `AST (SGOT): ${ast} U/L\nStatus: ${status}\nNormal Range: 8 - 48 U/L.` };
}
export function validate(inputs) { return !!inputs.inputData; }
