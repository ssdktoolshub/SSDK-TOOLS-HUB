export async function execute(inputs) {
  const w = parseFloat(inputs.weight);
  const h = parseFloat(inputs.height) / 100; // cm to m
  
  if (!w || !h || isNaN(w) || isNaN(h)) return { toolOutput: "Please enter valid weight and height." };

  const bmi = (w / (h * h)).toFixed(1);
  let status = "";
  if (bmi < 18.5) status = "Underweight";
  else if (bmi < 25) status = "Normal weight";
  else if (bmi < 30) status = "Overweight";
  else status = "Obese";

  return { toolOutput: `Result:\n(Remember: For educational purposes only)\n\nBMI: ${bmi} kg/m²\nStatus: ${status}` };
}
export function validate(inputs) { return true; }