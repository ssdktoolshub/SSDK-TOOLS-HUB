export async function execute(inputs) {
  const p = parseFloat(inputs.principal) || 0;
  const rateStr = String(inputs.rate);
  let rate = parseFloat(inputs.rate) || 0;
  let t = parseFloat(inputs.tenure) || 0;

  if (p <= 0 || rate <= 0 || t <= 0) {
    return { toolOutput: "Please enter positive values for principal, rate, and tenure." };
  }

  const r = (rate / 100) / 12;
  const n = t * 12;

  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  return { toolOutput: `Monthly EMI: $${emi.toFixed(2)}\nTotal Interest: $${totalInterest.toFixed(2)}\nTotal Payment: $${totalPayment.toFixed(2)}` };
}

export function validate(inputs) {
  return true;
}
