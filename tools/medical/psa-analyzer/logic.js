export async function execute(inputs) {
  const val = parseFloat(inputs.inputData);
  if (isNaN(val)) return { outputData: "Invalid input. Please enter a valid number (ng/mL)." };
  let status, explanation;
  if (val < 4.0) { status = "Normal"; explanation = "Generally considered normal. However, reference ranges may increase with age."; }
  else if (val <= 10.0) { status = "Borderline / Equivocal"; explanation = "Borderline elevation. Could be BPH, prostatitis, or early prostate cancer."; }
  else { status = "Elevated"; explanation = "High level. Increased risk of prostate cancer; further investigation recommended."; }
  return { outputData: `PSA: ${val} ng/mL\nStatus: ${status}\nInterpretation: ${explanation}` };
}
export function validate(inputs) {
  return inputs && inputs.inputData && inputs.inputData.trim() !== "";
}
