"use client";

import Image from "next/image";
import { useState } from "react";
import type { WpMedia } from "@/types/wordpress";
import styles from "./PointSection.module.css";

type PointTab = {
  name: string;
  title: string;
  text: string;
  list: {
    title: string;
    text: string;
  }[];
  img_one: WpMedia | null;
  img_two: WpMedia | null;
};

type PointSectionProps = {
  tabs: PointTab[];
};

export function PointSection({ tabs = [] }: PointSectionProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = tabs[activeTabIndex];
  const isReversed = activeTabIndex === 1;

  if (!activeTab) {
    return null;
  }

  const imgOneWidth = activeTab.img_one?.media_details?.width ?? 1920;
  const imgOneHeight = activeTab.img_one?.media_details?.height ?? 1024;
  const imgTwoWidth = activeTab.img_two?.media_details?.width ?? 360;
  const imgTwoHeight = activeTab.img_two?.media_details?.height ?? 240;

  return (
    <section className={styles.point}>
      <div className={styles.container}>
        <div className={styles.tab} data-reversed={isReversed}>
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

            {activeTab.list.length > 0 ? (
              <ul className={styles.list}>
                {activeTab.list.map((item, index) => (
                  <li className={styles.list_item} key={`${item.title}-${index}`}>
                    <p
                      className={styles.list_title}
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    />
                    <span
                      className={styles.list_text}
                      dangerouslySetInnerHTML={{ __html: item.text }}
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

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
      </div>
    </section>
  );
}
