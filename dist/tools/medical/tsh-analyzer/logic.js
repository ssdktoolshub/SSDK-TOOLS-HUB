export async function execute(inputs) {
  const tsh = parseFloat(inputs.tsh);
  if (isNaN(tsh)) throw new Error("Please provide a valid TSH value.");
  
  let result = "Normal (0.4 - 4.0 mIU/L)";
  if (tsh < 0.4) result = "Low (< 0.4 mIU/L) - Suggests possible Hyperthyroidism.";
  else if (tsh > 4.0) result = "High (> 4.0 mIU/L) - Suggests possible Hypothyroidism.";
  
  return { outputData: result };
}

export function validate(inputs) {
  return inputs.tsh !== undefined;
}
