const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/finance');

const implementations = {
  "emi-calculator": `
export async function execute(inputs) {
  const p = parseFloat(inputs.principal) || 0;
  const r = parseFloat(inputs.rate) || 0;
  const t = parseFloat(inputs.tenure) || 0;
  
  if (p <= 0 || r <= 0 || t <= 0) return { toolOutput: "Please enter valid Principal, Rate, and Tenure." };

  const ratePerMonth = r / (12 * 100);
  const totalMonths = t * 12;
  
  const emi = (p * ratePerMonth * Math.pow(1 + ratePerMonth, totalMonths)) / (Math.pow(1 + ratePerMonth, totalMonths) - 1);
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - p;
  
  return { toolOutput: \`EMI: $\${emi.toFixed(2)}\\nTotal Interest: $\${totalInterest.toFixed(2)}\\nTotal Payment (Principal + Interest): $\${totalPayment.toFixed(2)}\` };
}
export function validate(inputs) { return true; }
`,
  "roi-calculator": `
export async function execute(inputs) {
  const inv = parseFloat(inputs.investment) || 0;
  const ret = parseFloat(inputs.return) || 0;
  
  if (inv <= 0) return { toolOutput: "Initial investment must be greater than 0." };

  const netProfit = ret - inv;
  const roi = (netProfit / inv) * 100;
  
  return { toolOutput: \`Net Profit/Loss: $\${netProfit.toFixed(2)}\\nReturn on Investment (ROI): \${roi.toFixed(2)}%\` };
}
export function validate(inputs) { return true; }
`,
  "margin-calculator": `
export async function execute(inputs) {
  const cost = parseFloat(inputs.cost) || 0;
  const rev = parseFloat(inputs.revenue) || 0;
  
  if (rev <= 0) return { toolOutput: "Revenue must be greater than 0." };

  const grossProfit = rev - cost;
  const margin = (grossProfit / rev) * 100;
  const markup = (grossProfit / cost) * 100;
  
  return { toolOutput: \`Gross Profit: $\${grossProfit.toFixed(2)}\\nMargin: \${margin.toFixed(2)}%\\nMarkup: \${markup.toFixed(2)}%\` };
}
export function validate(inputs) { return true; }
`,
  "simple-interest-calculator": `
export async function execute(inputs) {
  const p = parseFloat(inputs.principal) || 0;
  const r = parseFloat(inputs.rate) || 0;
  const t = parseFloat(inputs.time) || 0;
  
  if (p <= 0 || r < 0 || t <= 0) return { toolOutput: "Please enter valid Principal, Rate, and Time." };

  const interest = (p * r * t) / 100;
  const totalAmount = p + interest;
  
  return { toolOutput: \`Simple Interest: $\${interest.toFixed(2)}\\nTotal Amount: $\${totalAmount.toFixed(2)}\` };
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
