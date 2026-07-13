"use client";

import Image from "@/components/OptimizedImage";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import "swiper/css/effect-fade";
import type { Swiper as SwiperClass } from "swiper/types";
import type { WpMedia } from "@/types/wordpress";
import styles from "./InfrastructureSliderSection.module.css";

type InfrastructureSlide = {
  title: string;
  text: string;
  images: WpMedia[];
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
    imageSwiper?.slideTo(index, 1000);
    contentSwiper?.slideTo(index, 1000);
    setActiveIndex(index);
  };

  const handleImageSlideChange = (swiper: SwiperClass) => {
    const nextIndex = swiper.activeIndex;

    if (nextIndex !== activeIndex) {
      contentSwiper?.slideTo(nextIndex, 1000);
      setActiveIndex(nextIndex);
    }
  };

  const handleContentSlideChange = (swiper: SwiperClass) => {
    const nextIndex = swiper.activeIndex;

    if (nextIndex !== activeIndex) {
      imageSwiper?.slideTo(nextIndex, 1000);
      setActiveIndex(nextIndex);
    }
  };

  return (
    <section className={styles.infrastructure_slider}
    data-infrastruture-slider-section={1}>
      <div className={styles.images}>
        <Swiper
          className={styles.image_swiper}
          slidesPerView={1}
          allowTouchMove={false}
          onSwiper={setImageSwiper}
          onSlideChange={handleImageSlideChange}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={`${slide.title}-${index}`}>
              <InnerImageSlider images={slide.images} />
            </SwiperSlide>
          ))}
        </Swiper>
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
          effect="fade"
          fadeEffect={{ crossFade: true }}
          modules={[EffectFade]}
          speed={1000}
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

function InnerImageSlider({ images }: { images: WpMedia[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const goPrev = () => {
    swiper?.slideTo(Math.max(activeIndex - 1, 0), 1000);
  };

  const goNext = () => {
    swiper?.slideTo(Math.min(activeIndex + 1, images.length - 1), 1000);
  };

  return (
    <div className={styles.inner_slider}>
      <Swiper
        className={styles.inner_image_swiper}
        slidesPerView={1}
        onSwiper={setSwiper}
        onSlideChange={(instance) => setActiveIndex(instance.activeIndex)}
      >
        {images.map((img, index) => {
          const imgWidth = img.media_details?.width ?? 900;
          const imgHeight = img.media_details?.height ?? 720;

          return (
            <SwiperSlide key={`${img.source_url}-${index}`}>
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

      {images.length > 1 ? (
        <div className={styles.controls}>
          <span className={styles.counter}>
            <span>{String(activeIndex + 1).padStart(2, '0')}</span> | {String(images.length).padStart(2, '0')}
          </span>
          <div className={styles.arrows}>
            <button
              className={styles.arrow}
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
              className={styles.arrow}
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
