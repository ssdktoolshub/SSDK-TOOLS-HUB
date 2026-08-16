export async function execute(inputs) {
  const a = parseInt(inputs.num1);
  const b = parseInt(inputs.num2);
  
  if (isNaN(a) || isNaN(b)) return { toolOutput: "Please enter valid numbers." };

  const gcd = (x, y) => (!y ? Math.abs(x) : gcd(y, x % y));
  const result = gcd(a, b);

  return { toolOutput: `GCD (Greatest Common Divisor) of ${a} and ${b} is: ${result}` };
}
export function validate(inputs) { return true; }