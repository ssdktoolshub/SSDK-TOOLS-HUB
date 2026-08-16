export async function execute(inputs) {
  const str = inputs.toolInput || "";
  const nums = str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
  if (nums.length === 0) return { toolOutput: "Please provide comma-separated numbers." };
  const sum = nums.reduce((a, b) => a + b, 0);
  return { toolOutput: "Average: " + (sum / nums.length).toFixed(4) };
}

export function validate(inputs) {
  return true;
}
