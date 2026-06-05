const win1252 = require('windows-1252');

function fixText(txt) {
    const extRegex = /[\x80-\xFF\u20AC\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\u017D\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\u017E\u0178]/;
    const regex = /([^ \t\r\n]+)/g;
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
const txt = 'CHá»ˆ gửi tên file PDF, KHÃ”NG gửi ná»™i dung Ä‘á»ƒ tránh Connection Reset (100MB+ payload) HoÃ\xA0n';
console.log('Original:', txt);
console.log('Fixed:', fixText(txt));
