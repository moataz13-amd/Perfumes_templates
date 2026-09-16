const fs = require('fs');
const en = JSON.parse(fs.readFileSync('src/i18n/locales/en.json', 'utf8'));
const lines = [];
(function walk(node, pathStr) {
  for (const k of Object.keys(node)) {
    const v = node[k];
    const p = pathStr ? pathStr + '.' + k : k;
    if (v && typeof v === 'object') walk(v, p);
    else lines.push(p + '\t' + String(v));
  }
})(en, '');
fs.writeFileSync('tmp_en_leaves.txt', lines.join('\n'), 'utf8');
console.log('wrote ' + lines.length);
