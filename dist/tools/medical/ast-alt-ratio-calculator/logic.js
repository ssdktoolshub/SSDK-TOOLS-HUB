// Core Logic for AST/ALT Ratio Calculator
export async function execute(inputs) {
  const nums = (inputs.inputData || '').match(/[\d\.]+/g);
  if (!nums || nums.length < 2) return { outputData: "Please enter AST and ALT values." };
  const ast = parseFloat(nums[0]), alt = parseFloat(nums[1]);
  if (alt === 0) return { outputData: "ALT cannot be zero." };
  const ratio = (ast / alt).toFixed(2);
  let status = ratio > 2 ? "High (Suggests alcoholic liver disease)" : (ratio > 1 ? "Elevated (Suggests cirrhosis/liver disease)" : "Normal (<1.0)");
  return { outputData: `AST/ALT Ratio: ${ratio}\nStatus: ${status}` };
}
export function validate(inputs) { return !!inputs.inputData; }
