const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/calculator');

const implementations = {
  "emi-calculator": `
export async function execute(inputs) {
  const p = parseFloat(inputs.principal);
  const r = parseFloat(inputs.rate);
  const t = parseFloat(inputs.tenure);
  
  if (!p || !r || !t || isNaN(p) || isNaN(r) || isNaN(t)) return { toolOutput: "Please enter valid Principal, Rate, and Tenure." };

  const rMonthly = r / 12 / 100;
  const emi = (p * rMonthly * Math.pow(1 + rMonthly, t)) / (Math.pow(1 + rMonthly, t) - 1);
  const totalAmount = emi * t;
  const totalInterest = totalAmount - p;

  return { toolOutput: \`EMI: \${emi.toFixed(2)}\\nTotal Interest: \${totalInterest.toFixed(2)}\\nTotal Payment: \${totalAmount.toFixed(2)}\` };
}
export function validate(inputs) { return true; }
`,
  "simple-interest-calculator": `
export async function execute(inputs) {
  const p = parseFloat(inputs.principal);
  const r = parseFloat(inputs.rate);
  const t = parseFloat(inputs.time);
  
  if (!p || !r || !t || isNaN(p) || isNaN(r) || isNaN(t)) return { toolOutput: "Please enter valid Principal, Rate, and Time." };

  const si = (p * r * t) / 100;
  const total = p + si;

  return { toolOutput: \`Simple Interest: \${si.toFixed(2)}\\nTotal Amount: \${total.toFixed(2)}\` };
}
export function validate(inputs) { return true; }
`,
  "compound-interest-calculator": `
export async function execute(inputs) {
  const p = parseFloat(inputs.principal);
  const r = parseFloat(inputs.rate);
  const t = parseFloat(inputs.time);
  
  if (!p || !r || !t || isNaN(p) || isNaN(r) || isNaN(t)) return { toolOutput: "Please enter valid Principal, Rate, and Time." };

  const amount = p * Math.pow((1 + (r / 100)), t);
  const ci = amount - p;

  return { toolOutput: \`Compound Interest: \${ci.toFixed(2)}\\nTotal Amount: \${amount.toFixed(2)}\` };
}
export function validate(inputs) { return true; }
`,
  "percentage-calculator": `
export async function execute(inputs) {
  const v1 = parseFloat(inputs.val1);
  const v2 = parseFloat(inputs.val2);
  const op = inputs.operation;
  
  if (isNaN(v1) || isNaN(v2)) return { toolOutput: "Please enter valid numbers." };

  let result = "";
  if (op === "what-is") {
     result = \`\${v1}% of \${v2} is \${(v1 / 100) * v2}\`;
  } else if (op === "is-what") {
     result = \`\${v1} is \${((v1 / v2) * 100).toFixed(2)}% of \${v2}\`;
  } else if (op === "increase") {
     const inc = ((v2 - v1) / Math.abs(v1)) * 100;
     result = \`Increase from \${v1} to \${v2} is \${inc.toFixed(2)}%\`;
  } else if (op === "decrease") {
     const dec = ((v1 - v2) / Math.abs(v1)) * 100;
     result = \`Decrease from \${v1} to \${v2} is \${dec.toFixed(2)}%\`;
  }

  return { toolOutput: result };
}
export function validate(inputs) { return true; }
`,
  "gst-calculator": `
export async function execute(inputs) {
  const amount = parseFloat(inputs.amount);
  const rate = parseFloat(inputs.rate);
  const op = inputs.operation;
  
  if (isNaN(amount) || isNaN(rate)) return { toolOutput: "Please enter valid Amount and Tax Rate." };

  let tax = 0;
  let total = 0;

  if (op === "add") {
     tax = (amount * rate) / 100;
     total = amount + tax;
     return { toolOutput: \`Original Amount: \${amount.toFixed(2)}\\nGST Added: \${tax.toFixed(2)}\\nTotal Amount (Inclusive): \${total.toFixed(2)}\` };
  } else {
     tax = amount - (amount * (100 / (100 + rate)));
     const orig = amount - tax;
     return { toolOutput: \`Original Amount (Exclusive): \${orig.toFixed(2)}\\nGST Removed: \${tax.toFixed(2)}\\nTotal Amount: \${amount.toFixed(2)}\` };
  }
}
export function validate(inputs) { return true; }
`,
  "vat-calculator": `
export async function execute(inputs) {
  const amount = parseFloat(inputs.amount);
  const rate = parseFloat(inputs.rate);
  const op = inputs.operation;
  
  if (isNaN(amount) || isNaN(rate)) return { toolOutput: "Please enter valid Amount and Tax Rate." };

  let tax = 0;
  let total = 0;

  if (op === "add") {
     tax = (amount * rate) / 100;
     total = amount + tax;
     return { toolOutput: \`Original Amount: \${amount.toFixed(2)}\\nVAT Added: \${tax.toFixed(2)}\\nTotal Amount (Inclusive): \${total.toFixed(2)}\` };
  } else {
     tax = amount - (amount * (100 / (100 + rate)));
     const orig = amount - tax;
     return { toolOutput: \`Original Amount (Exclusive): \${orig.toFixed(2)}\\nVAT Removed: \${tax.toFixed(2)}\\nTotal Amount: \${amount.toFixed(2)}\` };
  }
}
export function validate(inputs) { return true; }
`
};

Object.keys(implementations).forEach(slug => {
  const p = path.join(toolsPath, slug, 'logic.js');
  if (fs.existsSync(path.join(toolsPath, slug))) {
    fs.writeFileSync(p, implementations[slug].trim());
    console.log("Wrote " + p);
  }
});
