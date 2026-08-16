const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'core/registry/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));

const baseUrl = 'https://ssdktoolshub.com';

function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Add homepage
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // Add individual tools
  tools.forEach(tool => {
    // If tool has an addedDate, use it, otherwise fallback to currentDate
    let lastMod = currentDate;
    if (tool.addedDate) {
      try {
        const d = new Date(tool.addedDate);
        if (!isNaN(d.getTime())) {
          lastMod = d.toISOString().split('T')[0];
        }
      } catch (e) {
        // ignore
      }
    }

    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/pages/tool.html?id=${encodeURIComponent(tool.id)}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  const sitemapPath = path.join(rootDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml);
  console.log(`sitemap.xml generated with ${tools.length + 1} URLs at ${sitemapPath}`);
}

function generateRobotsTxt() {
  let txt = `User-agent: *\n`;
  txt += `Allow: /\n`;
  txt += `Disallow: /admin/\n`;
  txt += `Disallow: /backend/\n`;
  txt += `Sitemap: ${baseUrl}/sitemap.xml\n`;

  const robotsPath = path.join(rootDir, 'robots.txt');
  fs.writeFileSync(robotsPath, txt);
  console.log(`robots.txt generated at ${robotsPath}`);
}

generateSitemap();
generateRobotsTxt();
