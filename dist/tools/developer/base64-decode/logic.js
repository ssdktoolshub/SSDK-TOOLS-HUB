export async function execute(inputs = {}) {
  const text = inputs.toolInput || inputs.base64 || inputs.input || inputs.text || "";
  if (!text.trim()) {
    return { toolOutput: "Please enter Base64 encoded text to decode." };
  }
  try {
    if (typeof Buffer !== 'undefined') {
      const decoded = Buffer.from(text.trim(), 'base64').toString('utf8');
      return { toolOutput: decoded };
    } else {
      const decoded = decodeURIComponent(escape(atob(text.trim())));
      return { toolOutput: decoded };
    }
  } catch (err) {
    return { toolOutput: "Decoding error: Invalid Base64 string (" + err.message + ")" };
  }
}
export function validate(inputs) { return true; }
