export async function execute(inputs) {
  const title = inputs.title || "";
  const desc = inputs.desc || "";
  
  const html = `<!-- Twitter Card Meta Tags -->\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${title}">\n<meta name="twitter:description" content="${desc}">`;
  return { toolOutput: html };
}
export function validate(inputs) { return true; }