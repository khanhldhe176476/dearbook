/**
 * fix-encoding.js
 * Applies the mojibake fix to all source files in the project.
 * Uses fix-encoding-lib.js for the core logic.
 */

const fs = require('fs');
const path = require('path');
const { fixText } = require('./fix-encoding-lib');

const EXTENSIONS = ['.tsx', '.ts', '.js', '.jsx', '.json', '.md', '.html', '.css'];
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.vite']);

function fixFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const fixed = fixText(original);
  if (fixed !== original) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    return true;
  }
  return false;
}

function walkDir(dir) {
  const fixed = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (SKIP_DIRS.has(item)) continue;
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        fixed.push(...walkDir(full));
      } else if (EXTENSIONS.some(ext => full.toLowerCase().endsWith(ext))) {
        try {
          if (fixFile(full)) fixed.push(full);
        } catch (e) {
          console.error('Error fixing', full, ':', e.message);
        }
      }
    }
  } catch (e) {
    console.error('Error reading dir', dir, ':', e.message);
  }
  return fixed;
}

console.log('Scanning for mojibake...\n');
const fixedFiles = walkDir('src');

// Also check index.html at project root
if (fs.existsSync('index.html')) {
  try {
    if (fixFile('index.html')) fixedFiles.push('index.html');
  } catch (e) {
    console.error('Error fixing index.html:', e.message);
  }
}

if (fixedFiles.length > 0) {
  console.log('Fixed ' + fixedFiles.length + ' file(s):');
  fixedFiles.forEach(f => console.log('  ✓', f));
} else {
  console.log('No files needed fixing.');
}
console.log('\nDone!');
