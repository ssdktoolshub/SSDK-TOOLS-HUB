export async function execute(inputs) {
  const text = inputs.toolInput || "";
  if (!text.trim()) return { toolOutput: "Estimated Reading Time: 0 minutes" };

  const words = text.trim().split(/\s+/).length;
  const wpm = 225; // Average adult reading speed
  const minutes = Math.ceil(words / wpm);

  return { toolOutput: `Estimated Reading Time: ${minutes} minute(s) (${words} words at 225 WPM)` };
}
export function validate(inputs) { return true; }