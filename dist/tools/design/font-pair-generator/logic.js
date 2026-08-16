export async function execute(inputs) {
  const pairs = [
    { heading: 'Merriweather', body: 'Open Sans', headingType: 'serif', bodyType: 'sans-serif' },
    { heading: 'Montserrat', body: 'Roboto', headingType: 'sans-serif', bodyType: 'sans-serif' },
    { heading: 'Playfair Display', body: 'Source Sans Pro', headingType: 'serif', bodyType: 'sans-serif' },
    { heading: 'Poppins', body: 'Lora', headingType: 'sans-serif', bodyType: 'serif' }
  ];
  const pair = pairs[Math.floor(Math.random() * pairs.length)];
  
  const css = `
@import url('https://fonts.googleapis.com/css2?family=${pair.heading.replace(' ', '+')}:wght@700&family=${pair.body.replace(' ', '+')}:wght@400&display=swap');

body {
  font-family: '${pair.body}', ${pair.bodyType};
}
h1, h2, h3, h4, h5, h6 {
  font-family: '${pair.heading}', ${pair.headingType};
}`.trim();

  const htmlPreview = `
<style>
@import url('https://fonts.googleapis.com/css2?family=${pair.heading.replace(' ', '+')}:wght@700&family=${pair.body.replace(' ', '+')}:wght@400&display=swap');
</style>
<div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
  <h1 style="font-family: '${pair.heading}', ${pair.headingType}; margin-top: 0;">Beautiful Typography (${pair.heading})</h1>
  <p style="font-family: '${pair.body}', ${pair.bodyType}; line-height: 1.6;">This is a paragraph using ${pair.body}. Good typography pairs distinct typefaces to create hierarchy and readability. The heading uses a ${pair.headingType} font while the body uses a ${pair.bodyType} font.</p>
</div>`;

  return {
    toolOutput: css,
    htmlPreview: htmlPreview
  };
}

export function validate(inputs) {
  return true;
}
