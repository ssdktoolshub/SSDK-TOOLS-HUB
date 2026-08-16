export async function execute(inputs) {
  const str = inputs.toolInput || "";
  const nums = str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n)).sort((a,b)=>a-b);
  if (nums.length === 0) return { toolOutput: "Please provide comma-separated numbers." };
  const mid = Math.floor(nums.length / 2);
  const median = nums.length % 2 === 0 ? (nums[mid-1] + nums[mid]) / 2 : nums[mid];
  return { toolOutput: "Median: " + median };
}

export function validate(inputs) {
  return true;
}
