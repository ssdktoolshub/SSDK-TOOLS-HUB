export async function execute(inputs) {
  const h = parseFloat(inputs.height);
  const gender = inputs.gender;
  
  if (!h || !gender || isNaN(h)) return { toolOutput: "Please enter valid height and gender." };

  // Devine Formula (requires height in inches for calculation, but we take cm)
  const inchesOver5Ft = (h * 0.393701) - 60;
  
  let ibw = 0;
  if (inchesOver5Ft <= 0) {
     ibw = gender === "male" ? 50 : 45.5; // Base weight for 5ft or under
  } else {
     if (gender === "male") {
        ibw = 50 + (2.3 * inchesOver5Ft);
     } else {
        ibw = 45.5 + (2.3 * inchesOver5Ft);
     }
  }

  return { toolOutput: `Result:\n(Remember: For educational purposes only)\n\nIdeal Body Weight (Devine formula): ${ibw.toFixed(1)} kg` };
}
export function validate(inputs) { return true; }