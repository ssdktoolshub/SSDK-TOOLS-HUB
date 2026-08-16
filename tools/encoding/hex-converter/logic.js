export async function execute(inputs) {
  const text = inputs.toolInput || "";
  let hex = [];
  for (let i = 0; i < text.length; i++) {
    hex.push(text.charCodeAt(i).toString(16).padStart(2, '0'));
  }
  return { toolOutput: hex.join(" ") };
}

export function validate(inputs) {
  return true;
}
