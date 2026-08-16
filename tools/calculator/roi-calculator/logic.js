export async function execute(inputs) {
  let inv = 0, ret = 0;
  if (inputs.toolInput) {
    const parts = inputs.toolInput.split(/[,\s\n]+/).map(x => parseFloat(x)).filter(x => !isNaN(x));
    inv = parts[0] || 0;
    ret = parts[1] || 0;
  } else {
    inv = parseFloat(inputs.investment) || 0;
    ret = parseFloat(inputs.return) || 0;
  }
  if (inv <= 0) return { toolOutput: "Initial investment must be greater than 0." };
  const netProfit = ret - inv;
  const roi = (netProfit / inv) * 100;
  return { toolOutput: `Net Profit/Loss: $${netProfit.toFixed(2)}\nReturn on Investment (ROI): ${roi.toFixed(2)}%` };
}
export function validate(inputs) { return true; }
