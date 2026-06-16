"use client";

import Image from "next/image";
import { useState } from "react";
import type { WpMedia } from "@/types/wordpress";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import styles from "./GallerySection.module.css";

type gallerySectionProps = {
  top_title: string;
  title: string;
  gallery: WpMedia[];
};

export function GallerySection({ 
  top_title,
  title, 
  gallery = [],
}: gallerySectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [imageSwiper, setImageSwiper] = useState<SwiperClass | null>(null);
    const [contentSwiper, setContentSwiper] = useState<SwiperClass | null>(null);

    if (gallery.length === 0) {
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

    const goPrev = () => {
        goToSlide(Math.max(activeIndex - 1, 0));
    };

    const goNext = () => {
        goToSlide(Math.min(activeIndex + 1, gallery.length - 1));
    };
  return (
    <section className={styles.gallery} data-gallery={1}>
        <div className={styles.container}>
            <h3 className={`${styles.title} section-title`} >
                <span
                    className={`${styles.top_title} section-title-top`}
                    dangerouslySetInnerHTML={{ __html: top_title }}
                />
                <span dangerouslySetInnerHTML={{ __html: title }} />
            </h3>

            {gallery.length > 0 ? (
            <Swiper
                className={styles.slider}
                slidesPerView={1.1}
                spaceBetween={12}
                onSwiper={setImageSwiper}
                onSlideChange={handleImageSlideChange}
                breakpoints={{
                    991: {
                        slidesPerView: 1.3,
                    },
                    1501: {
                        slidesPerView: 1.7,
                    },
                }}
            >
                {gallery.map((img) => {
                const imgWidth = img.media_details?.width ?? 960;
                const imgHeight = img.media_details?.height ?? 540;

                return (
                    <SwiperSlide key={img.id}>
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

            <div className={styles.controls}>
                <span className={styles.counter}>
                    <span>{String(activeIndex + 1).padStart(2, '0')}</span> | {String(gallery.length).padStart(2, '0')}
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
                            <path d="M19 12H5M12 5L5 12L12 19" stroke="#4A3B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                    className={styles.arrow}
                    type="button"
                    onClick={goNext}
                    disabled={activeIndex === gallery.length - 1}
                    aria-label="Следующий слайд"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M12 19L19 12L12 5" stroke="#4A3B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                </div>
        </div>
    </section>
  );
}
