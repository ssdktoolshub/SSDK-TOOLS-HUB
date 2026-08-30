// SSDK Tool Logic - Image Converter
export function validate(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  if (!file) return false;
  return true;
}

export async function execute(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  const formatStr = inputs.format || "PNG";
  
  let mimeType = 'image/png';
  let ext = 'png';
  
  if (formatStr === 'JPEG') {
    mimeType = 'image/jpeg';
    ext = 'jpg';
  } else if (formatStr === 'WebP') {
    mimeType = 'image/webp';
    ext = 'webp';
  } else if (formatStr === 'BMP') {
    mimeType = 'image/bmp';
    ext = 'bmp';
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
          
          // If converting to JPEG or BMP (which don't support transparency), fill with white background first
          if (mimeType === 'image/jpeg' || mimeType === 'image/bmp') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error("Conversion failed. Format may not be supported by your browser."));
            
            resolve({
              outputBlob: blob,
              filename: file.name.replace(/\.[^/.]+$/, "") + '-converted.' + ext
            });
          }, mimeType, 1.0); // Use 1.0 quality for lossless formats or max quality
        };
        img.onerror = () => reject(new Error("Failed to load image. Ensure it is a valid image file."));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }
}
