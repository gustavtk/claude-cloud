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

**Upload the files in this folder, not `mirrored/`.** Meet mirrors only your own self-view; everyone
else sees the background exactly as uploaded, so the text reads correctly for them. The copies in
`mirrored/` are pre-flipped and only for apps that send a mirrored image to other people.

`render.mjs` rebuilds them (needs `playwright`, `@fontsource/plus-jakarta-sans`, `@fontsource/jetbrains-mono`):
`node render.mjs out`
