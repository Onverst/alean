"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { WpMedia } from "@/types/wordpress";
import styles from "./ServiceSection.module.css";

type ServiceSectionProps = {
  top_title: string;
  title: string;
  text: string;
  gallery: WpMedia[];
};

export function ServiceSection({
  top_title,
  title, 
  text,
  gallery = [],
}: ServiceSectionProps) {
  return (
    <section className={styles.service}>
      <div className={styles.container}>
        <span
          className={styles.top_title}
          dangerouslySetInnerHTML={{ __html: top_title }}
        />
        <h3 className={styles.title}>
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </h3>

        <p
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: text }}
        />

        {gallery.length > 0 ? (
          <Swiper
            className={`${styles.slider} image-slider`}
            slidesPerView={'auto'}
            spaceBetween={0}
            loop={true}
            breakpoints={{
              991: {
                loop: false
              },
              
            }} 
          >
            {gallery.map((img) => {
              const imgWidth = img.media_details?.width ?? 320;
              const imgHeight = img.media_details?.height ?? 448;

              return (
                <SwiperSlide
                 key={img.id}
                 className={styles.slide}
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
