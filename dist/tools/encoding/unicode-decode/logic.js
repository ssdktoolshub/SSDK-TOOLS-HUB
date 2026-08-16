export async function execute(inputs) {
  const text = inputs.toolInput || "";
  try {
    const decoded = text.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => String.fromCharCode(parseInt(grp, 16)));
    return { toolOutput: decoded };
  } catch (e) {
    return { toolOutput: "Invalid Unicode encoding." };
  }
}

export function validate(inputs) {
  return true;
}
