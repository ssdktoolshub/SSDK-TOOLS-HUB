export async function execute(inputs) {
  let val = 0, from = 'kg', to = 'g';
  if (inputs.toolInput) {
    const regex = /([\d.]+)\s*([a-zA-Z]+)\s*(?:to)?\s*([a-zA-Z]+)/i;
    const match = inputs.toolInput.match(regex);
    if (match) {
      val = parseFloat(match[1]);
      from = match[2].toLowerCase();
      to = match[3].toLowerCase();
    } else {
      val = parseFloat(inputs.toolInput) || 0;
    }
  } else {
    val = parseFloat(inputs.value) || 0;
    from = inputs.fromUnit || 'kg';
    to = inputs.toUnit || 'g';
  }

  const rates = {
    kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.0283495231
  };

  if (!rates[from] || !rates[to]) {
    return { toolOutput: `Unsupported units. Supported: ${Object.keys(rates).join(', ')}` };
  }

  const result = val * rates[from] / rates[to];
  return { toolOutput: `${val} ${from} = ${result.toPrecision(6)} ${to}` };
}
export function validate(inputs) { return true; }
