export async function execute(inputs) {
  const duration = inputs.duration || 2;
  const timingFunction = inputs.timingFunction || 'ease-in-out';
  const iterationCount = inputs.iterationCount || 'infinite';

  const css = `
.animated-box {
  animation: pulse ${duration}s ${timingFunction} ${iterationCount};
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}`.trim();

  const htmlPreview = `
<style>
@keyframes generated-pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
<div style="width: 100px; height: 100px; background-color: #8b5cf6; border-radius: 50%; animation: generated-pulse ${duration}s ${timingFunction} ${iterationCount}; margin: 20px;"></div>`;

  return {
    toolOutput: css,
    htmlPreview: htmlPreview
  };
}

export function validate(inputs) {
  return true;
}
