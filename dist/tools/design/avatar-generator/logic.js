export async function execute(inputs) {
  const size = inputs.size || 100;
  const initials = inputs.initials || 'JD';
  const bgColor = inputs.bgColor || '#6366f1';
  const fgColor = inputs.fgColor || '#ffffff';
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bgColor}" rx="${size/2}" ry="${size/2}"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="${fgColor}" font-family="sans-serif" font-size="${size * 0.4}px" font-weight="bold">${initials}</text>
</svg>`;

  return {
    toolOutput: svg,
    htmlPreview: `<div style="display:flex;justify-content:center;align-items:center;padding:20px;">${svg}</div>`
  };
}

export function validate(inputs) {
  return true;
}
