export async function execute(inputs) {
  let val = 0, from = 'm', to = 'cm';
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
    from = inputs.fromUnit || 'm';
    to = inputs.toUnit || 'cm';
  }

  const rates = {
    m: 1, cm: 0.01, km: 1000, mm: 0.001,
    inch: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344
  };

  if (!rates[from] || !rates[to]) {
    return { toolOutput: `Unsupported units. Supported: ${Object.keys(rates).join(', ')}` };
  }

  const result = val * rates[from] / rates[to];
  return { toolOutput: `${val} ${from} = ${result.toPrecision(6)} ${to}` };
}
export function validate(inputs) { return true; }
