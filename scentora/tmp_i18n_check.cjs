const fs = require('fs');
const { execFileSync } = require('child_process');
const path = require('path');
const root = path.resolve(process.cwd());

// 1) Parse both locale files after a lightweight cleanup, but do NOT write back en.json
function readClean(p) {
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace(/^\uFEFF/, '');
  const tryParse = (str) => JSON.parse(str);
  try {
    return tryParse(s);
  } catch {
    // tolerate trailing commas only for analysis
    return JSON.parse(s.replace(/,\s*([}\]])/g, '$1'));
  }
}

const en = readClean(path.join('src/i18n/locales/en.json'));
const ar = readClean(path.join('src/i18n/locales/ar.json'));

function leaves(o) {
  const out = [];
  (function w(n, p) {
    for (const k in n) {
      const v = n[k];
      const q = p ? p + '.' + k : k;
      if (v && typeof v === 'object') w(v, q);
      else out.push(q);
    }
  })(o, '');
  return out;
}

const enL = new Set(leaves(en));
const arL = new Set(leaves(ar));
const missing = [...enL].filter((x) => !arL.has(x));
const extra = [...arL].filter((x) => !enL.has(x));

console.log('=== AR missing ' + missing.length + ' ===');
for (const m of missing) console.log('  - ' + m);
console.log('=== AR extra ' + extra.length + ' ===');
for (const e of extra) console.log('  + ' + e);

// Also verify en.json parses under strict mode (what vite will do)
let strict = 'OK';
try {
  JSON.parse(fs.readFileSync('src/i18n/locales/en.json', 'utf8').replace(/^\uFEFF/, ''));
} catch (e) {
  strict = 'BROKEN: ' + e.message;
}
console.log('=== en.json strict parse: ' + strict + ' ===');
