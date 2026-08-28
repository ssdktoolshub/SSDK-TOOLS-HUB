export async function execute(inputs) {
  const title = inputs.title || inputs.inputData || 'My Website Title';
  const description = inputs.description || 'Website description here';
  const keywords = inputs.keywords || 'seo, meta, tags';
  const author = inputs.author || '';
  const viewport = 'width=device-width, initial-scale=1.0';

  let tags = `<meta name="title" content="${title}">\n`;
  tags += `<meta name="description" content="${description}">\n`;
  tags += `<meta name="keywords" content="${keywords}">\n`;
  if (author) tags += `<meta name="author" content="${author}">\n`;
  tags += `<meta name="viewport" content="${viewport}">`;

  return { toolOutput: tags, outputData: tags };
}

export function validate(inputs) {
  return true;
}
