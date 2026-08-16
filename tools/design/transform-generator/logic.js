export async function execute(inputs) {
  const width = inputs.width || 150;
  const height = inputs.height || 150;
  const rotate = inputs.rotate || 15;
  const scale = inputs.scale || 1.1;
  const translateX = inputs.translateX || 10;
  const translateY = inputs.translateY || 10;

  const transformString = `rotate(${rotate}deg) scale(${scale}) translate(${translateX}px, ${translateY}px)`;
  
  const css = `
.transform-box {
  width: ${width}px;
  height: ${height}px;
  transform: ${transformString};
}`.trim();

  const htmlPreview = `<div style="width: ${width}px; height: ${height}px; transform: ${transformString}; background-color: #ef4444; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-family: sans-serif;">Transform</div>`;

  return {
    toolOutput: css,
    htmlPreview: htmlPreview
  };
}

export function validate(inputs) {
  return true;
}
