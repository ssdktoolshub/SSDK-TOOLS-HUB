export async function execute(inputs) {
  const w = parseFloat(inputs.weight);
  const h = parseFloat(inputs.height);
  const age = parseFloat(inputs.age);
  const gender = inputs.gender;
  
  if (!w || !h || !age || !gender || isNaN(w) || isNaN(h) || isNaN(age)) return { toolOutput: "Please enter valid weight, height, age, and gender." };

  // Mifflin-St Jeor Equation
  let bmr = (10 * w) + (6.25 * h) - (5 * age);
  if (gender === "male") bmr += 5;
  else bmr -= 161;

  return { toolOutput: `Result:\n(Remember: For educational purposes only)\n\nBMR: ${bmr.toFixed(0)} kcal/day\n\nInterpretation:\nThis represents the number of calories required to keep your body functioning at rest.` };
}
export function validate(inputs) { return true; }