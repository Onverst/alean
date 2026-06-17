"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
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
  const [hasTabSwitched, setHasTabSwitched] = useState(false);
  const isMobileSlider = useMediaQuery("(max-width: 1200px)");
  const activeTab = tabs[activeTabIndex];
  const isReversed = activeTabIndex === 1;

  if (!activeTab) {
    return null;
  }

  const imgOneWidth = activeTab.img_one?.media_details?.width ?? 720;
  const imgOneHeight = activeTab.img_one?.media_details?.height ?? 720;
  const productImages = activeTab.list_img.length > 1
    ? duplicateProductImages(activeTab.list_img)
    : activeTab.list_img;
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
      <div className={styles.left} data-lenis-prevent>
        {activeTab.list_img.length > 0 ? (
          <Swiper
            key={`${activeTabIndex}-${isMobileSlider ? "mobile" : "desktop"}`}
            className={styles.list_img}
            direction={isMobileSlider ? "horizontal" : "vertical"}
            slidesPerView="auto"
            spaceBetween={8}
            loop={activeTab.list_img.length > 1}
            centeredSlides={!isMobileSlider}
            freeMode={{
              enabled: true,
              momentum: true,
              momentumRatio: 0.6,
              momentumVelocityRatio: 0.6,
            }}
            mousewheel={{
              enabled: true,
              forceToAxis: true,
              releaseOnEdges: true,
              sensitivity: 0.6,
            }}
            modules={[FreeMode, Mousewheel]}
            onSlideChange={(swiper) => {
              if (swiper.realIndex >= 2) {
                swiper.el.classList.add(styles.list_img_changed);
              }
            }}
          >
            {productImages.map((item, index) => {
              const imgWidth = item.img?.media_details?.width ?? 240;
              const imgHeight = item.img?.media_details?.height ?? 320;

              return (
                <SwiperSlide className={styles.img_item} key={`${item.name}-${index}-${item.img?.id ?? "empty"}`}>
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
                </SwiperSlide>
              );
            })}
          </Swiper>
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
  );

  return (
    <section className={styles.product}
             data-product-section={1}
    >
      <div className={styles.container}>
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
      </div>
    </section>
  );
}

function duplicateProductImages(items: ProductTab["list_img"]) {
  return [...items, ...items, ...items];
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);

    updateMatches();
    mediaQuery.addEventListener("change", updateMatches);

    return () => {
      mediaQuery.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}
