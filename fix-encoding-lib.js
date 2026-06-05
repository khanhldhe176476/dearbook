/**
 * fix-encoding-lib.js
 * 
 * Fixes Vietnamese mojibake: text that was UTF-8, got misread as Windows-1252,
 * then each Win-1252 char got stored as UTF-8 → double-encoded garbage.
 * 
 * Example: "đủ" (UTF-8: C4 91 E1 BB A7)
 *   → misread as Win-1252 → chars: Ä ' á » §
 *   → stored as UTF-8    → "Ä'á»§"
 *
 * After a partial fix, "á»§" may already be fixed to "ủ", leaving "Ä'ủ".
 * The greedy approach handles both cases.
 */

const win1252 = require('windows-1252');

// Win1252 chars above 0x7F that map to Unicode code points > 0xFF
// (the "special" 0x80-0x9F range in Win1252)
const WIN1252_SPECIALS = new Set([
  0x20AC, // € (0x80)
  0x201A, // ‚ (0x82)
  0x0192, // ƒ (0x83)
  0x201E, // „ (0x84)
  0x2026, // … (0x85)
  0x2020, // † (0x86)
  0x2021, // ‡ (0x87)
  0x02C6, // ˆ (0x88)
  0x2030, // ‰ (0x89)
  0x0160, // Š (0x8A)
  0x2039, // ‹ (0x8B)
  0x0152, // Œ (0x8C)
  0x017D, // Ž (0x8E)
  0x2018, // ' (0x91) ← KEY: this is what byte 0x91 becomes in Win1252
  0x2019, // ' (0x92)
  0x201C, // " (0x93)
  0x201D, // " (0x94)
  0x2022, // • (0x95)
  0x2013, // – (0x96)
  0x2014, // — (0x97)
  0x02DC, // ˜ (0x98)
  0x2122, // ™ (0x99)
  0x0161, // š (0x9A)
  0x203A, // › (0x9B)
  0x0153, // œ (0x9C)
  0x017E, // ž (0x9E)
  0x0178, // Ÿ (0x9F)
]);

/**
 * Returns true if the character (by its Unicode code point) can be
 * encoded as a single byte in Windows-1252.
 */
function isWin1252Encodeable(codePoint) {
  return (codePoint >= 0x00 && codePoint <= 0xFF) || WIN1252_SPECIALS.has(codePoint);
}

/**
 * Try to encode a string back to Win-1252 bytes and decode as UTF-8.
 * Returns the decoded string if valid, or null on failure.
 */
function tryDecodeAsWin1252(str) {
  if (!str) return null;
  try {
    // win1252.encode returns Uint16Array (each element is a byte value 0-255)
    const uint16 = win1252.encode(str);
    const buf = Buffer.from(uint16); // Convert to Buffer
    const decoded = buf.toString('utf8');
    if (!decoded.includes('\uFFFD') && decoded !== str) {
      return decoded;
    }
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Fix all mojibake in a text string using a greedy character-by-character approach.
 *
 * Algorithm:
 * 1. Walk through the string character by character.
 * 2. When we hit a non-ASCII char that's Win1252-encodeable (potential mojibake start),
 *    try to extend a mojibake sequence greedily.
 * 3. Try to decode the longest possible sequence, then fall back to shorter ones.
 * 4. Plain ASCII and already-correct Vietnamese chars pass through unchanged.
 */
function fixText(txt) {
  const out = [];
  let i = 0;

  while (i < txt.length) {
    const ch = txt[i];
    const cp = ch.codePointAt(0);

    // ASCII: pass through as-is
    if (cp < 0x80) {
      out.push(ch);
      i++;
      continue;
    }

    // Check if this char is Win1252-encodeable (potential mojibake)
    if (!isWin1252Encodeable(cp)) {
      // Already a proper Unicode char (outside Win1252 range), pass through
      out.push(ch);
      i++;
      continue;
    }

    // Try to build the longest possible Win1252-encodeable sequence from position i
    let j = i + 1;
    while (j < txt.length) {
      const cp2 = txt.codePointAt(j);
      if (!isWin1252Encodeable(cp2)) break;
      j++;
    }

    // Now txt[i..j) is a candidate mojibake sequence.
    // Try decoding the longest sequence first, then progressively shorter ones.
    let fixed = false;
    for (let end = j; end > i; end--) {
      const candidate = txt.substring(i, end);
      const decoded = tryDecodeAsWin1252(candidate);
      if (decoded !== null) {
        out.push(decoded);
        i = end;
        fixed = true;
        break;
      }
    }

    if (!fixed) {
      // Nothing worked, emit the character as-is and advance
      out.push(ch);
      i++;
    }
  }

  return out.join('');
}

module.exports = { fixText, tryDecodeAsWin1252 };
