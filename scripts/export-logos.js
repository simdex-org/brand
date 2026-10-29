// Writes every logo version to ./logos.
// Usage: node scripts/export-logos.js
const S = require('../logo.js');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const logos = path.join(root, 'logos');
fs.mkdirSync(logos, { recursive: true });
for (const k of Object.keys(S.kinds))
  for (const p of Object.keys(S.pal))
    fs.writeFileSync(path.join(logos, `simdex-${k}-${p}.svg`), S.svg(k, S.pal[p]));

console.log(`Done: ${fs.readdirSync(logos).length} logos`);
