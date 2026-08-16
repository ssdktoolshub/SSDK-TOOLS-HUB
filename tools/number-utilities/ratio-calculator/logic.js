export async function execute(inputs) {
  const a = parseFloat(inputs.value1 || (inputs.toolInput ? inputs.toolInput.split(',')[0] : 0));
  const b = parseFloat(inputs.value2 || (inputs.toolInput ? inputs.toolInput.split(',')[1] : 0));
  if (isNaN(a) || isNaN(b) || b === 0) return { toolOutput: "Please provide valid numbers (Value 2 cannot be zero)." };
  return { toolOutput: "Ratio (Value 1 / Value 2): " + (a / b).toFixed(4) };
}

export function validate(inputs) {
  return true;
}
