export async function execute(inputs) {
  const protein = parseFloat(inputs.protein);
  if (isNaN(protein)) throw new Error("Please provide a valid protein level.");
  
  let result = "Normal (Negative / < 14 mg/dL)";
  if (protein >= 14 && protein <= 30) result = "Trace - Borderline or temporary condition.";
  else if (protein > 30) result = "Positive - Indicates possible proteinuria (kidney disease, infection, etc.).";
  
  return { outputData: result };
}

export function validate(inputs) {
  return inputs.protein !== undefined;
}
