export async function execute(inputs) {
  const val = parseFloat(inputs.inputData);
  if (isNaN(val)) return { outputData: "Invalid input. Please enter a valid number in seconds." };
  let status, explanation;
  if (val < 25) { status = "Low"; explanation = "Decreased aPTT. May indicate hypercoagulable state."; }
  else if (val <= 35) { status = "Normal"; explanation = "Normal range for a healthy individual."; }
  else if (val <= 75) { status = "Therapeutic"; explanation = "Often the therapeutic goal range for unfractionated heparin."; }
  else { status = "High"; explanation = "Prolonged aPTT. Increased bleeding risk. May indicate factor deficiency or inhibitor."; }
  return { outputData: `aPTT: ${val} seconds\nStatus: ${status}\nInterpretation: ${explanation}` };
}
export function validate(inputs) {
  return inputs && inputs.inputData && inputs.inputData.trim() !== "";
}
