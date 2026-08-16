// Core Logic for Robots.txt Generator
export async function execute(inputs) {
  const url = inputs.inputData || "https://example.com";
  return { outputData: `User-agent: *\nDisallow: /admin/\nSitemap: ${url}/sitemap.xml` };
}
export function validate(inputs) { return true; }
