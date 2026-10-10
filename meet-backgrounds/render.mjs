import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUT = process.argv[2];
mkdirSync(OUT, { recursive: true });
const fs = (p) => "file://" + resolve(process.env.FONTS_DIR ?? "node_modules/@fontsource", p);

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

// Every layout: logo, name and role top left; email and website top right; the middle stays clear.
const contact = (cls = "") => `
  <div class="${cls} mono"><span class="p">@</span> ${EMAIL}</div>
  <div class="${cls} mono"><span class="p">↗</span> ${SITE}</div>`;

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

  // 5. Glass: frosted cards over the site's grid and a calm teal/cyan glow, kept quiet.
  "05-glass": `
<style>
body{background:#f6f9fb}
.grid{inset:0;background-size:48px 48px;background-image:linear-gradient(to right,rgb(15 23 42/.045) 1px,transparent 1px),linear-gradient(to bottom,rgb(15 23 42/.045) 1px,transparent 1px);
  -webkit-mask-image:linear-gradient(180deg,#000 0%,rgb(0 0 0/.35) 45%,rgb(0 0 0/.35) 70%,#000 100%)}
.g{border-radius:50%}
.pill{background:rgb(255 255 255/.7);border:1px solid rgb(255 255 255/.95);box-shadow:0 18px 40px -24px rgb(15 23 42/.22),0 0 0 1px rgb(15 23 42/.04),inset 0 1px 0 #fff;backdrop-filter:blur(14px);border-radius:28px}
.id{left:80px;top:72px;display:flex;align-items:center;gap:28px;padding:26px 40px 26px 30px}
.nm{font-size:66px;font-weight:800;letter-spacing:-.03em;line-height:1}
.rl{font-family:Mono;font-size:16px;letter-spacing:.22em;color:var(--muted);margin-top:10px}
.ct{right:80px;top:72px;padding:24px 34px;text-align:right}
.c{font-size:25px;color:var(--ink2);line-height:1.7;font-weight:500}
.fade{left:0;right:0;bottom:0;height:420px;background:linear-gradient(transparent,rgb(246 249 251/.4))}
</style>
<div class="abs g" style="left:-320px;top:-360px;width:1100px;height:900px;background:radial-gradient(closest-side,rgb(1 240 201/.2),transparent)"></div>
<div class="abs g" style="right:-320px;top:-380px;width:1000px;height:820px;background:radial-gradient(closest-side,rgb(6 182 212/.13),transparent)"></div>
<div class="abs g" style="left:-200px;bottom:-560px;width:1300px;height:900px;background:radial-gradient(closest-side,rgb(45 212 191/.16),transparent)"></div>
<div class="abs g" style="right:-260px;bottom:-560px;width:1300px;height:900px;background:radial-gradient(closest-side,rgb(56 189 248/.13),transparent)"></div>
<div class="abs grid"></div>
<div class="abs pill id">${mark(76)}<div><div class="nm">Gustav</div><div class="rl">FULL-STACK DEVELOPER</div></div></div>
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
