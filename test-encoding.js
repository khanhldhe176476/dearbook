// Validate fix-encoding-lib.js using Buffer-constructed test cases
const { fixText } = require('./fix-encoding-lib');

function make(hexPairs) {
  return hexPairs.map(h => String.fromCodePoint(parseInt(h, 16))).join('');
}

// Build mojibake strings directly from their Unicode code points
// (as they would appear in a JS string after reading the file as UTF-8)
const tests = [
  // "đủ" mojibake: Ä (00C4) + ' (2018) + already-fixed ủ (1EE7)
  [make(['00C4','2018']) + '\u1EE7', '\u0111\u1EE7'],          // Ä'ủ → đủ
  // "đã" mojibake: Ä (00C4) + ' (2018) + ã (00E3)
  [make(['00C4','2018','00E3']), '\u0111\u00E3'],               // Ä'ã → đã (ã here is still mojibake for 'a') 
  // Pure mojibake "Giao hàng": Giao h + Ã(00C3) + (non-breaking space A0)
  ['Giao h\u00C3\u00A0ng', 'Giao h\u00E0ng'],                  // Giao hÃ ng → Giao hàng
  // "Thanh toán": Thanh to + Ã(00C3) + ¡(00A1) + n  
  ['Thanh to\u00C3\u00A1n', 'Thanh to\u00E1n'],                // Thanh toÃ¡n → Thanh toán
  // "Hoàn": Ho + Ã(00C3) + (A0) + n
  ['Ho\u00C3\u00A0n', 'Ho\u00E0n'],                            // HoÃ n → Hoàn
  // "Phí": Ph + Ã(00C3) + ­(00AD soft hyphen)
  ['Ph\u00C3\u00AD', 'Ph\u00ED'],                              // PhÃ­ → Phí
  // "Sách": S + Ã(00C3) + ¡(00A1) + ch
  ['S\u00C3\u00A1ch', 'S\u00E1ch'],                            // SÃ¡ch → Sách
  // "Tổng": T + á»(1EBB) + (2022) + ng  — actually already half fixed
  // "ơ" mojibake: Æ(00C6) + ¡(00A1)
  ['\u00C6\u00A1', '\u01A1'],                                   // Æ¡ → ơ
  // "ư" mojibake: Æ(00C6) + °(00B0)
  ['\u00C6\u00B0', '\u01B0'],                                   // Æ° → ư
  // "Kích thước": K + í already correct + ch th + ư (from Æ°) + á»›c (already correct)
  ['K\u00ED ch th\u00C6\u00B0\u1EDBc', 'K\u00ED ch th\u01B0\u1EDBc'], // Kích thÆ°ớc → Kích thước
  // "đơn hàng": đ(0111) already correct + ơ(Æ¡) + n h + àng
  ['\u0111\u00C6\u00A1n h\u00C3\u00A0ng', '\u0111\u01A1n h\u00E0ng'],  // đÆ¡n hÃ ng → đơn hàng
];

let pass = 0, fail = 0;
for (const [input, expected] of tests) {
  const result = fixText(input);
  const ok = result === expected;
  if (ok) {
    console.log('PASS:', JSON.stringify(input), '->', result);
    pass++;
  } else {
    console.log('FAIL:');
    console.log('  Input:   ', JSON.stringify(input));
    console.log('  Got:     ', result, JSON.stringify(result));
    console.log('  Expected:', expected, JSON.stringify(expected));
    fail++;
  }
}
console.log('\n' + pass + ' passed, ' + fail + ' failed');
