const fs = require('fs');
const path = require('path');
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(css|scss)$/.test(e.name)) out.push(p);
  }
  return out;
}
const src = path.resolve('src');
const files = walk(src);
console.log('CSS files found:', files.length);

// 1) any repeated radial gradients / dot-pattern backgrounds anywhere
const pats = [
  /radial-gradient[\s\S]{0,220}?\.\./i,
  /radial-gradient/gi,
  /url\(["']?[^"')]*(dot|pattern|star|spark)[^"')]*\)/gi,
  /background-image:\s*(repeating-\w+)?/gi,
];
for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  const hasRadial = (txt.match(/radial-gradient/g) || []).length;
  const hasPatternUrl = (txt.match(pats[2]) || []).length;
  if (hasRadial || hasPatternUrl) {
    console.log('\n=== ' + f.replace(src + '\\', '') + ' | radial://' + hasRadial + ' patternUrl:' + hasPatternUrl);
    // print the surrounding lines so we can see context
    const lines = txt.split(/\r?\n/);
    lines.forEach((ln, i) => {
      if (/radial-gradient|background-image|::before|::after|content:\s*['"]/.test(ln)) {
        const start = Math.max(0, i - 1);
        console.log('  L' + (i + 1) + ': ' + lines.slice(start, i + 3).join('\n      '));
      }
    });
  }
}

// 2) Any fixed/anchored decorative elements that overlay page edges
console.log('\n\n=== fixed-position decorative overlays ===');
for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  const lines = txt.split(/\r?\n/);
  lines.forEach((ln, i) => {
    if (/position:\s*fixed|position:\s*absolute/.test(ln) && i < 400 && /blur|glow|decor|dot|spark|star|noise|grain|top-right|bottom-left/i.test(ln)) {
      console.log(f.replace(src + '\\', '') + ' L' + (i + 1) + ': ' + ln.trim());
    }
  });
}
