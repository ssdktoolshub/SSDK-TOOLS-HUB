const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const toolsRegex = /<section class="tools" id="tools">[\s\S]*?<\/section>/;
const toolsMatch = html.match(toolsRegex);

if (toolsMatch) {
  const toolsContent = toolsMatch[0];
  // Remove it from its original place
  html = html.replace(toolsContent, '');
  
  // Insert it right before popular categories
  const target = '<!-- Popular Categories Discovery Section -->';
  html = html.replace(target, toolsContent + '\n\n' + target);
  
  fs.writeFileSync('index.html', html);
  console.log('Successfully moved tools section');
} else {
  console.log('Tools section not found');
}
