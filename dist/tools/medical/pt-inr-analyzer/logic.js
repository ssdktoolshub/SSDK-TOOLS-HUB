export async function execute(inputs) {
  const val = parseFloat(inputs.inputData);
  if (isNaN(val)) return { outputData: "Invalid input. Please enter a valid INR number." };
  let status, explanation;
  if (val < 0.8) { status = "Low"; explanation = "Below normal range. Risk of clotting."; }
  else if (val <= 1.1) { status = "Normal"; explanation = "Normal range for a healthy individual not on anticoagulants."; }
  else if (val < 2.0) { status = "Slightly Elevated"; explanation = "Mildly elevated INR."; }
  else if (val <= 3.0) { status = "Therapeutic"; explanation = "Standard therapeutic range for warfarin (VTE, AFib)."; }
  else { status = "High"; explanation = "Above therapeutic range. Increased risk of bleeding."; }
  return { outputData: `INR: ${val}\nStatus: ${status}\nInterpretation: ${explanation}` };
}
export function validate(inputs) {
  return inputs && inputs.inputData && inputs.inputData.trim() !== "";
}
