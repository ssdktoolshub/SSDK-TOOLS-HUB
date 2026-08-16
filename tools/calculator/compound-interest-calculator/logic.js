export async function execute(inputs) {
  const p = parseFloat(inputs.principal);
  const r = parseFloat(inputs.rate);
  const t = parseFloat(inputs.time);
  
  if (!p || !r || !t || isNaN(p) || isNaN(r) || isNaN(t)) return { toolOutput: "Please enter valid Principal, Rate, and Time." };

  const amount = p * Math.pow((1 + (r / 100)), t);
  const ci = amount - p;

  return { toolOutput: `Compound Interest: ${ci.toFixed(2)}\nTotal Amount: ${amount.toFixed(2)}` };
}
export function validate(inputs) { return true; }