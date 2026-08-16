const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/data-analysis');

const implementations = {
  "variance-calculator": `
export async function execute(inputs) {
  const dataStr = inputs.toolInput;
  if (!dataStr) return { toolOutput: "Please enter comma-separated numbers." };
  
  const nums = dataStr.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
  if (nums.length === 0) return { toolOutput: "No valid numbers found." };
  
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const variance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (nums.length > 1 ? nums.length - 1 : 1); // Sample variance
  const popVariance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length;
  
  return { toolOutput: \`Sample Variance: \${variance.toFixed(4)}\\nPopulation Variance: \${popVariance.toFixed(4)}\` };
}
export function validate(inputs) { return true; }
`,
  "percentile-calculator": `
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
  
  return { toolOutput: \`25th Percentile: \${calculatePercentile(25)}\\n50th Percentile (Median): \${calculatePercentile(50)}\\n75th Percentile: \${calculatePercentile(75)}\\n90th Percentile: \${calculatePercentile(90)}\` };
}
export function validate(inputs) { return true; }
`
};

Object.keys(implementations).forEach(slug => {
  const p = path.join(toolsPath, slug, 'logic.js');
  if (fs.existsSync(path.join(toolsPath, slug))) {
    fs.writeFileSync(p, implementations[slug].trim());
    console.log("Wrote " + p);
  } else {
    console.log("Could not find " + p);
  }
});
