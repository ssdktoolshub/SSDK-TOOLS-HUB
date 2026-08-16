export async function execute(inputs) {
  const minItemWidth = inputs.minItemWidth || 200;
  const gap = inputs.gap || 16;
  
  const css = `
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${minItemWidth}px, 1fr));
  gap: ${gap}px;
}`.trim();

  const divs = Array.from({length: 4}).map((_, i) => `<div style="background:#8b5cf6;color:white;padding:20px;text-align:center;border-radius:4px;">Item ${i+1}</div>`).join('');
  
  const htmlPreview = `
<div style="resize: horizontal; overflow: auto; border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px;">
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${minItemWidth}px, 1fr)); gap: ${gap}px; background: #f3f4f6; padding: ${gap}px; border-radius: 8px;">
    ${divs}
  </div>
</div><p style="font-size:12px;color:#666;">Drag the right edge to resize and see the grid adapt.</p>`;

  return {
    toolOutput: css,
    htmlPreview: htmlPreview
  };
}

export function validate(inputs) {
  return true;
}
