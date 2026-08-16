export async function execute(inputs) {
  const columns = inputs.columns || 3;
  const gap = inputs.gap || 16;
  
  const css = `
.grid-container {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  gap: ${gap}px;
}`.trim();

  const divs = Array.from({length: columns * 2}).map((_, i) => `<div style="background:#3b82f6;color:white;padding:20px;text-align:center;border-radius:4px;">${i+1}</div>`).join('');
  
  const htmlPreview = `<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: ${gap}px; padding: 20px; background: #f3f4f6; border-radius: 8px;">${divs}</div>`;

  return {
    toolOutput: css,
    htmlPreview: htmlPreview
  };
}

export function validate(inputs) {
  return true;
}
