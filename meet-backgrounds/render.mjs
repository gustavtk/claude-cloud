import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUT = process.argv[2];
mkdirSync(OUT, { recursive: true });
const fs = (p) => "file://" + resolve("node_modules/@fontsource", p);

const EMAIL = "gustav@gustavtk.com";
const SITE = "gustavtk.com";

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

const variants = {
  // 1. Clean grid: the site's grid background, inverted to light, with a soft teal glow.
  "01-grid-studio": `
<style>
body{background:#f8fafc}
.grid{inset:0;background-size:48px 48px;background-image:linear-gradient(to right,rgb(15 23 42/.05) 1px,transparent 1px),linear-gradient(to bottom,rgb(15 23 42/.05) 1px,transparent 1px);
  -webkit-mask-image:radial-gradient(ellipse 80% 90% at 50% 50%,#000 30%,transparent 100%)}
.glow1{right:-260px;top:-300px;width:1100px;height:900px;background:radial-gradient(closest-side,rgb(1 240 201/.22),transparent)}
.glow2{left:-300px;bottom:-400px;width:1000px;height:900px;background:radial-gradient(closest-side,rgb(6 182 212/.12),transparent)}
.id{right:96px;top:84px;text-align:right;display:flex;flex-direction:column;align-items:flex-end}
.name{font-size:76px;font-weight:800;letter-spacing:-.03em;line-height:1;margin-top:26px}
.role{font-size:18px;letter-spacing:.24em;text-transform:uppercase;color:var(--muted);margin-top:14px;font-family:Mono;font-weight:500}
.rule{width:56px;height:3px;background:linear-gradient(90deg,var(--cyan),var(--em));margin:28px 0 24px}
.c{font-size:27px;color:var(--ink2);line-height:1.65;font-weight:500}
.foot{left:96px;bottom:72px;font-size:16px;color:#94a3b8;letter-spacing:.18em}
</style>
<div class="abs grid"></div><div class="abs glow1"></div><div class="abs glow2"></div>
<div class="abs id">${mark(78)}
  <div class="name">Gustav</div>
  <div class="role">Web Developer</div>
  <div class="rule"></div>
  <div class="c mono"><span class="p">@</span> ${EMAIL}</div>
  <div class="c mono"><span class="p">↗</span> ${SITE}</div>
</div>
<div class="abs foot mono">&gt; STATUS: ONLINE</div>`,

  // 2. Terminal: the hero's window chrome and boot lines, as a light shell session.
  "02-terminal": `
<style>
body{background:#f3f5f8}
.fine{inset:0;background-size:18px 18px;background-image:linear-gradient(to right,rgb(15 23 42/.035) 1px,transparent 1px),linear-gradient(to bottom,rgb(15 23 42/.035) 1px,transparent 1px)}
.bar{left:0;right:0;top:0;height:58px;background:#fff;border-bottom:1px solid var(--line);display:flex;align-items:center;padding:0 28px;font-size:17px;color:var(--muted)}
.dots{display:flex;gap:10px}.dots i{width:14px;height:14px;border-radius:50%;display:block}
.title{position:absolute;left:0;right:0;text-align:center}
.pill{margin-left:auto;display:flex;align-items:center;gap:10px;border:1px solid rgb(16 185 129/.45);background:rgb(16 185 129/.08);color:#047857;border-radius:99px;padding:6px 16px;font-size:15px}
.pill b{width:9px;height:9px;border-radius:50%;background:var(--em);box-shadow:0 0 0 4px rgb(16 185 129/.18)}
.sh{right:96px;top:128px;width:600px;font-size:24px;line-height:1.55}
.cmd{color:var(--muted)}.cmd .p{font-weight:700}
.out{color:var(--ink2);margin:2px 0 22px;font-weight:500}
.big{font-family:Jakarta;font-size:84px;font-weight:800;letter-spacing:-.03em;color:var(--ink);line-height:1.1;display:flex;align-items:center;gap:14px}
.cur{width:16px;height:64px;background:var(--cyan);display:inline-block}
.wm{left:-60px;bottom:-120px;opacity:.035}
</style>
<div class="abs fine"></div>
<div class="abs bar mono"><span class="dots"><i style="background:#f87171"></i><i style="background:#fbbf24"></i><i style="background:#34d399"></i></span>
  <span class="title">gustav@gustavtk: ~</span><span class="pill"><b></b>available for work</span></div>
<div class="abs wm">${mark(620, "#0b0f14", "#0b0f14")}</div>
<div class="abs sh mono">
  <div class="cmd"><span class="p">&gt;</span> whoami</div>
  <div class="big">Gustav<span class="cur"></span></div>
  <div class="out" style="color:var(--muted);font-size:20px;letter-spacing:.12em;margin-top:6px">WEB_DEVELOPER</div>
  <div class="cmd"><span class="p">&gt;</span> contact --email</div>
  <div class="out">${EMAIL}</div>
  <div class="cmd"><span class="p">&gt;</span> open</div>
  <div class="out">https://${SITE}</div>
</div>`,

  // 3. Access pass: the hero's lanyard badge, hanging in the top-right corner.
  "03-access-pass": `
<style>
body{background:radial-gradient(ellipse 70% 80% at 80% 10%,#ffffff,#eef2f5)}
.dotsbg{inset:0;background-image:radial-gradient(rgb(15 23 42/.08) 1.2px,transparent 1.2px);background-size:30px 30px;-webkit-mask-image:linear-gradient(200deg,#000,transparent 70%)}
.strap{right:316px;top:-10px;width:36px;height:150px;background:repeating-linear-gradient(0deg,#0e7490 0 9px,#06b6d4 9px 12px);border-radius:0 0 4px 4px}
.clip{right:306px;top:128px;width:56px;height:30px;border-radius:6px;background:linear-gradient(#cbd5e1,#94a3b8);box-shadow:inset 0 -3px 0 rgb(0 0 0/.12)}
.card{right:144px;top:150px;width:400px;border-radius:22px;background:#fff;box-shadow:0 30px 60px -20px rgb(15 23 42/.28),0 0 0 1px rgb(15 23 42/.06);overflow:hidden;transform:rotate(-3deg);transform-origin:50% 0}
.slot{width:70px;height:12px;border-radius:6px;background:#e2e8f0;margin:18px auto 0}
.head{background:#0b0f14;margin:18px 18px 0;border-radius:14px;padding:26px 26px 22px;display:flex;justify-content:space-between;align-items:flex-end}
.head small{font-family:Mono;color:#94a3b8;font-size:13px;letter-spacing:.2em;line-height:1.6;text-align:right}
.head small b{color:var(--mint);font-weight:500}
.body{padding:26px 30px 28px}
.lbl{font-family:Mono;font-size:12px;letter-spacing:.22em;color:#94a3b8}
.nm{font-size:58px;font-weight:800;letter-spacing:-.03em;line-height:1.05;margin:4px 0 2px}
.rl{font-size:18px;color:var(--teal);font-weight:700}
.kv{margin-top:20px;font-family:Mono;font-size:19px;color:var(--ink2);line-height:1.7}
.bc{height:44px;margin-top:22px;background:repeating-linear-gradient(90deg,#0b0f14 0 2px,transparent 2px 3px,#0b0f14 3px 4px,transparent 4px 7px,#0b0f14 7px 8px,transparent 8px 9px,#0b0f14 9px 12px,transparent 12px 14px)}
.ac{display:flex;justify-content:space-between;font-family:Mono;font-size:12px;color:#94a3b8;letter-spacing:.2em;margin-top:8px}
.ac b{color:var(--em);font-weight:700}
</style>
<div class="abs dotsbg"></div>
<div class="abs strap"></div><div class="abs clip"></div>
<div class="abs card"><div class="slot"></div>
  <div class="head">${mark(70, "#fafafa", "#01f0c9")}<small>ACCESS PASS<br><b>GUSTAV_TK</b></small></div>
  <div class="body">
    <div class="lbl">NAME</div><div class="nm">Gustav</div><div class="rl">Web Developer</div>
    <div class="kv"><span class="p">@</span> ${EMAIL}<br><span class="p">↗</span> ${SITE}</div>
    <div class="bc"></div><div class="ac"><span>ID · GTK-001</span><b>● ACCESS GRANTED</b></div>
  </div></div>`,

  // 4. Monogram: the mark drawn as a huge teal outline, bleeding off the bottom-left.
  "04-monogram": `
<style>
body{background:linear-gradient(135deg,#ffffff 0%,#f6faf9 50%,#e9f7f4 100%)}
.big{left:-160px;bottom:-260px;opacity:.55}
.big2{left:-120px;bottom:-230px;opacity:.25}
.id{right:100px;top:96px;display:flex;gap:30px;align-items:stretch}
.vr{width:3px;border-radius:2px;background:linear-gradient(var(--cyan),var(--em))}
.t{display:flex;flex-direction:column;justify-content:center}
.nm{font-size:88px;font-weight:800;letter-spacing:-.04em;line-height:.95}
.nm .p{color:var(--teal)}
.rl{font-family:Mono;font-size:18px;letter-spacing:.26em;color:var(--muted);margin:16px 0 26px}
.c{font-family:Mono;font-size:26px;color:var(--ink2);line-height:1.6;font-weight:500}
.small{right:100px;bottom:80px}
</style>
<div class="abs big">${markOutline(900, "#14b8a6", 1.2)}</div>
<div class="abs big2">${markOutline(900, "#06b6d4", 0.8)}</div>
<div class="abs id"><div class="vr"></div><div class="t">
  <div class="nm">Gustav<span class="p">.</span></div>
  <div class="rl">WEB DEVELOPER</div>
  <div class="c">${EMAIL}</div><div class="c">${SITE}</div></div></div>
<div class="abs small">${mark(40, "#0b0f14", "var(--teal)")}</div>`,

  // 5. Orbit: the hero's dashed rings, centred on the top-right corner around the details.
  "05-orbit": `
<style>
body{background:radial-gradient(circle at 100% 0%,#ecfeff 0%,#f8fafc 45%,#ffffff 100%)}
.ring{border-radius:50%;border:1.5px dashed rgb(6 182 212/.5);transform:translate(50%,-50%);right:0;top:0}
.ring.s{border-style:solid;border-color:rgb(15 23 42/.1)}
.dot{width:14px;height:14px;border-radius:50%}
.id{right:110px;top:100px;text-align:right;display:flex;flex-direction:column;align-items:flex-end}
.nm{font-size:80px;font-weight:800;letter-spacing:-.03em;line-height:1;margin-top:28px}
.rl{font-family:Mono;font-size:18px;letter-spacing:.24em;color:var(--muted);margin:14px 0 28px}
.chip{font-family:Mono;font-size:24px;color:var(--ink2);background:rgb(255 255 255/.8);border:1px solid var(--line);border-radius:999px;padding:10px 22px;margin-top:12px;font-weight:500;backdrop-filter:blur(6px)}
.cloud{left:120px;top:120px;opacity:.5}
</style>
<div class="abs ring" style="width:1000px;height:1000px"></div>
<div class="abs ring s" style="width:1500px;height:1500px"></div>
<div class="abs ring" style="width:2100px;height:2100px;border-color:rgb(16 185 129/.38)"></div>
<div class="abs dot" style="right:463px;top:164px;background:var(--cyan);box-shadow:0 0 0 8px rgb(6 182 212/.14)"></div>
<div class="abs dot" style="right:370px;top:645px;width:10px;height:10px;background:var(--em)"></div>
<div class="abs dot" style="right:1008px;top:266px;width:12px;height:12px;background:var(--teal);box-shadow:0 0 0 6px rgb(13 148 136/.14)"></div>
<div class="abs dot" style="right:610px;top:426px;width:8px;height:8px;background:#94a3b8"></div>
<svg class="abs cloud" width="120" viewBox="0 0 64 44"><path fill="rgb(125 211 252/.15)" stroke="rgb(56 189 248/.7)" stroke-width="1.5" d="M18 38a12 12 0 0 1-1.6-23.9A16 16 0 0 1 47 12.2a13 13 0 1 1 2 25.8H18z"/></svg>
<div class="abs id">${mark(76)}
  <div class="nm">Gustav</div><div class="rl">WEB DEVELOPER</div>
  <div class="chip"><span class="p">@</span> ${EMAIL}</div>
  <div class="chip"><span class="p">↗</span> ${SITE}</div></div>`,
};

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
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
