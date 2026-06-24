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
It must be checked through Playwright/runtime screenshots.
