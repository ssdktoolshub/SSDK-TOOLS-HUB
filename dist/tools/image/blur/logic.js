export function validate(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  return !!file;
}
export async function execute(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  // Extract specific filter value from options or use a default
  let filterStr = '';
  if ('blur' === 'blur') filterStr = 'blur(' + (inputs.blur || 5) + 'px)';
  if ('blur' === 'brightness') filterStr = 'brightness(' + (inputs.brightness || 150) + '%)';
  if ('blur' === 'contrast') filterStr = 'contrast(' + (inputs.contrast || 150) + '%)';
  if ('blur' === 'saturation') filterStr = 'saturate(' + (inputs.saturation || 200) + '%)';
  if ('blur' === 'hue') filterStr = 'hue-rotate(' + (inputs.hue || 90) + 'deg)';
  if ('blur' === 'grayscale') filterStr = 'grayscale(' + (inputs.grayscale || 100) + '%)';
  if ('blur' === 'invert-colors') filterStr = 'invert(' + (inputs.invert || 100) + '%)';
  if ('blur' === 'sepia') filterStr = 'sepia(' + (inputs.sepia || 100) + '%)';

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
