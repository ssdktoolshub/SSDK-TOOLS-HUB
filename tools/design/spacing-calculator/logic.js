export async function execute(inputs) {
  const baseSize = inputs.baseSize || 4; // default 4px grid
  
  const css = `
:root {
  --space-0: 0px;
  --space-1: ${baseSize}px;
  --space-2: ${baseSize * 2}px;
  --space-3: ${baseSize * 3}px;
  --space-4: ${baseSize * 4}px;
  --space-6: ${baseSize * 6}px;
  --space-8: ${baseSize * 8}px;
  --space-12: ${baseSize * 12}px;
  --space-16: ${baseSize * 16}px;
}`.trim();

  const htmlPreview = `
<div style="display: flex; flex-direction: column; gap: 8px; font-family: monospace;">
  ${[1,2,3,4,6,8,12,16].map(mult => `
    <div style="display: flex; align-items: center; gap: 16px;">
      <div style="width: 80px;">space-${mult}</div>
      <div style="width: ${baseSize * mult}px; height: 16px; background-color: #3b82f6;"></div>
      <div>${baseSize * mult}px</div>
    </div>
  `).join('')}
</div>`;

  return {
    toolOutput: css,
    htmlPreview: htmlPreview
  };
}

export function validate(inputs) {
  return true;
}
