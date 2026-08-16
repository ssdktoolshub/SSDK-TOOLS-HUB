export async function execute(inputs) {
  const str = inputs.toolInput || "";
  const nums = str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
  if (nums.length === 0) return { toolOutput: "Please provide comma-separated numbers." };
  const counts = {};
  nums.forEach(n => counts[n] = (counts[n] || 0) + 1);
  let maxCount = 0;
  let mode = null;
  for (let n in counts) {
    if (counts[n] > maxCount) {
      maxCount = counts[n];
      mode = n;
    }
  }
  return { toolOutput: "Mode: " + mode + " (appears " + maxCount + " times)" };
}

export function validate(inputs) {
  return true;
}
