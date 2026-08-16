export async function execute(inputs) {
  const width = inputs.width || 300;
  const height = inputs.height || 200;
  const blur = inputs.blur || 0;
  const brightness = inputs.brightness || 100;
  const contrast = inputs.contrast || 100;
  const grayscale = inputs.grayscale || 0;

  const filterString = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)`;
  
  const css = `
.filter-preview {
  width: ${width}px;
  height: ${height}px;
  filter: ${filterString};
}`.trim();

  const htmlPreview = `<div style="width: ${width}px; height: ${height}px; filter: ${filterString}; background-image: url('https://picsum.photos/300/200'); background-size: cover; background-position: center; border-radius: 8px;"></div>`;

  return {
    toolOutput: css,
    htmlPreview: htmlPreview
  };
}

export function validate(inputs) {
  return true;
}
