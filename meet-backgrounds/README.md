# Google Meet backgrounds (light)

Five 1920×1080 virtual backgrounds in the gustavtk.com brand: the G/T mark with its teal `>_`,
Plus Jakarta Sans and JetBrains Mono, teal/cyan accents, inverted to light mode.

| File | Idea |
| --- | --- |
| `01-grid-studio.png` | The site's grid background with a soft teal glow |
| `02-terminal.png` | Light terminal session: `whoami`, `contact`, `open` |
| `03-access-pass.png` | The hero's lanyard access pass hanging top right |
| `04-monogram.png` | The mark drawn as a huge teal outline |
| `05-orbit.png` | Dashed orbit rings around the details |

**Upload the files in this folder, not `mirrored/`.** Meet mirrors only your own self-view; everyone
else sees the background exactly as uploaded, so the text reads correctly for them. The copies in
`mirrored/` are pre-flipped and only for apps that send a mirrored image to other people.

`render.mjs` rebuilds them (needs `playwright`, `@fontsource/plus-jakarta-sans`, `@fontsource/jetbrains-mono`):
`node render.mjs out`
