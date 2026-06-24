import type { Page } from "@playwright/test";

import { isScrollStageInitialized } from "./visible-section";

/** Задержка после fonts.ready для стабилизации GSAP/Lenis анимаций. */
const GSAP_LENIS_STABILIZATION_MS = 400;
const SCROLLSTAGE_INIT_TIMEOUT_MS = 3_000;

/**
 * Ждёт готовности ScrollStage перед скроллом и скриншотами.
 * Проверяет DOM, шрифты, GSAP scroll track и даёт время на стабилизацию.
 */
export async function waitForScrollStageReady(page: Page): Promise<void> {
  await page.waitForSelector("[data-scroll-stage]", { state: "attached" });
  await page.waitForSelector("[data-scroll-panel]", { state: "attached" });

  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });

  // ScrollTrigger pin создаёт scroll track; без этого wheel-scroll не работает.
  await page
    .waitForFunction(
      () => {
        const viewportHeight = window.innerHeight;
        const scrollHeight = document.documentElement.scrollHeight;
        const pinSpacers = document.querySelectorAll(".pin-spacer").length;
        const panels = document.querySelectorAll("[data-scroll-panel]");
        const footerPanel = panels[panels.length - 1] as HTMLElement | undefined;
        const footerTop = footerPanel?.getBoundingClientRect().top ?? 0;

        return (
          scrollHeight > viewportHeight * 1.5 ||
          pinSpacers > 0 ||
          footerTop >= viewportHeight - 20
        );
      },
      { timeout: SCROLLSTAGE_INIT_TIMEOUT_MS },
    )
    .catch(() => {
      // Не блокируем прогон: navigation helper сам сообщит о failure.
    });

  await page.waitForTimeout(GSAP_LENIS_STABILIZATION_MS);

  const initialized = await isScrollStageInitialized(page);
  if (!initialized) {
    // Диагностика в console — помогает отличить harness issue от layout issue.
    console.warn(
      "[visual-tests] ScrollStage scroll track not detected — wheel navigation may fail.",
    );
  }
}
