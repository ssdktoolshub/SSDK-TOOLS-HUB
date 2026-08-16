export async function execute(inputs) {
  const dataStr = inputs.toolInput;
  if (!dataStr) return { toolOutput: "Please enter comma-separated numbers." };
  
  const nums = dataStr.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
  if (nums.length === 0) return { toolOutput: "No valid numbers found." };
  
  nums.sort((a, b) => a - b);
  
  const calculatePercentile = (p) => {
      const index = (p / 100) * (nums.length - 1);
      const lower = Math.floor(index);
      const upper = lower + 1;
      const weight = index % 1;
      
      if (upper >= nums.length) return nums[lower];
      return nums[lower] * (1 - weight) + nums[upper] * weight;
  };
  
  return { toolOutput: `25th Percentile: ${calculatePercentile(25)}\n50th Percentile (Median): ${calculatePercentile(50)}\n75th Percentile: ${calculatePercentile(75)}\n90th Percentile: ${calculatePercentile(90)}` };
}
export function validate(inputs) { return true; }