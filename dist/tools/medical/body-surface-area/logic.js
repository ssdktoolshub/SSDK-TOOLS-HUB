export async function execute(inputs) {
  const w = parseFloat(inputs.weight);
  const h = parseFloat(inputs.height);
  
  if (!w || !h || isNaN(w) || isNaN(h)) return { toolOutput: "Please enter valid weight and height." };

  // Mosteller formula
  const bsa = Math.sqrt((w * h) / 3600);

  return { toolOutput: `Result:\n(Remember: For educational purposes only)\n\nBody Surface Area (Mosteller): ${bsa.toFixed(2)} m²` };
}
export function validate(inputs) { return true; }