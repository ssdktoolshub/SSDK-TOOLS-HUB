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
  
  return { toolOutput: `EMI: $${emi.toFixed(2)}\nTotal Interest: $${totalInterest.toFixed(2)}\nTotal Payment (Principal + Interest): $${totalPayment.toFixed(2)}` };
}
export function validate(inputs) { return true; }