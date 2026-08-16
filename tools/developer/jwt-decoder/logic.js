export async function execute(inputs = {}) {
  const token = (inputs.toolInput || inputs.jwt || inputs.input || inputs.text || "").trim();
  if (!token) {
    return { toolOutput: "Please provide a valid JWT token." };
  }
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { toolOutput: "Invalid JWT format: A valid JWT must contain Header, Payload, and Signature separated by dots." };
  }
  try {
    const decodePart = (str) => {
      const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
      if (typeof Buffer !== 'undefined') {
        return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
      } else {
        return JSON.parse(decodeURIComponent(escape(atob(b64))));
      }
    };
    const header = decodePart(parts[0]);
    const payload = decodePart(parts[1]);
    return {
      toolOutput: JSON.stringify({ Header: header, Payload: payload, Signature: parts[2] }, null, 2)
    };
  } catch (err) {
    return { toolOutput: "JWT Parsing Error: " + err.message };
  }
}
export function validate(inputs) { return true; }
