export async function execute(inputs) {
  const rgb = inputs.toolInput;
  if (!rgb) return { toolOutput: "Please enter RGB values (e.g. 255, 87, 51 or rgb(255, 87, 51))." };
  
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return { toolOutput: "Invalid RGB format." };
  
  const r = parseInt(match[0]);
  const g = parseInt(match[1]);
  const b = parseInt(match[2]);
  
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  
  return { toolOutput: "#" + toHex(r) + toHex(g) + toHex(b) };
}
export function validate(inputs) { return true; }
