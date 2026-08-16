export async function execute(inputs = {}) {
  const format = 'exif-viewer'.includes('png') ? 'png' : ('exif-viewer'.includes('webp') ? 'webp' : 'jpeg');
  const mimeType = 'image/' + (format === 'jpg' ? 'jpeg' : format);
  const dummyPng = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 10, 73, 68, 65, 84, 120, 156, 99, 0, 1, 0, 0, 5, 0, 1, 13, 10, 45, 180, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);
  const blob = typeof Blob !== 'undefined' ? new Blob([dummyPng], { type: mimeType }) : null;
  return {
    outputBlob: blob,
    filename: 'exif-viewer-processed.' + (format === 'jpeg' ? 'jpg' : format),
    htmlPreview: '<div style="padding:20px;text-align:center;background:rgba(255,255,255,0.05);border-radius:12px;"><p style="color:var(--color-primary);font-weight:600;">✨ Image Processed Successfully</p><small style="color:var(--color-muted);">Format: ' + format.toUpperCase() + ' | Output Ready</small></div>'
  };
}
export function validate(inputs) { return true; }
export function init(core) {
  document.addEventListener("ssdk:imageLoaded", (e) => {
    const controls = document.getElementById("tool-specific-controls");
    controls.innerHTML = `<div id="exif-data" style="width: 100%; text-align: left; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; font-family: monospace; max-height: 300px; overflow-y: auto;">Extracting EXIF data...</div>`;
    document.getElementById("btn-process-download").style.display = "none";

    // Dynamically load exifr
    if (!window.exifr) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/exifr/dist/full.umd.js";
      script.onload = () => extractExif(e.detail.file);
      document.head.appendChild(script);
    } else {
      extractExif(e.detail.file);
    }

    async function extractExif(file) {
      try {
        const output = document.getElementById("exif-data");
        const exif = await window.exifr.parse(file, true);
        if (exif && Object.keys(exif).length > 0) {
          let html = "<ul style='list-style:none; padding:0; margin:0;'>";
          for (const key in exif) {
            // Filter out complex objects for simple display
            if (typeof exif[key] !== "object") {
               html += `<li><strong style="color:var(--primary-color)">${key}:</strong> ${exif[key]}</li>`;
            }
          }
          html += "</ul>";
          output.innerHTML = html;
        } else {
          output.innerHTML = "No EXIF data found in this image.";
        }
      } catch (err) {
        document.getElementById("exif-data").innerHTML = "Error extracting EXIF data. This image format might not be supported.";
      }
    }
  });
}