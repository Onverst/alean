"use client";

import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import type { WpMedia } from "@/types/wordpress";
import styles from "./InfrastructureSliderSection.module.css";

type InfrastructureSlide = {
  title: string;
  text: string;
  img: WpMedia | null;
};

type InfrastructureSliderSectionProps = {
  slides: InfrastructureSlide[];
};

export function InfrastructureSliderSection({
  slides = [],
}: InfrastructureSliderSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageSwiper, setImageSwiper] = useState<SwiperClass | null>(null);
  const [contentSwiper, setContentSwiper] = useState<SwiperClass | null>(null);

  if (slides.length === 0) {
    return null;
  }

  const goToSlide = (index: number) => {
    imageSwiper?.slideTo(index);
    contentSwiper?.slideTo(index);
    setActiveIndex(index);
  };

  const handleImageSlideChange = (swiper: SwiperClass) => {
    const nextIndex = swiper.activeIndex;

    if (nextIndex !== activeIndex) {
      contentSwiper?.slideTo(nextIndex);
      setActiveIndex(nextIndex);
    }
  };

  const handleContentSlideChange = (swiper: SwiperClass) => {
    const nextIndex = swiper.activeIndex;

    if (nextIndex !== activeIndex) {
      imageSwiper?.slideTo(nextIndex);
      setActiveIndex(nextIndex);
    }
  };

  const goPrev = () => {
    goToSlide(Math.max(activeIndex - 1, 0));
  };

  const goNext = () => {
    goToSlide(Math.min(activeIndex + 1, slides.length - 1));
  };

  return (
    <section className={styles.infrastructure_slider}>
      <div className={styles.images}>
        <Swiper
          className={styles.image_swiper}
          slidesPerView={1}
          onSwiper={setImageSwiper}
          onSlideChange={handleImageSlideChange}
        >
          {slides.map((slide, index) => {
            const imgWidth = slide.img?.media_details?.width ?? 900;
            const imgHeight = slide.img?.media_details?.height ?? 720;

            return (
              <SwiperSlide key={`${slide.title}-${index}`}>
                {slide.img ? (
                  <Image
                    className={styles.img}
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

        <div className={styles.controls}>
          <span className={styles.counter}>
            <span>{String(activeIndex + 1).padStart(2, '0')}</span> | {String(slides.length).padStart(2, '0')}
          </span>
          <div className={styles.arrows}>
            <button
              className={styles.arrow}
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
              className={styles.arrow}
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
      </div>

      <div className={styles.content}>
        <div className={styles.titles}>
          {slides.map((slide, index) => (
            <button
              className={styles.title_button}
              data-active={activeIndex === index}
              key={`${slide.title}-${index}`}
              type="button"
              onClick={() => goToSlide(index)}
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />
          ))}
        </div>

        <Swiper
          className={styles.content_swiper}
          slidesPerView={1}
          allowTouchMove
          onSwiper={setContentSwiper}
          onSlideChange={handleContentSlideChange}
          autoHeight={false}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={`${slide.text}-${index}`}>
              <div
                className={styles.text}
                dangerouslySetInnerHTML={{ __html: slide.text }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
