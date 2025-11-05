const fs = require('fs');
const path = require('path');

function removeConsoleLogs(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Remove console statements but preserve logger. calls and console.error for error handling
    const updatedContent = content
        .replace(/^\s*console\.(log|info|warn|debug|trace)\s*\([^)]*\)\s*;?\s*$/gm, '')
        // Remove empty lines that might be left behind
        .replace(/^\s*\n/gm, '');

    if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent);
        console.log(`✅ Cleaned console logs from: ${filePath}`);
    }
} function processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Skip node_modules and other irrelevant directories
            if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
                processDirectory(fullPath);
            }
        } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(item)) {
            removeConsoleLogs(fullPath);
        }
    });
}

console.log('🧹 Removing console.log statements...');
processDirectory('./src');
console.log('✨ Done! Console logs have been removed from src directory.');
