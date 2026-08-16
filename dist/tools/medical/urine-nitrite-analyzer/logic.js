export async function execute(inputs = {}) {
  const val = String(inputs.nitrite || inputs.toolInput || "Negative").trim();
  const isPos = !val.toLowerCase().includes("neg") && val !== "0";
  return { toolOutput: `Urine Nitrite Test: ${val}\nInterpretation: ${isPos ? 'Positive - Indicates presence of nitrate-reducing bacteria (e.g. E. coli), suggestive of UTI' : 'Negative - No significant bacteriuria detected'}` };
}
export function validate(inputs) { return true; }
