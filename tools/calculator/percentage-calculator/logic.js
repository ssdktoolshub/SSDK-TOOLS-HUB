export async function execute(inputs) {
  const v1 = parseFloat(inputs.val1);
  const v2 = parseFloat(inputs.val2);
  const op = inputs.operation;
  
  if (isNaN(v1) || isNaN(v2)) return { toolOutput: "Please enter valid numbers." };

  let result = "";
  if (op === "what-is") {
     result = `${v1}% of ${v2} is ${(v1 / 100) * v2}`;
  } else if (op === "is-what") {
     result = `${v1} is ${((v1 / v2) * 100).toFixed(2)}% of ${v2}`;
  } else if (op === "increase") {
     const inc = ((v2 - v1) / Math.abs(v1)) * 100;
     result = `Increase from ${v1} to ${v2} is ${inc.toFixed(2)}%`;
  } else if (op === "decrease") {
     const dec = ((v1 - v2) / Math.abs(v1)) * 100;
     result = `Decrease from ${v1} to ${v2} is ${dec.toFixed(2)}%`;
  }

  return { toolOutput: result };
}
export function validate(inputs) { return true; }