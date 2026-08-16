export async function execute(inputs) {
  let output = "";
  for(let i=0; i<10; i++) {
    output += crypto.randomUUID() + "\n";
  }
  return { toolOutput: output.trim() };
}
export function validate(inputs) { return true; }