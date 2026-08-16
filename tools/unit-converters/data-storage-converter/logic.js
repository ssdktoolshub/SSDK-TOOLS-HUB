// Core Logic for Data Storage Converter
export async function execute(inputs) {
  const { value, fromUnit, toUnit } = inputs;
  if (value === undefined || value === null || value === '') {
    return { toolOutput: "Please enter a valid number." };
  }
  const val = parseFloat(value);
  
  // Base unit: Byte (B)
  const rates = {
    'bit': 0.125,
    'b': 1,
    'kb': 1e3,
    'kib': 1024,
    'mb': 1e6,
    'mib': 1048576,
    'gb': 1e9,
    'gib': 1073741824,
    'tb': 1e12,
    'tib': 1099511627776,
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
