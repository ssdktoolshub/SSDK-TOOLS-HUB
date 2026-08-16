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
     return { toolOutput: `Original Amount: ${amount.toFixed(2)}\nVAT Added: ${tax.toFixed(2)}\nTotal Amount (Inclusive): ${total.toFixed(2)}` };
  } else {
     tax = amount - (amount * (100 / (100 + rate)));
     const orig = amount - tax;
     return { toolOutput: `Original Amount (Exclusive): ${orig.toFixed(2)}\nVAT Removed: ${tax.toFixed(2)}\nTotal Amount: ${amount.toFixed(2)}` };
  }
}
export function validate(inputs) { return true; }