const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const componentsPath = path.join(root, 'components');

const compFolders = ["Header", "Footer", "Sidebar", "Hero", "ToolCard", "CategoryCard", "SearchBox", "Upload", "Download", "Result", "FAQ", "RelatedTools", "Share", "Copy", "Toast", "Modal", "Dialog", "Skeleton", "Loading", "Error", "Empty", "Pagination"];

compFolders.forEach(folder => {
  const dirPath = path.join(componentsPath, folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const indexPath = path.join(dirPath, 'index.js');
  const cssPath = path.join(dirPath, 'style.css');
  
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, `export class ${folder}Component {\n  render() {\n    return '<div class="${folder.toLowerCase()}-component"></div>';\n  }\n}\n`);
  }
  
  if (!fs.existsSync(cssPath)) {
    fs.writeFileSync(cssPath, `.${folder.toLowerCase()}-component {\n  /* Styles for ${folder} */\n}\n`);
  }
});

console.log("✅ Component index and style files generated.");
