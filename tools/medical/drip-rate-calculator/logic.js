export async function execute(inputs) {
  const v = parseFloat(inputs.volume);
  const t = parseFloat(inputs.time); // hours
  const df = parseFloat(inputs.dropFactor);
  
  if (!v || !t || !df || isNaN(v) || isNaN(t) || isNaN(df)) return { toolOutput: "Please enter valid volume, time, and drop factor." };

  // Drip Rate (gtt/min) = (Volume (mL) * Drop Factor (gtt/mL)) / Time (minutes)
  const timeInMinutes = t * 60;
  const dripRate = (v * df) / timeInMinutes;

  return { toolOutput: `Result:\n(Remember: For educational purposes only)\n\nDrip Rate: ${Math.round(dripRate)} gtt/min (drops per minute)` };
}
export function validate(inputs) { return true; }