export async function execute(inputs) {
  const data = inputs.inputData;
  try {
    // Try to decode first
    const decoded = atob(data);
    // If it decodes to something but it doesn't look like readable text, maybe they wanted to encode.
    // For simplicity, let's just return both in the output, or do a simple heuristic.
    // Let's just return Base64 Encoded version.
    return { outputData: btoa(data) };
  } catch(e) {
    return { outputData: btoa(data) };
  }
}
export function validate(inputs) { return inputs.inputData && inputs.inputData.trim().length > 0; }
