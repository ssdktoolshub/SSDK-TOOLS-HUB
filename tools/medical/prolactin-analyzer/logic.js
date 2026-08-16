export async function execute(inputs) {
  const val = parseFloat(inputs.inputData);
  if (isNaN(val)) return { outputData: "Invalid input. Please enter a valid number (ng/mL)." };
  let status = val > 29 ? "Elevated (Hyperprolactinemia)" : "Normal";
  let explanation = "General Reference:\nMales: 2-18 ng/mL\nNon-pregnant Females: 2-29 ng/mL\nPregnant Females: 10-209 ng/mL";
  return { outputData: `Prolactin: ${val} ng/mL\nStatus: ${status}\n\n${explanation}` };
}
export function validate(inputs) {
  return inputs && inputs.inputData && inputs.inputData.trim() !== "";
}
