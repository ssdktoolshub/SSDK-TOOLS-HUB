export async function execute(inputs) {
  const val = parseFloat(inputs.inputData);
  if (isNaN(val)) return { outputData: "Invalid input. Please enter a valid number (ng/mL)." };
  let status, explanation;
  if (val < 0.1) { status = "Normal"; explanation = "Normal level. Systemic bacterial infection is unlikely."; }
  else if (val < 0.25) { status = "Mildly Elevated"; explanation = "Low risk for severe sepsis, but bacterial infection is possible."; }
  else if (val < 0.5) { status = "Moderately Elevated"; explanation = "Moderate risk. Probable systemic bacterial infection."; }
  else { status = "Significantly Elevated"; explanation = "High risk for severe sepsis/septic shock."; }
  return { outputData: `Procalcitonin: ${val} ng/mL\nStatus: ${status}\nInterpretation: ${explanation}` };
}
export function validate(inputs) {
  return inputs && inputs.inputData && inputs.inputData.trim() !== "";
}
