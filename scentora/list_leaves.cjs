const fs = require('fs');
const path = require('path');
const en = JSON.parse(fs.readFileSync(path.join('src','i18n','locales','en.json'),'utf8'));
const leaves = [];
(function walk(node, pathStr){
  for (const k of Object.keys(node)) {
    const v = node[k];
    const p = pathStr ? pathStr + '.' + k : k;
    if (v && typeof v === 'object') walk(v, p);
    else leaves.push(p);
  }
})(en, '');
console.log('LEAF_COUNT=' + leaves.length);
const sorted = [...leaves].sort();
console.log('--- all leaf keys ---');
console.log(sorted.join('\n'));
