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
.grid{inset:0;background-size:48px 48px;background-image:linear-gradient(to right,rgb(20 22 24/.05) 1px,transparent 1px),linear-gradient(to bottom,rgb(20 22 24/.05) 1px,transparent 1px);
  -webkit-mask-image:radial-gradient(ellipse 120% 100% at 50% 0%,#000 35%,rgb(0 0 0/.55) 100%)}
.pill{background:rgb(178 183 183/.72);border:1px solid rgb(255 255 255/.28);box-shadow:0 18px 40px -22px rgb(20 22 26/.45),inset 0 1px 0 rgb(255 255 255/.35);backdrop-filter:blur(14px);border-radius:28px}
.id{left:80px;top:72px;display:flex;align-items:center;gap:28px;padding:26px 40px 26px 30px}
.nm{font-size:66px;font-weight:800;letter-spacing:-.03em;line-height:1}
.rl{font-family:Mono;font-size:16px;letter-spacing:.22em;color:#41484c;margin-top:10px}
.ct{right:80px;top:72px;padding:24px 34px;text-align:right}
.c{font-size:25px;color:#22272a;line-height:1.7;font-weight:500}
.c .p{color:#0b6f66}
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
<div class="abs pill id">${mark(76, "#15191c", "#0b6f66")}<div><div class="nm" style="color:#15191c">Gustav</div><div class="rl">FULL-STACK DEVELOPER</div></div></div>
<div class="abs pill ct">${contact("c")}</div>`,

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
