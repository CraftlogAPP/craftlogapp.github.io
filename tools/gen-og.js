/* Dexware - Generator fuer das OG-/Social-Bild (1200x630).
 * Hintergrund und Logo teilen denselben Marken-Blauverlauf wie die App-Kachel
 * (#5B8DF7 -> #2563EB -> #16225C), das Tile hebt sich ueber Ring + Schatten ab.
 * Rendert via Edge headless (gleiche Technik wie PruefDex/dexware/gen-brand.js).
 *
 *   node tools/gen-og.js [ziel.png]
 *
 * Voraussetzung: Microsoft Edge (Windows). Pfad ueber $EDGE ueberschreibbar.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const OUT = process.argv[2] || path.join(__dirname, '..', 'assets', 'og-image.png');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'dexware-og-'));
const EDGE =
  process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const W = 1200;
const H = 630;

const DEFS = `
  <linearGradient id="tile" x1="0" y1="0" x2="0.5" y2="1">
    <stop offset="0%"  stop-color="#5B8DF7"/>
    <stop offset="42%" stop-color="#2563EB"/>
    <stop offset="100%" stop-color="#16225C"/>
  </linearGradient>
  <linearGradient id="sheen" x1="0" y1="0" x2="0.5" y2="1">
    <stop offset="0%"  stop-color="#FFFFFF" stop-opacity="0.20"/>
    <stop offset="46%" stop-color="#FFFFFF" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="dwhite" x1="0.1" y1="0" x2="0.5" y2="1">
    <stop offset="0%"  stop-color="#FFFFFF"/>
    <stop offset="100%" stop-color="#DCE6FB"/>
  </linearGradient>
  <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"  stop-color="#FCD34D"/>
    <stop offset="100%" stop-color="#F59E0B"/>
  </linearGradient>`;

/** 4-Punkt-Funken (Sparkle) um (cx,cy) mit Radius r. */
function sparkle(cx, cy, r, fill) {
  const k = r * 0.16;
  const d = `M${cx},${cy - r} Q${cx + k},${cy - k} ${cx + r},${cy} Q${cx + k},${cy + k} ${cx},${cy + r} Q${cx - k},${cy + k} ${cx - r},${cy} Q${cx - k},${cy - k} ${cx},${cy - r} Z`;
  return `<path d="${d}" fill="${fill}"/>`;
}

/** Dexware-Markenzeichen als Kachel-SVG (viewBox 0 0 100 100). */
function markSvg(px) {
  return `<svg width="${px}" height="${px}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>${DEFS}</defs>
    <rect width="100" height="100" rx="22" fill="url(#tile)"/>
    <rect width="100" height="100" rx="22" fill="url(#sheen)"/>
    <path d="M37,72 L37,28 C63,28 71,39 71,50 C71,61 63,72 37,72 Z"
      fill="none" stroke="url(#dwhite)" stroke-width="10.5"
      stroke-linecap="round" stroke-linejoin="round"/>
    ${sparkle(55.5, 41.5, 7.2, 'url(#spark)')}
  </svg>`;
}

/** Schwach angedeutete App-Kachel als Hintergrund-Textur. */
function ghostTile(x, y, s, rot) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${s}px;height:${s}px;
    transform:rotate(${rot}deg);border-radius:${s * 0.24}px;
    background:linear-gradient(150deg,rgba(255,255,255,.10),rgba(255,255,255,.02));
    border:1.5px solid rgba(255,255,255,.09)"></div>`;
}

function ogHtml() {
  const tiles = [
    ghostTile(880, -60, 260, -12),
    ghostTile(1010, 300, 210, 8),
    ghostTile(760, 430, 170, -6),
    ghostTile(-40, 40, 150, 10),
  ].join('');
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:${W}px;height:${H}px;overflow:hidden}
    .stage{position:relative;width:${W}px;height:${H}px;overflow:hidden;
      font-family:'Segoe UI Variable Display','Segoe UI',system-ui,Arial,sans-serif;
      background:
        radial-gradient(900px 620px at 14% 6%, rgba(126,166,255,.55), transparent 62%),
        radial-gradient(760px 560px at 92% 96%, rgba(11,18,48,.55), transparent 60%),
        linear-gradient(135deg,#5B8DF7 0%,#2E68EE 44%,#1B2E7E 78%,#16225C 100%);}
    .texture{position:absolute;inset:0;opacity:.85}
    .row{position:absolute;left:110px;top:225px;display:flex;align-items:flex-start;gap:43px}
    .tile{width:180px;height:180px;border-radius:40px;overflow:hidden;
      box-shadow:0 22px 48px rgba(8,16,48,.45), 0 0 0 1.5px rgba(255,255,255,.28) inset;}
    .copy{padding-top:6px}
    .word{font-size:84px;font-weight:800;letter-spacing:-2.5px;line-height:1;color:#fff;
      text-shadow:0 4px 18px rgba(8,16,48,.35)}
    .tag{margin-top:26px;font-size:30px;font-weight:500;color:rgba(255,255,255,.9);
      letter-spacing:.2px}
    .pill{margin-top:38px;display:inline-flex;align-items:center;height:48px;padding:0 26px;
      border:1.5px solid rgba(255,255,255,.55);border-radius:26px;
      background:rgba(255,255,255,.10);
      font-size:21px;font-weight:700;color:#fff;letter-spacing:.3px}
    .bar{position:absolute;left:0;right:0;bottom:0;height:12px;
      background:linear-gradient(90deg,#FCD34D 0%,#F59E0B 38%,#93B4FF 100%)}
  </style></head>
  <body><div class="stage">
    <div class="texture">${tiles}</div>
    <div class="row">
      <div class="tile">${markSvg(180)}</div>
      <div class="copy">
        <div class="word">Dexware</div>
        <div class="tag">Compliance aus einer Hand &mdash; 15 Apps f&uuml;rs Handwerk</div>
        <div><span class="pill">dexware.app</span></div>
      </div>
    </div>
    <div class="bar"></div>
  </div></body></html>`;
}

const htmlPath = path.join(TMP, 'og.html');
fs.writeFileSync(htmlPath, ogHtml());
const args = [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  `--window-size=${W},${H}`,
  `--screenshot=${path.resolve(OUT)}`,
  'file:///' + htmlPath.split(String.fromCharCode(92)).join('/'),
];
try {
  execFileSync(EDGE, args, { stdio: 'ignore' });
} catch {
  /* Edge schreibt harmlose Stderr-Warnungen; PNG entsteht trotzdem. */
}
console.log('wrote', path.resolve(OUT), `(${W}x${H})`);
