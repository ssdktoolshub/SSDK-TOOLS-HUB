export async function execute(inputs = {}) {
  const ft4 = parseFloat(inputs.free_t4 || inputs.ft4 || inputs.toolInput || 1.2);
  let status = "Normal (0.8 - 1.8 ng/dL)";
  if (ft4 < 0.8) status = "Low (< 0.8 ng/dL) - Hypothyroidism";
  if (ft4 > 1.8) status = "High (> 1.8 ng/dL) - Hyperthyroidism";
  return { toolOutput: `Free T4 (Thyroxine): ${ft4} ng/dL\nStatus: ${status}\nReference Range: 0.8 - 1.8 ng/dL (10 - 23 pmol/L)` };
}
export function validate(inputs) { return true; }
