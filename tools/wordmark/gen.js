// Converts "simdex" set in Sora Bold to SVG outlines: x-height = 50 units, baseline at y = 60.
// Prints JSON with the bounding box, the letter outlines (body) and the dot of the i (dot).
// Paste body/dot into WORD_BODY/WORD_DOT in logo.js and update WORD_VB if the box changes.
//
// Setup: npm install, then download Sora Bold (static .ttf, SIL Open Font License) from
// https://fonts.google.com/specimen/Sora into this folder as Sora-Bold.ttf.
const opentype = require('opentype.js');
const font = opentype.loadSync(__dirname + '/Sora-Bold.ttf');
const size = 50 / (font.tables.os2.sxHeight / font.unitsPerEm);
const paths = font.getPaths('simdex', 0, 60, size, { kerning: true });

const split = d => d.match(/M[^M]*/g);
let body = '', dot = '';
const box = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
paths.forEach((p, i) => {
  const b = p.getBoundingBox();
  box.x1 = Math.min(box.x1, b.x1); box.y1 = Math.min(box.y1, b.y1);
  box.x2 = Math.max(box.x2, b.x2); box.y2 = Math.max(box.y2, b.y2);
  const d = p.toPathData(2);
  if (i !== 1) { body += d; return; }
  // In the "i", the highest contour is the dot.
  const parts = split(d);
  const top = parts.map(c => Math.min(...(c.match(/-?\d+\.?\d*/g).filter((_, k) => k % 2 === 1).map(Number))));
  const k = top.indexOf(Math.min(...top));
  dot = parts[k]; body += parts.filter((_, j) => j !== k).join('');
});
console.log(JSON.stringify({ size: +size.toFixed(2), box: Object.fromEntries(Object.entries(box).map(([k, v]) => [k, +v.toFixed(2)])), body, dot }));
