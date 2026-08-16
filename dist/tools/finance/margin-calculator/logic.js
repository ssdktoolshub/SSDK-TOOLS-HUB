export async function execute(inputs) {
  const cost = parseFloat(inputs.cost) || 0;
  const rev = parseFloat(inputs.revenue) || 0;
  
  if (rev <= 0) return { toolOutput: "Revenue must be greater than 0." };

  const grossProfit = rev - cost;
  const margin = (grossProfit / rev) * 100;
  const markup = (grossProfit / cost) * 100;
  
  return { toolOutput: `Gross Profit: $${grossProfit.toFixed(2)}\nMargin: ${margin.toFixed(2)}%\nMarkup: ${markup.toFixed(2)}%` };
}
export function validate(inputs) { return true; }