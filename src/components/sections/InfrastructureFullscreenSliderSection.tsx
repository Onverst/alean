"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import type { WpMedia } from "@/types/wordpress";
import styles from "./InfrastructureFullscreenSliderSection.module.css";

type InfrastructureFullscreenSlide = {
  title: string;
  text: string;
  img: WpMedia | null;
};

type InfrastructureFullscreenSliderSectionProps = {
  slides: InfrastructureFullscreenSlide[];
};

export function InfrastructureFullscreenSliderSection({
  slides = [],
}: InfrastructureFullscreenSliderSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const [imageSwiper, setImageSwiper] = useState<SwiperClass | null>(null);
  const [titleSwiper, setTitleSwiper] = useState<SwiperClass | null>(null);
  const [textSwiper, setTextSwiper] = useState<SwiperClass | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      titleSwiper?.update();
      titleSwiper?.updateAutoHeight();

      textSwiper?.update();
      textSwiper?.updateAutoHeight();
    });

    return () => cancelAnimationFrame(raf);
  }, [isOpen, activeIndex, titleSwiper, textSwiper]);

  if (slides.length === 0) {
    return null;
  }

  const syncSlide = (index: number) => {
    imageSwiper?.slideTo(index);
    titleSwiper?.slideTo(index);
    textSwiper?.slideTo(index);

    setActiveIndex(index);
  };

  const handleSlideChange = (swiper: SwiperClass) => {
    const nextIndex = swiper.activeIndex;

    if (nextIndex === activeIndex) {
      return;
    }

    imageSwiper?.slideTo(nextIndex);
    titleSwiper?.slideTo(nextIndex);
    textSwiper?.slideTo(nextIndex);

    setActiveIndex(nextIndex);
  };

  const toggleText = () => {
    setIsOpen((current) => !current);
  };

  const goPrev = () => {
    syncSlide(Math.max(activeIndex - 1, 0));
  };

  const goNext = () => {
    syncSlide(Math.min(activeIndex + 1, slides.length - 1));
  };

  return (
    <section className={styles.fullscreen_slider}>
      <div className={styles.wrap}>
        <Swiper
          className={styles.bg_swiper}
          slidesPerView={1}
          onSwiper={setImageSwiper}
          onSlideChange={handleSlideChange}
        >
          {slides.map((slide, index) => {
            const imgWidth = slide.img?.media_details?.width ?? 1920;
            const imgHeight = slide.img?.media_details?.height ?? 1080;

            return (
              <SwiperSlide key={`bg-${index}`}>
                {slide.img ? (
                  <Image
                    className={styles.bg}
                    src={slide.img.source_url}
                    alt={slide.img.alt_text}
                    width={imgWidth}
                    height={imgHeight}
                  />
                ) : null}
              </SwiperSlide>
            );
          })}
        </Swiper> 

        {slides.length > 1 ? (
          <div className={styles.slider_controls}>
            <span className={styles.slider_counter}>
              <span>{String(activeIndex + 1).padStart(2, '0')}</span> | {String(slides.length).padStart(2, '0')}
            </span>
            <div className={styles.slider_buttons}>
              <button
                className={styles.slider_arrow}
                type="button"
                onClick={goPrev}
                disabled={activeIndex === 0}
                aria-label="Предыдущий слайд"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M12 5L5 12L12 19" stroke="#FAF5EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                className={styles.slider_arrow}
                type="button"
                onClick={goNext}
                disabled={activeIndex === slides.length - 1}
                aria-label="Следующий слайд"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M12 19L19 12L12 5" stroke="#FAF5EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.container}>
        <div className={styles.panel}>
          <button
            className={styles.toggle}
            type="button"
            aria-expanded={isOpen}
            onClick={toggleText}
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
                width: `${((activeIndex + 1) / slides.length) * 100}%`,
              }}
            />
          </div>

          <Swiper
            className={styles.content_swiper}
            slidesPerView={1}
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
      </div>
    </section>
  );
}
