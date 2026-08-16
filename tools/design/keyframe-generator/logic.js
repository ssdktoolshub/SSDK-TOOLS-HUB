export async function execute(inputs) {
  const name = inputs.name || 'slide-in';
  
  const css = `
@keyframes ${name} {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}`.trim();

  const htmlPreview = `
<style>
@keyframes ${name}-preview {
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}
</style>
<div style="width: 150px; height: 50px; background-color: #10b981; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-family: sans-serif; animation: ${name}-preview 2s ease-out infinite;">Slide In</div>`;

  return {
    toolOutput: css,
    htmlPreview: htmlPreview
  };
}

export function validate(inputs) {
  return true;
}
