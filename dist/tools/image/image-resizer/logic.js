// SSDK Tool Logic - Image Resizer
export function validate(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  if (!file) return false;
  return true;
}

export async function execute(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  const targetWidth = parseInt(inputs.width);
  const targetHeight = parseInt(inputs.height);
  const maintainAspectRatio = inputs.maintainAspectRatio !== false; // Default true
  
  if (typeof window !== 'undefined' && file instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let newWidth = targetWidth || img.width;
          let newHeight = targetHeight || img.height;
          
          if (maintainAspectRatio && (targetWidth || targetHeight)) {
            const aspect = img.width / img.height;
            if (targetWidth && !targetHeight) {
              newHeight = Math.round(targetWidth / aspect);
            } else if (targetHeight && !targetWidth) {
              newWidth = Math.round(targetHeight * aspect);
            } else if (targetWidth && targetHeight) {
              // Fit inside the bounding box
              if (newWidth / aspect <= newHeight) {
                newHeight = Math.round(newWidth / aspect);
              } else {
                newWidth = Math.round(newHeight * aspect);
              }
            }
          }
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          let format = file.type || 'image/png';
          let ext = file.name.split('.').pop();
          
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error("Resizing failed."));
            
            let statsHtml = `
              <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
                <div style="flex:1; background:rgba(255,255,255,0.05); padding:16px; border-radius:12px; text-align:center; border: 1px solid var(--color-border);">
                  <div style="font-size:var(--font-size-small); color:var(--color-muted);">Original Dimensions</div>
                  <div style="font-size:1.2rem; font-weight:bold; color:var(--color-primary);">${img.width} × ${img.height}</div>
                </div>
                <div style="flex:1; background:rgba(255,255,255,0.05); padding:16px; border-radius:12px; text-align:center; border: 1px solid var(--color-border);">
                  <div style="font-size:var(--font-size-small); color:var(--color-muted);">New Dimensions</div>
                  <div style="font-size:1.2rem; font-weight:bold; color:var(--color-success);">${newWidth} × ${newHeight}</div>
                </div>
              </div>
            `;
            
            resolve({
              outputBlob: blob,
              filename: file.name.replace(/\.[^/.]+$/, "") + '-resized.' + ext,
              htmlPreview: statsHtml
            });
          }, format, 1.0);
        };
        img.onerror = () => reject(new Error("Failed to load image."));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }
}