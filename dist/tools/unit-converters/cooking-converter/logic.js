// Core Logic for Cooking Converter
export async function execute(inputs) {
  const { value, fromUnit, toUnit } = inputs;
  if (value === undefined || value === null || value === '') {
    return { toolOutput: "Please enter a valid number." };
  }
  const val = parseFloat(value);
  
  // Base unit: ml
  const rates = {
    'tsp': 4.92892,
    'tbsp': 14.7868,
    'cup': 240,
    'floz': 29.5735,
    'pt': 473.176,
    'qt': 946.353,
    'gal': 3785.41,
    'ml': 1,
    'l': 1000,
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
