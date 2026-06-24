# 03 Investments

## Code

- Component: src/components/sections/InvestmentsSection.tsx
- Styles: src/components/sections/InvestmentsSection.module.css
- Selector: [data-investments-section]

## Critical data attributes

- data-investments-section
- data-investments-reveal
- data-investments-list

## Figma variants

| Breakpoint | Context | Screenshot | Notes |
|---|---|---|---|
| 1920 | variants/1920/context.md | variants/1920/reference.png | canonical |
| 1440 | variants/1440/context.md | variants/1440/reference.png | same layout as 1920; see local compare-1920-1440.md |
| 1024 | variants/1024/context.md | variants/1024/reference.png |  |
| 768 | variants/768/context.md | variants/768/reference.png |  |
| 375 | variants/375/context.md | variants/375/reference.png |  |

Context and screenshot files are local-only (gitignored). Figma URL and node ID live inside each variant's `context.md`.

## Section mode

Mode: fit

Meaning:
- Section should fit into a fullscreen slide state on desktop.
- Next panel must not be visible at the bottom.
- Low-height desktop must be checked separately.

## What to store in each variant (local context.md)

Each variant context should include:
- frame size
- screenshot path
- colors
- typography
- main measurements
- visible content
- image dimensions
- differences from 1920
- CSS implications

Figma URL and node ID are stored only in the local gitignored `context.md`, not in publishable repo files.

## Manual design inspection

Route:
http://localhost:3000/__visual/sections/03-investments

### Figma parity viewports
- 1920×1350
- 1440×1350

### Real runtime viewports
- 1440×900
- 1920×1080
- 2560×1440
- 2560×1080

### Low-height viewports
- 1440×760
- 1503×700
- 1920×800

### Checkpoints
- title
- top badge
- image
- text_one
- text_two
- stats bar
- column widths
- vertical spacing
- horizontal overflow
- compact layout decision

| Viewport | Result | Problem | Decision |
|---|---|---|---|

## Runtime checks (Cursor browser)

Open isolated route:
```
http://localhost:3000/__visual/sections/03-investments
```

1. Run `npm run dev`.
2. Open the URL in Cursor browser.
3. Resize viewport and compare with Figma context.

Important viewports:
- 1440x760
- 1503x700
- 1920x800
- 2048x1152
- 2560x1440
- 2560x1080
- 2560x1600

## 1920 vs 1440 summary

Figma 1440 is a **width-narrowed artboard** with **identical internal dimensions** to 1920: same padding (192/96), gaps (128/64/24), content (1024 px), image (200×280), typography (128/40/16/40/14 px), table (158 px, columns 227 px). Only frame width (1440 vs 1920) and horizontal centering offset differ.

Code already has `@media (min-width: 1201px) and (max-width: 1450px)` shrinking stats columns to 190 px — runtime behavior **not shown in Figma 1440**.

Full comparison: local `compare-1920-1440.md` (gitignored).

## Risks

- next slide visible at bottom
- title cropped on low-height desktop
- bottom stats bar cropped
- incorrect panel overflow calculation
- broken GSAP data selectors
