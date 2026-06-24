import { mkdir } from "node:fs/promises";
import path from "node:path";

import type { Page } from "@playwright/test";

const RUNTIME_SCREENSHOTS_ROOT = path.join(
  process.cwd(),
  "tests/visual/runtime-screenshots",
);

/**
 * Сохраняет screenshot isolated section test.
 * Путь: tests/visual/runtime-screenshots/<sectionSlug>-isolated/<viewportName>.png
 */
export async function saveSectionScreenshot(
  page: Page,
  sectionSlug: string,
  _variantName: string,
  viewportName: string,
): Promise<string> {
  const outputDir = path.join(
    RUNTIME_SCREENSHOTS_ROOT,
    `${sectionSlug}-isolated`,
  );
  await mkdir(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${viewportName}.png`);
  await page.screenshot({ path: outputPath, fullPage: false });

  return outputPath;
}
