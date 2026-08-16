export async function execute(inputs = {}) {
  const hb = parseFloat(inputs.hemoglobin || inputs.hb || (typeof inputs.toolInput === 'string' ? inputs.toolInput.split(',')[0] : null) || 15.0);
  const rbc = parseFloat(inputs.rbc || (typeof inputs.toolInput === 'string' ? inputs.toolInput.split(',')[1] : null) || 5.0);
  
  if (!hb || !rbc || rbc <= 0) {
    return { toolOutput: "Please provide valid numerical values for Hemoglobin (g/dL) and RBC count (million/µL)." };
  }
  
  const mch = ((hb * 10) / rbc).toFixed(1);
  let status = "Normochromic (27 - 33 pg)";
  if (mch < 27) status = "Hypochromic (< 27 pg)";
  if (mch > 33) status = "Hyperchromic (> 33 pg)";
  
  return { toolOutput: `Mean Corpuscular Hemoglobin (MCH): ${mch} pg\nInterpretation: ${status}\nReference Range: 27.0 - 33.0 pg` };
}
export function validate(inputs) { return true; }
