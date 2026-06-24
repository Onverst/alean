# Visual testing strategy

## Current workflow (primary)

### Cursor browser — основной инструмент

Для текущей ручной visual-проверки и CSS/layout правок по Figma используй **Cursor browser**.

1. Запусти `npm run dev`.
2. Открой isolated route секции в Cursor browser.
3. Переключай viewport (1440×900, low-height, 2K и т.д.).
4. Сверяй с Figma context в `docs/figma-context/`.

### Isolated visual routes — основной способ смотреть слайды

Dev-only страницы без ScrollStage / GSAP / Lenis — только одна секция с реальными данными.

URL (alias):
```
http://localhost:3000/__visual/sections/03-investments
```

Прямой route (исходный файл):
```
http://localhost:3000/visual/sections/03-investments
```

Файл route:
```
src/app/visual/sections/03-investments/page.tsx
```

> Папка `src/app/__visual/` **не работает** в App Router: Next.js трактует `_`-prefixed folders как private. Alias `/__visual/*` настроен через rewrite в `next.config.ts`.

**Не проверять layout секций через полную главную страницу со ScrollStage.**
**Не использовать wheel-scroll navigation для layout-проверок.**

---

## Playwright — будущий batch runner

Playwright **не основной инструмент разработки**. Оставлен для будущего batch-прогона:
- screenshots по viewport matrix;
- horizontal overflow checks;
- repeatable CI regression.

Сейчас active Playwright specs **отсутствуют** — все specs в `_experimental/`.

Конфиг: `playwright.visual.config.ts` (`testIgnore: **/_experimental/**`).

Commands (когда batch specs будут активированы):
```bash
npm run test:visual
npm run test:visual:headed
npm run test:visual:report
```

`test:visual:investments` — напоминание открыть isolated route в Cursor browser.

---

## Layers overview

| Layer | Status | Tool |
|-------|--------|------|
| **Figma context** | Active | `docs/figma-context/` — не runtime test |
| **Isolated visual routes** | **Active (primary)** | Cursor browser |
| **Playwright batch** | Deferred | Playwright (future) |
| **ScrollStage integration** | Deferred/experimental | `tests/visual/_experimental/scrollstage/` |
| **Page smoke tests** | Future | TBD |
| **Critical scenario tests** | Future | TBD — точечные рискованные переходы |

---

## Viewport groups (для ручной проверки)

Presets: `tests/visual/viewport-presets.ts`

Mobile: 375×812

Tablet: 768×1024, 1024×768

Desktop: 1366×768, 1440×900, 1920×1080

Low-height desktop: 1440×760, 1503×700, 1920×800

2K / QHD: 2048×1080, 2048×1152, 2560×1080, 2560×1440, 2560×1600, 3440×1440

Critical viewports для 03-investments: `tests/visual/visual-sections.config.ts`

---

## Config files

- `playwright.visual.config.ts` — Playwright (deferred batch runner)
- `tests/visual/viewport-presets.ts` — viewport matrix
- `tests/visual/visual-sections.config.ts` — per-section critical viewports
- `next.config.ts` — rewrite `/__visual/*` → `/visual/*`
- `docs/figma-context/design-map.json` — section inventory

## Adding a new isolated section

1. Создать `src/app/visual/sections/<slug>/page.tsx` (dev-only, `notFound()` in production).
2. Добавить rewrite не нужен — общий `/__visual/:path*` уже есть.
3. Добавить секцию в `visual-sections.config.ts`.
4. Проверять в Cursor browser по URL `/__visual/sections/<slug>`.
5. Playwright batch spec — только когда понадобится CI regression.

## Experimental (не запускаются)

```
tests/visual/_experimental/scrollstage/     — ScrollStage integration (deferred)
tests/visual/_experimental/isolated/        — Playwright isolated batch (deferred)
```
