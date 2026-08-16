export async function execute(inputs) {
  const text = inputs.text || 'The quick brown fox jumps over the lazy dog';
  const fontName = inputs.fontName || 'Inter';
  const weight = inputs.weight || 400;
  
  const css = `
@import url('https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@${weight}&display=swap');

.font-preview {
  font-family: '${fontName}', sans-serif;
  font-weight: ${weight};
}`.trim();

  const htmlPreview = `
<style>
@import url('https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@${weight}&display=swap');
</style>
<div style="padding: 20px; font-family: '${fontName}', sans-serif; font-weight: ${weight};">
  <div style="font-size: 32px; margin-bottom: 16px;">${text}</div>
  <div style="font-size: 24px; margin-bottom: 16px;">${text}</div>
  <div style="font-size: 16px;">${text}</div>
</div>`;

  return {
    toolOutput: css,
    htmlPreview: htmlPreview
  };
}

export function validate(inputs) {
  return true;
}
