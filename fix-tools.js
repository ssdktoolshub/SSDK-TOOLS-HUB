const fs = require('fs');
const path = require('path');

const FINANCE_TOOLS = ['car-loan-calculator', 'bike-loan-calculator', 'home-loan-calculator', 'education-loan-calculator', 'personal-loan-calculator'];
const DATA_TOOLS = ['correlation-calculator', 'regression-calculator', 'forecast-calculator'];
const NUM_TOOLS = ['prime-checker', 'lcm', 'gcd', 'ratio-calculator', 'average-calculator', 'median', 'mode', 'standard-deviation'];
const ENC_TOOLS = ['unicode-encode', 'unicode-decode', 'ascii-converter', 'binary-converter', 'hex-converter', 'octal-converter'];

const templates = {
  finance: `export async function execute(inputs) {
  const p = parseFloat(inputs.principal) || 0;
  const rate = parseFloat(inputs.rate) || 0;
  const t = parseFloat(inputs.tenure) || 0;

  if (p <= 0 || rate <= 0 || t <= 0) {
    return { toolOutput: "Please enter positive values for principal, rate, and tenure." };
  }

  const r = (rate / 100) / 12;
  const n = t * 12;

  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  return { toolOutput: \\\`Monthly EMI: $\\$\\{emi.toFixed(2)\\}\\nTotal Interest: $\\$\\{totalInterest.toFixed(2)\\}\\nTotal Payment: $\\$\\{totalPayment.toFixed(2)}\\\` };
}

export function validate(inputs) {
  return true;
}
`
};

FINANCE_TOOLS.forEach(tool => {
  fs.writeFileSync(path.join('tools', 'finance', tool, 'logic.js'), templates.finance);
});

const parseDataXY = `function parseData(input) {
  let lines = input.split('\\\\n').map(l => l.trim()).filter(l => l.length);
  if (lines.length >= 2) {
    let x = lines[0].split(',').map(Number);
    let y = lines[1].split(',').map(Number);
    return {x, y};
  }
  let nums = input.split(',').map(Number);
  let x = [], y = [];
  for(let i=0; i<nums.length; i+=2) {
    if (i+1 < nums.length) {
      x.push(nums[i]);
      y.push(nums[i+1]);
    }
  }
  return {x, y};
}`;

const dataTools = {
  'correlation-calculator': `${parseDataXY}
export async function execute(inputs) {
  const data = parseData(inputs.toolInput || '');
  const {x, y} = data;
  if (x.length < 2 || x.length !== y.length) return { toolOutput: "Please provide valid paired data (X and Y) with at least 2 points." };
  
  const n = x.length;
  const sumX = x.reduce((a,b)=>a+b,0);
  const sumY = y.reduce((a,b)=>a+b,0);
  const sumXY = x.reduce((a,b,i)=>a+b*y[i],0);
  const sumX2 = x.reduce((a,b)=>a+b*b,0);
  const sumY2 = y.reduce((a,b)=>a+b*b,0);
  
  const num = n * sumXY - sumX * sumY;
  const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  if (den === 0) return { toolOutput: "Correlation is undefined (division by zero)." };
  const r = num / den;
  return { toolOutput: "Correlation Coefficient (r): " + r.toFixed(4) };
}
export function validate(inputs) { return true; }
`,
  'regression-calculator': `${parseDataXY}
export async function execute(inputs) {
  const data = parseData(inputs.toolInput || '');
  const {x, y} = data;
  if (x.length < 2 || x.length !== y.length) return { toolOutput: "Please provide valid paired data (X and Y) with at least 2 points." };
  
  const n = x.length;
  const sumX = x.reduce((a,b)=>a+b,0);
  const sumY = y.reduce((a,b)=>a+b,0);
  const sumXY = x.reduce((a,b,i)=>a+b*y[i],0);
  const sumX2 = x.reduce((a,b)=>a+b*b,0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { toolOutput: "Linear Regression Equation: Y = " + slope.toFixed(4) + " * X + " + intercept.toFixed(4) };
}
export function validate(inputs) { return true; }
`,
  'forecast-calculator': `${parseDataXY}
export async function execute(inputs) {
  const data = parseData(inputs.toolInput || '');
  const {x, y} = data;
  if (x.length < 2 || x.length !== y.length) return { toolOutput: "Please provide valid paired data (X and Y) with at least 2 points." };
  
  const n = x.length;
  const sumX = x.reduce((a,b)=>a+b,0);
  const sumY = y.reduce((a,b)=>a+b,0);
  const sumXY = x.reduce((a,b,i)=>a+b*y[i],0);
  const sumX2 = x.reduce((a,b)=>a+b*b,0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const nextX = Math.max(...x) + 1;
  const forecastY = slope * nextX + intercept;
  return { toolOutput: "Forecasted Y for next X (" + nextX + "): " + forecastY.toFixed(4) };
}
export function validate(inputs) { return true; }
`
};

Object.keys(dataTools).forEach(tool => {
  fs.writeFileSync(path.join('tools', 'data-analysis', tool, 'logic.js'), dataTools[tool]);
});

const numTools = {
  'prime-checker': `export async function execute(inputs) {
  const val = parseInt(inputs.value1 || (inputs.toolInput ? inputs.toolInput : 0));
  if (isNaN(val) || val < 2) return { toolOutput: val + " is not a prime number." };
  for (let i = 2; i <= Math.sqrt(val); i++) {
    if (val % i === 0) return { toolOutput: val + " is not a prime number." };
  }
  return { toolOutput: val + " is a prime number." };
}
export function validate(inputs) { return true; }`,
  'lcm': `export async function execute(inputs) {
  const a = parseInt(inputs.value1 || 0);
  const b = parseInt(inputs.value2 || 0);
  if (isNaN(a) || isNaN(b)) return { toolOutput: "Please provide valid numbers." };
  const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
  const lcm = (a * b) / gcd(a, b);
  return { toolOutput: "LCM: " + Math.abs(lcm) };
}
export function validate(inputs) { return true; }`,
  'gcd': `export async function execute(inputs) {
  const a = parseInt(inputs.value1 || 0);
  const b = parseInt(inputs.value2 || 0);
  if (isNaN(a) || isNaN(b)) return { toolOutput: "Please provide valid numbers." };
  const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
  return { toolOutput: "GCD: " + Math.abs(gcd(a, b)) };
}
export function validate(inputs) { return true; }`,
  'ratio-calculator': `export async function execute(inputs) {
  const a = parseFloat(inputs.value1 || (inputs.toolInput ? inputs.toolInput.split(',')[0] : 0));
  const b = parseFloat(inputs.value2 || (inputs.toolInput ? inputs.toolInput.split(',')[1] : 0));
  if (isNaN(a) || isNaN(b) || b === 0) return { toolOutput: "Please provide valid numbers (Value 2 cannot be zero)." };
  return { toolOutput: "Ratio (Value 1 / Value 2): " + (a / b).toFixed(4) };
}
export function validate(inputs) { return true; }`,
  'average-calculator': `export async function execute(inputs) {
  const str = inputs.toolInput || "";
  const nums = str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
  if (nums.length === 0) return { toolOutput: "Please provide comma-separated numbers." };
  const sum = nums.reduce((a, b) => a + b, 0);
  return { toolOutput: "Average: " + (sum / nums.length).toFixed(4) };
}
export function validate(inputs) { return true; }`,
  'median': `export async function execute(inputs) {
  const str = inputs.toolInput || "";
  const nums = str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n)).sort((a,b)=>a-b);
  if (nums.length === 0) return { toolOutput: "Please provide comma-separated numbers." };
  const mid = Math.floor(nums.length / 2);
  const median = nums.length % 2 === 0 ? (nums[mid-1] + nums[mid]) / 2 : nums[mid];
  return { toolOutput: "Median: " + median };
}
export function validate(inputs) { return true; }`,
  'mode': `export async function execute(inputs) {
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
export function validate(inputs) { return true; }`,
  'standard-deviation': `export async function execute(inputs) {
  const str = inputs.toolInput || "";
  const nums = str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
  if (nums.length === 0) return { toolOutput: "Please provide comma-separated numbers." };
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const variance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length;
  return { toolOutput: "Standard Deviation: " + Math.sqrt(variance).toFixed(4) };
}
export function validate(inputs) { return true; }`
};

Object.keys(numTools).forEach(tool => {
  fs.writeFileSync(path.join('tools', 'number-utilities', tool, 'logic.js'), numTools[tool]);
});

const encTools = {
  'unicode-encode': `export async function execute(inputs) {
  const text = inputs.toolInput || "";
  let encoded = "";
  for (let i = 0; i < text.length; i++) {
    encoded += "\\\\\\\\u" + text.charCodeAt(i).toString(16).padStart(4, '0');
  }
  return { toolOutput: encoded };
}
export function validate(inputs) { return true; }`,
  'unicode-decode': `export async function execute(inputs) {
  const text = inputs.toolInput || "";
  try {
    const decoded = text.replace(/\\\\\\\\u([0-9a-fA-F]{4})/g, (match, grp) => String.fromCharCode(parseInt(grp, 16)));
    return { toolOutput: decoded };
  } catch (e) {
    return { toolOutput: "Invalid Unicode encoding." };
  }
}
export function validate(inputs) { return true; }`,
  'ascii-converter': `export async function execute(inputs) {
  const text = inputs.toolInput || "";
  let ascii = [];
  for (let i = 0; i < text.length; i++) {
    ascii.push(text.charCodeAt(i));
  }
  return { toolOutput: ascii.join(" ") };
}
export function validate(inputs) { return true; }`,
  'binary-converter': `export async function execute(inputs) {
  const text = inputs.toolInput || "";
  let binary = [];
  for (let i = 0; i < text.length; i++) {
    binary.push(text.charCodeAt(i).toString(2).padStart(8, '0'));
  }
  return { toolOutput: binary.join(" ") };
}
export function validate(inputs) { return true; }`,
  'hex-converter': `export async function execute(inputs) {
  const text = inputs.toolInput || "";
  let hex = [];
  for (let i = 0; i < text.length; i++) {
    hex.push(text.charCodeAt(i).toString(16).padStart(2, '0'));
  }
  return { toolOutput: hex.join(" ") };
}
export function validate(inputs) { return true; }`,
  'octal-converter': `export async function execute(inputs) {
  const text = inputs.toolInput || "";
  let octal = [];
  for (let i = 0; i < text.length; i++) {
    octal.push(text.charCodeAt(i).toString(8).padStart(3, '0'));
  }
  return { toolOutput: octal.join(" ") };
}
export function validate(inputs) { return true; }`
};

Object.keys(encTools).forEach(tool => {
  fs.writeFileSync(path.join('tools', 'encoding', tool, 'logic.js'), encTools[tool]);
});

console.log("Done");
