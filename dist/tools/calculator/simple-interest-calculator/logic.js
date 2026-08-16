export async function execute(inputs) {
  const p = parseFloat(inputs.principal) || 0;
  const r = parseFloat(inputs.rate) || 0;
  const t = parseFloat(inputs.time) || 0;
  if (p <= 0 || r < 0 || t <= 0) return { toolOutput: "Please enter valid Principal, Rate, and Time." };
  const interest = (p * r * t) / 100;
  const totalAmount = p + interest;
  return { toolOutput: `Simple Interest: $${interest.toFixed(2)}\nTotal Amount: $${totalAmount.toFixed(2)}` };
}
export function validate(inputs) { return true; }
