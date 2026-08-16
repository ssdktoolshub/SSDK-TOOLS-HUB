const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const assetsDir = path.join(root, 'assets');
const imgDir = path.join(assetsDir, 'images');
const cssDir = path.join(assetsDir, 'css');
const jsDir = path.join(assetsDir, 'js');

const files = fs.readdirSync(assetsDir);
files.forEach(file => {
  const fullPath = path.join(assetsDir, file);
  if (fs.statSync(fullPath).isFile()) {
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.ico') || file.endsWith('.svg')) {
      fs.renameSync(fullPath, path.join(imgDir, file));
    } else if (file.endsWith('.css')) {
      fs.renameSync(fullPath, path.join(cssDir, file));
    } else if (file.endsWith('.js')) {
      fs.renameSync(fullPath, path.join(jsDir, file));
    }
  }
});
console.log("✅ Assets organized.");
