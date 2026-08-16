function parseData(input) {
  let lines = input.split('\n').map(l => l.trim()).filter(l => l.length);
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
}

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

export function validate(inputs) {
  return true;
}
