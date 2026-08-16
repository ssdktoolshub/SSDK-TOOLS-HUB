export async function execute(inputs) {
  const str = inputs.toolInput || "";
  const nums = str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
  if (nums.length === 0) return { toolOutput: "Please provide comma-separated numbers." };
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const variance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length;
  return { toolOutput: "Standard Deviation: " + Math.sqrt(variance).toFixed(4) };
}

export function validate(inputs) {
  return true;
}
