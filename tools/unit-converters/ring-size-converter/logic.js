// Core Logic for Ring Size Converter
export async function execute(inputs) {
  const { value, fromUnit, toUnit } = inputs;
  if (value === undefined || value === null || value === '') {
    return { toolOutput: "Please enter a valid number." };
  }
  const val = parseFloat(value);
  
  // Base inside diameter in mm
  // US size to mm: diameter = 11.63 + 0.8128 * US
  let mm;
  const f = fromUnit.toLowerCase();
  if (f === 'us' || f === 'a') mm = 11.63 + 0.8128 * val;
  else if (f === 'uk') mm = 11.63 + 0.8128 * (val + 0.5); // Approx
  else if (f === 'eu') mm = val; // Often given in mm circumference or diameter, assume mm diameter
  else mm = val;
  
  let res;
  const t = toUnit.toLowerCase();
  if (t === 'us' || t === 'b') res = (mm - 11.63) / 0.8128;
  else if (t === 'uk') res = ((mm - 11.63) / 0.8128) - 0.5;
  else if (t === 'eu') res = mm;
  else res = mm;
  
  return { toolOutput: res.toString() };
}

export function validate(inputs) {
  return true;
}
