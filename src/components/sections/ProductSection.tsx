"use client";

import Image from "next/image";
import { useState } from "react";
import type { WpMedia } from "@/types/wordpress";
import styles from "./ProductSection.module.css";

type ProductTab = {
  name: string;
  title: string;
  text: string;
  list: {
    title: string;
    text: string;
  }[];
  img_one: WpMedia | null; 
  list_img: {
    name: string;
    img: WpMedia | null;
  }[];
};

type ProductSectionProps = {
  tabs: ProductTab[];
};

export function ProductSection({ tabs = [] }: ProductSectionProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = tabs[activeTabIndex];
  const isReversed = activeTabIndex === 1;

  if (!activeTab) {
    return null;
  }

  const imgOneWidth = activeTab.img_one?.media_details?.width ?? 720;
  const imgOneHeight = activeTab.img_one?.media_details?.height ?? 720;

  return (
    <section className={styles.product}>
      <div className={styles.container}>
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
            <div className={styles.left} data-lenis-prevent>
              {activeTab.list_img.length > 0 ? (
                <ul className={styles.list_img}>
                  {activeTab.list_img.map((item, index) => {
                    const imgWidth = item.img?.media_details?.width ?? 240;
                    const imgHeight = item.img?.media_details?.height ?? 320;

                    return (
                      <li className={styles.img_item} key={`${item.name}-${index}`}>
                        {item.img ? (
                          <Image
                            className={styles.item_img}
                            src={item.img.source_url}
                            alt={item.img.alt_text}
                            width={imgWidth}
                            height={imgHeight}
                          />
                        ) : null}
                        <span dangerouslySetInnerHTML={{ __html: item.name }} />
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>

            <div className={styles.right}>
              <h3
                className={styles.title}
                dangerouslySetInnerHTML={{ __html: activeTab.title }}
              />

              <div
                className={styles.text}
                dangerouslySetInnerHTML={{ __html: activeTab.text }}
              />

              {activeTab.list.length > 0 ? (
                <ul className={styles.list}>
                  {activeTab.list.map((item, index) => (
                    <li className={styles.list_item} key={`${item.title}-${index}`}>
                      <span
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
