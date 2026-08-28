import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('logic.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('tools');
let passed = 0;
let failed = 0;
let errors = [];

async function testAll() {
  for (const f of files) {
    try {
      const fileUrl = 'file:///' + path.resolve(f).replace(/\\/g, '/');
      const mod = await import(fileUrl);
      if (typeof mod.execute !== 'function') {
        failed++;
        errors.push({ file: f, error: 'Missing execute function' });
      } else {
        passed++;
      }
    } catch (err) {
      failed++;
      errors.push({ file: f, error: err.message });
    }
  }
  console.log(`Passed: ${passed}, Failed: ${failed}`);
  if (errors.length > 0) {
    console.log('Sample errors:', errors.slice(0, 20));
  }
}

testAll();
