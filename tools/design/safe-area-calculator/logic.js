export async function execute(inputs) {
  const top = inputs.top || 'env(safe-area-inset-top)';
  const right = inputs.right || 'env(safe-area-inset-right)';
  const bottom = inputs.bottom || 'env(safe-area-inset-bottom)';
  const left = inputs.left || 'env(safe-area-inset-left)';
  
  const css = `
.safe-area-container {
  padding-top: ${top};
  padding-right: ${right};
  padding-bottom: ${bottom};
  padding-left: ${left};
}`.trim();

  const htmlPreview = `
<div style="width: 300px; height: 500px; border: 8px solid #111827; border-radius: 36px; position: relative; background: #f3f4f6; overflow: hidden; margin: 20px;">
  <!-- Simulated notch -->
  <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 120px; height: 30px; background: #111827; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;"></div>
  
  <!-- Safe area content -->
  <div style="width: 100%; height: 100%; padding-top: 40px; padding-bottom: 20px; box-sizing: border-box;">
    <div style="width: 100%; height: 100%; background: #10b981; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px dashed #047857; box-sizing: border-box;">
      Safe Area Content
    </div>
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
