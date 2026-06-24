import type { Page } from "@playwright/test";

import {
  getDominantVisibleSection,
  type DominantVisibleSection,
} from "./visible-section";

/** Параметры пошагового scroll loop по dominant visible section. */
const SCROLL_CONFIG = {
  wheelDeltaY: 280,
  waitAfterWheelMs: 200,
  maxAttempts: 120,
  minConfidence: 0.5,
  stabilizationMs: 300,
  /** Минимум шагов scroll перед overscroll-failure. */
  minStepsBeforeOverscrollFail: 2,
} as const;

export type ScrollToSectionResult =
  | {
      success: true;
      expectedSlug: string;
      actualSlug: string;
      confidence: number;
      dominance: DominantVisibleSection;
    }
  | {
      success: false;
      expectedSlug: string;
      actualSlug: string;
      confidence: number;
      dominance: DominantVisibleSection;
      reason: string;
    };

/**
 * Доводит ScrollStage до expectedSlug через dominant visible section (front panel).
 */
export async function scrollToSectionByDominance(
  page: Page,
  expectedSlug: string,
  _selector: string,
): Promise<ScrollToSectionResult> {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(SCROLL_CONFIG.stabilizationMs);

  await page.locator("body").click({ position: { x: 8, y: 8 }, force: true });

  let lastDominance = await getDominantVisibleSection(page);

  for (let attempt = 0; attempt < SCROLL_CONFIG.maxAttempts; attempt += 1) {
    if (
      lastDominance.dominantSlug === expectedSlug &&
      lastDominance.confidence >= SCROLL_CONFIG.minConfidence
    ) {
      return {
        success: true,
        expectedSlug,
        actualSlug: lastDominance.dominantSlug,
        confidence: lastDominance.confidence,
        dominance: lastDominance,
      };
    }

    const overshot =
      attempt >= SCROLL_CONFIG.minStepsBeforeOverscrollFail &&
      isPastExpectedSection(lastDominance.dominantSlug, expectedSlug);

    if (overshot) {
      return {
        success: false,
        expectedSlug,
        actualSlug: lastDominance.dominantSlug,
        confidence: lastDominance.confidence,
        dominance: lastDominance,
        reason: `overscroll: dominant ${lastDominance.dominantSlug} after ${attempt} scroll steps`,
      };
    }

    const atDocumentEnd = await page.evaluate(() => {
      const docHeight = document.documentElement.scrollHeight;
      const viewBottom = window.scrollY + window.innerHeight;
      return viewBottom >= docHeight - 2;
    });

    if (
      atDocumentEnd &&
      attempt >= SCROLL_CONFIG.minStepsBeforeOverscrollFail &&
      lastDominance.dominantSlug !== expectedSlug
    ) {
      return {
        success: false,
        expectedSlug,
        actualSlug: lastDominance.dominantSlug,
        confidence: lastDominance.confidence,
        dominance: lastDominance,
        reason: "document end reached without finding expected section",
      };
    }

    await page.mouse.wheel(0, SCROLL_CONFIG.wheelDeltaY);
    await page.waitForTimeout(SCROLL_CONFIG.waitAfterWheelMs);
    lastDominance = await getDominantVisibleSection(page);
  }

  return {
    success: false,
    expectedSlug,
    actualSlug: lastDominance.dominantSlug,
    confidence: lastDominance.confidence,
    dominance: lastDominance,
    reason: `max scroll attempts (${SCROLL_CONFIG.maxAttempts}) exceeded`,
  };
}

function isPastExpectedSection(
  dominantSlug: string,
  expectedSlug: string,
): boolean {
  if (dominantSlug === "unknown" || dominantSlug === expectedSlug) {
    return false;
  }

  const order = [
    "01-hero",
    "02-about",
    "03-investments",
    "04-advantages",
    "05-income",
    "06-location",
    "07-point",
    "08-concept",
    "09-product",
    "10-open-form",
    "11-infrastructure",
    "12-genplan",
    "13-infrastructure-slider",
    "14-infrastructure-fullscreen-slider",
    "15-service",
    "16-service-slider",
    "17-rooms",
    "18-finance",
    "19-gallery",
    "20-footer",
  ];

  const expectedIndex = order.indexOf(expectedSlug);
  const dominantIndex = order.indexOf(dominantSlug);

  if (expectedIndex === -1 || dominantIndex === -1) {
    return false;
  }

  return dominantIndex > expectedIndex;
}
