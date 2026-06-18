"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import type { WpMedia } from "@/types/wordpress";
import styles from "./IncomeSection.module.css";
import { gsap } from "gsap";

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

  const tabRef = useRef<HTMLDivElement | null>(null);
  const isAnimatingRef = useRef(false);

  if (!activeTab) {
    return null;
  }

  const imgOneWidth = activeTab.img_one?.media_details?.width ?? 1920;
  const imgOneHeight = activeTab.img_one?.media_details?.height ?? 1024;
  const imgTwoWidth = activeTab.img_two?.media_details?.width ?? 240;
  const imgTwoHeight = activeTab.img_two?.media_details?.height ?? 320;
  const handleTabClick = ( index: number ) => {
    if ( index === activeTabIndex || isAnimatingRef.current ) {
      return;
    }

    isAnimatingRef.current = true;

    const container = tabRef.current;

    if ( !container ) {
      setActiveTabIndex( index );
      isAnimatingRef.current = false;
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
                isAnimatingRef.current = false;
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
    </div>
  );

  return (
    <section className={styles.income} data-income-section>
      <div className={styles.tab} data-reversed={isReversed} ref={tabRef}>
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
