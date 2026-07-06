"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import type { WpMedia } from "@/types/wordpress";
import styles from "./PointSection.module.css";
import { gsap } from "gsap";

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
  const [hasTabSwitched, setHasTabSwitched] = useState(false);
  const tab_ref = useRef<HTMLDivElement | null>(null);
  const is_animating_ref = useRef(false);
  const activeTab = tabs[activeTabIndex];
  const isReversed = activeTabIndex === 1;

  if (!activeTab) {
    return null;
  }

  const imgOneWidth = activeTab.img_one?.media_details?.width ?? 1920;
  const imgOneHeight = activeTab.img_one?.media_details?.height ?? 1024;
  const imgTwoWidth = activeTab.img_two?.media_details?.width ?? 360;
  const imgTwoHeight = activeTab.img_two?.media_details?.height ?? 240;
  const handleTabClick = ( index: number ) => {
    if ( index === activeTabIndex || is_animating_ref.current ) {
      return;
    }

    is_animating_ref.current = true;

    const container = tab_ref.current;

    if ( !container ) {
      setActiveTabIndex( index );
      is_animating_ref.current = false;
      return;
    }

    const leftSide = container.querySelector( '[data-income-side="left"]' );
    const rightSide = container.querySelector( '[data-income-side="right"]' );

    gsap.to( leftSide, {
      yPercent: 100,
      // opacity: 0,
      duration: 0.9,
      ease: "power2.in",
    } );

    gsap.to( rightSide, {
      yPercent: -100,
      // opacity: 0,
      duration: 0.9,
      ease: "power2.in",
      onComplete: () => {

        setActiveTabIndex( index );

        requestAnimationFrame( () => {

          const newLeft = container.querySelector( '[data-income-side="left"]' );
          const newRight = container.querySelector( '[data-income-side="right"]' );

          gsap.fromTo(
            newLeft,
            {
              yPercent: 100,
              // opacity: 0,
            },
            {
              yPercent: 0,
              // opacity: 1,
              duration: 0.9,
              ease: "power2.out",
            },
          );

          gsap.fromTo(
            newRight,
            {
              yPercent: -100,
              // opacity: 0,
            },
            {
              yPercent: 0,
              // opacity: 1,
              duration: 0.9,
              ease: "power2.out",
              onComplete: () => {
                is_animating_ref.current = false;
              },
            },
          );

        } );

      },
    } );
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
  );

  return (
    <section className={styles.point} data-point-section>
      <div className={styles.container}>
      <div className={styles.tab} data-reversed={isReversed} ref={tab_ref}>
          <div className={styles.side} data-income-side="left">
            {isReversed ? renderImagePanel("left") : renderContentPanel("left")}
          </div>

          <div className={styles.side} data-income-side="right">
            {isReversed ? renderContentPanel("right") : renderImagePanel("right")}
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
      </div>
    </section>
  );
}
