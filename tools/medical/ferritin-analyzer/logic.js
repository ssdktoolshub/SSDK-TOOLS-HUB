export async function execute(inputs = {}) {
  const ferritin = parseFloat(inputs.ferritin || inputs.toolInput || 120);
  let status = "Normal (20 - 250 ng/mL)";
  if (ferritin < 20) status = "Low (< 20 ng/mL) - Depleted Iron Stores (Iron Deficiency Anemia)";
  if (ferritin > 300) status = "High (> 300 ng/mL) - Inflammation, Infection, or Hemochromatosis";
  return { toolOutput: `Serum Ferritin: ${ferritin} ng/mL\nStatus: ${status}\nReference Range: 20 - 250 ng/mL (Men: 30-300, Women: 15-200)` };
}
export function validate(inputs) { return true; }
