export async function execute(inputs = {}) {
  const tsh = parseFloat(inputs.tsh || 2.1);
  const ft4 = parseFloat(inputs.ft4 || inputs.free_t4 || 1.2);
  const ft3 = parseFloat(inputs.ft3 || inputs.free_t3 || 3.0);

  let interp = "Euthyroid (Normal Thyroid Function)";
  if (tsh > 4.5 && ft4 < 0.8) interp = "Primary Overt Hypothyroidism";
  else if (tsh > 4.5 && ft4 >= 0.8) interp = "Subclinical Hypothyroidism";
  else if (tsh < 0.4 && ft4 > 1.8) interp = "Primary Overt Hyperthyroidism";
  else if (tsh < 0.4 && ft4 <= 1.8) interp = "Subclinical Hyperthyroidism";

  return {
    toolOutput: `=== THYROID FUNCTION REPORT ANALYSIS ===\n- TSH: ${tsh} µIU/mL (Normal: 0.4 - 4.5)\n- Free T4: ${ft4} ng/dL (Normal: 0.8 - 1.8)\n- Free T3: ${ft3} pg/mL (Normal: 2.3 - 4.2)\nDiagnosis / Assessment: ${interp}`
  };
}
export function validate(inputs) { return true; }
