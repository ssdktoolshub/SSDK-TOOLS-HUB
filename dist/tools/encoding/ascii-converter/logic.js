export async function execute(inputs) {
  const text = inputs.toolInput || "";
  let ascii = [];
  for (let i = 0; i < text.length; i++) {
    ascii.push(text.charCodeAt(i));
  }
  return { toolOutput: ascii.join(" ") };
}

export function validate(inputs) {
  return true;
}
