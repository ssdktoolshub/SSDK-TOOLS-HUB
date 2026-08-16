const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

console.log("Starting Enterprise Scaffold...");

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function ensureFile(filePath, content) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
    }
}

// 1. Core Folders
const coreFolders = ["config", "constants", "registry", "manifest", "search", "discovery", "analytics", "plugins", "providers", "storage", "theme", "i18n", "utils", "events", "logger", "cache", "seo"];
coreFolders.forEach(folder => ensureDir(path.join(root, 'core', folder)));
console.log("✅ Core Folders created.");

// 2. Components Folders
const compFolders = ["Header", "Footer", "Sidebar", "Hero", "ToolCard", "CategoryCard", "SearchBox", "Upload", "Download", "Result", "FAQ", "RelatedTools", "Share", "Copy", "Toast", "Modal", "Dialog", "Skeleton", "Loading", "Error", "Empty", "Pagination"];
compFolders.forEach(folder => ensureDir(path.join(root, 'components', folder)));
console.log("✅ Components Folders created.");

// 5. Assets Folders
const assetFolders = ["css", "js", "icons", "images", "fonts", "animations"];
assetFolders.forEach(folder => ensureDir(path.join(root, 'assets', folder)));
console.log("✅ Assets Folders created.");

// 6. Backend Folders
const backendFolders = ["services", "repositories", "middleware", "tasks", "workers", "events", "plugins"];
backendFolders.forEach(folder => ensureDir(path.join(root, 'backend', folder)));
console.log("✅ Backend Folders created.");

// 7. Documentation Folders and Files
ensureDir(path.join(root, 'docs'));
const docFiles = ["Architecture.md", "API.md", "Folder_Structure.md", "Registry.md", "Tool_Template.md", "Deployment.md", "Developer_Guide.md", "Contributing.md"];
docFiles.forEach(file => ensureFile(path.join(root, 'docs', file), `# ${file}\n`));
console.log("✅ Documentation created.");

// 8. Tests Folders
const testFolders = ["unit", "integration", "e2e", "performance"];
testFolders.forEach(folder => ensureDir(path.join(root, 'tests', folder)));
console.log("✅ Tests Folders created.");

// 9. CI/CD Folders and Files
ensureDir(path.join(root, '.github', 'workflows'));
const workflowFiles = ["test.yml", "lint.yml", "build.yml", "deploy.yml"];
workflowFiles.forEach(file => ensureFile(path.join(root, '.github', 'workflows', file), `name: ${file}\n`));
console.log("✅ CI/CD Workflows created.");

// 10. Production Root Files
const prodFiles = [".env.example", "Dockerfile", "docker-compose.yml", "LICENSE", "CHANGELOG.md", "CONTRIBUTING.md", "SECURITY.md", "ROADMAP.md"];
prodFiles.forEach(file => ensureFile(path.join(root, file), `# ${file}\n`));
console.log("✅ Production Files created.");

console.log("Scaffolding Complete!");
