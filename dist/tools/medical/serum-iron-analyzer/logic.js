export async function execute(inputs = {}) {
  const iron = parseFloat(inputs.iron || inputs.serumIron || inputs.toolInput || 90);
  let status = "Normal (60 - 170 µg/dL)";
  if (iron < 60) status = "Low (< 60 µg/dL) - Iron Deficiency";
  if (iron > 170) status = "High (> 170 µg/dL) - Hemochromatosis / Iron Overload";
  return { toolOutput: `Serum Iron: ${iron} µg/dL\nStatus: ${status}\nReference Range: 60 - 170 µg/dL (10.7 - 30.4 µmol/L)` };
}
export function validate(inputs) { return true; }
