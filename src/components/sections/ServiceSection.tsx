"use client";

import Image from "@/components/OptimizedImage";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import type { WpMedia } from "@/types/wordpress";
import styles from "./ServiceSection.module.css";

type ServiceSlide = {
  title: string;
  text: string;
  img: WpMedia;
};

type RenderedServiceSlide = {
  slide: ServiceSlide;
  sourceIndex: number;
  copyIndex: number;
};

type ServiceSectionProps = {
  top_title: string;
  title?: string;
  text?: string;
  gallery?: WpMedia[];
  slides?: ServiceSlide[];
};

const MIN_LOOP_SLIDES = 10;

function getRenderedSlides(
  slides: ServiceSlide[],
  shouldLoop: boolean,
): RenderedServiceSlide[] {
  const repeats = shouldLoop
    ? Math.max(1, Math.ceil(MIN_LOOP_SLIDES / slides.length))
    : 1;

  return Array.from({ length: repeats }).flatMap((_, copyIndex) =>
    slides.map((slide, sourceIndex) => ({
      slide,
      sourceIndex,
      copyIndex,
    })),
  );
}

export function ServiceSection({
  top_title,
  title, 
  text,
  gallery = [],
  slides = [],
}: ServiceSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoopEnabled, setIsLoopEnabled] = useState(false);
  const [imageSwiper, setImageSwiper] = useState<SwiperClass | null>(null);
  const [contentSwiper, setContentSwiper] = useState<SwiperClass | null>(null);

  const serviceSlides =
    slides.length > 0
      ? slides
      : gallery.map((img, index) => ({
          title: index === 0 ? title ?? "" : "",
          text: index === 0 ? text ?? "" : "",
          img,
        }));
  const shouldLoop = isLoopEnabled && serviceSlides.length > 1;
  const renderedSlides = getRenderedSlides(serviceSlides, shouldLoop);
  const activeRenderedIndex =
    renderedSlides.length > 0 ? activeIndex % renderedSlides.length : 0;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1200px)");
    const updateLoopMode = () => setIsLoopEnabled(mediaQuery.matches);

    updateLoopMode();
    mediaQuery.addEventListener("change", updateLoopMode);

    return () => mediaQuery.removeEventListener("change", updateLoopMode);
  }, []);

  useEffect(() => {
    if (!shouldLoop || !imageSwiper) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      imageSwiper.update();
      imageSwiper.slideToLoop(activeRenderedIndex, 0, false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeRenderedIndex, imageSwiper, shouldLoop]);

  const isDesktopHoverMode = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1201px) and (hover: hover) and (pointer: fine)")
      .matches;

  const activateSlide = (index: number, syncImage = false) => {
    setActiveIndex(index);
    if (shouldLoop) {
      contentSwiper?.slideToLoop(index);
    } else {
      contentSwiper?.slideTo(index);
    }

    if (syncImage) {
      if (shouldLoop) {
        imageSwiper?.slideToLoop(index);
      } else {
        imageSwiper?.slideTo(index);
      }
    }
  };

  const handleImageSlideChange = (swiper: SwiperClass) => {
    if (!isDesktopHoverMode()) {
      activateSlide(swiper.realIndex);
    }
  };

  return (
    <section className={styles.service}
    data-service-section={1}>
      <div className={styles.container}>
        <span
          className={styles.top_title}
          dangerouslySetInnerHTML={{ __html: top_title }}
        />

        {serviceSlides.length > 0 ? (
          <Swiper
            key={`content-${shouldLoop ? "loop" : "static"}`}
            className={styles.content_slider}
            modules={[ EffectFade ]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={600}
            slidesPerView={1}
            allowTouchMove={false}
            autoHeight
            loop={shouldLoop}
            initialSlide={activeRenderedIndex}
            onSwiper={setContentSwiper}
          >
            {renderedSlides.map(({ slide, sourceIndex, copyIndex }, index) => (
              <SwiperSlide
                className={styles.content_slide}
                key={`${slide.title}-${sourceIndex}-${copyIndex}`}
              >
                <h3 className={styles.title}>
                  <span dangerouslySetInnerHTML={{ __html: slide.title }} />
                </h3>

                <p
                  className={styles.text}
                  dangerouslySetInnerHTML={{ __html: slide.text }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}

        {serviceSlides.length > 0 ? (
          <Swiper
            key={`images-${shouldLoop ? "loop" : "static"}`}
            className={`${styles.slider} image-slider`}
            slidesPerView={'auto'}
            spaceBetween={0}
            loop={shouldLoop}
            centeredSlides={shouldLoop}
            initialSlide={activeRenderedIndex}
            onSwiper={setImageSwiper}
            onSlideChange={handleImageSlideChange}
            breakpoints={{
              1201: {
                allowTouchMove: false,
              },
            }} 
          >
            {renderedSlides.map(({ slide, sourceIndex, copyIndex }, index) => {
              const img = slide.img;
              const imgWidth = img.media_details?.width ?? 320;
              const imgHeight = img.media_details?.height ?? 448;

              return (
                <SwiperSlide
                  key={`${img.id}-${sourceIndex}-${copyIndex}`}
                  className={styles.slide}
                  data-active={activeRenderedIndex === index}
                  onMouseEnter={() => {
                    if (isDesktopHoverMode()) {
                      activateSlide(index);
                    }
                  }}
                >
                  <Image
                    className={styles.img}
                    src={img.source_url}
                    alt={img.alt_text}
                    width={imgWidth}
                    height={imgHeight}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : null}
      </div>
    </section>
  );
}
