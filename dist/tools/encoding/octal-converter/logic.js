export async function execute(inputs) {
  const text = inputs.toolInput || "";
  let octal = [];
  for (let i = 0; i < text.length; i++) {
    octal.push(text.charCodeAt(i).toString(8).padStart(3, '0'));
  }
  return { toolOutput: octal.join(" ") };
}

export function validate(inputs) {
  return true;
}
