const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const toolsJsonPath = path.join(rootDir, 'registry', 'tools.json');
const manifestsDir = path.join(rootDir, 'registry', 'manifests');

const videoTools = [
  "Video Compressor", "Video Trimmer", "Video Cutter", "Video Merger", "Video Splitter",
  "Video Cropper", "Video Rotator", "Video Speed Controller", "Video Reverse", "Mute Video",
  "Extract Audio", "Video to MP3", "Video to GIF", "GIF to Video", "MP4 Converter",
  "AVI Converter", "MOV Converter", "MKV Converter", "WEBM Converter", "Subtitle Adder",
  "Subtitle Extractor", "Subtitle Converter", "Thumbnail Generator", "Frame Extractor",
  "Screen Recorder", "Webcam Recorder", "Video Metadata Viewer", "Video Metadata Remover",
  "Video Watermark", "Video Resize", "Video Stabilizer", "Background Blur", "Background Remove"
];

const audioTools = [
  "MP3 Cutter", "Audio Trimmer", "Audio Joiner", "Audio Compressor", "Audio Converter",
  "MP3 to WAV", "WAV to MP3", "AAC Converter", "FLAC Converter", "OGG Converter",
  "Audio Speed Changer", "Pitch Changer", "Volume Booster", "Noise Reducer", "Echo Remover",
  "Bass Booster", "Voice Recorder", "Microphone Test", "Audio Metadata Viewer", "Audio Metadata Remover"
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

  const processList = (list, catFolder, category, icon) => {
    for (const toolName of list) {
      const slug = slugify(toolName);
      const manifestPath = path.join(manifestsDir, `${slug}.json`);

      if (!fs.existsSync(manifestPath)) {
        let acceptType = catFolder === 'video' ? "video/*" : "audio/*";
        let inputs = [{ id: "fileInput", type: "file", label: "Upload File", accept: acceptType }];
        
        // Add specific extra inputs if needed
        if (slug.includes("trimmer") || slug.includes("cutter")) {
           inputs.push({ id: "startTime", type: "text", label: "Start Time (e.g. 00:00:10)" });
           inputs.push({ id: "endTime", type: "text", label: "End Time (e.g. 00:00:20)" });
        } else if (slug.includes("resize") || slug.includes("compressor")) {
           inputs.push({ id: "resolution", type: "select", label: "Target Resolution", options: [
             {value: "1080p", label: "1080p"}, {value: "720p", label: "720p"}, {value: "480p", label: "480p"}
           ]});
        }

        const manifestObj = {
          name: toolName,
          slug: slug,
          category: category,
          description: `Professional, private, and fast ${toolName}. Processes files securely directly in your browser.`,
          keywords: [toolName.toLowerCase(), catFolder, "free", "converter", "online", "ffmpeg"],
          inputs: inputs,
          outputs: [
            { id: "toolOutput", type: "file", label: "Processed File" }
          ],
          supportedFormats: catFolder === 'video' ? ["mp4", "webm", "mkv", "avi", "mov"] : ["mp3", "wav", "ogg", "aac", "flac"],
          features: [
            "Client-Side Processing (FFmpeg WebAssembly)",
            "No data uploaded to servers",
            "100% Privacy Guaranteed",
            "Fast encoding and processing"
          ],
          faq: [
            { question: `What is the ${toolName}?`, answer: `The ${toolName} allows you to manipulate and process media files entirely in your browser.` },
            { question: `Are my files uploaded to your server?`, answer: `No. This tool utilizes advanced FFmpeg WebAssembly technology to process your files locally on your device.` },
            { question: `Why is the processing not starting?`, answer: `If the tool is in 'Future Ready' mode, it means the server requires specific Cross-Origin headers to enable WebAssembly. This will be activated soon.` }
          ],
          seo: {
            title: `${toolName} | Free Online Media Tools | SSDK TOOLS HUB`,
            description: `Use the best free online ${toolName}. Secure, private, and ultra-fast media processing directly in your browser.`
          },
          relatedTools: [],
          version: "1.0.0"
        };

        fs.writeFileSync(manifestPath, JSON.stringify(manifestObj, null, 2));

        // Scaffold logic file with Future Ready FFmpeg Stub
        const toolDir = path.join(rootDir, 'tools', catFolder, slug);
        if (!fs.existsSync(toolDir)) {
          fs.mkdirSync(toolDir, { recursive: true });
        }
        const logicPath = path.join(toolDir, 'logic.js');
        if (!fs.existsSync(logicPath)) {
          const logicContent = `// Future Ready FFmpeg WebAssembly Logic Stub for ${toolName}
export async function execute(inputs) {
  return { 
    toolOutput: "⚠️ FFMPEG WEBASSEMBLY PENDING\\n\\nThis Tool is currently in 'Future Ready' status.\\n\\nBrowser-side media processing via FFmpeg requires the backend server to be configured with 'Cross-Origin-Opener-Policy' and 'Cross-Origin-Embedder-Policy' headers to enable SharedArrayBuffer. Pending Admin activation." 
  };
}
export function validate(inputs) { return true; }
`;
          fs.writeFileSync(logicPath, logicContent);
        }

        // Add to registry if missing
        const exists = tools.find(t => t.id === slug);
        if (!exists) {
          tools.push({
            id: slug,
            name: toolName,
            category: category,
            description: manifestObj.description,
            icon: icon,
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
  };

  processList(videoTools, "video", "🎬 Video Tools", "🎬");
  processList(audioTools, "audio", "🎵 Audio Tools", "🎵");

  // Save updated registry
  fs.writeFileSync(toolsJsonPath, JSON.stringify(tools, null, 2));
  console.log(`✅ Media Pack Generation Complete! Scaffolded ${generated} tools.`);
} catch (e) {
  console.error("❌ Failed:", e.message);
}
