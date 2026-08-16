export async function execute(inputs) {
  const title = inputs.title || "";
  const desc = inputs.desc || "";
  
  const html = `<!-- Open Graph Meta Tags -->\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${desc}">\n<meta property="og:type" content="website">`;
  return { toolOutput: html };
}
export function validate(inputs) { return true; }