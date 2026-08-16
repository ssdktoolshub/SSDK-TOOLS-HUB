export async function execute(inputs = {}) {
  const ft3 = parseFloat(inputs.free_t3 || inputs.ft3 || inputs.toolInput || 3.0);
  let status = "Normal (2.3 - 4.2 pg/mL)";
  if (ft3 < 2.3) status = "Low (< 2.3 pg/mL) - Hypothyroidism or Euthyroid Sick Syndrome";
  if (ft3 > 4.2) status = "High (> 4.2 pg/mL) - Hyperthyroidism / T3 Thyrotoxicosis";
  return { toolOutput: `Free T3 (Triiodothyronine): ${ft3} pg/mL\nStatus: ${status}\nReference Range: 2.3 - 4.2 pg/mL (3.5 - 6.5 pmol/L)` };
}
export function validate(inputs) { return true; }
