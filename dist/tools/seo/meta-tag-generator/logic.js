export async function execute(inputs) {
  const title = inputs.title || "";
  const desc = inputs.description || inputs.desc || "";
  if (!title && !desc) return { outputData: "Please enter a Title and Description." };
  const html = `<title>${title}</title>\n<meta name="description" content="${desc}">`;
  return { outputData: html };
}
export function validate(inputs) { return true; }
