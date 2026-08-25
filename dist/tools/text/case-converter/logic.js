export async function execute(inputs = {}) {
  const text = String(inputs.inputData ?? inputs.text ?? inputs.input ?? "");
  const mode = inputs.mode || inputs.type || "uppercase";
  let result = text;
  if (mode === "lowercase") {
    result = text.toLowerCase();
  } else if (mode === "titlecase") {
    result = text.replace(/\b\w/g, c => c.toUpperCase());
  } else {
    result = text.toUpperCase();
  }
  return { outputData: result, toolOutput: result };
}
export function validate(inputs) { return true; }
