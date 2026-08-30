export function validate(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  return !!file;
}
export async function execute(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  // Extract specific filter value from options or use a default
  let filterStr = '';
  if ('saturation' === 'blur') filterStr = 'blur(' + (inputs.blur || 5) + 'px)';
  if ('saturation' === 'brightness') filterStr = 'brightness(' + (inputs.brightness || 150) + '%)';
  if ('saturation' === 'contrast') filterStr = 'contrast(' + (inputs.contrast || 150) + '%)';
  if ('saturation' === 'saturation') filterStr = 'saturate(' + (inputs.saturation || 200) + '%)';
  if ('saturation' === 'hue') filterStr = 'hue-rotate(' + (inputs.hue || 90) + 'deg)';
  if ('saturation' === 'grayscale') filterStr = 'grayscale(' + (inputs.grayscale || 100) + '%)';
  if ('saturation' === 'invert-colors') filterStr = 'invert(' + (inputs.invert || 100) + '%)';
  if ('saturation' === 'sepia') filterStr = 'sepia(' + (inputs.sepia || 100) + '%)';

  if (typeof window !== 'undefined' && file instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          ctx.filter = filterStr;
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Filter application failed.'));
            resolve({
              outputBlob: blob,
              filename: file.name.replace(/\.[^/.]+$/, '') + '-filtered.png'
            });
          }, 'image/png');
        };
        img.onerror = () => reject(new Error('Failed to load image.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}
