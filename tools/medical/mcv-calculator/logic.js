export async function execute(inputs = {}) {
  const hct = parseFloat(inputs.hematocrit || inputs.hct || (typeof inputs.toolInput === 'string' ? inputs.toolInput.split(',')[0] : null) || 45);
  const rbc = parseFloat(inputs.rbc || (typeof inputs.toolInput === 'string' ? inputs.toolInput.split(',')[1] : null) || 5.0);
  
  if (!hct || !rbc || rbc <= 0) {
    return { toolOutput: "Please provide valid numerical values for Hematocrit (%) and RBC count (million/µL)." };
  }
  
  const mcv = ((hct * 10) / rbc).toFixed(1);
  let status = "Normocytic (80 - 100 fL)";
  if (mcv < 80) status = "Microcytic (< 80 fL) - Consider Iron Deficiency / Thalassemia";
  if (mcv > 100) status = "Macrocytic (> 100 fL) - Consider Vitamin B12 / Folate deficiency";
  
  return { toolOutput: `Mean Corpuscular Volume (MCV): ${mcv} fL\nInterpretation: ${status}\nReference Range: 80.0 - 100.0 fL` };
}
export function validate(inputs) { return true; }
