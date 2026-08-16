export async function execute(inputs) {
  let p, r, t;
  if (inputs.principal !== undefined) {
    p = parseFloat(inputs.principal);
    r = parseFloat(inputs.rate);
    t = parseFloat(inputs.tenure);
  } else if (inputs.inputData) {
    const parts = inputs.inputData.split(/[,\s\n]+/).map(x => parseFloat(x)).filter(x => !isNaN(x));
    [p, r, t] = parts;
  }
  
  if (!p || !r || !t || isNaN(p) || isNaN(r) || isNaN(t)) return { outputData: "Please enter valid Principal, Rate, and Tenure." };

  const rMonthly = r / 12 / 100;
  const emi = (p * rMonthly * Math.pow(1 + rMonthly, t)) / (Math.pow(1 + rMonthly, t) - 1);
  const totalAmount = emi * t;
  const totalInterest = totalAmount - p;

  return { outputData: `EMI: ${emi.toFixed(2)}\nTotal Interest: ${totalInterest.toFixed(2)}\nTotal Payment: ${totalAmount.toFixed(2)}` };
}
export function validate(inputs) { return true; }
