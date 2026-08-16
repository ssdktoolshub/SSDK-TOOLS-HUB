export async function execute(inputs) {
  const size = inputs.size || 64;
  const color = inputs.color || '#3b82f6';
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="12" y1="8" x2="12" y2="12"></line>
  <line x1="12" y1="16" x2="12.01" y2="16"></line>
</svg>`;

  return {
    toolOutput: svg,
    htmlPreview: `<div style="display:flex;justify-content:center;align-items:center;padding:20px;background:#f9fafb;border-radius:8px;">${svg}</div>`
  };
}

export function validate(inputs) {
  return true;
}
