export async function execute(inputs) {
  const val = parseInt(inputs.value1 || (inputs.toolInput ? inputs.toolInput : 0));
  if (isNaN(val) || val < 2) return { toolOutput: val + " is not a prime number." };
  for (let i = 2; i <= Math.sqrt(val); i++) {
    if (val % i === 0) return { toolOutput: val + " is not a prime number." };
  }
  return { toolOutput: val + " is a prime number." };
}

export function validate(inputs) {
  return true;
}
