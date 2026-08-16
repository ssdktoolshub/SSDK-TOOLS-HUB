export async function execute(inputs) {
  const baseSize = inputs.baseSize || 16;
  const ratio = inputs.ratio || 1.25; // Major Third
  
  const css = `
:root {
  --text-xs: ${(baseSize / Math.pow(ratio, 2)).toFixed(2)}px;
  --text-sm: ${(baseSize / ratio).toFixed(2)}px;
  --text-base: ${baseSize}px;
  --text-lg: ${(baseSize * ratio).toFixed(2)}px;
  --text-xl: ${(baseSize * Math.pow(ratio, 2)).toFixed(2)}px;
  --text-2xl: ${(baseSize * Math.pow(ratio, 3)).toFixed(2)}px;
  --text-3xl: ${(baseSize * Math.pow(ratio, 4)).toFixed(2)}px;
}`.trim();

  const htmlPreview = `
<div style="font-family: sans-serif; display: flex; flex-direction: column; gap: 16px;">
  <div style="font-size: ${(baseSize * Math.pow(ratio, 4)).toFixed(2)}px; font-weight: bold;">Heading 1 (3xl)</div>
  <div style="font-size: ${(baseSize * Math.pow(ratio, 3)).toFixed(2)}px; font-weight: bold;">Heading 2 (2xl)</div>
  <div style="font-size: ${(baseSize * Math.pow(ratio, 2)).toFixed(2)}px; font-weight: bold;">Heading 3 (xl)</div>
  <div style="font-size: ${(baseSize * ratio).toFixed(2)}px; font-weight: bold;">Heading 4 (lg)</div>
  <div style="font-size: ${baseSize}px;">Body text (base) - The quick brown fox jumps over the lazy dog.</div>
  <div style="font-size: ${(baseSize / ratio).toFixed(2)}px;">Small text (sm)</div>
  <div style="font-size: ${(baseSize / Math.pow(ratio, 2)).toFixed(2)}px;">Extra small (xs)</div>
</div>`;

  return {
    toolOutput: css,
    htmlPreview: htmlPreview
  };
}

export function validate(inputs) {
  return true;
}
