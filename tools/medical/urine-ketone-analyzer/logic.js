export async function execute(inputs = {}) {
  const val = String(inputs.ketones || inputs.toolInput || "Negative").trim();
  const isPos = !val.toLowerCase().includes("neg") && val !== "0";
  return { toolOutput: `Urine Ketones Result: ${val}\nInterpretation: ${isPos ? 'Ketonuria Present (Positive) - Consider Diabetic Ketoacidosis (DKA), prolonged fasting, or ketogenic diet' : 'Normal (Negative - No ketones detected)'}` };
}
export function validate(inputs) { return true; }
