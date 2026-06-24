# Visual Tests Rules

- **Prefer Cursor browser for current isolated visual checks.**
- For Figma-driven layout work, open isolated route: `/__visual/sections/<slug>`.
- **Do not test section layout through full ScrollStage page.**
- Do not call Figma MCP from visual test setup unless explicitly requested.
- Do not modify ScrollStage from a visual-test setup task.
- Do not use Puppeteer unless explicitly asked.

## Playwright (deferred batch runner)

- **Use Playwright only for repeatable batch screenshots/overflow checks** (future CI).
- Playwright is **not** the primary development tool right now.
- Reuse `playwright.visual.config.ts`, `viewport-presets.ts`, `visual-sections.config.ts` when batch specs are activated.
- Active specs: none — all specs live in `tests/visual/_experimental/` (`testIgnore`).

## ScrollStage integration (deferred)

- **Do not build ScrollStage integration tests unless explicitly requested.**
- **Do not use wheel-scroll navigation for normal section layout checks.**
- ScrollStage tests: `tests/visual/_experimental/scrollstage/` — not run by `npm run test:visual`.
- Do not chase next-panel strip bugs via integration tests during layout work.

## Isolated section routes

- Primary path: dev-only route at `src/app/visual/sections/<slug>/page.tsx`.
- Browser URL alias: `/__visual/sections/<slug>` (rewrite in `next.config.ts`).
- Runtime screenshots (future batch): `tests/visual/runtime-screenshots/<sectionSlug>-isolated/`.
- Screenshots must show the expected section, not footer or another section.

## Section modes (visual-sections.config.ts)

- `fit-panel` — one screenshot per viewport.
- `overflow-panel` — start / middle / end states.
- `progress-panel` — progress-0 / progress-50 / progress-100.
- `interactive-panel` — UI states.
- `free-section` — viewport or fullPage.
