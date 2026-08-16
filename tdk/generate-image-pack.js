const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'registry', 'tools.json');
const manifestsDir = path.join(rootDir, 'registry', 'manifests');

const imageTools = [
  "Image Compressor", "Image Resizer", "Crop Image", "Rotate Image", "Flip Image", "Mirror Image",
  "JPG to PNG", "PNG to JPG", "PNG to WebP", "WebP to PNG", "WebP to JPG", "JPG to WebP",
  "HEIC Converter", "AVIF Converter", "BMP Converter", "TIFF Converter", "SVG Converter",
  "ICO Generator", "Favicon Generator", "Image Watermark", "Image Border", "Rounded Corners",
  "Brightness", "Contrast", "Saturation", "Hue", "Exposure", "Gamma", "Blur", "Sharpen",
  "Denoise", "Grayscale", "Sepia", "Invert Colors", "Image Splitter", "Image Joiner",
  "Collage Maker", "Photo Grid", "Passport Photo Maker", "Social Media Image Resizer",
  "Instagram Post", "Instagram Story", "Instagram Reel Cover", "Facebook Cover", "Facebook Post",
  "YouTube Thumbnail", "YouTube Banner", "LinkedIn Banner", "Twitter Header", "Pinterest Pin",
  "Background Blur", "Background Replace", "Background Remover", "Object Eraser", "OCR Image",
  "QR Reader", "Color Picker", "Color Palette Generator", "Dominant Color Extractor",
  "EXIF Viewer", "EXIF Remover", "Image Metadata Viewer", "Screenshot to PDF", "Image to PDF",
  "GIF Creator", "Animated WebP Creator"
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

try {
  let tools = [];
  if (fs.existsSync(toolsJsonPath)) {
    tools = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));
  }

  let generated = 0;

  for (const toolName of imageTools) {
    const slug = slugify(toolName);
    const catFolder = "image";
    const category = "🖼 Image Tools";

    const manifestPath = path.join(manifestsDir, `${slug}.json`);

    if (!fs.existsSync(manifestPath)) {
      const manifestObj = {
        name: toolName,
        slug: slug,
        category: category,
        description: `Professional, free, and fast ${toolName} online. Works instantly in your browser.`,
        keywords: [toolName.toLowerCase(), "image", "photo", "picture", "edit"],
        inputs: [
          { id: "imageFile", type: "file", label: "Upload Image", accept: "image/*" }
        ],
        outputs: [
          { id: "resultImage", type: "file", label: "Processed Image" }
        ],
        supportedFormats: ["jpg", "jpeg", "png", "webp", "bmp", "gif", "avif"],
        features: [
          "Fast browser-side processing",
          "No image upload to server",
          "Secure and private",
          "High quality output",
          "Multiple formats supported"
        ],
        faq: [
          { question: `How do I use the ${toolName}?`, answer: `Simply drag and drop your image into the upload area, adjust the settings if needed, and download your processed image instantly.` },
          { question: `Is the ${toolName} free?`, answer: `Yes, it is 100% free with no limits or watermarks.` },
          { question: `Are my images secure?`, answer: `Absolutely. All processing happens entirely within your web browser. No images are uploaded to any server.` },
          { question: `Does it work on mobile?`, answer: `Yes, this tool is fully responsive and works perfectly on smartphones, tablets, and desktop computers.` },
          { question: `What image formats are supported?`, answer: `We support JPG, PNG, WebP, BMP, and more, depending on the tool's specific functionality.` }
        ],
        seo: {
          title: `${toolName} | Free Online Tool | SSDK TOOLS HUB`,
          description: `Use the best free online ${toolName}. Fast, secure, and private browser-based image processing.`
        },
        relatedTools: [],
        version: "1.0.0"
      };

      fs.writeFileSync(manifestPath, JSON.stringify(manifestObj, null, 2));

      // Scaffold logic file
      const toolDir = path.join(rootDir, 'tools', catFolder, slug);
      if (!fs.existsSync(toolDir)) {
        fs.mkdirSync(toolDir, { recursive: true });
      }
      const logicPath = path.join(toolDir, 'logic.js');
      if (!fs.existsSync(logicPath)) {
        fs.writeFileSync(logicPath, `// Core Logic for ${toolName}\nexport async function execute(inputs) {\n  return { outputData: "Processing complete." };\n}\nexport function validate(inputs) {\n  return !!inputs.imageFile;\n}\n`);
      }

      // Add to registry if missing
      const exists = tools.find(t => t.id === slug);
      if (!exists) {
        tools.push({
          id: slug,
          name: toolName,
          category: category,
          description: manifestObj.description,
          icon: "🖼",
          url: `pages/tool.html?id=${slug}`,
          type: "js",
          featured: false,
          addedDate: new Date().toISOString().split('T')[0],
          tags: manifestObj.keywords
        });
      }

      generated++;
    }
  }

  // Save updated registry
  fs.writeFileSync(toolsJsonPath, JSON.stringify(tools, null, 2));
  console.log(`✅ Image Pack Generation Complete! Scaffolded ${generated} tools.`);
} catch (e) {
  console.error("❌ Failed:", e.message);
}
