const fs = require('fs');
const path = require('path');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.css$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = walk('src');
console.log('CSS files:', files.length);
const interesting = /radial-gradient|background-image|background:/;
const noMatch = [];

for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  const lines = txt.split(/\r?\n/);
  let hit = 0;
  lines.forEach((ln, i) => {
    if (interesting.test(ln)) {
      hit++;
      const s = Math.max(0, i - 1);
      console.log('\n### ' + f.split('src\\')[1] + ' L' + (i + 1));
      console.log(lines.slice(s, i + 2).map((x) => '   ' + x).join('\n'));
    }
  });
  if (!hit) noMatch.push(f.split('src\\')[1]);
}
console.log('\n=== files with NO interesting background lines ===');
console.log(noMatch.join('\n'));
