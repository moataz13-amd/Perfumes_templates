const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const dir = 'src/components/layout';
const targets = [
  'Header.jsx',
  'MobileMenu.jsx',
  'MobileMenu.cjs',
  'Footer.jsx',
  'HeaderBackup.jsx',
];
for (const t of targets) {
  const p = path.join(dir, t);
  if (!fs.existsSync(p)) {
    console.log('(absent) ' + t);
    continue;
  }
  try {
    const src = fs.readFileSync(p, 'utf8');
    const out = esbuild.transformSync(src, {
      loader: 'jsx',
      jsx: 'automatic',
      format: 'esm',
    });
    console.log('(ok)  ' + t + '  [' + src.split(/\r?\n/).length + ' lines]');
  } catch (e) {
    console.log('(ERR) ' + t + ' :: ' + e.message.split('\n').slice(0, 4).join(' | '));
  }
}
