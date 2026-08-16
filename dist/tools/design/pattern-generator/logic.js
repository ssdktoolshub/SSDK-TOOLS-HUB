export async function execute(inputs) {
  const size = inputs.size || 40;
  const color1 = inputs.color1 || '#e5e7eb';
  const color2 = inputs.color2 || '#9ca3af';
  
  const css = `
.pattern-bg {
  background-color: ${color1};
  background-image: linear-gradient(45deg, ${color2} 25%, transparent 25%, transparent 75%, ${color2} 75%, ${color2}), 
                    linear-gradient(45deg, ${color2} 25%, transparent 25%, transparent 75%, ${color2} 75%, ${color2});
  background-size: ${size}px ${size}px;
  background-position: 0 0, ${size/2}px ${size/2}px;
}`.trim();

  const htmlPreview = `<div style="width: 100%; height: 200px; background-color: ${color1}; background-image: linear-gradient(45deg, ${color2} 25%, transparent 25%, transparent 75%, ${color2} 75%, ${color2}), linear-gradient(45deg, ${color2} 25%, transparent 25%, transparent 75%, ${color2} 75%, ${color2}); background-size: ${size}px ${size}px; background-position: 0 0, ${size/2}px ${size/2}px; border-radius: 8px;"></div>`;

  return {
    toolOutput: css,
    htmlPreview: htmlPreview
  };
}

export function validate(inputs) {
  return true;
}
