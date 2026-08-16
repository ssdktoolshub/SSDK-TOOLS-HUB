export async function execute(inputs = {}) {
  const val = parseFloat(inputs.urobilinogen || inputs.toolInput || 0.2);
  let interp = "Normal (< 1.0 mg/dL / < 17 µmol/L)";
  if (val > 1.0) interp = "Elevated - Consider hemolytic jaundice or hepatocellular damage";
  return { toolOutput: `Urine Urobilinogen: ${val} mg/dL\nInterpretation: ${interp}\nReference Range: 0.1 - 1.0 mg/dL` };
}
export function validate(inputs) { return true; }
