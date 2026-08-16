export async function execute(inputs) {
  const text = inputs.toolInput || "";
  const urls = text.split("\n").filter(l => l.trim().length > 0);
  
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

  return { toolOutput: `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>` };
}
export function validate(inputs) { return true; }