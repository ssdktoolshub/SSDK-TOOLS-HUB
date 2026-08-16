export async function execute(inputs) {
  const a = parseInt(inputs.num1);
  const b = parseInt(inputs.num2);
  
  if (isNaN(a) || isNaN(b) || a === 0 || b === 0) return { toolOutput: "Please enter valid non-zero numbers." };

  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const lcm = (Math.abs(a * b)) / gcd(a, b);

  return { toolOutput: `LCM of ${a} and ${b} is: ${lcm}` };
}
export function validate(inputs) { return true; }