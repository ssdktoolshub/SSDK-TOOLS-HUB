// SSDK Tool Logic - Image Compressor
export function validate(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  if (!file) return false;
  return true;
}

export async function execute(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  const quality = parseInt(inputs.quality) || 80;
  const formatStr = inputs.format || "JPEG";
  
  let mimeType = 'image/jpeg';
  let ext = 'jpg';
  
  if (formatStr === 'WebP') {
    mimeType = 'image/webp';
    ext = 'webp';
  }

  if (typeof window !== 'undefined' && file instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const qVal = quality / 100;
          
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error("Compression failed"));
            
            const origSize = file.size;
            const newSize = blob.size;
            const savedBytes = origSize - newSize;
            const savedPct = (savedBytes > 0) ? ((savedBytes / origSize) * 100).toFixed(1) : 0;
            
            const origSizeKb = (origSize / 1024).toFixed(1);
            const newSizeKb = (newSize / 1024).toFixed(1);
            
            let statsHtml = `
              <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
                <div style="flex:1; background:rgba(255,255,255,0.05); padding:16px; border-radius:12px; text-align:center; border: 1px solid var(--color-border);">
                  <div style="font-size:var(--font-size-small); color:var(--color-muted);">Original Size</div>
                  <div style="font-size:1.5rem; font-weight:bold; color:var(--color-danger);">${origSizeKb} KB</div>
                </div>
                <div style="flex:1; background:rgba(255,255,255,0.05); padding:16px; border-radius:12px; text-align:center; border: 1px solid var(--color-border);">
                  <div style="font-size:var(--font-size-small); color:var(--color-muted);">Compressed Size</div>
                  <div style="font-size:1.5rem; font-weight:bold; color:var(--color-success);">${newSizeKb} KB</div>
                </div>
                <div style="flex:1; background:rgba(255,255,255,0.05); padding:16px; border-radius:12px; text-align:center; border: 1px solid var(--color-border);">
                  <div style="font-size:var(--font-size-small); color:var(--color-muted);">Saved</div>
                  <div style="font-size:1.5rem; font-weight:bold; color:var(--color-primary);">${savedBytes > 0 ? savedPct + '%' : '0%'}</div>
                </div>
              </div>
            `;
            
            resolve({
              outputBlob: blob,
              filename: 'compressed-' + file.name.replace(/\.[^/.]+$/, "") + '.' + ext,
              htmlPreview: statsHtml
            });
          }, mimeType, qVal);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }
}