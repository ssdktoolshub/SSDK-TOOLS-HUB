export async function execute(inputs = {}) {
  const val = String(inputs.bilirubin || inputs.toolInput || "Negative").trim();
  const isPos = !val.toLowerCase().includes("neg") && val !== "0";
  return { toolOutput: `Urine Bilirubin Result: ${val}\nInterpretation: ${isPos ? 'Positive (Abnormal) - Suggests conjugated hyperbilirubinemia / biliary obstruction or liver disease' : 'Normal (Negative)'}` };
}
export function validate(inputs) { return true; }
