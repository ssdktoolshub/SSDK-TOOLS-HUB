export async function execute(inputs) {
  const width = inputs.width || 200;
  const height = inputs.height || 200;
  const borderWidth = inputs.borderWidth || 2;
  const borderStyle = inputs.borderStyle || 'solid';
  const borderColor = inputs.borderColor || '#3b82f6';
  const borderRadius = inputs.borderRadius || 8;

  const css = `
.border-box {
  width: ${width}px;
  height: ${height}px;
  border: ${borderWidth}px ${borderStyle} ${borderColor};
  border-radius: ${borderRadius}px;
  background-color: #f3f4f6;
}`.trim();

  const htmlPreview = `<div style="width: ${width}px; height: ${height}px; border: ${borderWidth}px ${borderStyle} ${borderColor}; border-radius: ${borderRadius}px; background-color: #f3f4f6;"></div>`;

  return {
    toolOutput: css,
    htmlPreview: htmlPreview
  };
}

export function validate(inputs) {
  return true;
}
