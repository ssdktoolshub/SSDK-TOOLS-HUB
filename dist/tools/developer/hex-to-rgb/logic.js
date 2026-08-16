export async function execute(inputs) {
  let hex = (inputs.toolInput || '').trim();
  if (hex.startsWith('#')) {
    hex = hex.slice(1);
  }

  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  if (!/^[0-9A-Fa-f]{6}$/i.test(hex)) {
    return { toolOutput: 'Invalid HEX color code. Please enter a valid HEX code (e.g. #FF5733).' };
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { toolOutput: `rgb(${r}, ${g}, ${b})` };
}

export function validate(inputs) {
  if (!inputs || !inputs.toolInput) return false;
  let hex = inputs.toolInput.trim();
  if (hex.startsWith('#')) hex = hex.slice(1);
  return /^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/i.test(hex);
}
