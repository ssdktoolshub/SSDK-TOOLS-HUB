export async function execute(inputs) {
  const v = parseFloat(inputs.volume);
  const t = parseFloat(inputs.time);
  
  if (!v || !t || isNaN(v) || isNaN(t)) return { toolOutput: "Please enter valid volume and time." };

  // Flow Rate (mL/hr) = Volume (mL) / Time (hr)
  const rate = v / t;

  return { toolOutput: `Result:\n(Remember: For educational purposes only)\n\nIV Flow Rate: ${rate.toFixed(1)} mL/hr` };
}
export function validate(inputs) { return true; }