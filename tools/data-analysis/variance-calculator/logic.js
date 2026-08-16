export async function execute(inputs) {
  const dataStr = inputs.toolInput;
  if (!dataStr) return { toolOutput: "Please enter comma-separated numbers." };
  
  const nums = dataStr.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
  if (nums.length === 0) return { toolOutput: "No valid numbers found." };
  
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const variance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (nums.length > 1 ? nums.length - 1 : 1); // Sample variance
  const popVariance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length;
  
  return { toolOutput: `Sample Variance: ${variance.toFixed(4)}\nPopulation Variance: ${popVariance.toFixed(4)}` };
}
export function validate(inputs) { return true; }