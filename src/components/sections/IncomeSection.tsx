"use client";

import Image from "next/image";
import { useState } from "react";
import type { WpMedia } from "@/types/wordpress";
import styles from "./IncomeSection.module.css";

type IncomeTab = {
  name: string;
  title: string;
  text: string;
  img_one: WpMedia | null;
  img_two: WpMedia | null;
};

type IncomeSectionProps = {
  tabs: IncomeTab[];
}; 

export function IncomeSection({ tabs = [] }: IncomeSectionProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = tabs[activeTabIndex];
  const isReversed = activeTabIndex === 1;

  if (!activeTab) {
    return null;
  }

  const imgOneWidth = activeTab.img_one?.media_details?.width ?? 1920;
  const imgOneHeight = activeTab.img_one?.media_details?.height ?? 1024;
  const imgTwoWidth = activeTab.img_two?.media_details?.width ?? 240;
  const imgTwoHeight = activeTab.img_two?.media_details?.height ?? 320;

  return (
    <section className={styles.income}>
      <div className={styles.tab} data-reversed={isReversed}>
        <div className={styles.main_img_wrap}>
          {activeTab.img_one ? (
            <Image
              className={styles.main_img}
              src={activeTab.img_one.source_url}
              alt={activeTab.img_one.alt_text}
              width={imgOneWidth}
              height={imgOneHeight}
            />
          ) : null}
        </div>

        <div className={styles.content}>
          <h3
            className={styles.title}
            dangerouslySetInnerHTML={{ __html: activeTab.title }}
          />

          <div className={styles.content_img_wrap}>
            {activeTab.img_two ? (
              <Image
                className={styles.content_img}
                src={activeTab.img_two.source_url}
                alt={activeTab.img_two.alt_text}
                width={imgTwoWidth}
                height={imgTwoHeight}
              />
            ) : null}
          </div>

          <div
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: activeTab.text }}
          />
        </div>
      </div>

      <div className={styles.buttons}>
        {tabs.slice(0, 2).map((tab, index) => (
          <button
            className={styles.button}
            data-active={activeTabIndex === index}
            key={`${tab.name}-${index}`}
            type="button"
            onClick={() => setActiveTabIndex(index)}
          >
            <span dangerouslySetInnerHTML={{ __html: tab.name }} />
          </button>
        ))}
      </div>
    </section>
  );
}
