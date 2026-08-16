export async function execute(inputs) {
  const a = parseInt(inputs.value1 || 0);
  const b = parseInt(inputs.value2 || 0);
  if (isNaN(a) || isNaN(b)) return { toolOutput: "Please provide valid numbers." };
  const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
  const lcm = (a * b) / gcd(a, b);
  return { toolOutput: "LCM: " + Math.abs(lcm) };
}

export function validate(inputs) {
  return true;
}
