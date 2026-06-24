import { notFound } from "next/navigation";

import { InvestmentsSection } from "@/components/sections/InvestmentsSection";
import { VisualRouteChromeController } from "@/components/VisualRouteChromeController";
import { fetchMediaById, getHomePage } from "@/lib/wordpress";

/**
 * Dev-only isolated route для visual checks секции Investments (Cursor browser).
 *
 * Открывать: http://localhost:3000/__visual/sections/03-investments
 * (alias через rewrite в next.config.ts)
 *
 * Файл лежит в `visual/`, не в `__visual/`: Next.js App Router исключает
 * `_`-prefixed folders из routing (`__visual` → private folder).
 */
export default async function InvestmentsVisualPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const page = await getHomePage();

  const investmentsTopTitle = page?.acf?.investments_top_title || "";
  const investmentsTitle = page?.acf?.investments_title || "";
  const investmentsImg = await fetchMediaById(page?.acf?.investments_img);
  const investmentsTextOne = page?.acf.investments_text_one || "";
  const investmentsTextTwo = page?.acf.investments_text_two || "";
  const investmentsList = page?.acf.investments_list ?? [];

  return (
    <main data-visual-page="03-investments">
      <VisualRouteChromeController />
      <InvestmentsSection
        top_title={investmentsTopTitle}
        title={investmentsTitle}
        img={investmentsImg}
        text_one={investmentsTextOne}
        text_two={investmentsTextTwo}
        list={investmentsList}
      />
    </main>
  );
}
