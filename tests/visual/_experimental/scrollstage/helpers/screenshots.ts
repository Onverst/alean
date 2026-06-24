import { mkdir } from "node:fs/promises";
import path from "node:path";

import type { Page } from "@playwright/test";

const RUNTIME_SCREENSHOTS_ROOT = path.join(
  process.cwd(),
  "tests/visual/runtime-screenshots",
);

export type SaveRuntimeScreenshotOptions = {
  sectionSlug: string;
  viewportName: string;
  state?: string;
  actualSlug?: string;
};

/**
 * Сохраняет runtime-скриншот.
 * Если actualSlug !== sectionSlug — только в _navigation-failed (не в папку секции).
 */
export async function saveRuntimeScreenshot(
  page: Page,
  options: SaveRuntimeScreenshotOptions,
): Promise<string> {
  const {
    sectionSlug,
    viewportName,
    state = "default",
    actualSlug = sectionSlug,
  } = options;

  const navigationMismatch = actualSlug !== sectionSlug;

  if (navigationMismatch) {
    const outputDir = path.join(
      RUNTIME_SCREENSHOTS_ROOT,
      "_navigation-failed",
      sectionSlug,
    );
    await mkdir(outputDir, { recursive: true });

    const fileName = `expected-${sectionSlug}__actual-${actualSlug}__${viewportName}.png`;
    const outputPath = path.join(outputDir, fileName);
    await page.screenshot({ path: outputPath, fullPage: false });
    return outputPath;
  }

  const outputDir = path.join(RUNTIME_SCREENSHOTS_ROOT, sectionSlug);
  await mkdir(outputDir, { recursive: true });

  const fileName =
    state === "default" ? `${viewportName}.png` : `${viewportName}__${state}.png`;
  const outputPath = path.join(outputDir, fileName);
  await page.screenshot({ path: outputPath, fullPage: false });

  return outputPath;
}
