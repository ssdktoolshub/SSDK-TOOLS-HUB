// SSDK SEO Engine - Manages dynamic page titles, descriptions, metadata, JSON-LD crawler schemas, hreflang tags, and XML sitemaps.

export class SEOEngine {
  constructor() {
    this.core = null;
  }

  async init(core) {
    this.core = core;
    console.log("[SEOEngine] Enterprise Technical SEO Engine ready.");
  }

  /**
   * Enterprise Metadata & Schema Injector
   */
  updateMetadata(tool) {
    if (!tool) return;

    const url = window.location.href;
    const siteName = "SSDK TOOLS HUB";
    const author = tool.author || "Swarnava Das";
    
    // 1. Page Title & Meta Description
    document.title = tool.seoTitle || `${tool.name} • Free ${tool.category} - ${siteName}`;
    this.setStandardMeta("description", tool.seoDescription || tool.description);
    
    // 2. Keywords & Core Tagging
    if (tool.keywords && Array.isArray(tool.keywords)) {
      this.setStandardMeta("keywords", tool.keywords.join(", "));
    }
    this.setStandardMeta("author", author);
    this.setStandardMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    this.setStandardMeta("viewport", "width=device-width, initial-scale=1.0");
    this.setStandardMeta("application-name", siteName);
    this.setStandardMeta("theme-color", "#7C3AED");

    // 3. Canonical URL
    this.setCanonicalUrl(url);

    // 4. Hreflang Tags (Multi-Language SEO)
    this.injectHreflangTags(url);

    // 5. Open Graph Previews
    this.setOGMeta("og:title", tool.seoTitle || `${tool.name} • ${siteName}`);
    this.setOGMeta("og:description", tool.seoDescription || tool.description);
    this.setOGMeta("og:type", "website");
    this.setOGMeta("og:url", url);
    this.setOGMeta("og:site_name", siteName);
    this.setOGMeta("og:locale", "en_US");
    if (tool.ogImage) this.setOGMeta("og:image", tool.ogImage);

    // 6. Twitter Card Metadata
    this.setTwitterMeta("twitter:card", "summary_large_image");
    this.setTwitterMeta("twitter:title", tool.seoTitle || `${tool.name} • ${siteName}`);
    this.setTwitterMeta("twitter:description", tool.seoDescription || tool.description);
    this.setTwitterMeta("twitter:site", "@SSDKTools");
    if (tool.ogImage) this.setTwitterMeta("twitter:image", tool.ogImage);

    // 7. Inject Multi-Schema JSON-LD Structured Data
    this.injectEnterpriseJSONLD(tool, url, author);
  }

  setStandardMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.content = content;
  }

  setOGMeta(property, content) {
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("property", property);
      document.head.appendChild(el);
    }
    el.content = content;
  }

  setTwitterMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.content = content;
  }

  setCanonicalUrl(url) {
    let el = document.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", "canonical");
      document.head.appendChild(el);
    }
    el.href = url.split("?")[0].split("#")[0];
  }

  injectHreflangTags(baseUrl) {
    document.querySelectorAll(".ssdk-hreflang").forEach(el => el.remove());
    const cleanUrl = baseUrl.split("?")[0].split("#")[0];
    const langs = [
      { code: "en", url: cleanUrl },
      { code: "bn", url: `${cleanUrl}?lang=bn` },
      { code: "hi", url: `${cleanUrl}?lang=hi` },
      { code: "x-default", url: cleanUrl }
    ];

    langs.forEach(l => {
      const link = document.createElement("link");
      link.className = "ssdk-hreflang";
      link.rel = "alternate";
      link.hreflang = l.code;
      link.href = l.url;
      document.head.appendChild(link);
    });
  }

  injectEnterpriseJSONLD(tool, url, author) {
    document.querySelectorAll(".ssdk-jsonld-schema").forEach(el => el.remove());
    const schemas = [];

    // 1. SoftwareApplication / WebApplication Schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": tool.name,
      "description": tool.seoDescription || tool.description,
      "url": url,
      "applicationCategory": tool.category || "DeveloperApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "author": {
        "@type": "Organization",
        "name": author,
        "url": window.location.origin
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": tool.rating || "4.9",
        "ratingCount": tool.reviewCount || "128",
        "bestRating": "5",
        "worstRating": "1"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "softwareVersion": tool.version || "2.0.0",
      "dateModified": tool.lastUpdated || new Date().toISOString().split("T")[0]
    });

    // 2. BreadcrumbList Schema
    if (tool.category) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": window.location.origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": tool.category,
            "item": `${window.location.origin}/index.html#tools`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": tool.name,
            "item": url
          }
        ]
      });
    }

    // 3. FAQPage Schema (If tool has FAQs)
    if (tool.faq && Array.isArray(tool.faq) && tool.faq.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": tool.faq.map(item => ({
          "@type": "Question",
          "name": item.q || item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a || item.answer
          }
        }))
      });
    }

    // 4. HowTo Schema (Step-by-Step Guide)
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `How to use ${tool.name}`,
      "description": `Step-by-step instructions on how to use ${tool.name} online for free.`,
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Enter Input Payload",
          "text": "Input your data, text, or file into the designated input control area."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Configure Options",
          "text": "Adjust any available tool parameters or settings."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Execute Action",
          "text": "Click the Run Action button to process your data."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Export Result",
          "text": "Copy or download the output result directly to your device."
        }
      ]
    });

    // 5. WebSite & SearchAction Schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "SSDK TOOLS HUB",
      "url": window.location.origin,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/index.html?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    });

    // Inject all schemas into <head>
    schemas.forEach(schemaObj => {
      const script = document.createElement("script");
      script.className = "ssdk-jsonld-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schemaObj, null, 2);
      document.head.appendChild(script);
    });
  }

  /**
   * Generates dynamic XML Sitemaps suite.
   */
  async generateSitemapXML() {
    const config = this.core.getEngine("config");
    const tools = await config.getTools();
    const domain = window.location.origin;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    xml += `  <url>\n    <loc>${domain}/index.html</loc>\n    <priority>1.00</priority>\n  </url>\n`;

    const pages = ["about.html", "contact.html", "faq.html", "login.html", "privacy.html", "terms.html"];
    pages.forEach(p => {
      xml += `  <url>\n    <loc>${domain}/pages/${p}</loc>\n    <priority>0.60</priority>\n  </url>\n`;
    });

    tools.forEach(t => {
      xml += `  <url>\n    <loc>${domain}/${t.url}</loc>\n    <priority>0.80</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
  }

  /**
   * Generates dynamic robots.txt content.
   */
  generateRobotsTxt() {
    const domain = window.location.origin;
    return `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /scratch/\nSitemap: ${domain}/sitemap.xml\n`;
  }
}
