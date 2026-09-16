const fs = require('fs');
const p = 'src/i18n/locales/en.json';
let s = fs.readFileSync(p, 'utf8');
s = s.replace(/^\uFEFF/, '');
s = s.replace(/,[ \t]*([}\]])/g, '$1');
fs.writeFileSync(p, s, 'utf8');
let j;
try { j = JSON.parse(s); } catch (e) { console.log('STILL BAD: ' + e.message); process.exit(1); }
function count(o) { let n = 0; for (const k in o) { const v = o[k]; if (v && typeof v === 'object') n += count(v); else n++; } return n; }
console.log('EN fixed OK, leaves=' + count(j));
