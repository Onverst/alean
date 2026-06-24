import type { Page } from "@playwright/test";

/**
 * Известные секции: selector → slug.
 * Синхронизировано с docs/figma-context/design-map.json.
 */
export const SECTION_SELECTOR_MAP: ReadonlyArray<{
  selector: string;
  slug: string;
}> = [
  { selector: "[data-hero-section]", slug: "01-hero" },
  { selector: "[data-about-section]", slug: "02-about" },
  { selector: "[data-investments-section]", slug: "03-investments" },
  { selector: "[data-advantages-section]", slug: "04-advantages" },
  { selector: "[data-income-section]", slug: "05-income" },
  { selector: "[data-location-section]", slug: "06-location" },
  { selector: "[data-point-section]", slug: "07-point" },
  { selector: "[data-concept-section]", slug: "08-concept" },
  { selector: "[data-product-section]", slug: "09-product" },
  { selector: "[data-body-form-section]", slug: "10-open-form" },
  { selector: "[data-infrastructure-section]", slug: "11-infrastructure" },
  { selector: "[data-genplan-section]", slug: "12-genplan" },
  {
    selector: "[data-infrastruture-slider-section]",
    slug: "13-infrastructure-slider",
  },
  {
    selector: "[data-infrastructure-full]",
    slug: "14-infrastructure-fullscreen-slider",
  },
  { selector: "[data-service-section]", slug: "15-service" },
  { selector: "[data-service-slider-section]", slug: "16-service-slider" },
  { selector: "[data-room-section]", slug: "17-rooms" },
  { selector: "[data-finance-section]", slug: "18-finance" },
  { selector: "[data-gallery]", slug: "19-gallery" },
  { selector: "footer", slug: "20-footer" },
];

/** Slug-ы, которые не считаются «чужой секцией» в bottom strip fit-panel. */
export const NEUTRAL_BOTTOM_SLUGS = new Set(["unknown", "overlay"]);

export type TopmostElementInfo = {
  tagName: string;
  className: string;
  textSnippet: string;
  scrollPanelIndex: number | null;
  detectedSlug: string;
};

export type DominantVisibleSection = {
  dominantSlug: string;
  samples: Array<{ point: string; slug: string }>;
  confidence: number;
};

type EvaluateContext = {
  sectionMap: Array<{ selector: string; slug: string }>;
};

/** Сериализуемый контекст для page.evaluate. */
function getEvaluateContext(): EvaluateContext {
  return {
    sectionMap: SECTION_SELECTOR_MAP.map(({ selector, slug }) => ({
      selector,
      slug,
    })),
  };
}

/**
 * Browser-side helpers (дублируются в evaluate-блоках — Playwright не передаёт функции).
 *
 * ScrollStage stacked panels: elementFromPoint попадает в panel с max z-index (часто footer),
 * хотя визуально активна панель с min z-index, привязанная к верху viewport.
 * Поэтому slug определяем по «front panel» — panel с min z-index среди viewport-anchored.
 */
export type VisibleSectionBrowserHelpers = {
  detectSectionSlugFromPanel: (
    panel: Element | null,
    sectionMap: Array<{ selector: string; slug: string }>,
  ) => string;
  getFrontPanelSlugAtPoint: (
    x: number,
    y: number,
    sectionMap: Array<{ selector: string; slug: string }>,
  ) => string;
  getTopmostElementInfoAtPoint: (
    x: number,
    y: number,
    sectionMap: Array<{ selector: string; slug: string }>,
  ) => TopmostElementInfo;
};

/**
 * Информация о верхнем DOM-элементе в точке + slug через front panel (не raw elementFromPoint).
 */
export async function getTopmostElementInfo(
  page: Page,
  x: number,
  y: number,
): Promise<TopmostElementInfo> {
  const context = getEvaluateContext();

  return page.evaluate(
    ({ pointX, pointY, sectionMap }) => {
      return getTopmostElementInfoAtPoint(pointX, pointY, sectionMap);

      function detectSectionSlugFromPanel(
        panel: Element | null,
        map: Array<{ selector: string; slug: string }>,
      ): string {
        if (!panel) {
          return "unknown";
        }

        for (const entry of map) {
          const match = panel.querySelector(entry.selector);
          if (match) {
            return entry.slug;
          }
        }

        return "unknown";
      }

      function getFrontPanelSlugAtPoint(
        px: number,
        py: number,
        map: Array<{ selector: string; slug: string }>,
      ): string {
        const panels = Array.from(
          document.querySelectorAll<HTMLElement>("[data-scroll-panel]"),
        );
        const viewportHeight = window.innerHeight;
        const anchoredPanels = panels.filter((panel) => {
          const rect = panel.getBoundingClientRect();
          const containsPoint =
            px >= rect.left &&
            px <= rect.right &&
            py >= rect.top &&
            py <= rect.bottom;
          const anchoredAtViewportTop =
            rect.top >= -80 && rect.top <= viewportHeight * 0.25;

          return containsPoint && anchoredAtViewportTop;
        });

        if (anchoredPanels.length === 0) {
          const el = document.elementFromPoint(px, py);
          return detectSectionSlugFromElement(el, map);
        }

        anchoredPanels.sort(
          (a, b) =>
            parseInt(getComputedStyle(a).zIndex, 10) -
            parseInt(getComputedStyle(b).zIndex, 10),
        );

        return detectSectionSlugFromPanel(anchoredPanels[0], map);
      }

      function detectSectionSlugFromElement(
        startEl: Element | null,
        map: Array<{ selector: string; slug: string }>,
      ): string {
        if (!startEl) {
          return "unknown";
        }

        let current: Element | null = startEl;
        while (current && current !== document.documentElement) {
          if (current.tagName === "FOOTER") {
            return "20-footer";
          }

          for (const entry of map) {
            try {
              if (current.matches(entry.selector)) {
                return entry.slug;
              }
            } catch {
              // ignore invalid selector
            }
          }

          current = current.parentElement;
        }

        return "unknown";
      }

      function getTopmostElementInfoAtPoint(
        px: number,
        py: number,
        map: Array<{ selector: string; slug: string }>,
      ): TopmostElementInfo {
        const el = document.elementFromPoint(px, py);
        const detectedSlug = getFrontPanelSlugAtPoint(px, py, map);

        const panels = Array.from(
          document.querySelectorAll("[data-scroll-panel]"),
        );
        const panel = el?.closest("[data-scroll-panel]") ?? null;
        const scrollPanelIndex = panel ? panels.indexOf(panel) : null;

        const textSnippet = (el?.textContent ?? "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 80);

        return {
          tagName: el?.tagName ?? "",
          className: typeof el?.className === "string" ? el.className : "",
          textSnippet,
          scrollPanelIndex,
          detectedSlug,
        };
      }
    },
    { pointX: x, pointY: y, sectionMap: context.sectionMap },
  );
}

/**
 * Доминирующая видимая секция по sample-точкам viewport.
 * Использует front panel detection, не bounding rect следующей панели.
 */
export async function getDominantVisibleSection(
  page: Page,
): Promise<DominantVisibleSection> {
  const context = getEvaluateContext();

  return page.evaluate(({ sectionMap }) => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const samplePoints: Array<{ point: string; x: number; y: number }> = [
      { point: "center", x: w * 0.5, y: h * 0.5 },
      { point: "top-center", x: w * 0.5, y: h * 0.12 },
      { point: "bottom-center", x: w * 0.5, y: h * 0.88 },
      { point: "left-center", x: w * 0.15, y: h * 0.5 },
      { point: "right-center", x: w * 0.85, y: h * 0.5 },
    ];

    const samples = samplePoints.map(({ point, x, y }) => ({
      point,
      slug: getFrontPanelSlugAtPoint(x, y, sectionMap),
    }));

    const counts = new Map<string, number>();
    for (const sample of samples) {
      counts.set(sample.slug, (counts.get(sample.slug) ?? 0) + 1);
    }

    let dominantSlug = "unknown";
    let maxCount = 0;
    for (const [slug, count] of counts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        dominantSlug = slug;
      }
    }

    const confidence = samples.length > 0 ? maxCount / samples.length : 0;

    return { dominantSlug, samples, confidence };

    function detectSectionSlugFromPanel(
      panel: Element | null,
      map: Array<{ selector: string; slug: string }>,
    ): string {
      if (!panel) {
        return "unknown";
      }

      for (const entry of map) {
        if (panel.querySelector(entry.selector)) {
          return entry.slug;
        }
      }

      return "unknown";
    }

    function getFrontPanelSlugAtPoint(
      px: number,
      py: number,
      map: Array<{ selector: string; slug: string }>,
    ): string {
      const panels = Array.from(
        document.querySelectorAll<HTMLElement>("[data-scroll-panel]"),
      );
      const viewportHeight = window.innerHeight;

      const anchoredPanels = panels.filter((panel) => {
        const rect = panel.getBoundingClientRect();
        const containsPoint =
          px >= rect.left &&
          px <= rect.right &&
          py >= rect.top &&
          py <= rect.bottom;
        const anchoredAtViewportTop =
          rect.top >= -80 && rect.top <= viewportHeight * 0.25;

        return containsPoint && anchoredAtViewportTop;
      });

      if (anchoredPanels.length === 0) {
        const el = document.elementFromPoint(px, py);
        return detectSectionSlugFromElement(el, map);
      }

      anchoredPanels.sort(
        (a, b) =>
          parseInt(getComputedStyle(a).zIndex, 10) -
          parseInt(getComputedStyle(b).zIndex, 10),
      );

      return detectSectionSlugFromPanel(anchoredPanels[0], map);
    }

    function detectSectionSlugFromElement(
      startEl: Element | null,
      map: Array<{ selector: string; slug: string }>,
    ): string {
      if (!startEl) {
        return "unknown";
      }

      let current: Element | null = startEl;
      while (current && current !== document.documentElement) {
        if (current.tagName === "FOOTER") {
          return "20-footer";
        }

        for (const entry of map) {
          try {
            if (current.matches(entry.selector)) {
              return entry.slug;
            }
          } catch {
            // ignore
          }
        }

        current = current.parentElement;
      }

      return "unknown";
    }
  }, context);
}

/**
 * Проверяет, что ScrollStage/GSAP/Lenis инициализировались (есть scroll track или panels repositioned).
 */
export async function isScrollStageInitialized(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const viewportHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const pinSpacers = document.querySelectorAll(".pin-spacer").length;
    const panels = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-panel]"),
    );
    const footerPanel = panels[panels.length - 1];
    const footerTop = footerPanel?.getBoundingClientRect().top ?? 0;

    return (
      scrollHeight > viewportHeight * 1.5 ||
      pinSpacers > 0 ||
      footerTop >= viewportHeight - 20
    );
  });
}
