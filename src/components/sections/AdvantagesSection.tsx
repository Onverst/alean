"use client";

import Image from "next/image";
import { useState } from "react";
import type { WpMedia } from "@/types/wordpress";
import styles from "./AdvantagesSection.module.css";
import {Button} from "@/components/Button";

type AdvantagesSectionProps = {
  top_title: string;
  title: string;
  text: string;
  img: WpMedia | null;
  tabs: {
    name: string;
    list: { 
      title: string;
      text: string;
    }[];
  }[];
};

export function AdvantagesSection({
  top_title,
  title,
  text,
  img,
  tabs = [],
}: AdvantagesSectionProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "0-0": true,
  });
  const imgWidth = img?.media_details?.width ?? 712;
  const imgHeight = img?.media_details?.height ?? 767;
  const activeTab = tabs[activeTabIndex];

  const toggleItem = (itemKey: string) => {
    setOpenItems((current) => ({
      ...current,
      [itemKey]: !current[itemKey],
    }));
  };

  return (
  <section className={styles.advantages}>
    <div className={styles.container}>
      <h3 className={`${styles.title} section-title`} >
        <span
          className={`${styles.top_title} section-title-top`}
          dangerouslySetInnerHTML={{ __html: top_title }}
        />
        <span dangerouslySetInnerHTML={{ __html: title }} />
      </h3>

      <div className={styles.bottom}>
        <p className={styles.text} dangerouslySetInnerHTML={{ __html: text }}></p>

        <Button className={`${styles.button} main-button`}>
            рассчитать доходность
        </Button>

        <div className={styles.wrap}>
          <div className={styles.img_wrap}>
            {img ? (
              <Image
                className={styles.img}
                src={img.source_url}
                alt={img.alt_text}
                priority
                width={imgWidth}
                height={imgHeight}
              />
            ) : null}
            
          </div>

          <div className={styles.tabs}>
            {tabs.length > 0 ? (
              <>
                <div className={styles.tab_buttons}>
                  {tabs.map((tab, index) => (
                    <button
                      className={styles.tab_button}
                      data-active={activeTabIndex === index}
                      key={`${tab.name}-${index}`}
                      type="button"
                      onClick={() => setActiveTabIndex(index)}
                    >
                      <span dangerouslySetInnerHTML={{ __html: tab.name }} />
                    </button>
                  ))}
                </div>

                {activeTab ? (
                  <ul className={styles.tab_list}>
                    {activeTab.list.map((item, index) => {
                      const itemKey = `${activeTabIndex}-${index}`;
                      const isOpen = Boolean(openItems[itemKey]);

                      return (
                        <li className={styles.tab_item} key={`${item.title}-${index}`}>
                          <button
                            className={styles.item_title}
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() => toggleItem(itemKey)}
                          >
                            <span dangerouslySetInnerHTML={{ __html: item.title }} />
                          </button>
                          {isOpen ? (
                            <div
                              className={styles.item_text}
                              dangerouslySetInnerHTML={{ __html: item.text }}
                            />
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>

    </div>
  </section>
  )
};
