# Google Meet backgrounds (light)

Five 1920×1080 virtual backgrounds in the gustavtk.com brand: the G/T mark with its teal `>_`,
Plus Jakarta Sans and JetBrains Mono, teal/cyan accents, inverted to light mode.

Logo, name and role sit top left; email and website top right; the middle stays clear for you.

| File | Idea |
| --- | --- |
| `01-grid-studio.png` | The site's grid background with soft teal glows |
| `02-access-pass.png` | The hero's lanyard access pass hanging top left |
| `03-browser.png` | A light browser window: your brand in the tab, gustavtk.com in the address bar |
| `04-code.png` | Your contact details as a `contact.ts` snippet in a small editor card |
| `05-glass.png` | Frosted-glass cards over a light take on the site hero glow and grid, with a teal mark watermark bottom right (role: Full-Stack Developer) |
| `06-soft-blur.png` | An ash-grey room far out of focus, like a webcam background blur, with the mark huge and faded, running off the bottom-right edges |
| `07-blueprint.png` | An engineering drawing: title block top left, contact cells top right, the mark dimensioned bottom right |
| `08-paper-layers.png` | Stacked cut-paper waves in brand teals, the mark embossed into the front sheet |
| `09-full-stack.png` | "Full-stack" made literal: UI, API and DB layers stacked bottom right, the mark on top |
| `10-command-palette.png` | The site's ⌘K menu, open top right on your contact details |
| `11-window-office.png` | Out-of-focus office: cool daylight window and plant left, shelf and framed mark right |
| `12-evening-lamp.png` | Warm greige room: shadowed bookshelf left, glowing floor lamp right |
| `13-concrete-loft.png` | Ash concrete loft: steel window right, pendant lights and plant left, mark painted on the wall |
| `14-bookshelf.png` | Light-oak shelving at both edges, soft downlight on the wall behind you, mark framed on a shelf |
| `15-blinds-light.png` | Minimal warm-ash wall with sun through blinds, plant left, framed mark on a sideboard |
| `16-photo-office.png` | A generated photo of a grey home office (Higgsfield, Z Image): laptops removed, re-blurred, mark framed above the shelf |
| `17-glass-ash.png` | The Glass layout in the photo office colours: ash-grey wall, cool window light left, warm lamp glow right, white text on dark ash cards |

The room backgrounds (06, 11–16) keep the area behind your head a plain, mid-light wall so the
edges of your hair and hands blend instead of glitching; every object sits at the edges. They
carry camera grain so they match a webcam image and don't band once Meet compresses the video.

**For the cleanest edges:** light your face from the front (a window or lamp facing you, never
behind you), sit about an arm's length from the camera with some space between you and your real
wall, wear a top that contrasts with the background, and keep the camera at eye level.

**Upload the files in this folder, not `mirrored/`.** Meet mirrors only your own self-view; everyone
else sees the background exactly as uploaded, so the text reads correctly for them. The copies in
`mirrored/` are pre-flipped and only for apps that send a mirrored image to other people.

`render.mjs` rebuilds them (needs `playwright`, `@fontsource/plus-jakarta-sans`, `@fontsource/jetbrains-mono`):
`node render.mjs out`

`assets/photo-office-original.webp` is the generated photo as downloaded; `assets/clean-photo.py`
removes its laptops (`python3 assets/clean-photo.py assets/photo-office-original.webp cleaned.png`),
then a 9px Gaussian blur and a resize to 1920×1080 give `assets/photo-office.png`.
