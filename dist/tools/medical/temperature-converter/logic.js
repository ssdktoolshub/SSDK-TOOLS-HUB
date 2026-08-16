export async function execute(inputs = {}) {
  const val = parseFloat(inputs.value || inputs.toolInput || inputs.temperature || 98.6);
  const from = (inputs.from || inputs.unit || "f").toLowerCase();

  let c, f, k;
  if (from.startsWith("c")) {
    c = val;
    f = (c * 9/5) + 32;
    k = c + 273.15;
  } else if (from.startsWith("k")) {
    k = val;
    c = k - 273.15;
    f = (c * 9/5) + 32;
  } else {
    f = val;
    c = (f - 32) * 5/9;
    k = c + 273.15;
  }

  let fever = c >= 38.0 ? "Fever Present (≥ 38.0°C / 100.4°F)" : (c < 35.0 ? "Hypothermia (< 35.0°C / 95.0°F)" : "Normal Body Temperature");

  return {
    toolOutput: `Temperature Conversion:\n- Celsius: ${c.toFixed(2)} °C\n- Fahrenheit: ${f.toFixed(2)} °F\n- Kelvin: ${k.toFixed(2)} K\nClinical Status: ${fever}`
  };
}
export function validate(inputs) { return true; }
