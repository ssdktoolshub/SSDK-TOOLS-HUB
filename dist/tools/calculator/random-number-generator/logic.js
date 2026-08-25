// Core Logic for Random Number Generator
export async function execute(inputs = {}) {
  const min = parseFloat(inputs.min ?? inputs.from ?? 1);
  const max = parseFloat(inputs.max ?? inputs.to ?? 100);
  const count = parseInt(inputs.count ?? 1);
  const allowDecimal = inputs.decimal === true || inputs.decimal === 'true';

  let results = [];
  for (let i = 0; i < count; i++) {
    if (allowDecimal) {
      results.push((Math.random() * (max - min) + min).toFixed(2));
    } else {
      results.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
  }

  const output = results.join(', ');
  return { toolOutput: output, outputData: output, results };
}
export function validate(inputs = {}) {
  const min = parseFloat(inputs.min ?? 1);
  const max = parseFloat(inputs.max ?? 100);
  if (isNaN(min) || isNaN(max)) return false;
  return min <= max;
}
