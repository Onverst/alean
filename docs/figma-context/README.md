# Figma Context

## Principle

Figma file is breakpoint-first:
- 1920-Main
- 1440-Main
- 1024-Main
- 768-Main
- 375-Main

Project memory is section-first:
- section
  - variant 1920
  - variant 1440
  - variant 1024
  - variant 768
  - variant 375

## Folder structure

```
docs/figma-context/sections/<section-slug>/
  section.md
  variants/
    1920/
      context.md
      reference.png
    1440/
      context.md
      reference.png
    1024/
      context.md
      reference.png
    768/
      context.md
      reference.png
    375/
      context.md
      reference.png
```

Section inventory: `docs/figma-context/design-map.json`.

## What to save per variant

For each Figma breakpoint variant save:
- Figma URL to exact section node
- node ID
- frame size
- screenshot reference.png
- key colors
- key typography
- main layout measurements
- visible text
- image sizes/aspect ratios
- differences from 1920 canonical
- implementation notes if needed

## What not to save

Do not save huge raw MCP dumps by default.
Do not save the whole Figma canvas.
Do not call Figma MCP again if local context is enough.

## Figma vs runtime

Figma variants mostly describe width-based layouts.
Runtime viewport checks describe real browser behavior.

Low-height desktop is not a separate Figma breakpoint.
Check it manually in Cursor browser on isolated visual routes.

## Visual workflow (primary)

### 1. Figma context

Read local `context.md` and `reference.png` for the target section variant.
Do not call Figma MCP unless explicitly requested.

### 2. Isolated visual routes

Dev-only pages without ScrollStage / GSAP / Lenis — one section with real data.

URL alias:
```
http://localhost:3000/__visual/sections/<section-slug>
```

Direct route:
```
http://localhost:3000/visual/sections/<section-slug>
```

Example:
```
http://localhost:3000/__visual/sections/03-investments
```

Route file:
```
src/app/visual/sections/<section-slug>/page.tsx
```

> Next.js App Router treats `_`-prefixed folders as private. Alias `/__visual/*` is configured via rewrite in `next.config.ts`.

Do not check section layout on the full homepage with ScrollStage.

### 3. Cursor browser

1. Run `npm run dev`.
2. Open isolated route in Cursor browser.
3. Resize viewport to target size.
4. Compare with Figma context in `docs/figma-context/`.

## Viewport groups (manual checks)

Mobile:
- 375×812

Tablet:
- 768×1024
- 1024×768

Desktop:
- 1366×768
- 1440×900
- 1920×1080

Low-height desktop (critical for fit/pinned slides):
- 1440×760
- 1503×700
- 1920×800

2K / QHD:
- 2048×1080
- 2048×1152
- 2560×1080
- 2560×1440
- 2560×1600
- 3440×1440

Per-section critical viewports are listed in each `section.md`.

## Adding a new isolated section

1. Create `src/app/visual/sections/<slug>/page.tsx` (dev-only, `notFound()` in production).
2. No extra rewrite needed — `/__visual/:path*` already maps to `/visual/:path*`.
3. Add section entry to `design-map.json` and create `docs/figma-context/sections/<slug>/section.md`.
4. Check in Cursor browser at `/__visual/sections/<slug>`.
