import { expect, test } from "@playwright/test";

import { saveSectionScreenshot } from "./helpers/save-screenshot";
import { viewportPresets } from "../../viewport-presets";
import { visualSections } from "../../visual-sections.config";

const ISOLATED_ROUTE = "/__visual/sections/03-investments";
const SECTION_SLUG = "03-investments";

const investmentsSection = visualSections.find(
  (section) => section.slug === SECTION_SLUG,
);

if (!investmentsSection) {
  throw new Error("visual-sections.config.ts: секция 03-investments не найдена");
}

const criticalViewports = viewportPresets.filter((preset) =>
  investmentsSection.criticalViewports.includes(preset.name),
);

test.describe("Isolated visual: 03-investments", () => {
  for (const viewport of criticalViewports) {
    test(`${viewport.name}: section layout and screenshot`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.goto(ISOLATED_ROUTE);

      const section = page.locator("[data-investments-section]");
      await expect(section).toBeVisible();

      // Stats bar: в markup это ul внутри секции (docs: data-investments-list).
      const statsList = page.locator("[data-investments-section] ul");
      await expect(statsList).toBeVisible();

      // Footer не должен присутствовать на isolated route.
      await expect(page.locator("footer")).toHaveCount(0);

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 1;
      });

      const screenshotPath = await saveSectionScreenshot(
        page,
        SECTION_SLUG,
        "isolated",
        viewport.name,
      );

      expect(
        overflow,
        [
          `horizontalOverflow=true на viewport ${viewport.name}`,
          `screenshot=${screenshotPath}`,
        ].join("\n"),
      ).toBe(false);

      await expect(page.locator("[data-visual-page='03-investments']")).toBeVisible();
    });
  }
});
