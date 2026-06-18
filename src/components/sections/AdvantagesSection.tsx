"use client";

import Image from "next/image";
import { useState } from "react";
import type { WpMedia } from "@/types/wordpress";
import styles from "./AdvantagesSection.module.css";
import {Button} from "@/components/Button";
import { gsap } from "gsap";
import { useRef } from "react";

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
  const [openItemKey, setOpenItemKey] = useState<string | null>(null);
  const imgWidth = img?.media_details?.width ?? 712;
  const imgHeight = img?.media_details?.height ?? 767;
  const activeTab = tabs[activeTabIndex];

  const item_refs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleItem = (itemKey: string) => {
    const el = item_refs.current[itemKey];

    if ( !el ) {
      setOpenItemKey((current) => (current === itemKey ? null : itemKey));
      return;
    }

    const is_open = openItemKey === itemKey;

    if ( is_open ) {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power1.out",
        onComplete: () => {
          el.style.display = "none";
        },
      });

      setOpenItemKey(null);

      return;
    }

    el.style.display = "block";
    el.style.overflow = "hidden";

    gsap.fromTo(
      el,
      {
        height: 0,
        opacity: 0,
      },
      {
        height: el.scrollHeight,
        opacity: 1,
        duration: 0.4,
        ease: "power1.out",
        onComplete: () => {
          gsap.set(el, { height: "auto" });
        },
      },
    );

    setOpenItemKey(itemKey);
  };

  return (
  <section className={styles.advantages} data-advantages-section>
    <div className={styles.container}>
      <h3 className={`${styles.title} section-title`} data-advantages-reveal>
        <span
          className={`${styles.top_title} section-title-top`}
          dangerouslySetInnerHTML={{ __html: top_title }}
        />
        <span dangerouslySetInnerHTML={{ __html: title }} />
      </h3>

      <div className={styles.bottom}>
        <p
          className={styles.text}
          data-advantages-reveal
          dangerouslySetInnerHTML={{ __html: text }}
        ></p>

        <Button className={`${styles.button} main-button`} data-advantages-reveal>
            рассчитать доходность
        </Button>

        <div className={styles.wrap}>
          <div className={styles.img_wrap} data-advantages-reveal>
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

          <div className={styles.tabs} data-advantages-reveal>
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
                  <ul
                      key={activeTabIndex}
                      className={styles.tab_list}>
                    {activeTab.list.map((item, index) => {
                      const itemKey = `${activeTabIndex}-${index}`;
                      const isOpen = openItemKey === itemKey;

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
                            <div
                              ref={(el) => {
                                item_refs.current[itemKey] = el;
                              }}
                              className={styles.item_text}
                              data-open={isOpen}
                              dangerouslySetInnerHTML={{ __html: item.text }}
                            />
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
