// SSDK Tool Logic - crop-image
export function validate(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  if (!file) return false;
  return true;
}

export async function execute(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  const cropX = parseInt(inputs.cropX) || 0;
  const cropY = parseInt(inputs.cropY) || 0;
  const cropWidth = parseInt(inputs.cropWidth) || 400;
  const cropHeight = parseInt(inputs.cropHeight) || 400;

  if (typeof window !== 'undefined' && file instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Clamp crop values to image dimensions
          const x = Math.max(0, Math.min(cropX, img.width - 1));
          const y = Math.max(0, Math.min(cropY, img.height - 1));
          const w = Math.max(1, Math.min(cropWidth, img.width - x));
          const h = Math.max(1, Math.min(cropHeight, img.height - y));
          
          canvas.width = w;
          canvas.height = h;
          
          ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
          
          canvas.toBlob((blob) => {
            resolve({
              outputBlob: blob,
              filename: 'cropped-' + file.name
            });
          }, file.type || 'image/png');
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }
}
