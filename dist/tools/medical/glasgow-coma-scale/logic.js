export async function execute(inputs) {
  const e = parseInt(inputs.eye) || 0;
  const v = parseInt(inputs.verbal) || 0;
  const m = parseInt(inputs.motor) || 0;
  
  if (!e || !v || !m) return { toolOutput: "Please select a response for all three categories." };

  const score = e + v + m;
  let interpretation = "";
  if (score >= 13) interpretation = "Mild Brain Injury";
  else if (score >= 9) interpretation = "Moderate Brain Injury";
  else interpretation = "Severe Brain Injury";

  return { toolOutput: `Result:\n(Remember: For educational purposes only)\n\nGCS Score: ${score}\n\nInterpretation:\n${interpretation}` };
}
export function validate(inputs) { return true; }