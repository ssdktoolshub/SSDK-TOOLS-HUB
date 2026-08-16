const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'core/registry/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));

const distDir = path.join(rootDir, 'dist');
const distPagesDir = path.join(distDir, 'pages');

// Create directories if they don't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}
if (!fs.existsSync(distPagesDir)) {
  fs.mkdirSync(distPagesDir, { recursive: true });
}

// Read the base tool-template.html or tool.html
const templatePath = path.join(rootDir, 'pages/tool.html');
let templateHtml = '';
if (fs.existsSync(templatePath)) {
  templateHtml = fs.readFileSync(templatePath, 'utf8');
} else {
  // Try templates/tool-template/index.html
  const fallbackTemplate = path.join(rootDir, 'templates/tool-template/index.html');
  if (fs.existsSync(fallbackTemplate)) {
    templateHtml = fs.readFileSync(fallbackTemplate, 'utf8');
  } else {
    console.error("Could not find a tool template file.");
    process.exit(1);
  }
}

const siteName = "SSDK TOOLS HUB";
const baseUrl = "https://ssdktoolshub.com";

let count = 0;
tools.forEach(tool => {
  let html = templateHtml;
  
  const title = tool.seoTitle || `${tool.name} • Free ${tool.category} - ${siteName}`;
  const description = tool.seoDescription || tool.description;
  const url = `${baseUrl}/pages/tool.html?id=${encodeURIComponent(tool.id)}`;
  const image = tool.ogImage || `${baseUrl}/assets/images/og/${tool.id}.png`;

  // Inject standard meta tags
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
  
  const metaTags = `
    <meta name="description" content="${description}">
    <link rel="canonical" href="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${image}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "${tool.name}",
      "description": "${description}",
      "url": "${url}",
      "applicationCategory": "${tool.category}",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Person",
        "name": "Swarnava Das"
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "${baseUrl}" },
        { "@type": "ListItem", "position": 2, "name": "${tool.category}", "item": "${baseUrl}/#${tool.category}" },
        { "@type": "ListItem", "position": 3, "name": "${tool.name}", "item": "${url}" }
      ]
    }
    </script>
  `;

  // Insert before </head>
  html = html.replace('</head>', `${metaTags}\n</head>`);

  const outPath = path.join(distPagesDir, `${tool.id}.html`);
  fs.writeFileSync(outPath, html);
  count++;
});

console.log(`Pre-rendered ${count} tool pages into dist/pages/`);
