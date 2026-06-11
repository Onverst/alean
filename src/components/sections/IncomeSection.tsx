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
  const [hasTabSwitched, setHasTabSwitched] = useState(false);
  const activeTab = tabs[activeTabIndex];
  const isReversed = activeTabIndex === 1;

  if (!activeTab) {
    return null;
  }

  const imgOneWidth = activeTab.img_one?.media_details?.width ?? 1920;
  const imgOneHeight = activeTab.img_one?.media_details?.height ?? 1024;
  const imgTwoWidth = activeTab.img_two?.media_details?.width ?? 240;
  const imgTwoHeight = activeTab.img_two?.media_details?.height ?? 320;
  const handleTabClick = (index: number) => {
    if (index === activeTabIndex) {
      return;
    }

    setHasTabSwitched(true);
    setActiveTabIndex(index);
  };
  const renderImagePanel = (side: "left" | "right") => (
    <div
      className={`${styles.side_inner} ${styles.image_inner} ${hasTabSwitched ? styles.switching : ""}`}
      data-income-switch-side={side}
      key={`image-inner-${activeTabIndex}-${side}`}
    >
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
  );
  const renderContentPanel = (side: "left" | "right") => (
    <div
      className={`${styles.side_inner} ${styles.content_inner} ${hasTabSwitched ? styles.switching : ""}`}
      data-income-switch-side={side}
      key={`content-inner-${activeTabIndex}-${side}`}
    >
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
  );

  return (
    <section className={styles.income} data-income-section>
      <div className={styles.tab} data-reversed={isReversed}>
        <div className={styles.side} data-income-side="left">
          {isReversed ? renderContentPanel("left") : renderImagePanel("left")}
        </div>

        <div className={styles.side} data-income-side="right">
          {isReversed ? renderImagePanel("right") : renderContentPanel("right")}
        </div>
      </div>

      <div className={styles.buttons} data-income-buttons>
        {tabs.slice(0, 2).map((tab, index) => (
          <button
            className={styles.button}
            data-active={activeTabIndex === index}
            key={`${tab.name}-${index}`}
            type="button"
            onClick={() => handleTabClick(index)}
          >
            <span dangerouslySetInnerHTML={{ __html: tab.name }} />
          </button>
        ))}
      </div>
    </section>
  );
}
