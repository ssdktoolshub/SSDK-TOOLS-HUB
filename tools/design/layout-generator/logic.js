export async function execute(inputs) {
  const sidebarWidth = inputs.sidebarWidth || 250;
  const headerHeight = inputs.headerHeight || 60;
  
  const css = `
.layout {
  display: grid;
  grid-template-columns: ${sidebarWidth}px 1fr;
  grid-template-rows: ${headerHeight}px 1fr;
  min-height: 100vh;
}
.header { grid-column: 1 / -1; }
.sidebar { grid-column: 1; grid-row: 2; }
.main { grid-column: 2; grid-row: 2; }`.trim();

  const htmlPreview = `
<div style="display: grid; grid-template-columns: ${sidebarWidth}px 1fr; grid-template-rows: ${headerHeight}px 300px; width: 100%; border: 1px solid #ccc; border-radius: 8px; overflow: hidden; font-family: sans-serif; text-align: center;">
  <div style="grid-column: 1 / -1; background: #1f2937; color: white; display: flex; align-items: center; justify-content: center;">Header</div>
  <div style="grid-column: 1; grid-row: 2; background: #374151; color: white; display: flex; align-items: center; justify-content: center;">Sidebar</div>
  <div style="grid-column: 2; grid-row: 2; background: #f3f4f6; color: #111827; display: flex; align-items: center; justify-content: center;">Main Content</div>
</div>`;

  return {
    toolOutput: css,
    htmlPreview: htmlPreview
  };
}

export function validate(inputs) {
  return true;
}
