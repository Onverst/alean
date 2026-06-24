import { expect, test } from "@playwright/test";

import {
  getBottomStripVisibility,
  getPanelRectDiagnostics,
} from "./helpers/panel-visibility";
import { saveRuntimeScreenshot } from "./helpers/screenshots";
import { scrollToSectionByDominance } from "./helpers/scroll-to-section";
import { getDominantVisibleSection } from "./helpers/visible-section";
import { waitForScrollStageReady } from "./helpers/wait-for-scrollstage";
import { viewportPresets } from "./viewport-presets";
import { visualSections } from "./visual-sections.config";

const investmentsSection = visualSections.find(
  (section) => section.slug === "03-investments",
);

if (!investmentsSection) {
  throw new Error("visual-sections.config.ts: секция 03-investments не найдена");
}

const criticalViewports = viewportPresets.filter((preset) =>
  investmentsSection.criticalViewports.includes(preset.name),
);

test.describe("ScrollStage integration: 03-investments (fit-panel)", () => {
  for (const viewport of criticalViewports) {
    test(`${viewport.name}: navigate, dominant section, bottom strip`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.goto("/");
      await waitForScrollStageReady(page);

      const navigation = await scrollToSectionByDominance(
        page,
        investmentsSection.slug,
        investmentsSection.selector,
      );

      if (!navigation.success) {
        const screenshotPath = await saveRuntimeScreenshot(page, {
          sectionSlug: investmentsSection.slug,
          viewportName: viewport.name,
          actualSlug: navigation.actualSlug,
        });

        throw new Error(
          [
            `navigation failed: expected ${investmentsSection.slug}, actual ${navigation.actualSlug}`,
            `viewport=${viewport.name}`,
            `confidence=${navigation.confidence}`,
            `reason=${navigation.reason}`,
            `dominanceSamples=${JSON.stringify(navigation.dominance.samples)}`,
            `screenshot=${screenshotPath}`,
          ].join("\n"),
        );
      }

      const dominance = await getDominantVisibleSection(page);
      expect(
        dominance.dominantSlug,
        [
          `dominantSlug !== ${investmentsSection.slug} on ${viewport.name}`,
          `samples=${JSON.stringify(dominance.samples)}`,
          `confidence=${dominance.confidence}`,
        ].join("\n"),
      ).toBe(investmentsSection.slug);

      const bottomStrip = await getBottomStripVisibility(
        page,
        investmentsSection.slug,
      );

      const rectDiagnostics = await getPanelRectDiagnostics(
        page,
        investmentsSection.selector,
      );

      const screenshotPath = await saveRuntimeScreenshot(page, {
        sectionSlug: investmentsSection.slug,
        viewportName: viewport.name,
        actualSlug: dominance.dominantSlug,
      });

      await expect(page.locator(investmentsSection.selector)).toBeVisible();

      expect(
        rectDiagnostics.horizontalOverflow,
        [
          `horizontalOverflow=true на viewport ${viewport.name}`,
          `scrollWidth=${rectDiagnostics.scrollWidth}`,
          `windowInnerWidth=${rectDiagnostics.windowInnerWidth}`,
          `screenshot=${screenshotPath}`,
        ].join("\n"),
      ).toBe(false);

      if (
        investmentsSection.mode === "fit-panel" &&
        investmentsSection.mustNotRevealNextPanel &&
        bottomStrip.otherSlugVisibleAtBottom
      ) {
        throw new Error(
          [
            `Other section visible at bottom strip on ${viewport.name}`,
            `otherSlug=${bottomStrip.otherSlugVisibleAtBottom}`,
            `bottomSamples=${JSON.stringify(bottomStrip.bottomSamples)}`,
            `rectDebug=${JSON.stringify({
              sectionRect: rectDiagnostics.sectionRect,
              activePanelRect: rectDiagnostics.activePanelRect,
              nextPanelRect: rectDiagnostics.nextPanelRect,
            })}`,
            `screenshot=${screenshotPath}`,
          ].join("\n"),
        );
      }
    });
  }
});
