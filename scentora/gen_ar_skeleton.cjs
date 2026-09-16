const fs = require('fs');
const path = require('path');
const enPath = path.join('src', 'i18n', 'locales', 'en.json');
const raw = fs.readFileSync(enPath, 'utf8');
const en = JSON.parse(raw);

// collect all leaf keys with full dotted path + value + interpolation info
const leaves = [];
(function walk(node, prefix) {
  for (const k of Object.keys(node)) {
    const v = node[k];
    const p = prefix ? prefix + '.' + k : k;
    if (v && typeof v === 'object') walk(v, p);
    else leaves.push({ p, v });
  }
})(en, '');

console.log('TOTAL LEAF KEYS:', leaves.lengthTRY);
const lines = leaves.map((l) => l.p);
fs.writeFileSync(path.join(process.env.TEMP, 'scentora_en_keys.txt'), lines.join('\n'), 'utf8');
console.log('saved keys to TEMP');

// Also produce a skeleton ar.json with empty-string placeholders so I can fill translations
function buildSkeleton(node) {
  const out = {};
  for (const k of Object.keys(node)) {
    const v = node[k];
    if (v && typeof v === 'object') {
      out[k] = buildSkeleton(v);
    } else {
      out[k] = '';
    }
  }
  return out;
}
fs.writeFileSync(path.join('src', 'i18n', 'locales', 'ar.json'), JSON.stringify(buildSkeleton(en), null, 2), 'utf8');
console.log('skeleton ar.json written');
