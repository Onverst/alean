# Visual checks strategy

## Playwright vs Puppeteer

Для runtime visual checks используем **Playwright Test**, не Puppeteer.

Причины:
- повторяемые visual/runtime checks с единым конфигом;
- viewport matrix из `viewport-presets.ts`;
- lifecycle dev server (`webServer`) с reuse локально;
- скриншоты, trace и HTML-отчёты из коробки;
- переиспользование уже запущенного `npm run dev`.

Puppeteer в этой обвязке не используется.

## Conceptual model

### Entities

| Entity | Описание |
|--------|----------|
| **Figma Slide Variant** | Статический frame из Figma для одной секции и breakpoint (например `03-investments @ 1440`). Хранится в `docs/figma-context/`. |
| **React Section** | Компонент секции в коде с `data-*` selector (например `[data-investments-section]`). |
| **ScrollStage Panel** | DOM-обёртка `[data-scroll-panel]` внутри `[data-scroll-stage]`. Панели stacked/pinned — **bounding rect не равен видимости**. |
| **Viewport State** | Именованный preset из `viewport-presets.ts` (width × height). |
| **Visual Capture** | Runtime screenshot + diagnostics (dominant slug, bottom strip, overflow). Не pixel-diff с Figma. |

### Two test layers

1. **Isolated section test** (будущее)
   - Рендер одной секции без ScrollStage.
   - Сравнение layout/typography в controlled environment.
   - Полезно для CSS-регрессий без scroll logic.

2. **ScrollStage integration test** (текущее)
   - Полная страница `/` с ScrollStage, GSAP, Lenis.
   - Навигация к секции через `scrollToSectionByDominance`.
   - Проверка реально видимой секции через `elementFromPoint`.
   - Diagnostic screenshots в `runtime-screenshots/`.

### Section modes

| Mode | Screenshots | Assertions |
|------|-------------|------------|
| **fit-panel** | один на viewport (`default`) | bottom strip не показывает другую секцию; no horizontal overflow |
| **overflow-panel** | `start` / `middle` / `end` | internal scroll progress; next panel не раньше времени |
| **progress-panel** | `progress-0` / `progress-50` / `progress-100` | GSAP/scroll-driven states |
| **interactive-panel** | UI states (tabs, modals) | explicit interaction before capture |
| **free-section** | viewport или fullPage | обычная длинная секция вне strict panel fit |

### Visibility truth for ScrollStage

**Не использовать bounding rect панелей** как pass/fail — stacked/pinned panels дают одинаковые rects.

Источник истины:
- `getDominantVisibleSection()` — sample points (center, top/bottom/left/right-center).
- `getBottomStripVisibility()` — нижняя полоса viewport (25%/50%/75% × height−4px).
- `getTopmostElementInfo()` — debug для одной точки.

Slug определяется по `SECTION_SELECTOR_MAP` из `visible-section.ts` (синхрон с `design-map.json`).

### Screenshot paths

Валидный capture (actual === expected):
```
tests/visual/runtime-screenshots/<sectionSlug>/<viewportName>.png
```

Navigation failed (actual !== expected):
```
tests/visual/runtime-screenshots/_navigation-failed/<expectedSlug>/expected-03-investments__actual-20-footer__low-1440x760.png
```

**Нельзя** сохранять footer screenshot в папку `03-investments` как валидный capture.

## Dev server lifecycle

Конфиг: `playwright.visual.config.ts`.

Локально (`reuseExistingServer: true`, если не CI):
1. Playwright проверяет `http://127.0.0.1:3000`.
2. Если dev server уже запущен — переиспользует его и **не останавливает** после тестов.
3. Если server не запущен — Playwright поднимает `npm run dev -- --hostname 127.0.0.1 --port 3000` сам.
4. После тестов Playwright останавливает **только тот server, который сам поднял**.

В CI (`CI=true`) server всегда стартует Playwright и всегда останавливается после прогона.

## Commands

```bash
npm run test:visual
npm run test:visual:investments
npm run test:visual:headed
npm run test:visual:report
```

- `test:visual` — все visual specs из `tests/visual/`.
- `test:visual:investments` — только `scrollstage-investments.spec.ts`.
- `test:visual:headed` — тот же прогон с видимым браузером.
- `test:visual:report` — открыть HTML-отчёт из `playwright-report/visual`.

## Why runtime checks are needed

Figma variants show static design by width.
Runtime checks show real browser behavior with ScrollStage, GSAP, Lenis, 100svh and panel pinning.

## Important viewport groups

Mobile:
- 375x812

Tablet:
- 768x1024
- 1024x768

Desktop:
- 1366x768
- 1440x900
- 1920x1080

Low-height desktop:
- 1440x760
- 1503x700
- 1920x800

2K / QHD:
- 2048x1080
- 2048x1152
- 2560x1080
- 2560x1440
- 2560x1600
- 3440x1440

## Main defects to catch

- wrong section captured (navigation overscroll to footer);
- next slide visible at bottom (via bottom strip, not panel rect);
- title cropped;
- text overflow;
- image distortion;
- horizontal scrollbar;
- broken data-* selectors;
- pinned panel shifted up;
- bottom fixed bar cropped.

## Config files

- `playwright.visual.config.ts` — Playwright config, webServer, reporters.
- `tests/visual/viewport-presets.ts` — named viewport presets grouped by device class.
- `tests/visual/visual-sections.config.ts` — per-section mode, states, and critical viewports.
- `tests/visual/helpers/visible-section.ts` — elementFromPoint slug detection.
- `tests/visual/helpers/scroll-to-section.ts` — dominance-based navigation.
- `tests/visual/helpers/panel-visibility.ts` — bottom strip + rect debug.
- `tests/visual/helpers/screenshots.ts` — valid vs navigation-failed paths.
- `docs/figma-context/design-map.json` — section inventory linked to code and Figma variants.

## Adding a new section

1. Добавить секцию в `visual-sections.config.ts` с правильным mode.
2. Убедиться, что selector есть в `SECTION_SELECTOR_MAP` (`visible-section.ts`).
3. Создать spec только если нужно section-specific поведение.
4. Переиспользовать helpers — не копировать scroll/wait/diagnostics код.
