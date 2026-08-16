export async function execute(inputs = {}) {
  const val = String(inputs.leukocytes || inputs.toolInput || "Negative").trim();
  const isPos = !val.toLowerCase().includes("neg") && val !== "0";
  return { toolOutput: `Urine Leukocyte Esterase: ${val}\nInterpretation: ${isPos ? 'Positive - Pyuria indicated, suggestive of Urinary Tract Infection or inflammation' : 'Negative - Normal white cell activity'}` };
}
export function validate(inputs) { return true; }
