"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import type { WpMedia } from "@/types/wordpress";
import styles from "./InfrastructureFullscreenSliderSection.module.css";

type InfrastructureFullscreenSlide = {
  title: string;
  text: string;
  images: WpMedia[];
};

type InfrastructureFullscreenSliderSectionProps = {
  slides: InfrastructureFullscreenSlide[];
};

export function InfrastructureFullscreenSliderSection({
  slides = [],
}: InfrastructureFullscreenSliderSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const [imageSwiper, setImageSwiper] = useState<SwiperClass | null>(null);
  const [titleSwiper, setTitleSwiper] = useState<SwiperClass | null>(null);
  const [textSwiper, setTextSwiper] = useState<SwiperClass | null>(null);
  const progressWidth =
    slides.length > 1
      ? ((progressValue * (slides.length - 1) + 1) / slides.length) * 100
      : 100;

  const syncProgress = useCallback((progress: number) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 1);
    const nextIndex = Math.round(clampedProgress * (slides.length - 1));

    imageSwiper?.setProgress(clampedProgress, 0);
    titleSwiper?.setProgress(clampedProgress, 0);
    textSwiper?.setProgress(clampedProgress, 0);

    setProgressValue(clampedProgress);

    if (nextIndex !== activeIndexRef.current) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }
  }, [imageSwiper, slides.length, textSwiper, titleSwiper]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      titleSwiper?.update();
      titleSwiper?.updateAutoHeight();

      textSwiper?.update();
      textSwiper?.updateAutoHeight();
    });

    return () => cancelAnimationFrame(raf);
  }, [isOpen, activeIndex, titleSwiper, textSwiper]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || slides.length <= 1) {
      return;
    }

    const handleScrollProgress = (event: Event) => {
      const progress = (event as CustomEvent<{ progress: number }>).detail
        ?.progress;

      if (typeof progress !== "number") {
        return;
      }

      syncProgress(progress);
    };

    section.addEventListener(
      "scroll-driven-slider-progress",
      handleScrollProgress,
    );

    return () => {
      section.removeEventListener(
        "scroll-driven-slider-progress",
        handleScrollProgress,
      );
    };
  }, [slides.length, syncProgress]);

  if (slides.length === 0) {
    return null;
  }

  const handleSlideChange = (swiper: SwiperClass) => {
    const nextIndex = swiper.activeIndex;

    if (nextIndex === activeIndex) {
      return;
    }

    imageSwiper?.slideTo(nextIndex);
    titleSwiper?.slideTo(nextIndex);
    textSwiper?.slideTo(nextIndex);

    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
    setProgressValue(slides.length > 1 ? nextIndex / (slides.length - 1) : 1);
  };

  return (
    <section
      className={styles.fullscreen_slider}
      data-scroll-driven-slider
      data-scroll-duration={Math.max(slides.length - 1, 0)}
      ref={sectionRef}
    >
      <div className={styles.wrap}>
        <Swiper
          className={styles.bg_swiper}
          slidesPerView={1}
          allowTouchMove={false}
          onSwiper={setImageSwiper}
          onSlideChange={handleSlideChange}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={`bg-${index}`}>
              <InnerBackgroundSlider images={slide.images} />
            </SwiperSlide>
          ))}
        </Swiper> 
      </div>

      {/* <div className={styles.container}> */}
        <div
          className={styles.panel}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
        >
          <button
            className={styles.toggle}
            type="button"
            aria-expanded={isOpen}
            tabIndex={-1}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="#FAF5EF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <Swiper
            className={styles.content_swiper}
            slidesPerView={1}
            allowTouchMove={false}
            autoHeight
            onSwiper={setTitleSwiper}
            onSlideChange={handleSlideChange}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={`title-${index}`}>
                <div className={styles.slide_content}>
                  <div className={styles.title_row}>
                    

                    <h3
                      className={styles.title}
                      dangerouslySetInnerHTML={{
                        __html: slide.title,
                      }}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.progress}>
            <span
              style={{
                width: `${progressWidth}%`,
              }}
            />
          </div>

          <Swiper
            className={styles.content_swiper}
            slidesPerView={1}
            allowTouchMove={false}
            autoHeight
            onSwiper={setTextSwiper}
            onSlideChange={handleSlideChange}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={`text-${index}`}>
                <div className={styles.slide_content}>
                  {isOpen && (
                    <div
                      className={styles.text}
                      dangerouslySetInnerHTML={{
                        __html: slide.text,
                      }}
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      {/* </div> */}
    </section>
  );
}

function InnerBackgroundSlider({ images }: { images: WpMedia[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const goPrev = () => {
    swiper?.slideTo(Math.max(activeIndex - 1, 0));
  };

  const goNext = () => {
    swiper?.slideTo(Math.min(activeIndex + 1, images.length - 1));
  };

  return (
    <div className={styles.bg_inner_slider}>
      <Swiper
        className={styles.bg_inner_swiper}
        slidesPerView={1}
        onSwiper={setSwiper}
        onSlideChange={(instance) => setActiveIndex(instance.activeIndex)}
      >
        {images.map((image, index) => {
          const imgWidth = image.media_details?.width ?? 1920;
          const imgHeight = image.media_details?.height ?? 1080;

          return (
            <SwiperSlide key={`${image.source_url}-${index}`}>
              <Image
                className={styles.bg}
                src={image.source_url}
                alt={image.alt_text}
                width={imgWidth}
                height={imgHeight}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>

      {images.length > 1 ? (
        <div className={styles.slider_controls}>
          <span className={styles.slider_counter}>
            <span>{String(activeIndex + 1).padStart(2, '0')}</span> | {String(images.length).padStart(2, '0')}
          </span>
          <div className={styles.slider_buttons}>
            <button
              className={styles.slider_arrow}
              type="button"
              onClick={goPrev}
              disabled={activeIndex === 0}
              aria-label="Предыдущее изображение"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 5L5 12L12 19" stroke="#FAF5EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              className={styles.slider_arrow}
              type="button"
              onClick={goNext}
              disabled={activeIndex === images.length - 1}
              aria-label="Следующее изображение"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M12 19L19 12L12 5" stroke="#FAF5EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
