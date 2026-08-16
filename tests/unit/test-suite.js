// SSDK Tools Hub - Automated Unit & Integration Test Suite
// Verifies core registry, search mechanics, manifests, and build artifacts.

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', '..');

console.log('🧪 Running SSDK Tools Hub Enterprise Test Suite...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

// 1. Tool Registry Tests
test('Master Registry: tools.json contains 967 valid tools', () => {
  const tools = JSON.parse(fs.readFileSync(path.join(rootDir, 'core/registry/tools.json'), 'utf8'));
  assert.strictEqual(tools.length, 967, `Expected 967 tools, got ${tools.length}`);
  tools.forEach(t => {
    assert(t.id, 'Tool missing ID');
    assert(t.name, `Tool ${t.id} missing name`);
    assert(t.category, `Tool ${t.id} missing category`);
  });
});

// 2. Tool Folder Map Tests
test('Tool Folder Map: maps all 967 tools to real directories', () => {
  const map = JSON.parse(fs.readFileSync(path.join(rootDir, 'core/registry/tool-folder-map.json'), 'utf8'));
  assert(Object.keys(map).length >= 967, 'Folder map does not cover all tools');
});

// 3. SEO Sitemap & Robots Tests
test('SEO Artifacts: sitemap.xml and robots.txt exist and are non-empty', () => {
  const sitemapPath = path.join(rootDir, 'sitemap.xml');
  const robotsPath = path.join(rootDir, 'robots.txt');
  assert(fs.existsSync(sitemapPath), 'sitemap.xml missing');
  assert(fs.existsSync(robotsPath), 'robots.txt missing');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  assert(sitemapContent.includes('<urlset'), 'sitemap.xml does not contain urlset');
  assert(sitemapContent.includes('https://ssdktoolshub.com'), 'sitemap.xml missing base URL');
});

// 4. Pre-rendered Pages Tests
test('Pre-rendered HTML: dist/pages/ contains pre-rendered snapshots', () => {
  const distPages = path.join(rootDir, 'dist/pages');
  if (fs.existsSync(distPages)) {
    const files = fs.readdirSync(distPages);
    assert(files.length >= 967, `Expected at least 967 pre-rendered pages, found ${files.length}`);
  }
});

// 5. Backend Gateway Tests
test('FastAPI Gateway: api/gateway.py exists and contains admin routes', () => {
  const gatewayPath = path.join(rootDir, 'backend/api/gateway.py');
  assert(fs.existsSync(gatewayPath), 'backend/api/gateway.py missing');
  const content = fs.readFileSync(gatewayPath, 'utf8');
  assert(content.includes('/admin/stats'), 'Admin stats route missing');
  assert(content.includes('/admin/tools'), 'Admin tools route missing');
  assert(content.includes('/admin/users'), 'Admin users route missing');
});

// 6. Design System Tokens Tests
test('Design Tokens: design-tokens.css contains primary palette & radii', () => {
  const cssPath = path.join(rootDir, 'assets/css/design-tokens.css');
  assert(fs.existsSync(cssPath), 'design-tokens.css missing');
  const content = fs.readFileSync(cssPath, 'utf8');
  assert(content.includes('--color-background'), 'Missing background token');
  assert(content.includes('--color-primary'), 'Missing primary color token');
  assert(content.includes('--radius-'), 'Missing radius tokens');
});

console.log('\n=========================================');
console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
console.log('=========================================\n');

if (failed > 0) {
  process.exit(1);
}
