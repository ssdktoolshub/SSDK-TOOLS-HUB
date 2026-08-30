// SSDK Tool Logic - flip-image
export function validate(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  if (!file) return false;
  return true;
}

export async function execute(inputs) {
  const file = inputs.file || inputs.imageFile || inputs.toolInput;
  const flipDirection = inputs.flipDirection || "Horizontal";
  
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
          
          // Translate and scale depending on option selected
          if (flipDirection === "Horizontal") {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          } else if (flipDirection === "Vertical") {
            ctx.translate(0, canvas.height);
            ctx.scale(1, -1);
          } else if (flipDirection === "Both") {
            ctx.translate(canvas.width, canvas.height);
            ctx.scale(-1, -1);
          }
          
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            resolve({
              outputBlob: blob,
              filename: 'flipped-' + file.name
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
