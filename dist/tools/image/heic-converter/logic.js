export function validate(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  return !!file;
}
export async function execute(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  let targetMime = 'image/png';
  let ext = 'png';
  if ('heic-converter'.includes('to-jpg') || 'heic-converter'.includes('to-jpeg')) { targetMime = 'image/jpeg'; ext = 'jpg'; }
  else if ('heic-converter'.includes('to-webp')) { targetMime = 'image/webp'; ext = 'webp'; }
  else if ('heic-converter'.includes('bmp')) { targetMime = 'image/bmp'; ext = 'bmp'; }

  if (typeof window !== 'undefined' && file instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (targetMime === 'image/jpeg' || targetMime === 'image/bmp') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Conversion failed.'));
            resolve({
              outputBlob: blob,
              filename: file.name.replace(/\.[^/.]+$/, '') + '-converted.' + ext
            });
          }, targetMime, 1.0);
        };
        img.onerror = () => reject(new Error('Failed to load image.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}
