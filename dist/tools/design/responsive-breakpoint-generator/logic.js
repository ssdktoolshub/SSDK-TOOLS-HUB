export async function execute(inputs) {
  const framework = inputs.framework || 'Tailwind';
  
  const css = `
/* Media Queries for ${framework} style breakpoints */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
`.trim();

  const htmlPreview = `
<div style="font-family: sans-serif; padding: 20px;">
  <h3>Breakpoints</h3>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <div style="display: flex; align-items: center; justify-content: space-between; background: #e0e7ff; padding: 10px; border-radius: 4px;"><span>sm</span> <span>640px</span></div>
    <div style="display: flex; align-items: center; justify-content: space-between; background: #c7d2fe; padding: 10px; border-radius: 4px;"><span>md</span> <span>768px</span></div>
    <div style="display: flex; align-items: center; justify-content: space-between; background: #a5b4fc; padding: 10px; border-radius: 4px;"><span>lg</span> <span>1024px</span></div>
    <div style="display: flex; align-items: center; justify-content: space-between; background: #818cf8; padding: 10px; border-radius: 4px;"><span>xl</span> <span>1280px</span></div>
    <div style="display: flex; align-items: center; justify-content: space-between; background: #6366f1; color: white; padding: 10px; border-radius: 4px;"><span>2xl</span> <span>1536px</span></div>
  </div>
</div>`;

  return {
    toolOutput: css,
    htmlPreview: htmlPreview
  };
}

export function validate(inputs) {
  return true;
}
