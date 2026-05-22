const fs = require('fs');
const path = require('path');

function replaceColorsInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            replaceColorsInDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content.replace(/#3A2E28/gi, '#000000');
            newContent = newContent.replace(/#1C1715/gi, '#000000');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

replaceColorsInDir(path.join(__dirname, 'src'));
console.log('Done!');
