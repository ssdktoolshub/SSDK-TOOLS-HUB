export async function execute(inputs) {
  const a1 = parseInt(inputs.appearance) || 0;
  const p = parseInt(inputs.pulse) || 0;
  const g = parseInt(inputs.grimace) || 0;
  const a2 = parseInt(inputs.activity) || 0;
  const r = parseInt(inputs.respiration) || 0;
  
  if (inputs.appearance === undefined || inputs.pulse === undefined || inputs.grimace === undefined || inputs.activity === undefined || inputs.respiration === undefined) {
     return { toolOutput: "Please select all 5 criteria." };
  }

  const score = a1 + p + g + a2 + r;
  let interpretation = "";
  if (score >= 7) interpretation = "Normal / Reassuring";
  else if (score >= 4) interpretation = "Moderately Abnormal (requires some resuscitation)";
  else interpretation = "Severely Abnormal (requires immediate resuscitation)";

  return { toolOutput: `Result:\n(Remember: For educational purposes only)\n\nAPGAR Score: ${score}/10\n\nInterpretation:\n${interpretation}` };
}
export function validate(inputs) { return true; }