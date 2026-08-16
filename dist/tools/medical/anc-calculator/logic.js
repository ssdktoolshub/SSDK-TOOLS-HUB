export async function execute(inputs = {}) {
  const wbc = parseFloat(inputs.wbc || (typeof inputs.toolInput === 'string' ? inputs.toolInput.split(',')[0] : null) || 7000);
  const neut = parseFloat(inputs.neutrophils || inputs.neut || 60);
  const bands = parseFloat(inputs.bands || 0);

  if (!wbc || wbc <= 0) {
    return { toolOutput: "Please enter a valid Total WBC count (cells/µL)." };
  }

  const anc = Math.round((wbc * (neut + bands)) / 100);
  let risk = "Normal ANC (≥ 1500 /µL) - No neutropenia";
  if (anc < 500) risk = "Severe Neutropenia (< 500 /µL) - High infection risk";
  else if (anc < 1000) risk = "Moderate Neutropenia (500 - 999 /µL)";
  else if (anc < 1500) risk = "Mild Neutropenia (1000 - 1499 /µL)";

  return { toolOutput: `Absolute Neutrophil Count (ANC): ${anc} /µL\nInterpretation: ${risk}\nFormula: WBC × (% Neutrophils + % Bands) / 100` };
}
export function validate(inputs) { return true; }
