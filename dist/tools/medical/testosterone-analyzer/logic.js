export async function execute(inputs) {
  const val = parseFloat(inputs.inputData);
  if (isNaN(val)) return { outputData: "Invalid input. Please enter a valid number (ng/dL)." };
  let explanation = "General Reference:\nAdult Males: 300 - 1000 ng/dL\nAdult Females: 15 - 70 ng/dL\n";
  let analysis = val < 15 ? "Low for both genders." : val <= 70 ? "Normal for females. Low for males." : val < 300 ? "Elevated for females. Low for males." : val <= 1000 ? "Normal for males. High for females." : "High for both genders.";
  return { outputData: `Testosterone: ${val} ng/dL\n\nInterpretation: ${analysis}\n\n${explanation}` };
}
export function validate(inputs) {
  return inputs && inputs.inputData && inputs.inputData.trim() !== "";
}
