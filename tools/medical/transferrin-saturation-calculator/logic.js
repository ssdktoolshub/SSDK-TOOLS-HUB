export async function execute(inputs = {}) {
  const iron = parseFloat(inputs.iron || 90);
  const tibc = parseFloat(inputs.tibc || 320);
  if (!tibc || tibc <= 0) return { toolOutput: "TIBC must be greater than 0." };
  const sat = ((iron / tibc) * 100).toFixed(1);
  let status = "Normal (20 - 50%)";
  if (sat < 20) status = "Low (< 20%) - Iron Deficiency Anemia";
  if (sat > 50) status = "High (> 50%) - Hemochromatosis / Iron Overload";
  return { toolOutput: `Transferrin Saturation (TSAT): ${sat}%\nFormula: (Serum Iron / TIBC) × 100\nStatus: ${status}\nReference Range: 20 - 50%` };
}
export function validate(inputs) { return true; }
