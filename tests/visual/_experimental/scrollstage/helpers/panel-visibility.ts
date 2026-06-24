import type { Page } from "@playwright/test";

import {
  NEUTRAL_BOTTOM_SLUGS,
  SECTION_SELECTOR_MAP,
  type TopmostElementInfo,
} from "./visible-section";

/** DOM rect — только debug, не источник истины видимости ScrollStage. */
export type DomRectSnapshot = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

/** Rect-диагностика панелей (debug). Не использовать для pass/fail. */
export type PanelRectDiagnostics = {
  sectionRect: DomRectSnapshot | null;
  activePanelRect: DomRectSnapshot | null;
  nextPanelRect: DomRectSnapshot | null;
  windowInnerWidth: number;
  windowInnerHeight: number;
  scrollWidth: number;
  horizontalOverflow: boolean;
};

export type BottomStripSample = TopmostElementInfo & {
  x: number;
  y: number;
};

export type BottomStripVisibility = {
  bottomSamples: BottomStripSample[];
  expectedVisibleAtBottom: boolean;
  otherSlugVisibleAtBottom: string | null;
};

/**
 * Rect-диагностика для отчёта. Bounding rect stacked/pinned panels совпадает —
 * это не доказательство видимости следующего panel.
 */
export async function getPanelRectDiagnostics(
  page: Page,
  sectionSelector: string,
): Promise<PanelRectDiagnostics> {
  return page.evaluate((selector) => {
    const section = document.querySelector<HTMLElement>(selector);
    const panels = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-panel]"),
    );

    const activePanel = section
      ? (panels.find((panel) => panel.contains(section)) ?? null)
      : null;

    const activePanelIndex = activePanel ? panels.indexOf(activePanel) : -1;
    const nextPanel =
      activePanelIndex >= 0 && activePanelIndex < panels.length - 1
        ? panels[activePanelIndex + 1]
        : null;

    const sectionRect = section
      ? toDomRectSnapshot(section.getBoundingClientRect())
      : null;
    const activePanelRect = activePanel
      ? toDomRectSnapshot(activePanel.getBoundingClientRect())
      : null;
    const nextPanelRect = nextPanel
      ? toDomRectSnapshot(nextPanel.getBoundingClientRect())
      : null;

    const windowInnerWidth = window.innerWidth;
    const scrollWidth = document.documentElement.scrollWidth;

    return {
      sectionRect,
      activePanelRect,
      nextPanelRect,
      windowInnerWidth,
      windowInnerHeight: window.innerHeight,
      scrollWidth,
      horizontalOverflow: scrollWidth > windowInnerWidth + 1,
    };

    function toDomRectSnapshot(rect: DOMRect): DomRectSnapshot {
      return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
    }
  }, sectionSelector);
}

/** @deprecated Используйте getPanelRectDiagnostics. */
export const getPanelDiagnostics = getPanelRectDiagnostics;

/**
 * Bottom strip visibility через front panel + elementFromPoint.
 * Fail для fit-panel только если видна другая конкретная секция (не unknown/overlay).
 */
export async function getBottomStripVisibility(
  page: Page,
  expectedSlug: string,
): Promise<BottomStripVisibility> {
  const sectionMap = SECTION_SELECTOR_MAP.map(({ selector, slug }) => ({
    selector,
    slug,
  }));

  return page.evaluate(
    ({ expected, map, neutralSlugs }) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const y = h - 4;
      const xPoints = [w * 0.25, w * 0.5, w * 0.75];

      const bottomSamples = xPoints.map((x) => {
        const el = document.elementFromPoint(x, y);
        const detectedSlug = getFrontPanelSlugAtPoint(x, y, map);
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
          x,
          y,
          tagName: el?.tagName ?? "",
          className: typeof el?.className === "string" ? el.className : "",
          textSnippet,
          scrollPanelIndex,
          detectedSlug,
        };
      });

      const slugsAtBottom = bottomSamples.map((s) => s.detectedSlug);
      const expectedVisibleAtBottom = slugsAtBottom.includes(expected);

      let otherSlugVisibleAtBottom: string | null = null;
      for (const slug of slugsAtBottom) {
        if (
          slug !== expected &&
          slug !== "unknown" &&
          !neutralSlugs.includes(slug)
        ) {
          otherSlugVisibleAtBottom = slug;
          break;
        }
      }

      return {
        bottomSamples,
        expectedVisibleAtBottom,
        otherSlugVisibleAtBottom,
      };

      function detectSectionSlugFromPanel(
        panel: Element | null,
        sectionMapInner: Array<{ selector: string; slug: string }>,
      ): string {
        if (!panel) {
          return "unknown";
        }

        for (const entry of sectionMapInner) {
          if (panel.querySelector(entry.selector)) {
            return entry.slug;
          }
        }

        return "unknown";
      }

      function getFrontPanelSlugAtPoint(
        px: number,
        py: number,
        sectionMapInner: Array<{ selector: string; slug: string }>,
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
          return detectSectionSlugFromElement(
            document.elementFromPoint(px, py),
            sectionMapInner,
          );
        }

        anchoredPanels.sort(
          (a, b) =>
            parseInt(getComputedStyle(a).zIndex, 10) -
            parseInt(getComputedStyle(b).zIndex, 10),
        );

        return detectSectionSlugFromPanel(anchoredPanels[0], sectionMapInner);
      }

      function detectSectionSlugFromElement(
        startEl: Element | null,
        sectionMapInner: Array<{ selector: string; slug: string }>,
      ): string {
        if (!startEl) {
          return "unknown";
        }

        let current: Element | null = startEl;
        while (current && current !== document.documentElement) {
          if (current.tagName === "FOOTER") {
            return "20-footer";
          }

          for (const entry of sectionMapInner) {
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
    },
    {
      expected: expectedSlug,
      map: sectionMap,
      neutralSlugs: [...NEUTRAL_BOTTOM_SLUGS],
    },
  );
}
