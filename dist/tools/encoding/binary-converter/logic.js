export async function execute(inputs) {
  const text = inputs.toolInput || "";
  let binary = [];
  for (let i = 0; i < text.length; i++) {
    binary.push(text.charCodeAt(i).toString(2).padStart(8, '0'));
  }
  return { toolOutput: binary.join(" ") };
}

export function validate(inputs) {
  return true;
}
