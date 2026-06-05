const fs = require('fs');
const path = require('path');
const win1252 = require('windows-1252');

const extRegex = /[\x80-\xFF\u20AC\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\u017D\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\u017E\u0178]/;

function fixText(txt) {
    const regex = /[\x00-\xFF\u20AC\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\u017D\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\u017E\u0178]+/g;
    return txt.replace(regex, (match) => {
        if (!extRegex.test(match)) return match;
        try {
            const buf = win1252.encode(match);
            const decoded = Buffer.from(buf, 'binary').toString('utf8');
            if (decoded !== match && !decoded.includes('\uFFFD')) {
                return decoded;
            }
        } catch(e) {}
        return match;
    });
}

function fixFile(filePath) {
    const txt = fs.readFileSync(filePath, 'utf8');
    const fixed = fixText(txt);
    if (fixed !== txt) {
        fs.writeFileSync(filePath, fixed, 'utf8');
        console.log('Fixed', filePath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
            walkDir(full);
        } else if (full.endsWith('.tsx') || full.endsWith('.ts') || full.endsWith('.js') || full.endsWith('.md') || full.endsWith('.json')) {
            fixFile(full);
        }
    }
}

walkDir('src');
console.log('Done');
