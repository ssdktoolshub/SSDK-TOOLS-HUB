const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../tools/seo');

const implementations = {
  "meta-tag-generator": `
export async function execute(inputs) {
  const title = inputs.title || "";
  const desc = inputs.desc || "";
  
  if (!title && !desc) return { toolOutput: "Please enter a Title and Description." };

  const html = \`<title>\${title}</title>\\n<meta name="description" content="\${desc}">\`;
  return { toolOutput: html };
}
export function validate(inputs) { return true; }
`,
  "open-graph-generator": `
export async function execute(inputs) {
  const title = inputs.title || "";
  const desc = inputs.desc || "";
  
  const html = \`<!-- Open Graph Meta Tags -->\\n<meta property="og:title" content="\${title}">\\n<meta property="og:description" content="\${desc}">\\n<meta property="og:type" content="website">\`;
  return { toolOutput: html };
}
export function validate(inputs) { return true; }
`,
  "twitter-card-generator": `
export async function execute(inputs) {
  const title = inputs.title || "";
  const desc = inputs.desc || "";
  
  const html = \`<!-- Twitter Card Meta Tags -->\\n<meta name="twitter:card" content="summary_large_image">\\n<meta name="twitter:title" content="\${title}">\\n<meta name="twitter:description" content="\${desc}">\`;
  return { toolOutput: html };
}
export function validate(inputs) { return true; }
`,
  "faq-schema-generator": `
export async function execute(inputs) {
  const q1 = inputs.q1;
  const a1 = inputs.a1;
  const q2 = inputs.q2;
  const a2 = inputs.a2;

  if (!q1 || !a1) return { toolOutput: "Please enter at least Question 1 and Answer 1." };

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": []
  };

  if (q1 && a1) {
    schema.mainEntity.push({
      "@type": "Question",
      "name": q1,
      "acceptedAnswer": { "@type": "Answer", "text": a1 }
    });
  }
  
  if (q2 && a2) {
    schema.mainEntity.push({
      "@type": "Question",
      "name": q2,
      "acceptedAnswer": { "@type": "Answer", "text": a2 }
    });
  }

  return { toolOutput: \`<script type="application/ld+json">\\n\${JSON.stringify(schema, null, 2)}\\n</script>\` };
}
export function validate(inputs) { return true; }
`,
  "breadcrumb-schema-generator": `
export async function execute(inputs) {
  const text = inputs.toolInput || "";
  const urls = text.split("\\n").filter(l => l.trim().length > 0);
  
  if (urls.length === 0) return { toolOutput: "Please enter at least one URL path." };

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": []
  };

  urls.forEach((url, i) => {
    schema.itemListElement.push({
      "@type": "ListItem",
      "position": i + 1,
      "name": "Page " + (i + 1),
      "item": url.trim()
    });
  });

  return { toolOutput: \`<script type="application/ld+json">\\n\${JSON.stringify(schema, null, 2)}\\n</script>\` };
}
export function validate(inputs) { return true; }
`,
  "utm-builder": `
export async function execute(inputs) {
  const url = inputs.url;
  const source = inputs.source;
  const medium = inputs.medium;
  const name = inputs.name;
  
  if (!url || !source) return { toolOutput: "Website URL and Campaign Source are required." };

  try {
    const obj = new URL(url);
    if (source) obj.searchParams.set("utm_source", source);
    if (medium) obj.searchParams.set("utm_medium", medium);
    if (name) obj.searchParams.set("utm_campaign", name);
    
    return { toolOutput: obj.toString() };
  } catch (err) {
    return { toolOutput: "Invalid URL format." };
  }
}
export function validate(inputs) { return true; }
`
};

Object.keys(implementations).forEach(slug => {
  const p = path.join(toolsPath, slug, 'logic.js');
  if (fs.existsSync(path.join(toolsPath, slug))) {
    fs.writeFileSync(p, implementations[slug].trim());
    console.log("Wrote " + p);
  }
});
