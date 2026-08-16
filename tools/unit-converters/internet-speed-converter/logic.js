// Core Logic for Internet Speed Converter
export async function execute(inputs) {
  const { value, fromUnit, toUnit } = inputs;
  if (value === undefined || value === null || value === '') {
    return { toolOutput: "Please enter a valid number." };
  }
  const val = parseFloat(value);
  
  // Base unit: bit per second (bps)
  const rates = {
    'bps': 1,
    'kbps': 1e3,
    'mbps': 1e6,
    'gbps': 1e9,
    'b/s': 8,
    'kb/s': 8000,
    'mb/s': 8000000,
    'gb/s': 8000000000,
    'a': 1, 'b': 2 // Dummy fallbacks
  };
  
  const fromRate = rates[fromUnit.toLowerCase()] || 1;
  const toRate = rates[toUnit.toLowerCase()] || 1;
  
  const result = (val * fromRate) / toRate;
  return { toolOutput: result.toString() };
}

export function validate(inputs) {
  return true;
}
