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

**Upload the files in this folder, not `mirrored/`.** Meet mirrors only your own self-view; everyone
else sees the background exactly as uploaded, so the text reads correctly for them. The copies in
`mirrored/` are pre-flipped and only for apps that send a mirrored image to other people.

`render.mjs` rebuilds them (needs `playwright`, `@fontsource/plus-jakarta-sans`, `@fontsource/jetbrains-mono`):
`node render.mjs out`
