import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = process.argv[2];
mkdirSync(OUT, { recursive: true });
const fs = (p) => "file://" + resolve(process.env.FONTS_DIR ?? "node_modules/@fontsource", p);

// Photos used as backgrounds live next to this script in assets/.
const ASSETS = resolve(dirname(fileURLToPath(import.meta.url)), "assets");

const EMAIL = "gustav@gustavtk.com";
const SITE = "gustavtk.com";
const ROLE = "FULL-STACK DEVELOPER";

// Brand mark (public/brand/gustavtk-mark.svg); G/T follow currentColor, >_ uses --acc.
const mark = (h, color = "var(--ink)", acc = "var(--teal)") => `
<svg viewBox="0 0 449 346" style="height:${h}px;color:${color};display:block" aria-hidden>
  <path fill="currentColor" d="M90 0h188.5v66H112l-39 39v95l17 17h91v67.5H65L0 219.5V90z"/>
  <path fill="currentColor" d="M114 103.5h264.5V170h-106v176h-39l-33-33V170H114z"/>
  <path fill="${acc}" d="M294 202.5h12.5l56 56-56 56H294v-24l32-32-32-32z"/>
  <path fill="${acc}" d="M356 290.5h92.5v24H356z"/>
</svg>`;
const markOutline = (h, stroke, sw) => `
<svg viewBox="-4 -4 457 354" style="height:${h}px;display:block" aria-hidden>
  <g fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round">
  <path d="M90 0h188.5v66H112l-39 39v95l17 17h91v67.5H65L0 219.5V90z"/>
  <path d="M114 103.5h264.5V170h-106v176h-39l-33-33V170H114z"/>
  <path d="M294 202.5h12.5l56 56-56 56H294v-24l32-32-32-32z"/>
  <path d="M356 290.5h92.5v24H356z"/></g>
</svg>`;

const base = `
@font-face{font-family:Jakarta;font-weight:400;src:url(${fs("plus-jakarta-sans/files/plus-jakarta-sans-latin-400-normal.woff2")})}
@font-face{font-family:Jakarta;font-weight:500;src:url(${fs("plus-jakarta-sans/files/plus-jakarta-sans-latin-500-normal.woff2")})}
@font-face{font-family:Jakarta;font-weight:700;src:url(${fs("plus-jakarta-sans/files/plus-jakarta-sans-latin-700-normal.woff2")})}
@font-face{font-family:Jakarta;font-weight:800;src:url(${fs("plus-jakarta-sans/files/plus-jakarta-sans-latin-800-normal.woff2")})}
@font-face{font-family:Mono;font-weight:400;src:url(${fs("jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2")})}
@font-face{font-family:Mono;font-weight:500;src:url(${fs("jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2")})}
@font-face{font-family:Mono;font-weight:700;src:url(${fs("jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2")})}
:root{--ink:#0b0f14;--ink2:#334155;--muted:#64748b;--line:#e2e8f0;--teal:#0d9488;--teal2:#0f8f80;--cyan:#06b6d4;--em:#10b981;--mint:#01f0c9}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px;overflow:hidden}
body{font-family:Jakarta;color:var(--ink);position:relative;-webkit-font-smoothing:antialiased}
.mono{font-family:Mono}
.abs{position:absolute}
.p{color:var(--teal)}
`;

// Every layout: logo, name and role top left; email and website top right; the middle stays clear.
const contact = (cls = "") => `
  <div class="${cls} mono"><span class="p">@</span> ${EMAIL}</div>
  <div class="${cls} mono"><span class="p">↗</span> ${SITE}</div>`;


// Out-of-focus rooms. Shapes are placed in canvas pixels inside a layer that overhangs the frame
// by PAD, so the blur never pulls in empty edges. A lens-like finish (soft wall unevenness, light
// falloff, camera grain) goes on top so the room matches a real webcam image.
const PAD = 200;
const sh = (x, y, w, h, css) =>
  `<i style="position:absolute;display:block;left:${x + PAD}px;top:${y + PAD}px;width:${w}px;height:${h}px;${css}"></i>`;
const room = (blur, base, shapes) =>
  `<div class="abs" style="inset:-${PAD}px;filter:blur(${blur}px);background:${base}">${shapes.join("")}</div>`;
// A framed print of the mark, defocused close to the wall it hangs on so it sits in the room.
const framedMark = (x, y, w, blur, opts = {}) => {
  const { frame = "#2b2e31", mat = "#efefed", ink = "#2b3035", opacity = 0.9 } = opts;
  return `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;padding:${w * 0.03}px;background:${frame};filter:blur(${blur}px);opacity:${opacity};box-shadow:0 ${w * 0.04}px ${w * 0.08}px rgb(0 0 0/.25)">
  <div style="background:${mat};padding:${w * 0.16}px ${w * 0.14}px">${mark(w * 0.46, ink, "#0d9488")}</div></div>`;
};
const bokeh = (x, y, r, color, a) =>
  `<i style="position:absolute;display:block;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:radial-gradient(circle,${color} 0 62%,${color} 80%,transparent 100%);opacity:${a};filter:blur(2.5px)"></i>`;
const lens = (vignette = 0.2) => `
<svg class="abs" style="inset:0;mix-blend-mode:soft-light;opacity:.35" width="1920" height="1080"><filter id="lf"><feTurbulence type="fractalNoise" baseFrequency=".0022" numOctaves="3" seed="7"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#lf)"/></svg>
<div class="abs" style="inset:0;background:radial-gradient(ellipse 78% 72% at 50% 46%,transparent 48%,rgb(28 26 24/${vignette}))"></div>
<svg class="abs" style="inset:0;mix-blend-mode:overlay;opacity:.16" width="1920" height="1080"><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" seed="3"/><feColorMatrix type="saturate" values="0.25"/></filter><rect width="100%" height="100%" filter="url(#gr)"/></svg>`;
// Frosted name and contact cards shared by the room backgrounds.
const roomCards = () => `
<style>
.pill{background:rgb(255 255 255/.8);border:1px solid rgb(255 255 255/.9);box-shadow:0 18px 40px -22px rgb(20 22 26/.45),inset 0 1px 0 #fff;backdrop-filter:blur(16px);border-radius:28px}
.id{left:80px;top:72px;display:flex;align-items:center;gap:28px;padding:26px 40px 26px 30px}
.nm{font-size:66px;font-weight:800;letter-spacing:-.03em;line-height:1}
.rl{font-family:Mono;font-size:16px;letter-spacing:.22em;color:var(--muted);margin-top:10px}
.ct{right:80px;top:72px;padding:24px 34px;text-align:right}
.c{font-size:25px;color:var(--ink2);line-height:1.7;font-weight:500}
</style>
<div class="abs pill id">${mark(76)}<div><div class="nm">Gustav</div><div class="rl">${ROLE}</div></div></div>
<div class="abs pill ct">${contact("c")}</div>`;
const books = (x, y, h, colors, widths) => {
  let cx = x;
  return colors.map((c, i) => { const w = widths[i % widths.length], hh = h - (i * 37 % 5) * 9; const out = sh(cx, y + (h - hh), w, hh, `background:${c}`); cx += w + 3; return out; }).join("");
};


// The ash series (17 onward): the photo office palette with Glass's frosted white cards.
const ashBase = () => `
<style>
body{background:#939898}
.afield{left:0;right:0;top:0;height:760px;overflow:hidden;filter:blur(90px)}
.afield i{position:absolute;border-radius:50%;display:block}
</style>
<div class="abs afield">
  <i style="left:-160px;top:-260px;width:900px;height:640px;background:rgb(189 193 192/.75)"></i>
  <i style="left:520px;top:-320px;width:900px;height:600px;background:rgb(160 166 166/.55)"></i>
  <i style="left:980px;top:-200px;width:700px;height:460px;background:rgb(207 182 155/.35)"></i>
  <i style="right:-200px;top:-280px;width:900px;height:640px;background:rgb(207 182 155/.5)"></i>
</div>
<div class="abs" style="left:0;right:0;top:0;height:780px;background:linear-gradient(rgb(147 152 152/0) 0%,rgb(147 152 152/.18) 25%,rgb(147 152 152/.45) 45%,rgb(147 152 152/.75) 65%,rgb(147 152 152/.94) 82%,#939898 100%)"></div>
<div class="abs" style="left:0;right:0;bottom:0;height:420px;background:linear-gradient(transparent,rgb(144 129 110/.3))"></div>`;
const ashCards = () => `
<style>
.pill{background:rgb(255 255 255/.8);border:1px solid rgb(255 255 255/.9);box-shadow:0 18px 40px -22px rgb(20 22 26/.45),inset 0 1px 0 #fff;backdrop-filter:blur(14px);border-radius:28px}
.id{left:80px;top:72px;display:flex;align-items:center;gap:28px;padding:26px 40px 26px 30px}
.nm{font-size:66px;font-weight:800;letter-spacing:-.03em;line-height:1}
.rl{font-family:Mono;font-size:16px;letter-spacing:.22em;color:var(--muted);margin-top:10px}
.ct{right:80px;top:72px;padding:24px 34px;text-align:right}
.c{font-size:25px;color:var(--ink2);line-height:1.7;font-weight:500}
</style>
<div class="abs pill id">${mark(76)}<div><div class="nm">Gustav</div><div class="rl">${ROLE}</div></div></div>
<div class="abs pill ct">${contact("c")}</div>`;
// Seeded randomness so every render of a design comes out the same.
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const MARK_PATHS = [
  "M90 0h188.5v66H112l-39 39v95l17 17h91v67.5H65L0 219.5V90z",
  "M114 103.5h264.5V170h-106v176h-39l-33-33V170H114z",
  "M294 202.5h12.5l56 56-56 56H294v-24l32-32-32-32z",
  "M356 290.5h92.5v24H356z",
];
const markSvgData = (fill = "#000") =>
  "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 449 346">${MARK_PATHS.map((d) => `<path fill="${fill}" d="${d}"/>`).join("")}</svg>`);


// The mark as polygons in its own 449×346 units, for designs that sample its shape point by point.
const MARK_POLYS = [
  [[90, 0], [278.5, 0], [278.5, 66], [112, 66], [73, 105], [73, 200], [90, 217], [181, 217], [181, 284.5], [65, 284.5], [0, 219.5], [0, 90]],
  [[114, 103.5], [378.5, 103.5], [378.5, 170], [272.5, 170], [272.5, 346], [233.5, 346], [200.5, 313], [200.5, 170], [114, 170]],
  [[294, 202.5], [306.5, 202.5], [362.5, 258.5], [306.5, 314.5], [294, 314.5], [294, 290.5], [326, 258.5], [294, 226.5]],
  [[356, 290.5], [448.5, 290.5], [448.5, 314.5], [356, 314.5]],
];
const inPoly = (x, y, poly) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
// Which part of the mark a point falls in: 0 for the G and T, 1 for the >_, -1 outside.
const markPart = (x, y) => (inPoly(x, y, MARK_POLYS[0]) || inPoly(x, y, MARK_POLYS[1]) ? 0 : inPoly(x, y, MARK_POLYS[2]) || inPoly(x, y, MARK_POLYS[3]) ? 1 : -1);

const variants = {
  // 1. Grid studio: the site's grid background, inverted to light, with soft teal glows.
  "01-grid-studio": `
<style>
body{background:#f8fafc}
.grid{inset:0;background-size:48px 48px;background-image:linear-gradient(to right,rgb(15 23 42/.05) 1px,transparent 1px),linear-gradient(to bottom,rgb(15 23 42/.05) 1px,transparent 1px);
  -webkit-mask-image:radial-gradient(ellipse 80% 90% at 50% 50%,#000 30%,transparent 100%)}
.glow1{left:-300px;top:-320px;width:1100px;height:900px;background:radial-gradient(closest-side,rgb(1 240 201/.22),transparent)}
.glow2{right:-300px;top:-380px;width:900px;height:800px;background:radial-gradient(closest-side,rgb(6 182 212/.12),transparent)}
.glow3{right:-300px;bottom:-420px;width:1000px;height:900px;background:radial-gradient(closest-side,rgb(16 185 129/.08),transparent)}
.id{left:96px;top:84px}
.name{font-size:76px;font-weight:800;letter-spacing:-.03em;line-height:1;margin-top:26px}
.role{font-size:18px;letter-spacing:.24em;color:var(--muted);margin-top:14px;font-family:Mono;font-weight:500}
.rule{width:56px;height:3px;background:linear-gradient(90deg,var(--cyan),var(--em));margin-top:24px}
.ct{right:96px;top:92px;text-align:right}
.c{font-size:27px;color:var(--ink2);line-height:1.65;font-weight:500}
.foot{right:96px;bottom:72px;font-size:16px;color:#94a3b8;letter-spacing:.18em}
</style>
<div class="abs grid"></div><div class="abs glow1"></div><div class="abs glow2"></div><div class="abs glow3"></div>
<div class="abs id">${mark(78)}<div class="name">Gustav</div><div class="role">WEB DEVELOPER</div><div class="rule"></div></div>
<div class="abs ct">${contact("c")}</div>
<div class="abs foot mono">&gt; STATUS: ONLINE</div>`,

  // 2. Access pass: the hero's lanyard badge, now hanging top left; contact pinned top right.
  "02-access-pass": `
<style>
body{background:radial-gradient(ellipse 70% 80% at 20% 10%,#ffffff,#eef2f5)}
.dotsbg{inset:0;background-image:radial-gradient(rgb(15 23 42/.08) 1.2px,transparent 1.2px);background-size:30px 30px;-webkit-mask-image:linear-gradient(160deg,#000,transparent 70%)}
.strap{left:316px;top:-10px;width:36px;height:150px;background:repeating-linear-gradient(0deg,#0e7490 0 9px,#06b6d4 9px 12px);border-radius:0 0 4px 4px}
.clip{left:306px;top:128px;width:56px;height:30px;border-radius:6px;background:linear-gradient(#cbd5e1,#94a3b8);box-shadow:inset 0 -3px 0 rgb(0 0 0/.12)}
.card{left:134px;top:150px;width:400px;border-radius:22px;background:#fff;box-shadow:0 30px 60px -20px rgb(15 23 42/.28),0 0 0 1px rgb(15 23 42/.06);overflow:hidden;transform:rotate(3deg);transform-origin:50% 0}
.slot{width:70px;height:12px;border-radius:6px;background:#e2e8f0;margin:18px auto 0}
.head{background:#0b0f14;margin:18px 18px 0;border-radius:14px;padding:26px 26px 22px;display:flex;justify-content:space-between;align-items:flex-end}
.head small{font-family:Mono;color:#94a3b8;font-size:13px;letter-spacing:.2em;line-height:1.6;text-align:right}
.head small b{color:var(--mint);font-weight:500}
.body{padding:26px 30px 28px}
.lbl{font-family:Mono;font-size:12px;letter-spacing:.22em;color:#94a3b8}
.nm{font-size:62px;font-weight:800;letter-spacing:-.03em;line-height:1.05;margin:4px 0 4px}
.rl{font-size:20px;color:var(--teal);font-weight:700}
.bc{height:44px;margin-top:26px;background:repeating-linear-gradient(90deg,#0b0f14 0 2px,transparent 2px 3px,#0b0f14 3px 4px,transparent 4px 7px,#0b0f14 7px 8px,transparent 8px 9px,#0b0f14 9px 12px,transparent 12px 14px)}
.ac{display:flex;justify-content:space-between;font-family:Mono;font-size:12px;color:#94a3b8;letter-spacing:.2em;margin-top:8px}
.ac b{color:var(--em);font-weight:700}
.ct{right:96px;top:92px;text-align:right}
.ct .lb{font-family:Mono;font-size:15px;letter-spacing:.24em;color:#94a3b8;margin-bottom:12px}
.c{font-size:27px;color:var(--ink2);line-height:1.65;font-weight:500}
</style>
<div class="abs dotsbg"></div>
<div class="abs strap"></div><div class="abs clip"></div>
<div class="abs card"><div class="slot"></div>
  <div class="head">${mark(70, "#fafafa", "#01f0c9")}<small>ACCESS PASS<br><b>GUSTAV_TK</b></small></div>
  <div class="body">
    <div class="lbl">NAME</div><div class="nm">Gustav</div><div class="rl">Web Developer</div>
    <div class="bc"></div><div class="ac"><span>ID · GTK-001</span><b>● ACCESS GRANTED</b></div>
  </div></div>
<div class="abs ct"><div class="lb">// CONTACT</div>${contact("c")}</div>`,

  // 3. Browser: a light browser window; the tab holds the brand, the address bar the contact.
  "03-browser": `
<style>
body{background:linear-gradient(180deg,#f1f5f9,#f8fafc 40%,#ffffff)}
.chrome{left:0;right:0;top:0;height:196px;background:#e9eef3;border-bottom:1px solid #d7dee6}
.dots{left:36px;top:30px;display:flex;gap:12px}.dots i{width:16px;height:16px;border-radius:50%;display:block}
.tab{left:28px;top:66px;height:130px;padding:0 44px 0 30px;background:#fff;border-radius:18px 18px 0 0;display:flex;align-items:center;gap:26px;box-shadow:0 -1px 0 #d7dee6}
.tab .nm{font-size:58px;font-weight:800;letter-spacing:-.03em;line-height:1}
.tab .rl{font-family:Mono;font-size:16px;letter-spacing:.24em;color:var(--muted);margin-top:10px}
.tab .x{font-family:Mono;color:#94a3b8;font-size:22px;margin-left:30px}
.tab2{left:560px;top:96px;height:100px;width:180px;border-radius:14px 14px 0 0;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:30px;font-family:Mono}
.url{right:36px;top:34px;width:760px;height:62px;background:#fff;border:1px solid #d7dee6;border-radius:999px;display:flex;align-items:center;padding:0 26px;gap:14px;font-size:25px;color:var(--ink2)}
.url .lock{color:var(--em)}
.url .h{color:#94a3b8}
.mail{right:36px;top:116px;height:52px;display:flex;align-items:center;gap:12px;font-size:24px;color:var(--ink2);background:rgb(13 148 136/.08);border:1px solid rgb(13 148 136/.25);border-radius:12px;padding:0 20px}
.page{left:0;right:0;top:196px;bottom:0;background-size:40px 40px;background-image:linear-gradient(to right,rgb(15 23 42/.035) 1px,transparent 1px),linear-gradient(to bottom,rgb(15 23 42/.035) 1px,transparent 1px);-webkit-mask-image:linear-gradient(#000,transparent 80%)}
.load{left:28px;top:194px;width:420px;height:3px;background:linear-gradient(90deg,var(--cyan),var(--em))}
</style>
<div class="abs chrome"></div><div class="abs page"></div>
<div class="abs dots"><i style="background:#f87171"></i><i style="background:#fbbf24"></i><i style="background:#34d399"></i></div>
<div class="abs tab">${mark(64)}<div><div class="nm">Gustav</div><div class="rl">WEB DEVELOPER</div></div><span class="x">×</span></div>
<div class="abs tab2">+</div>
<div class="abs load"></div>
<div class="abs url mono"><span class="lock">●</span><span><span class="h">https://</span>${SITE}</span></div>
<div class="abs mail mono"><span class="p">@</span> ${EMAIL}</div>`,

  // 4. Code: the contact written as a typed object in a small light editor card.
  "04-code": `
<style>
body{background:#fbfcfd}
.dg{inset:0;background-image:radial-gradient(rgb(15 23 42/.09) 1.2px,transparent 1.2px);background-size:28px 28px;-webkit-mask-image:radial-gradient(ellipse 60% 70% at 50% 45%,transparent 30%,#000 100%)}
.glow{left:-260px;top:-300px;width:1000px;height:800px;background:radial-gradient(closest-side,rgb(1 240 201/.18),transparent)}
.id{left:96px;top:88px;display:flex;align-items:center;gap:30px}
.nm{font-size:80px;font-weight:800;letter-spacing:-.035em;line-height:1}
.nm .cur{display:inline-block;width:14px;height:62px;background:var(--cyan);margin-left:10px;vertical-align:-4px}
.rl{font-family:Mono;font-size:18px;letter-spacing:.24em;color:var(--muted);margin-top:12px}
.vr{width:2px;height:120px;background:linear-gradient(var(--cyan),var(--em))}
.ed{right:96px;top:80px;width:620px;background:#fff;border-radius:16px;border:1px solid var(--line);box-shadow:0 24px 50px -24px rgb(15 23 42/.22);overflow:hidden}
.eh{height:46px;border-bottom:1px solid var(--line);display:flex;align-items:center;padding:0 20px;gap:9px;font-family:Mono;font-size:15px;color:#94a3b8}
.eh i{width:11px;height:11px;border-radius:50%;display:block;background:#e2e8f0}
.eh span{margin-left:auto}
pre{font-family:Mono;font-size:23px;line-height:1.7;padding:20px 26px 24px;color:var(--ink2)}
.ln{color:#cbd5e1;display:inline-block;width:34px}
.k{color:#7c3aed}.s{color:var(--teal);font-weight:500}.pr{color:#0369a1}
</style>
<div class="abs dg"></div><div class="abs glow"></div>
<div class="abs id">${mark(104)}<div class="vr"></div><div><div class="nm">Gustav<span class="cur"></span></div><div class="rl">WEB DEVELOPER</div></div></div>
<div class="abs ed"><div class="eh"><i></i><i></i><i></i><span>contact.ts</span></div>
<pre><span class="ln">1</span><span class="k">export const</span> contact = {
<span class="ln">2</span>  <span class="pr">email</span>: <span class="s">"${EMAIL}"</span>,
<span class="ln">3</span>  <span class="pr">site</span>:  <span class="s">"${SITE}"</span>,
<span class="ln">4</span>};</pre></div>`,

  // 5. Glass: frosted cards over a light take on the site's hero: its blue/violet/emerald glow
  // field fading into the grid. The mark sits as a quiet watermark bottom right, clear of the middle.
  "05-glass": `
<style>
body{background:#f7f9fc}
.field{left:0;right:0;top:0;height:760px;overflow:hidden;filter:blur(90px) saturate(1.05)}
.field i{position:absolute;border-radius:50%;display:block}
.fade{left:0;right:0;top:0;height:780px;background:linear-gradient(rgb(247 249 252/0) 0%,rgb(247 249 252/.18) 25%,rgb(247 249 252/.45) 45%,rgb(247 249 252/.75) 65%,rgb(247 249 252/.94) 82%,#f7f9fc 100%)}
.wash{left:0;right:0;bottom:0;height:420px;background:linear-gradient(transparent,rgb(16 185 129/.05))}
.grid{inset:0;background-size:48px 48px;background-image:linear-gradient(to right,rgb(15 23 42/.05) 1px,transparent 1px),linear-gradient(to bottom,rgb(15 23 42/.05) 1px,transparent 1px);
  -webkit-mask-image:radial-gradient(ellipse 120% 100% at 50% 0%,#000 35%,rgb(0 0 0/.55) 100%)}
.pill{background:rgb(255 255 255/.72);border:1px solid rgb(255 255 255/.95);box-shadow:0 18px 40px -24px rgb(15 23 42/.25),0 0 0 1px rgb(15 23 42/.04),inset 0 1px 0 #fff;backdrop-filter:blur(14px);border-radius:28px}
.id{left:80px;top:72px;display:flex;align-items:center;gap:28px;padding:26px 40px 26px 30px}
.nm{font-size:66px;font-weight:800;letter-spacing:-.03em;line-height:1}
.rl{font-family:Mono;font-size:16px;letter-spacing:.22em;color:var(--muted);margin-top:10px}
.ct{right:80px;top:72px;padding:24px 34px;text-align:right}
.c{font-size:25px;color:var(--ink2);line-height:1.7;font-weight:500}
.wm{right:56px;bottom:48px}
</style>
<div class="abs field">
  <i style="left:-160px;top:-260px;width:900px;height:640px;background:rgb(16 185 129/.30)"></i>
  <i style="left:520px;top:-320px;width:900px;height:600px;background:rgb(56 150 248/.24)"></i>
  <i style="left:980px;top:-200px;width:700px;height:460px;background:rgb(124 92 246/.14)"></i>
  <i style="right:-200px;top:-280px;width:900px;height:640px;background:rgb(6 182 212/.26)"></i>
</div>
<div class="abs fade"></div><div class="abs wash"></div>
<div class="abs grid"></div>
<div class="abs wm"><svg viewBox="0 0 449 346" style="height:580px;display:block" aria-hidden>
  <defs><linearGradient id="wg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f766e" stop-opacity=".1"/><stop offset="1" stop-color="#0e7490" stop-opacity=".07"/></linearGradient></defs>
  <path fill="url(#wg)" d="M90 0h188.5v66H112l-39 39v95l17 17h91v67.5H65L0 219.5V90z"/>
  <path fill="url(#wg)" d="M114 103.5h264.5V170h-106v176h-39l-33-33V170H114z"/>
  <path fill="#0d9488" fill-opacity=".22" d="M294 202.5h12.5l56 56-56 56H294v-24l32-32-32-32z"/>
  <path fill="#0d9488" fill-opacity=".22" d="M356 290.5h92.5v24H356z"/>
</svg></div>
<div class="abs pill id">${mark(76)}<div><div class="nm">Gustav</div><div class="rl">FULL-STACK DEVELOPER</div></div></div>
<div class="abs pill ct">${contact("c")}</div>`,

  // 6. Soft blur: a real room thrown far out of focus, the way a camera's background blur leaves
  // it: ash-grey walls, a bright doorway, a dark shape at the edge, camera grain. The mark runs huge and
  // faded off the bottom-right edges, out of focus like the wall, and the details stay sharp on frosted cards.
  "06-soft-blur": `
<style>
body{background:#b9b9b7}
.room{inset:-160px;filter:blur(70px)}
.room i{position:absolute;display:block;border-radius:40px}
.sign{right:-380px;bottom:-130px;filter:blur(12px);opacity:.22}
.vig{inset:0;background:radial-gradient(ellipse 75% 70% at 52% 48%,transparent 45%,rgb(40 42 46/.22))}
.grain{inset:0;opacity:.07;mix-blend-mode:multiply}
.pill{background:rgb(255 255 255/.8);border:1px solid rgb(255 255 255/.9);box-shadow:0 18px 40px -22px rgb(20 22 26/.45),inset 0 1px 0 #fff;backdrop-filter:blur(16px);border-radius:28px}
.id{left:80px;top:72px;display:flex;align-items:center;gap:28px;padding:26px 40px 26px 30px}
.nm{font-size:66px;font-weight:800;letter-spacing:-.03em;line-height:1}
.rl{font-family:Mono;font-size:16px;letter-spacing:.22em;color:var(--muted);margin-top:10px}
.ct{right:80px;top:72px;padding:24px 34px;text-align:right}
.c{font-size:25px;color:var(--ink2);line-height:1.7;font-weight:500}
</style>
<div class="abs room">
  <i style="inset:0;border-radius:0;background:linear-gradient(100deg,#a9a9a7 0%,#bcbcba 35%,#c3c3c2 60%,#b6b6b4 100%)"></i>
  <i style="left:0;right:0;top:0;height:300px;border-radius:0;background:linear-gradient(#9a9b9b,transparent)"></i>
  <i style="left:0;right:0;bottom:0;height:380px;border-radius:0;background:linear-gradient(transparent,#a6a6a4)"></i>
  <i style="left:40px;top:560px;width:380px;height:760px;background:#3e3833;opacity:.7"></i>
  <i style="left:160px;top:420px;width:200px;height:300px;background:#5a534d;opacity:.35"></i>
  <i style="left:1260px;top:380px;width:380px;height:820px;background:#d3d6da"></i>
  <i style="left:1320px;top:440px;width:240px;height:700px;background:#dde0e4"></i>
  <i style="left:1660px;top:420px;width:70px;height:800px;background:#9e9e9d;opacity:.6"></i>
  <i style="left:1940px;top:420px;width:300px;height:420px;background:#9c8c74;opacity:.5"></i>
  <i style="left:620px;top:200px;width:520px;height:420px;border-radius:50%;background:#c8c8c7;opacity:.6"></i>
</div>
<div class="abs sign"><svg viewBox="0 0 449 346" style="height:800px;display:block" aria-hidden>
  <path fill="#4a5258" d="M90 0h188.5v66H112l-39 39v95l17 17h91v67.5H65L0 219.5V90z"/>
  <path fill="#4a5258" d="M114 103.5h264.5V170h-106v176h-39l-33-33V170H114z"/>
  <path fill="#0d9488" d="M294 202.5h12.5l56 56-56 56H294v-24l32-32-32-32z"/><path fill="#0d9488" d="M356 290.5h92.5v24H356z"/></svg></div>
<div class="abs vig"></div>
<svg class="abs grain" width="1920" height="1080"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
<div class="abs pill id">${mark(76)}<div><div class="nm">Gustav</div><div class="rl">${ROLE}</div></div></div>
<div class="abs pill ct">${contact("c")}</div>`,

  // 7. Blueprint: an engineering sheet. Title block top left, contact cells top right, and the
  // mark drawn as a dimensioned technical drawing in the bottom-right corner.
  "07-blueprint": `
<style>
body{background:#f3f9fc}
.gr{inset:0;background-size:120px 120px,120px 120px,24px 24px,24px 24px;background-image:linear-gradient(to right,rgb(14 116 144/.12) 1px,transparent 1px),linear-gradient(to bottom,rgb(14 116 144/.12) 1px,transparent 1px),linear-gradient(to right,rgb(14 116 144/.05) 1px,transparent 1px),linear-gradient(to bottom,rgb(14 116 144/.05) 1px,transparent 1px)}
.frame{inset:28px;border:2px solid rgb(14 116 144/.45)}
.tb{left:28px;top:28px;display:grid;grid-template-columns:auto auto;border-right:2px solid rgb(14 116 144/.45);border-bottom:2px solid rgb(14 116 144/.45);background:rgb(243 249 252/.92)}
.tb>div{padding:18px 26px;border-right:1px solid rgb(14 116 144/.3)}
.lb{font-family:Mono;font-size:13px;letter-spacing:.22em;color:#0e7490;opacity:.8}
.nm{font-size:64px;font-weight:800;letter-spacing:-.03em;line-height:1;margin-top:6px}
.rl{font-family:Mono;font-size:16px;letter-spacing:.2em;color:var(--ink2);margin-top:10px}
.cb{right:28px;top:28px;border-left:2px solid rgb(14 116 144/.45);border-bottom:2px solid rgb(14 116 144/.45);background:rgb(243 249 252/.92)}
.cb>div{padding:16px 28px;font-family:Mono;font-size:25px;color:var(--ink2);font-weight:500}
.cb>div+div{border-top:1px solid rgb(14 116 144/.3)}
.cb .lb{display:block;margin-bottom:4px}
.foot{left:56px;bottom:52px;font-family:Mono;font-size:14px;letter-spacing:.2em;color:#0e7490;opacity:.7}
.dw{right:90px;bottom:80px}
.dw text{font-family:Mono;fill:#0e7490}
</style>
<div class="abs gr"></div><div class="abs frame"></div>
<div class="abs tb"><div style="display:flex;align-items:center">${mark(84)}</div>
  <div><div class="lb">PROJECT</div><div class="nm">Gustav</div><div class="rl">${ROLE}</div></div></div>
<div class="abs cb"><div><span class="lb">EMAIL</span>${EMAIL}</div><div><span class="lb">WEB</span>${SITE}</div></div>
<svg class="abs dw" width="640" height="560" viewBox="0 0 640 560">
  <g transform="translate(60 70) scale(1.15)" fill="rgb(13 148 136/.06)" stroke="#0e7490" stroke-width="1.6" stroke-linejoin="round">
    <path d="M90 0h188.5v66H112l-39 39v95l17 17h91v67.5H65L0 219.5V90z"/>
    <path d="M114 103.5h264.5V170h-106v176h-39l-33-33V170H114z"/>
    <path d="M294 202.5h12.5l56 56-56 56H294v-24l32-32-32-32z" fill="rgb(13 148 136/.18)"/>
    <path d="M356 290.5h92.5v24H356z" fill="rgb(13 148 136/.18)"/>
  </g>
  <g stroke="#0e7490" stroke-width="1" fill="none" opacity=".75">
    <path d="M60 520v-30M576 520v-30M60 505h516"/><path d="M60 505l10-5v10zM576 505l-10-5v10z" fill="#0e7490"/>
    <path d="M600 70h-20M600 468h-20M590 70v398"/><path d="M590 70l-5 10h10zM590 468l-5-10h10z" fill="#0e7490"/>
    <path d="M60 173a60 60 0 0 1 43-43" stroke-dasharray="4 4"/>
    <path d="M470 380l70-70h60" />
    <circle cx="470" cy="380" r="4" fill="#0e7490"/>
  </g>
  <text x="318" y="540" font-size="15" text-anchor="middle">449</text>
  <text x="620" y="274" font-size="15" text-anchor="middle" transform="rotate(90 620 274)">346</text>
  <text x="30" y="135" font-size="14">45°</text>
  <text x="548" y="300" font-size="14" letter-spacing="2">PROMPT</text>
</svg>
<div class="abs foot">DWG GTK-001 · SCALE 1:1 · REV A · SHEET 1/1</div>`,

  // 8. Paper layers: stacked cut-paper waves in brand teals, the mark embossed into the front sheet.
  "08-paper-layers": `
<style>
body{background:linear-gradient(180deg,#fbfdfd,#f2f8f7)}
.waves{left:0;bottom:0}
.waves path{filter:drop-shadow(0 -6px 10px rgb(15 23 42/.08))}
.id{left:96px;top:88px;display:flex;align-items:center;gap:30px}
.nm{font-size:76px;font-weight:800;letter-spacing:-.03em;line-height:1}
.rl{font-family:Mono;font-size:17px;letter-spacing:.24em;color:var(--teal2);margin-top:12px;font-weight:500}
.ct{right:96px;top:96px;text-align:right}
.c{font-size:26px;color:var(--ink2);line-height:1.65;font-weight:500}
.em{right:120px;bottom:56px}
</style>
<svg class="abs waves" width="1920" height="1080" viewBox="0 0 1920 1080">
  <path fill="#e3f6f2" d="M0 700C320 640 520 760 860 720S1500 600 1920 640V1080H0z"/>
  <path fill="#cdeee8" d="M0 800C300 760 560 860 900 820S1520 720 1920 760V1080H0z"/>
  <path fill="#b3e6dd" d="M0 890C360 850 640 940 980 900S1560 800 1920 840V1080H0z"/>
  <path fill="#99dcd1" d="M0 970C420 940 700 1010 1060 980S1600 900 1920 930V1080H0z"/>
</svg>
<svg class="abs" style="right:-60px;top:-40px" width="760" height="520" viewBox="0 0 760 520">
  <path fill="#eef9f7" style="filter:drop-shadow(0 6px 10px rgb(15 23 42/.06))" d="M760 0V360C640 420 520 300 380 330S120 280 0 200V0z"/>
</svg>
<div class="abs em" style="filter:drop-shadow(-2px -2px 0 rgb(255 255 255/.7)) drop-shadow(2px 3px 2px rgb(15 23 42/.18))">${mark(130, "#99dcd1", "#5ec8b8")}</div>
<div class="abs id">${mark(96)}<div><div class="nm">Gustav</div><div class="rl">${ROLE}</div></div></div>
<div class="abs ct">${contact("c")}</div>`,

  // 9. Full stack: "full-stack" made literal. Three isometric layers (UI, API, DB) wired together
  // in the bottom-right corner, the mark printed on the top layer.
  "09-full-stack": (() => {
    const slab = (cx, cy, w, t, top, left, right) => {
      const h = w / 2;
      return `<polygon points="${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}" fill="${top}" stroke="rgb(14 116 144/.35)" stroke-width="1.2"/>
<polygon points="${cx - w},${cy} ${cx},${cy + h} ${cx},${cy + h + t} ${cx - w},${cy + t}" fill="${left}"/>
<polygon points="${cx},${cy + h} ${cx + w},${cy} ${cx + w},${cy + t} ${cx},${cy + h + t}" fill="${right}"/>`;
    };
    const cx = 1580, w = 150, t = 22, ys = [470, 685, 900];
    const labels = ["UI · FRONTEND", "API · BACKEND", "DB · DATA"];
    return `
<style>
body{background:radial-gradient(ellipse 60% 70% at 82% 70%,#e6f8f6,#f7f9fc 70%)}
.fine{inset:0;background-size:24px 24px;background-image:linear-gradient(to right,rgb(15 23 42/.035) 1px,transparent 1px),linear-gradient(to bottom,rgb(15 23 42/.035) 1px,transparent 1px)}
.id{left:96px;top:88px;display:flex;align-items:center;gap:30px}
.nm{font-size:78px;font-weight:800;letter-spacing:-.03em;line-height:1}
.rl{font-family:Mono;font-size:17px;letter-spacing:.24em;color:var(--muted);margin-top:12px}
.rl b{color:var(--teal);font-weight:700}
.ct{right:96px;top:96px;text-align:right}
.c{font-size:26px;color:var(--ink2);line-height:1.65;font-weight:500}
svg text{font-family:Mono;font-size:15px;letter-spacing:3px;fill:#64748b}
</style>
<div class="abs fine"></div>
<svg class="abs" style="left:0;top:0" width="1920" height="1080">
  <ellipse cx="${cx}" cy="${ys[2] + 110}" rx="220" ry="60" fill="rgb(13 148 136/.10)" style="filter:blur(20px)"/>
  ${[2, 1, 0].map((i) => slab(cx, ys[i], w, t, i === 0 ? "#ffffff" : i === 1 ? "#f2fbfa" : "#e7f7f4", i === 0 ? "#cdeee8" : i === 1 ? "#b9e5de" : "#a3dcd3", i === 0 ? "#e3f6f2" : i === 1 ? "#d2efea" : "#bfe8e1")).join("")}
  ${[0, 1].map((i) => `<line x1="${cx}" y1="${ys[i] + w / 2 + t + 8}" x2="${cx}" y2="${ys[i + 1] - w / 2 - 8}" stroke="#06b6d4" stroke-width="2" stroke-dasharray="3 6"/><circle cx="${cx}" cy="${(ys[i] + w / 2 + t + ys[i + 1] - w / 2) / 2}" r="5" fill="#06b6d4"/>`).join("")}
  <ellipse cx="${cx}" cy="${ys[0] + 4}" rx="74" ry="20" fill="rgb(13 148 136/.18)" style="filter:blur(6px)"/>
  <g transform="translate(${cx - 70} ${ys[0] - w / 2 - 128}) scale(${140 / 449})">
    <path fill="#0b0f14" d="M90 0h188.5v66H112l-39 39v95l17 17h91v67.5H65L0 219.5V90z"/>
    <path fill="#0b0f14" d="M114 103.5h264.5V170h-106v176h-39l-33-33V170H114z"/>
    <path fill="#0d9488" d="M294 202.5h12.5l56 56-56 56H294v-24l32-32-32-32z"/><path fill="#0d9488" d="M356 290.5h92.5v24H356z"/></g>
  ${ys.map((y, i) => `<line x1="${cx - w - 16}" y1="${y + t / 2}" x2="${cx - w - 70}" y2="${y + t / 2}" stroke="#94a3b8" stroke-width="1"/><circle cx="${cx - w - 16}" cy="${y + t / 2}" r="3" fill="#94a3b8"/><text x="${cx - w - 80}" y="${y + t / 2 + 5}" text-anchor="end">${labels[i]}</text>`).join("")}
</svg>
<div class="abs id">${mark(96)}<div><div class="nm">Gustav</div><div class="rl"><b>FULL-STACK</b> DEVELOPER</div></div></div>
<div class="abs ct">${contact("c")}</div>`;
  })(),

  // 10. Command palette: the site's ⌘K menu, opened top right and already searching for Gustav.
  "10-command-palette": `
<style>
body{background:#f7f9fc}
.glow{border-radius:50%}
.fine{inset:0;background-size:48px 48px;background-image:linear-gradient(to right,rgb(15 23 42/.04) 1px,transparent 1px),linear-gradient(to bottom,rgb(15 23 42/.04) 1px,transparent 1px);-webkit-mask-image:linear-gradient(#000,rgb(0 0 0/.3))}
.id{left:96px;top:88px;display:flex;align-items:center;gap:30px}
.nm{font-size:78px;font-weight:800;letter-spacing:-.03em;line-height:1}
.rl{font-family:Mono;font-size:17px;letter-spacing:.24em;color:var(--muted);margin-top:12px}
.pal{right:80px;top:64px;width:660px;background:rgb(255 255 255/.86);border:1px solid var(--line);border-radius:18px;box-shadow:0 30px 60px -28px rgb(15 23 42/.3);backdrop-filter:blur(14px);overflow:hidden;font-family:Mono}
.in{display:flex;align-items:center;gap:14px;padding:20px 24px;border-bottom:1px solid var(--line);font-size:24px;color:var(--ink)}
.in .q{color:var(--teal);font-weight:700}
.in .cur{width:2px;height:28px;background:var(--cyan)}
.in kbd{margin-left:auto;font-family:Mono;font-size:14px;color:var(--muted);border:1px solid var(--line);border-radius:6px;padding:3px 8px;background:#f8fafc}
.grp{padding:12px 24px 4px;font-size:13px;letter-spacing:.22em;color:#94a3b8}
.row{display:flex;align-items:center;gap:16px;margin:4px 10px;padding:13px 16px;border-radius:10px;font-size:23px;color:var(--ink2)}
.row.on{background:rgb(13 148 136/.09);box-shadow:inset 3px 0 0 var(--teal);color:var(--ink)}
.row .ic{color:var(--teal);width:22px;text-align:center}
.row .k{margin-left:auto;font-size:14px;color:#94a3b8}
.row .ok{width:9px;height:9px;border-radius:50%;background:var(--em);box-shadow:0 0 0 4px rgb(16 185 129/.18)}
.ft{display:flex;gap:22px;padding:12px 24px;border-top:1px solid var(--line);font-size:13px;color:#94a3b8;margin-top:8px}
</style>
<div class="abs glow" style="left:-300px;top:-340px;width:1100px;height:880px;background:radial-gradient(closest-side,rgb(16 185 129/.16),transparent)"></div>
<div class="abs glow" style="right:-260px;top:-360px;width:1200px;height:900px;background:radial-gradient(closest-side,rgb(56 150 248/.14),transparent)"></div>
<div class="abs glow" style="right:200px;bottom:-500px;width:1200px;height:800px;background:radial-gradient(closest-side,rgb(124 92 246/.07),transparent)"></div>
<div class="abs fine"></div>
<div class="abs id">${mark(96)}<div><div class="nm">Gustav</div><div class="rl">${ROLE}</div></div></div>
<div class="abs pal">
  <div class="in"><span class="q">&gt;</span>contact gustav<span class="cur"></span><kbd>⌘ K</kbd></div>
  <div class="grp">CONTACT</div>
  <div class="row on"><span class="ic">@</span>${EMAIL}<span class="k">↵ copy</span></div>
  <div class="row"><span class="ic">↗</span>${SITE}<span class="k">↵ open</span></div>
  <div class="row"><span class="ic"><span class="ok" style="display:inline-block"></span></span>available for work</div>
  <div class="ft"><span>↑↓ navigate</span><span>↵ select</span><span>esc close</span></div>
</div>`,

  // 11. Window office: cool daylight from a window on the left, a plant by the glass, a shelf and
  // a framed print of the mark on the right. Plain, softly lit wall in the middle.
  "11-window-office": `
${room(58, "linear-gradient(90deg,#cfd2d3 0%,#c6c8c8 38%,#bcbdbc 70%,#b1b1af 100%)", [
  sh(-200, -200, 2400, 330, "background:linear-gradient(#a9abac,transparent)"),
  sh(-200, 930, 2400, 400, "background:linear-gradient(#a7a29b,#98928a)"),
  sh(-200, 40, 620, 860, "background:#aab0b4"),
  sh(-180, 70, 580, 800, "background:linear-gradient(180deg,#f4f7f9,#eef2f4 50%,#dfe7e2)"),
  sh(-180, 470, 580, 400, "background:linear-gradient(#cdd9cb,#b9cbb6);opacity:.65"),
  sh(170, 70, 22, 800, "background:#9aa2a7"),
  sh(-180, 440, 580, 18, "background:#9aa2a7"),
  sh(380, 30, 150, 900, "background:#e3e5e5;opacity:.75"),
  sh(420, 120, 520, 760, "border-radius:50%;background:#dcdfe0;opacity:.6"),
  sh(330, 470, 170, 230, "border-radius:50%;background:#56724f"),
  sh(420, 420, 160, 260, "border-radius:50%;background:#6e8f62"),
  sh(290, 600, 150, 180, "border-radius:50%;background:#4d6847"),
  sh(370, 760, 130, 160, "border-radius:10px;background:#ece9e4"),
  sh(1540, 540, 460, 600, "background:#8c8277"),
  sh(1560, 560, 420, 160, "background:#6f665d"),
  sh(1560, 740, 420, 170, "background:#6f665d"),
  books(1575, 590, 125, ["#34444f", "#c4b79c", "#5f8378", "#b19d82", "#2f3a43", "#d8d2c6"], [34, 28, 40, 30]),
  books(1590, 770, 135, ["#a9927a", "#3e5160", "#cfc7b8", "#6f8f86", "#8b6e5a"], [30, 42, 26, 36]),
  sh(1820, 600, 120, 110, "border-radius:50%;background:#7a9a6c"),
  sh(1690, 440, 120, 100, "border-radius:50%;background:#f6e2bd;opacity:.75"),
])}
${framedMark(1500, 270, 270, 13, { opacity: 0.8 })}
${lens(0.18)}${roomCards()}`,

  // 12. Evening lamp: a warm greige room, bookshelf in shadow on the left, a floor lamp glowing on
  // the right with out-of-focus highlights.
  "12-evening-lamp": `
${room(62, "linear-gradient(90deg,#9f978e 0%,#b3aca3 35%,#b9b2a9 62%,#aaa197 100%)", [
  sh(-200, -200, 2400, 360, "background:linear-gradient(#8d857c,transparent)"),
  sh(-200, 940, 2400, 400, "background:linear-gradient(#958b80,#81776c)"),
  sh(-200, 80, 520, 1200, "background:#4a423b"),
  sh(-180, 100, 470, 200, "background:#3a332d"), sh(-180, 330, 470, 200, "background:#3a332d"), sh(-180, 560, 470, 200, "background:#3a332d"),
  books(-160, 140, 150, ["#7a5c45", "#a08a6b", "#56504a", "#8f6f52", "#6a7b72", "#b49a74"], [30, 38, 26, 34]),
  books(-150, 370, 150, ["#9b8467", "#5a6a62", "#a5793f", "#7f6a58", "#c2ab86"], [36, 26, 40, 30]),
  sh(1380, 160, 760, 760, "border-radius:50%;background:radial-gradient(closest-side,rgb(255 214 150/.7),transparent)"),
  sh(1610, 420, 190, 150, "border-radius:40% 40% 8px 8px;background:#fbe8c8"),
  sh(1700, 570, 10, 520, "background:#3c3732"),
  sh(1480, 790, 620, 420, "border-radius:60px;background:#6c645c"),
  sh(1500, 760, 260, 160, "border-radius:40px;background:#7f766d"),
  sh(600, 180, 720, 640, "border-radius:50%;background:#bdb6ad;opacity:.55"),
])}
<div class="abs" style="inset:0">
  ${bokeh(1640, 520, 34, "#ffe6bc", 0.45)}${bokeh(1760, 470, 22, "#ffe0ad", 0.4)}${bokeh(1590, 610, 18, "#ffd9a0", 0.35)}
  ${bokeh(150, 300, 20, "#e9cfa6", 0.25)}${bokeh(90, 520, 26, "#dcc19a", 0.2)}
</div>
${framedMark(350, 300, 230, 13, { frame: "#3a332d", mat: "#e9e3d9", opacity: 0.8 })}
${lens(0.26)}${roomCards()}`,

  // 13. Concrete loft: cool ash concrete, a black steel window on the right, pendant lights and a
  // large plant on the left, the mark painted on the concrete.
  "13-concrete-loft": `
${room(56, "linear-gradient(90deg,#9ea1a2 0%,#a9acad 40%,#b0b3b4 70%,#a6aaac 100%)", [
  sh(-200, -200, 2400, 330, "background:linear-gradient(#8e9192,transparent)"),
  sh(-200, 950, 2400, 400, "background:linear-gradient(#8b8b89,#7a7a78)"),
  sh(1376, 0, 820, 940, "background:#2b2f33"),
  sh(1400, 40, 146, 261, "background:#e3e9ec"), sh(1590, 40, 146, 261, "background:#e8eef0"), sh(1780, 40, 146, 261, "background:#e1e7ea"), sh(1400, 345, 146, 261, "background:#dfe6e9"), sh(1590, 345, 146, 261, "background:#e6ecee"), sh(1780, 345, 146, 261, "background:#dbe2e5"), sh(1400, 650, 146, 261, "background:#cfd8d4"), sh(1590, 650, 146, 261, "background:#d6ded9"), sh(1780, 650, 146, 261, "background:#ccd5d1"),
  sh(1000, 100, 520, 820, "border-radius:50%;background:#c4c8ca;opacity:.6"),
  sh(-160, 560, 300, 360, "border-radius:50%;background:#3d5644"),
  sh(40, 500, 260, 300, "border-radius:50%;background:#4f6b53"),
  sh(-60, 700, 260, 300, "border-radius:50%;background:#34493a"),
  sh(80, 860, 170, 200, "border-radius:16px;background:#5b5e60"),
])}
<div class="abs" style="inset:0">
  <div class="abs" style="left:300px;top:0;width:3px;height:330px;background:#2b2f33;filter:blur(18px);opacity:.6"></div>
  <div class="abs" style="left:520px;top:0;width:3px;height:270px;background:#2b2f33;filter:blur(18px);opacity:.6"></div>
  ${bokeh(302, 352, 30, "#ffe3b3", 0.6)}${bokeh(522, 292, 24, "#ffe3b3", 0.55)}
  <div class="abs" style="left:302px;top:352px;width:0;height:0;box-shadow:0 0 120px 60px rgb(255 220 170/.28)"></div>
  <div class="abs" style="left:522px;top:292px;width:0;height:0;box-shadow:0 0 100px 50px rgb(255 220 170/.24)"></div>
</div>
<div class="abs" style="left:240px;top:550px;filter:blur(18px);opacity:.4">${mark(230, "#2f3437", "#0d9488")}</div>
${lens(0.22)}${roomCards()}`,

  // 14. Bookshelf: built-in light-oak shelving at both edges with books, plants and ceramics, a
  // soft ceiling downlight on the plain wall in the middle, the mark framed on a shelf.
  "14-bookshelf": `
${room(58, "linear-gradient(90deg,#b9b2a9 0%,#c5beb5 30%,#cac4bb 55%,#bfb8af 100%)", [
  sh(-200, -200, 2400, 330, "background:linear-gradient(#aaa39a,transparent)"),
  sh(-200, 960, 2400, 400, "background:linear-gradient(#a1968a,#8f8478)"),
  sh(700, -120, 520, 760, "border-radius:50%;background:radial-gradient(closest-side,rgb(240 234 226/.9),transparent)"),
  sh(-200, 120, 600, 1100, "background:#b0957a"),
  sh(-180, 140, 560, 200, "background:#8f775f"), sh(-180, 380, 560, 210, "background:#8f775f"), sh(-180, 630, 560, 210, "background:#8f775f"),
  books(-160, 180, 150, ["#e7e2d8", "#3f5361", "#b7a284", "#d9cfbf", "#6b8a80"], [30, 26, 38, 32]),
  sh(120, 220, 110, 120, "border-radius:50%;background:#eceae6"),
  sh(230, 180, 130, 160, "border-radius:50%;background:#6f8f5f"),
  books(-150, 420, 160, ["#a88d6c", "#2f3d47", "#cbbfa9", "#8a6d55", "#e3ddd1", "#56736a"], [34, 28, 40, 26]),
  sh(-160, 690, 200, 140, "border-radius:50%;background:#e6e2db"),
  sh(100, 660, 240, 170, "border-radius:50%;background:#5f7f52"),
  sh(1520, 120, 600, 1100, "background:#b0957a"),
  sh(1540, 140, 560, 200, "background:#8f775f"), sh(1540, 380, 560, 210, "background:#8f775f"), sh(1540, 630, 560, 210, "background:#8f775f"),
  books(1560, 170, 160, ["#d9cfbf", "#506b75", "#b39a7a", "#2c3a44", "#e7e2d8", "#9b7e62"], [32, 40, 26, 30]),
  sh(1820, 190, 140, 150, "border-radius:50%;background:#78985f"),
  sh(1580, 690, 150, 140, "border-radius:50%;background:#ecebe7"),
  books(1760, 660, 170, ["#7b8f86", "#c4b293", "#3d4a52", "#a58566"], [36, 30, 42]),
])}
${framedMark(1590, 390, 220, 13, { frame: "#6e5a46", mat: "#f2efe9", opacity: 0.8 })}
${lens(0.2)}${roomCards()}`,

  // 15. Blinds light: a minimal warm-ash wall with morning sun falling through blinds on the right,
  // a sideboard with a framed print of the mark, and a plant at the left edge.
  "15-blinds-light": `
${room(52, "linear-gradient(90deg,#aaa49d 0%,#b7b1aa 40%,#bcb6af 70%,#b2aca5 100%)", [
  sh(-200, -200, 2400, 330, "background:linear-gradient(#9b958e,transparent)"),
  sh(-200, 960, 2400, 400, "background:linear-gradient(#9f978d,#8e867c)"),
  sh(-180, 420, 380, 520, "border-radius:50%;background:#4e5f4b"),
  sh(-100, 300, 260, 380, "border-radius:50%;background:#63775c"),
  sh(1280, 860, 900, 400, "background:#e2ddd5"),
  sh(1300, 900, 860, 30, "background:#cfc8bd"),
  sh(1900, 700, 120, 200, "border-radius:50% 50% 12px 12px;background:#d9d3c9"),
])}
<div class="abs" style="inset:0;filter:blur(18px);opacity:.75">
  <div class="abs" style="left:1060px;top:120px;width:900px;height:720px;transform:skewY(-14deg);background:repeating-linear-gradient(180deg,#efe2cc 0 34px,transparent 34px 58px);-webkit-mask-image:radial-gradient(ellipse 60% 60% at 60% 50%,#000 40%,transparent 100%)"></div>
</div>
${framedMark(1510, 630, 220, 13, { frame: "#2f2c29", mat: "#f3f0ea", opacity: 0.8 })}
${lens(0.2)}${roomCards()}`,

  // 16. Photo office: a generated photo of a grey home office (laptops removed, re-blurred; see
  // assets/clean-photo.py), with the mark hung as a framed print above the shelf.
  "16-photo-office": `
<img class="abs" style="inset:0;width:1920px;height:1080px" src="file://${ASSETS}/photo-office.png">
${framedMark(1430, 300, 230, 11, { frame: "#3a3d40", mat: "#dcdedd", opacity: 0.88 })}
${lens(0.12)}${roomCards()}`,
  // 17. Glass ash: the Glass layout in the photo office's colours (sampled from
  // assets/photo-office.png): ash-grey wall, cool window light left, warm lamp glow right, wood below.
  "17-glass-ash": `
<style>
body{background:#939898}
.field{left:0;right:0;top:0;height:760px;overflow:hidden;filter:blur(90px) saturate(1.05)}
.field i{position:absolute;border-radius:50%;display:block}
.fade{left:0;right:0;top:0;height:780px;background:linear-gradient(rgb(147 152 152/0) 0%,rgb(147 152 152/.18) 25%,rgb(147 152 152/.45) 45%,rgb(147 152 152/.75) 65%,rgb(147 152 152/.94) 82%,#939898 100%)}
.wash{left:0;right:0;bottom:0;height:420px;background:linear-gradient(transparent,rgb(144 129 110/.3))}
.grid{inset:0;background-size:48px 48px;background-image:linear-gradient(to right,rgb(20 22 24/.13) 1px,transparent 1px),linear-gradient(to bottom,rgb(20 22 24/.13) 1px,transparent 1px);
  -webkit-mask-image:radial-gradient(ellipse 120% 100% at 50% 0%,#000 45%,rgb(0 0 0/.8) 100%)}
.pill{background:rgb(255 255 255/.8);border:1px solid rgb(255 255 255/.9);box-shadow:0 18px 40px -22px rgb(20 22 26/.45),inset 0 1px 0 #fff;backdrop-filter:blur(14px);border-radius:28px}
.id{left:80px;top:72px;display:flex;align-items:center;gap:28px;padding:26px 40px 26px 30px}
.nm{font-size:66px;font-weight:800;letter-spacing:-.03em;line-height:1}
.rl{font-family:Mono;font-size:16px;letter-spacing:.22em;color:var(--muted);margin-top:10px}
.ct{right:80px;top:72px;padding:24px 34px;text-align:right}
.c{font-size:25px;color:var(--ink2);line-height:1.7;font-weight:500}
.wm{right:56px;bottom:48px}
</style>
<div class="abs field">
  <i style="left:-160px;top:-260px;width:900px;height:640px;background:rgb(189 193 192/.75)"></i>
  <i style="left:520px;top:-320px;width:900px;height:600px;background:rgb(160 166 166/.55)"></i>
  <i style="left:980px;top:-200px;width:700px;height:460px;background:rgb(207 182 155/.35)"></i>
  <i style="right:-200px;top:-280px;width:900px;height:640px;background:rgb(207 182 155/.5)"></i>
</div>
<div class="abs fade"></div><div class="abs wash"></div>
<div class="abs grid"></div>
<div class="abs wm"><svg viewBox="0 0 449 346" style="height:580px;display:block" aria-hidden>
  <defs><linearGradient id="wga" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f3336" stop-opacity=".1"/><stop offset="1" stop-color="#2f3336" stop-opacity=".07"/></linearGradient></defs>
  <path fill="url(#wga)" d="M90 0h188.5v66H112l-39 39v95l17 17h91v67.5H65L0 219.5V90z"/>
  <path fill="url(#wga)" d="M114 103.5h264.5V170h-106v176h-39l-33-33V170H114z"/>
  <path fill="#0d9488" fill-opacity=".2" d="M294 202.5h12.5l56 56-56 56H294v-24l32-32-32-32z"/>
  <path fill="#0d9488" fill-opacity=".2" d="M356 290.5h92.5v24H356z"/>
</svg></div>
<div class="abs pill id">${mark(76)}<div><div class="nm">Gustav</div><div class="rl">FULL-STACK DEVELOPER</div></div></div>
<div class="abs pill ct">${contact("c")}</div>`,


  // 18. Topographic: contour lines rising to a summit in the bottom-right corner, where the mark
  // stands like a survey marker, with a smaller hill at the bottom left.
  "18-topographic": (() => {
    const ring = (cx, cy, r, i, k) => {
      const pts = [];
      for (let a = 0; a <= 360; a += 4) {
        const t = (a * Math.PI) / 180;
        const rr = r * (1 + 0.13 * Math.sin(3 * t + i * 0.45 + k) + 0.07 * Math.sin(5 * t + 1.3 + k) + 0.04 * Math.sin(9 * t + i));
        pts.push(`${(cx + rr * Math.cos(t)).toFixed(1)},${(cy + rr * 0.78 * Math.sin(t)).toFixed(1)}`);
      }
      return `<polygon points="${pts.join(" ")}" fill="none" stroke="rgb(30 34 36/${i % 5 === 0 ? 0.26 : 0.15})" stroke-width="${i % 5 === 0 ? 1.8 : 1.2}"/>`;
    };
    const main = Array.from({ length: 16 }, (_, i) => ring(1640, 880, 50 + i * 44, i, 0)).join("");
    const small = Array.from({ length: 8 }, (_, i) => ring(150, 1010, 40 + i * 40, i, 2)).join("");
    return `${ashBase()}
<svg class="abs" style="inset:0" width="1920" height="1080">${main}${small}
  <text x="1360" y="660" font-family="Mono" font-size="15" fill="rgb(30 34 36/.4)" letter-spacing="2">240</text>
  <text x="1500" y="760" font-family="Mono" font-size="15" fill="rgb(30 34 36/.4)" letter-spacing="2">460</text>
  <text x="1690" y="958" font-family="Mono" font-size="15" fill="rgb(30 34 36/.55)" letter-spacing="3">▲ GTK · 449 M</text></svg>
<div class="abs" style="left:1586px;top:812px;opacity:.85">${mark(80, "#2b3035", "#0d9488")}</div>
${ashCards()}`;
  })(),

  // 19. Circuit: the mark set in a chip at the bottom right, its traces running out to the edges and
  // ending in pads, a few lit in teal.
  "19-circuit": (() => {
    const cx = 1560, cy = 790, half = 150;
    const traces = [];
    const pads = [];
    const R = rng(19);
    // Pins along each side of the chip, each trace leaving straight then bending 45° to an edge.
    for (let i = 0; i < 7; i++) {
      const y = cy - half + 30 + i * 40;
      const bend = (R() - 0.5) * 120;
      traces.push(`M${cx + half} ${y} H${cx + half + 70 + i * 6} l${Math.abs(bend)} ${bend} H1960`);
      const x = cx - half + 30 + i * 40;
      const b2 = (R() - 0.5) * 120;
      traces.push(`M${x} ${cy + half} V${cy + half + 40 + i * 4} l${b2} ${Math.abs(b2)} V1120`);
    }
    for (let i = 0; i < 6; i++) {
      const y = cy - half + 40 + i * 44;
      const len = 120 + R() * 220;
      traces.push(`M${cx - half} ${y} H${cx - half - 50 - i * 8} l-${40 + i * 10} ${(i - 2.5) * 22} H${cx - half - 90 - len}`);
      pads.push([cx - half - 90 - len, y + (i - 2.5) * 22, i % 3 === 0]);
    }
    for (let i = 0; i < 6; i++) {
      const x = cx - half + 40 + i * 44;
      const len = 80 + R() * 180;
      traces.push(`M${x} ${cy - half} V${cy - half - 40 - i * 6} l${(i - 2.5) * 20} -${40 + i * 8} V${cy - half - 80 - len}`);
      pads.push([x + (i - 2.5) * 20, cy - half - 80 - len, i % 4 === 1]);
    }
    return `${ashBase()}
<svg class="abs" style="inset:0" width="1920" height="1080">
  <g fill="none" stroke="rgb(30 34 36/.2)" stroke-width="3" stroke-linejoin="round">${traces.map((d) => `<path d="${d}"/>`).join("")}</g>
  ${pads.map(([x, y, lit]) => `<circle cx="${x}" cy="${y}" r="8" fill="${lit ? "#2dd4bf" : "none"}" stroke="${lit ? "rgb(45 212 191/.9)" : "rgb(30 34 36/.25)"}" stroke-width="3" ${lit ? 'style="filter:drop-shadow(0 0 8px rgb(45 212 191/.8))"' : ""}/>`).join("")}
  <rect x="${cx - half}" y="${cy - half}" width="${half * 2}" height="${half * 2}" rx="18" fill="rgb(52 57 60/.55)" stroke="rgb(255 255 255/.18)" stroke-width="2"/>
  <rect x="${cx - half + 14}" y="${cy - half + 14}" width="${half * 2 - 28}" height="${half * 2 - 28}" rx="10" fill="none" stroke="rgb(255 255 255/.1)"/>
</svg>
<div class="abs" style="left:${cx - 92}px;top:${cy - 72}px;opacity:.9">${mark(140, "#e8ecec", "#2dd4bf")}</div>
${ashCards()}`;
  })(),

  // 20. Isometric: an isometric drafting grid, with the mark extruded as a solid 3D block at the
  // bottom right.
  "20-isometric": (() => {
    const lines = [];
    const step = 44, k = Math.tan(Math.PI / 6);
    for (let c = -1200; c < 3200; c += step) {
      lines.push(`M${c} 0 L${c - 1080 / k} 1080`, `M${c} 0 L${c + 1080 / k} 1080`);
    }
    const depth = 16;
    const layers = Array.from({ length: depth }, (_, i) => {
      const d = depth - i;
      return `<g transform="translate(${d * 2.6} ${d * 1.5})" fill="rgb(${58 + i * 2} ${62 + i * 2} ${64 + i * 2}/.55)">${MARK_PATHS.map((p) => `<path d="${p}"/>`).join("")}</g>`;
    }).join("");
    return `${ashBase()}
<svg class="abs" style="inset:0;-webkit-mask-image:radial-gradient(ellipse 80% 80% at 75% 80%,#000 20%,rgb(0 0 0/.35) 70%)" width="1920" height="1080"><g stroke="rgb(30 34 36/.1)" stroke-width="1">${lines.map((d) => `<path d="${d}"/>`).join("")}</g></svg>
<svg class="abs" style="left:1290px;top:600px" width="560" height="440" viewBox="0 0 520 400">
  <g transform="translate(10 10)">${layers}
    <g>${MARK_PATHS.slice(0, 2).map((p) => `<path d="${p}" fill="#d9dddd"/>`).join("")}${MARK_PATHS.slice(2).map((p) => `<path d="${p}" fill="#2dd4bf"/>`).join("")}</g>
  </g>
</svg>
<div class="abs" style="left:1290px;top:1010px;width:560px;height:40px;border-radius:50%;background:rgb(20 22 24/.25);filter:blur(16px)"></div>
${ashCards()}`;
  })(),

  // 21. Code ghost: a few lines of code sit faintly on the wall at either side, like a reflection
  // on glass; the middle stays clear.
  "21-code-ghost": `${ashBase()}
<style>
.code{font-family:Mono;font-size:23px;line-height:1.75;color:rgb(255 255 255/.32);white-space:pre;filter:blur(.6px)}
.code .k{color:rgb(45 212 191/.6)}.code .s{color:rgb(255 236 210/.5)}.code .cm{color:rgb(30 34 36/.35)}
</style>
<div class="abs code" style="left:96px;top:330px"><span class="cm">// gustavtk.com</span>
<span class="k">const</span> gustav = {
  role: <span class="s">"full-stack developer"</span>,
  stack: [<span class="s">"react"</span>, <span class="s">"node"</span>, <span class="s">"cloud"</span>],
  available: <span class="k">true</span>,
};</div>
<div class="abs code" style="right:96px;top:360px;text-align:left"><span class="k">async function</span> ship(idea) {
  <span class="k">const</span> app = <span class="k">await</span> build(idea);
  <span class="k">await</span> deploy(app, <span class="s">"cloud"</span>);
  <span class="k">return</span> <span class="s">"✓ live"</span>;
}</div>
<div class="abs" style="right:90px;bottom:70px;opacity:.16">${mark(260, "#1e2224", "#0d9488")}</div>
${ashCards()}`,

  // 22. Light beam: a shaft of warm lamp light falls across the wall from the top right, with dust
  // in the air and the mark's shadow cast inside the beam.
  "22-light-beam": (() => {
    const R = rng(22);
    const dust = Array.from({ length: 70 }, () => {
      const t = R(), w = R();
      const x = 1950 - t * 700 + (w - 0.5) * 320 * (0.4 + t);
      const y = -20 + t * 1100 + (w - 0.5) * 80;
      const r = 1 + R() * 2.6;
      return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="rgb(255 246 230/${(0.25 + R() * 0.45).toFixed(2)})" ${r > 2.6 ? 'style="filter:blur(1.5px)"' : ""}/>`;
    }).join("");
    return `${ashBase()}
<div class="abs" style="inset:0;filter:blur(34px)">
  <svg width="1920" height="1080"><defs><linearGradient id="bm" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(255 236 205)" stop-opacity=".55"/><stop offset=".7" stop-color="rgb(255 236 205)" stop-opacity=".18"/><stop offset="1" stop-color="rgb(255 236 205)" stop-opacity="0"/></linearGradient></defs>
  <polygon points="1760,-40 2060,-40 1560,1120 1120,1120" fill="url(#bm)"/></svg>
</div>
<div class="abs" style="left:1420px;top:660px;transform:skewX(-24deg) scaleY(.92);filter:blur(7px);opacity:.2">${mark(230, "#20242a", "#20242a")}</div>
<svg class="abs" style="inset:0" width="1920" height="1080">${dust}</svg>
${ashCards()}`;
  })(),

  // 23. Panels: a wall of wide architectural panels (seams kept to the sides) with soft wall-washer light, the mark debossed
  // into the bottom-right panel.
  "23-panels": `${ashBase()}
${[300, 1620].map((x) => `<div class="abs" style="left:${x}px;top:0;bottom:0;width:3px;background:linear-gradient(90deg,rgb(30 34 36/.2) 0 2px,rgb(255 255 255/.22) 2px 3px)"></div>`).join("")}
<div class="abs" style="left:1623px;right:0;top:812px;height:3px;background:linear-gradient(rgb(30 34 36/.18),rgb(255 255 255/.22))"></div>
<div class="abs" style="left:150px;top:-60px;width:360px;height:620px;border-radius:50%;background:radial-gradient(closest-side,rgb(255 236 210/.32),transparent);filter:blur(10px)"></div>
<div class="abs" style="left:1430px;top:-60px;width:360px;height:620px;border-radius:50%;background:radial-gradient(closest-side,rgb(255 236 210/.38),transparent);filter:blur(10px)"></div>
<div class="abs" style="left:1500px;top:850px;filter:drop-shadow(-2px -2px 1px rgb(20 22 24/.35)) drop-shadow(2px 2px 1px rgb(255 255 255/.45))">${mark(170, "#8f9494", "#86a6a2")}</div>
${ashCards()}`,

  // 24. Halftone: a print-style dot screen fading in from the bottom-right corner, with the mark
  // itself made of teal dots.
  "24-halftone": `${ashBase()}
<div class="abs" style="inset:0;background-image:radial-gradient(circle,rgb(30 34 36/.3) 3.2px,transparent 3.6px);background-size:20px 20px;-webkit-mask-image:radial-gradient(circle at 100% 100%,#000 0,rgb(0 0 0/.7) 320px,transparent 760px)"></div>
<div class="abs" style="inset:0;background-image:radial-gradient(circle,rgb(30 34 36/.24) 2px,transparent 2.4px);background-size:20px 20px;-webkit-mask-image:radial-gradient(circle at 0% 100%,#000 0,transparent 420px)"></div>
<div class="abs" style="left:1260px;top:540px;width:520px;height:400px;background-image:radial-gradient(circle,#0d9488 4.4px,transparent 5px);background-size:13px 13px;-webkit-mask:url('${markSvgData()}') center/contain no-repeat;opacity:.55"></div>
${ashCards()}`,

  // 25. Network: a constellation of linked nodes along the right edge and bottom, a few glowing
  // teal, gathering around the mark.
  "25-network": (() => {
    const R = rng(25);
    const nodes = [];
    for (let i = 0; i < 46; i++) {
      const side = R();
      let x, y;
      if (side < 0.62) { x = 1300 + R() * 640; y = 300 + R() * 800; }
      else if (side < 0.85) { x = -20 + R() * 520; y = 640 + R() * 460; }
      else { x = 500 + R() * 800; y = 960 + R() * 140; }
      nodes.push([x, y, R() < 0.16]);
    }
    const links = [];
    nodes.forEach(([x, y], i) => {
      nodes.map(([x2, y2], j) => [Math.hypot(x - x2, y - y2), j]).filter(([d, j]) => j > i && d < 190).slice(0, 3)
        .forEach(([d, j]) => links.push(`<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${nodes[j][0].toFixed(0)}" y2="${nodes[j][1].toFixed(0)}" stroke="rgb(255 255 255/${(0.38 - d / 700).toFixed(2)})" stroke-width="1.4"/>`));
    });
    return `${ashBase()}
<svg class="abs" style="inset:0" width="1920" height="1080">${links.join("")}
  ${nodes.map(([x, y, lit]) => lit
    ? `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="6" fill="#5eead4" style="filter:drop-shadow(0 0 8px rgb(45 212 191/.9))"/>`
    : `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="4" fill="rgb(255 255 255/.55)"/>`).join("")}
</svg>
<div class="abs" style="left:1500px;top:700px;opacity:.75">${mark(150, "#e8ecec", "#2dd4bf")}</div>
${ashCards()}`;
  })(),

  // 26. Glass layers: three frosted glass panes stacked in perspective at the bottom right, the
  // mark on the front pane, a nod to working across the stack.
  "26-glass-layers": `${ashBase()}
<style>
.stage{left:1180px;top:430px;width:640px;height:560px;perspective:1400px}
.pane{position:absolute;width:380px;height:300px;border-radius:26px;background:linear-gradient(135deg,rgb(255 255 255/.34),rgb(255 255 255/.1));border:1.5px solid rgb(255 255 255/.55);box-shadow:0 30px 60px -30px rgb(20 22 26/.5),inset 0 1px 0 rgb(255 255 255/.6);backdrop-filter:blur(6px);transform:rotateY(-32deg) rotateX(12deg)}
.pane small{position:absolute;left:24px;bottom:18px;font-family:Mono;font-size:14px;letter-spacing:.24em;color:rgb(30 34 36/.55)}
</style>
<div class="abs stage">
  <div class="pane" style="left:200px;top:0;opacity:.7"><small>DB</small></div>
  <div class="pane" style="left:110px;top:90px;opacity:.85"><small>API</small></div>
  <div class="pane" style="left:20px;top:180px;display:flex;align-items:center;justify-content:center"><div style="opacity:.85">${mark(130, "#2b3035", "#0d9488")}</div><small>UI</small></div>
</div>
${ashCards()}`,

  // 27. Flow lines: a ribbon of fine parallel curves sweeping in from the bottom left and rising
  // to the right, like generative line art.
  "27-flow-lines": (() => {
    const lines = Array.from({ length: 40 }, (_, i) => {
      const o = i * 9;
      const a = (0.1 + 0.32 * Math.sin((i / 40) * Math.PI)).toFixed(2);
      return `<path d="M-40 ${880 + o * 0.5} C 560 ${990 + o * 0.25}, 1120 ${700 + o * 0.35}, 1960 ${500 + o * 0.6}" fill="none" stroke="rgb(255 255 255/${a})" stroke-width="1.2"/>`;
    }).join("");
    const teal = `<path d="M-40 1040 C 560 1070, 1120 830, 1960 700" fill="none" stroke="rgb(45 212 191/.55)" stroke-width="2" style="filter:drop-shadow(0 0 6px rgb(45 212 191/.6))"/>`;
    return `${ashBase()}
<svg class="abs" style="inset:0" width="1920" height="1080">${lines}${teal}</svg>
<div class="abs" style="right:100px;bottom:80px;opacity:.2">${mark(200, "#1e2224", "#0d9488")}</div>
${ashCards()}`;
  })(),

  // 28. Terminal 3D: a dark terminal window floating in perspective at the bottom right, mid-way
  // through scaffolding "gustav" across the stack.
  "28-terminal-3d": `${ashBase()}
<style>
.t3{left:1230px;top:470px;width:600px;perspective:1500px}
.term{transform:rotateY(-26deg) rotateX(8deg);background:rgb(24 27 29/.82);border:1px solid rgb(255 255 255/.14);border-radius:18px;box-shadow:0 40px 80px -30px rgb(10 12 14/.7),inset 0 1px 0 rgb(255 255 255/.08);overflow:hidden;font-family:Mono}
.tbar{display:flex;align-items:center;gap:9px;padding:14px 18px;border-bottom:1px solid rgb(255 255 255/.08);font-size:14px;color:rgb(255 255 255/.5)}
.tbar i{width:11px;height:11px;border-radius:50%;display:block}
.tbar span{margin-left:auto}
.tbody{padding:18px 22px 24px;font-size:19px;line-height:1.85;color:rgb(255 255 255/.86);white-space:pre}
.tbody .g{color:#5eead4}.tbody .m{color:rgb(255 255 255/.45)}
.cur{display:inline-block;width:11px;height:22px;background:#5eead4;vertical-align:-4px}
</style>
<div class="abs t3"><div class="term">
  <div class="tbar"><i style="background:#f87171"></i><i style="background:#fbbf24"></i><i style="background:#34d399"></i><span>gustav@gtk: ~</span></div>
  <div class="tbody"><span class="g">$</span> npx create-gustav-app
<span class="g">✓</span> frontend   <span class="m">react · next</span>
<span class="g">✓</span> backend    <span class="m">node · postgres</span>
<span class="g">✓</span> cloud      <span class="m">deployed</span>
<span class="g">$</span> status
<span class="g">●</span> available for new projects
<span class="g">$</span> <span class="cur"></span></div>
</div></div>
${ashCards()}`,

  // 29. Git graph: a branch-and-merge commit graph running along the bottom right, feature
  // branches peeling off main and merging back, the last commit tagged with the mark.
  "29-git-graph": (() => {
    const yMain = 960, yA = 860, yB = 760;
    const main = `M1080 ${yMain} H1960`;
    const fa = `M1180 ${yMain} C1240 ${yMain}, 1240 ${yA}, 1300 ${yA} H1500 C1560 ${yA}, 1560 ${yMain}, 1620 ${yMain}`;
    const fb = `M1360 ${yA} C1420 ${yA}, 1420 ${yB}, 1480 ${yB} H1700 C1760 ${yB}, 1760 ${yMain}, 1820 ${yMain}`;
    const dot = (x, y, c = "#f1f3f3") => `<circle cx="${x}" cy="${y}" r="10" fill="${c}" stroke="rgb(30 34 36/.35)" stroke-width="2"/>`;
    const lbl = (x, y, t, c = "rgb(255 255 255/.75)") => `<text x="${x}" y="${y}" font-family="Mono" font-size="15" fill="${c}" letter-spacing="1">${t}</text>`;
    return `${ashBase()}
<svg class="abs" style="inset:0" width="1920" height="1080">
  <g fill="none" stroke-width="5" stroke-linecap="round">
    <path d="${main}" stroke="rgb(241 243 243/.75)"/><path d="${fa}" stroke="rgb(94 234 212/.8)"/><path d="${fb}" stroke="rgb(207 182 155/.9)"/>
  </g>
  ${dot(1120, yMain)}${dot(1240, yMain)}${dot(1360, yA, "#5eead4")}${dot(1440, yA, "#5eead4")}${dot(1560, yB, "#e2cdb4")}${dot(1660, yB, "#e2cdb4")}${dot(1620, yMain)}${dot(1820, yMain)}
  ${lbl(1090, yMain + 40, "main")}${lbl(1300, yA - 22, "feat/frontend", "rgb(94 234 212/.9)")}${lbl(1480, yB - 22, "feat/api", "rgb(226 205 180/.95)")}
  ${lbl(1596, yMain + 40, "merge")}${lbl(1772, yMain + 40, "v1.0 · ship it")}
</svg>
<div class="abs" style="left:1790px;top:${yMain - 120}px;opacity:.9">${mark(62, "#f1f3f3", "#5eead4")}</div>
${ashCards()}`;
  })(),

  // 30. Globe: a wireframe globe rising from the bottom right, with teal flight arcs between a few
  // points, for work shipped to clients anywhere.
  "30-globe": (() => {
    const cx = 1640, cy = 900, r = 300;
    const merid = Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * Math.PI;
      return `<ellipse cx="${cx}" cy="${cy}" rx="${Math.abs(r * Math.cos(a)).toFixed(1)}" ry="${r}" />`;
    }).join("");
    const lat = [-60, -40, -20, 0, 20, 40, 60].map((d) => {
      const t = (d * Math.PI) / 180;
      return `<ellipse cx="${cx}" cy="${(cy + r * Math.sin(t)).toFixed(1)}" rx="${(r * Math.cos(t)).toFixed(1)}" ry="${(r * Math.cos(t) * 0.16).toFixed(1)}" />`;
    }).join("");
    const pts = [[1450, 760], [1600, 700], [1780, 790], [1700, 960], [1520, 900]];
    const arcs = [[0, 2], [1, 3], [4, 2], [0, 3]].map(([a, b]) => {
      const [x1, y1] = pts[a], [x2, y2] = pts[b];
      return `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 140} ${x2} ${y2}" />`;
    }).join("");
    return `${ashBase()}
<svg class="abs" style="inset:0" width="1920" height="1080">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="rgb(255 255 255/.05)" stroke="rgb(255 255 255/.35)" stroke-width="1.6"/>
  <g fill="none" stroke="rgb(255 255 255/.22)" stroke-width="1.2">${merid}${lat}</g>
  <g fill="none" stroke="rgb(94 234 212/.85)" stroke-width="2.2" stroke-dasharray="6 7" style="filter:drop-shadow(0 0 5px rgb(45 212 191/.6))">${arcs}</g>
  ${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#5eead4" style="filter:drop-shadow(0 0 7px rgb(45 212 191/.9))"/>`).join("")}
</svg>
<div class="abs" style="left:${cx - 58}px;top:${cy - r - 118}px;opacity:.85">${mark(90, "#f1f3f3", "#5eead4")}</div>
${ashCards()}`;
  })(),

  // 31. ASCII: the mark drawn in code characters, like an old terminal render, filling the bottom
  // right with the >_ in teal.
  "31-ascii-mark": (() => {
    const R = rng(31);
    const chars = "01{}<>/;=()[]+*#";
    const cell = 9.2, k = 1.3, ox = 1290, oy = 560;
    const glyphs = [];
    for (let y = 0; y < 346; y += cell) for (let x = 0; x < 449; x += cell) {
      const part = markPart(x + cell / 2, y + cell / 2);
      if (part < 0 && R() > 0.06) continue;
      const ch = chars[Math.floor(R() * chars.length)].replace("<", "&lt;").replace(">", "&gt;");
      const fill = part === 0 ? "rgb(241 243 243/.7)" : part === 1 ? "#5eead4" : "rgb(241 243 243/.18)";
      glyphs.push(`<text x="${(ox + x * k).toFixed(1)}" y="${(oy + (y + cell) * k).toFixed(1)}" fill="${fill}">${ch}</text>`);
    }
    return `${ashBase()}
<svg class="abs" style="inset:0" width="1920" height="1080"><g font-family="Mono" font-weight="700" font-size="${(cell * k * 1.05).toFixed(1)}">${glyphs.join("")}</g></svg>
${ashCards()}`;
  })(),

  // 32. Neon: the mark bent in glowing neon tube on a clear acrylic plate, mounted on the wall at the
  // bottom right, washing the wall in teal.
  "32-neon": `${ashBase()}
<div class="abs" style="left:1260px;top:540px;width:640px;height:520px;border-radius:50%;background:radial-gradient(closest-side,rgb(45 212 191/.25),transparent)"></div>
<div class="abs" style="left:1350px;top:610px;width:470px;height:390px;border-radius:22px;background:rgb(255 255 255/.06);border:1.5px solid rgb(255 255 255/.22);box-shadow:0 30px 50px -30px rgb(10 12 14/.5)">
  ${[[18, 18], [430, 18], [18, 350], [430, 350]].map(([x, y]) => `<i style="position:absolute;left:${x}px;top:${y}px;width:12px;height:12px;border-radius:50%;background:rgb(220 224 224/.7);display:block"></i>`).join("")}
</div>
<svg class="abs" style="left:1395px;top:650px" width="380" height="300" viewBox="-12 -12 473 370">
  <g fill="none" stroke-linejoin="round" stroke-linecap="round">
    ${MARK_PATHS.slice(0, 2).map((d) => `<path d="${d}" stroke="#f2fffc" stroke-width="7" style="filter:drop-shadow(0 0 6px rgb(255 255 255/.9)) drop-shadow(0 0 18px rgb(94 234 212/.8))"/>`).join("")}
    ${MARK_PATHS.slice(2).map((d) => `<path d="${d}" stroke="#7af5e1" stroke-width="7" style="filter:drop-shadow(0 0 6px rgb(94 234 212/1)) drop-shadow(0 0 22px rgb(45 212 191/.9))"/>`).join("")}
  </g>
</svg>
<svg class="abs" style="left:1700px;top:1000px" width="160" height="80"><path d="M10 0 C 30 50, 90 40, 150 80" fill="none" stroke="rgb(30 34 36/.5)" stroke-width="3"/></svg>
${ashCards()}`,

  // 33. Low poly: a faceted, folded-paper landscape of grey triangles rising into the bottom-right
  // corner, the mark pressed into the largest facets.
  "33-low-poly": (() => {
    const R = rng(33);
    const x0 = 1080, y0 = 520, cols = 9, rowsN = 7, cw = 110, ch = 100;
    const P = [];
    for (let r = 0; r <= rowsN; r++) {
      P.push([]);
      for (let c = 0; c <= cols; c++) {
        const edge = r === 0 || c === 0 || r === rowsN || c === cols;
        P[r].push([x0 + c * cw + (edge ? 0 : (R() - 0.5) * 70), y0 + r * ch + (edge ? 0 : (R() - 0.5) * 60)]);
      }
    }
    const tris = [];
    for (let r = 0; r < rowsN; r++) for (let c = 0; c < cols; c++) {
      const a = P[r][c], b = P[r][c + 1], d = P[r + 1][c], e = P[r + 1][c + 1];
      const flip = R() < 0.5;
      for (const t of flip ? [[a, b, e], [a, e, d]] : [[a, b, d], [b, e, d]]) {
        // Facets brighten toward the lamp (top right) and darken toward the floor.
        const mx = (t[0][0] + t[1][0] + t[2][0]) / 3, my = (t[0][1] + t[1][1] + t[2][1]) / 3;
        const v = 150 + (mx - x0) * 0.04 - (my - y0) * 0.05 + (R() - 0.5) * 34;
        tris.push(`<polygon points="${t.map((p) => p.join(",")).join(" ")}" fill="rgb(${v.toFixed(0)} ${(v + 4).toFixed(0)} ${(v + 4).toFixed(0)})" stroke="rgb(255 255 255/.14)" stroke-width="1"/>`);
      }
    }
    return `${ashBase()}
<svg class="abs" style="inset:0;-webkit-mask-image:radial-gradient(circle at 100% 100%,#000 0,#000 420px,transparent 900px)" width="1920" height="1080">${tris.join("")}</svg>
<div class="abs" style="left:1560px;top:810px;filter:drop-shadow(-2px -2px 1px rgb(20 22 24/.4)) drop-shadow(2px 2px 1px rgb(255 255 255/.4))">${mark(140, "#a5aaaa", "#7fb3ab")}</div>
${ashCards()}`;
  })(),

  // 34. Browser cascade: three wireframe browser windows cascading down the right side, page
  // skeletons inside, the front one open on gustavtk.com.
  "34-browser-cascade": (() => {
    const win = (x, y, w, h, front) => `
<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:14px;background:rgb(255 255 255/${front ? 0.16 : 0.07});border:1.5px solid rgb(255 255 255/${front ? 0.55 : 0.3});box-shadow:0 30px 60px -32px rgb(10 12 14/.55);backdrop-filter:blur(${front ? 8 : 3}px);overflow:hidden">
  <div style="display:flex;align-items:center;gap:7px;padding:12px 14px;border-bottom:1px solid rgb(255 255 255/.18)">
    <i style="width:9px;height:9px;border-radius:50%;background:rgb(255 255 255/.45);display:block"></i><i style="width:9px;height:9px;border-radius:50%;background:rgb(255 255 255/.35);display:block"></i><i style="width:9px;height:9px;border-radius:50%;background:rgb(255 255 255/.25);display:block"></i>
    <span style="margin-left:12px;flex:1;height:22px;border-radius:11px;background:rgb(255 255 255/.14);font-family:Mono;font-size:13px;line-height:22px;padding-left:12px;color:rgb(255 255 255/.75)">${front ? "gustavtk.com" : ""}</span>
  </div>
  <div style="padding:22px">
    ${front ? `<div style="display:flex;align-items:center;gap:16px;margin-bottom:20px"><div style="opacity:.9">${mark(46, "#f1f3f3", "#5eead4")}</div><div style="height:14px;width:150px;border-radius:7px;background:rgb(255 255 255/.4)"></div></div>` : ""}
    <div style="height:12px;width:78%;border-radius:6px;background:rgb(255 255 255/.25);margin-bottom:12px"></div>
    <div style="height:12px;width:62%;border-radius:6px;background:rgb(255 255 255/.18);margin-bottom:22px"></div>
    <div style="display:flex;gap:12px"><div style="flex:1;height:${front ? 80 : 60}px;border-radius:10px;background:rgb(255 255 255/.12)"></div><div style="flex:1;height:${front ? 80 : 60}px;border-radius:10px;background:rgb(255 255 255/.12)"></div><div style="flex:1;height:${front ? 80 : 60}px;border-radius:10px;background:${front ? "rgb(94 234 212/.35)" : "rgb(255 255 255/.12)"}"></div></div>
  </div>
</div>`;
    return `${ashBase()}${win(1560, 330, 340, 240, false)}${win(1480, 500, 380, 270, false)}${win(1380, 690, 440, 320, true)}${ashCards()}`;
  })(),

  // 35. Waveform: an equaliser of live audio bars rising from the bottom corners, for a call
  // background that answers to the voice in it, with the centre left quiet.
  "35-waveform": (() => {
    const bars = [];
    const add = (from, to) => {
      for (let x = from; x < to; x += 16) {
        const t = x / 1920;
        const h = 40 + 160 * Math.abs(Math.sin(x * 0.021) * Math.cos(x * 0.0071) + 0.4 * Math.sin(x * 0.063)) * (from > 900 ? 1.25 : 0.9);
        const lit = (x / 16) % 9 === 0;
        bars.push(`<rect x="${x}" y="${1080 - h}" width="9" height="${h}" rx="4.5" fill="${lit ? "rgb(94 234 212/.75)" : "rgb(241 243 243/.32)"}" ${lit ? 'style="filter:drop-shadow(0 0 6px rgb(45 212 191/.7))"' : ""}/>`);
        bars.push(`<rect x="${x}" y="${1080 - h - 16}" width="9" height="5" rx="2.5" fill="rgb(241 243 243/.45)"/>`);
        void t;
      }
    };
    add(16, 560);
    add(1320, 1920);
    return `${ashBase()}
<svg class="abs" style="inset:0" width="1920" height="1080">${bars.join("")}</svg>
<div class="abs" style="right:96px;top:640px;font-family:Mono;font-size:15px;letter-spacing:.24em;color:rgb(241 243 243/.75);display:flex;align-items:center;gap:10px"><i style="width:10px;height:10px;border-radius:50%;background:#f87171;box-shadow:0 0 10px rgb(248 113 113/.8);display:block"></i>ON AIR</div>
<div class="abs" style="right:96px;top:690px;opacity:.75">${mark(64, "#f1f3f3", "#5eead4")}</div>
${ashCards()}`;
  })(),

  // 36. Keycaps: oversized mechanical keyboard keys at the bottom right spelling the mark, G, T and
  // >_, with a wide "ship" enter key.
  "36-keycaps": (() => {
    const key = (x, y, w, legend, opts = {}) => {
      const { color = "#e6e9e9", ink = "#1f2427", side = "#9ea4a5", font = "Jakarta", size = 64 } = opts;
      return `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:150px">
  <div style="position:absolute;inset:14px 0 0 0;border-radius:22px;background:${side};box-shadow:0 26px 40px -18px rgb(10 12 14/.6)"></div>
  <div style="position:absolute;left:10px;right:10px;top:0;height:120px;border-radius:18px;background:linear-gradient(160deg,#ffffff 0%,${color} 60%);box-shadow:inset 0 -6px 10px rgb(0 0 0/.08);display:flex;align-items:center;justify-content:center;font-family:${font};font-weight:800;font-size:${size}px;color:${ink};letter-spacing:-.02em">${legend}</div>
</div>`;
    };
    return `${ashBase()}
<div class="abs" style="left:1190px;top:640px;width:720px;height:440px;transform:rotate(-8deg);transform-origin:50% 50%">
  ${key(40, 40, 150, "G")}${key(210, 40, 150, "T")}${key(380, 40, 150, "&gt;_", { ink: "#0d9488", font: "Mono", size: 58 })}
  ${key(120, 210, 410, "ship ⏎", { color: "#5eead4", side: "#2f8f84", ink: "#0b3b36", font: "Mono", size: 40 })}
</div>
${ashCards()}`;
  })(),

  // 37. Pixel deploy: the mark built from square pixels that break away and stream off the right
  // edge, as if it were being deployed.
  "37-pixel-deploy": (() => {
    const R = rng(37);
    const step = 14, s = 1.18, ox = 1220, oy = 520;
    const px = [];
    for (let y = 0; y < 346; y += step) for (let x = 0; x < 449; x += step) {
      const part = markPart(x + step / 2, y + step / 2);
      if (part < 0) continue;
      const fly = x / 449;
      const gone = R() < Math.max(0, fly - 0.45) * 1.4;
      const size = step * s - 3;
      if (!gone) {
        px.push(`<rect x="${(ox + x * s).toFixed(1)}" y="${(oy + y * s).toFixed(1)}" width="${size.toFixed(1)}" height="${size.toFixed(1)}" rx="2" fill="${part ? "#5eead4" : "rgb(241 243 243/.82)"}"/>`);
      } else {
        // Broken-off pixels drift right and up, shrinking and fading the further they travel.
        const d = R();
        const dx = 80 + d * 520, dy = -(R() * 160);
        const k = 1 - d * 0.7;
        px.push(`<rect x="${(ox + x * s + dx).toFixed(1)}" y="${(oy + y * s + dy).toFixed(1)}" width="${(size * k).toFixed(1)}" height="${(size * k).toFixed(1)}" rx="2" fill="${part ? "rgb(94 234 212/" : "rgb(241 243 243/"}${(0.75 - d * 0.6).toFixed(2)})"/>`);
      }
    }
    return `${ashBase()}
<svg class="abs" style="inset:0" width="1920" height="1080">${px.join("")}</svg>
<div class="abs" style="left:1224px;top:1010px;font-family:Mono;font-size:15px;letter-spacing:.2em;color:rgb(241 243 243/.7)">DEPLOYING · 87%</div>
<div class="abs" style="left:1224px;top:988px;width:340px;height:4px;border-radius:2px;background:rgb(255 255 255/.2)"><div style="width:87%;height:100%;border-radius:2px;background:#5eead4"></div></div>
${ashCards()}`;
  })(),
};

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
mkdirSync(resolve(OUT, "mirrored"), { recursive: true });
for (const [name, body] of Object.entries(variants)) {
  for (const mirrored of [false, true]) {
    const flip = mirrored ? "html{transform:scaleX(-1)}" : "";
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>${base}${flip}</style></head><body>${body}</body></html>`;
    const file = resolve(OUT, `${name}.html`);
    writeFileSync(file, html);
    await page.goto("file://" + file);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: resolve(OUT, mirrored ? `mirrored/${name}-mirrored.png` : `${name}.png`) });
  }
}
await browser.close();
