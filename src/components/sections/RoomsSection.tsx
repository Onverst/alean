"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import type { WpMedia } from "@/types/wordpress";
import styles from "./RoomsSection.module.css";

type RoomsSection = {
  title: string;
  square: string;
  text: string;
  img: WpMedia | null;
  income: WpMedia | null;
  plans: WpMedia[];
};

type RoomsSectionProps = {
  slides: RoomsSection[];
};

type PopupState = {
  type: "income" | "plans";
  slideIndex: number;
} | null;

export function RoomsSection({
  slides = [],
}: RoomsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [popup, setPopup] = useState<PopupState>(null);
  const [activePlanIndex, setActivePlanIndex] = useState(0);

  const [imageSwiper, setImageSwiper] = useState<SwiperClass | null>(null);
  const [titleSwiper, setTitleSwiper] = useState<SwiperClass | null>(null);
  const [textSwiper, setTextSwiper] = useState<SwiperClass | null>(null);
  const [plansSwiper, setPlansSwiper] = useState<SwiperClass | null>(null);

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

  const openPopup = (type: "income" | "plans", slideIndex: number) => {
    setPopup({ type, slideIndex });
    setActivePlanIndex(0);
  };

  const closePopup = () => {
    setPopup(null);
  };

  const handlePlanSlideChange = (swiper: SwiperClass) => {
    setActivePlanIndex(swiper.activeIndex);
  };

  const goPrevPlan = () => {
    plansSwiper?.slideTo(Math.max(activePlanIndex - 1, 0));
  };

  const goNextPlan = (plansLength: number) => {
    plansSwiper?.slideTo(Math.min(activePlanIndex + 1, plansLength - 1));
  };

  const popupSlide = popup ? slides[popup.slideIndex] : null;
  const incomeWidth = popupSlide?.income?.media_details?.width ?? 1024;
  const incomeHeight = popupSlide?.income?.media_details?.height ?? 694;

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
                aria-label="Предыдущий номер"
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
                aria-label="Следующий номер"
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

                    <div className={styles.buttons}>
                      <button
                        type="button"
                        onClick={() => openPopup("income", index)}
                        disabled={!slide.income}
                      >
                        Доходность
                      </button>
                      <button
                        type="button"
                        onClick={() => openPopup("plans", index)}
                        disabled={slide.plans.length === 0}
                      >
                        планировка
                      </button>
                    </div>
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
                    <div>
                    <p
                      className={styles.square}
                      dangerouslySetInnerHTML={{
                        __html: slide.square,
                    }}/>
                    <p
                      className={styles.text}
                      dangerouslySetInnerHTML={{
                        __html: slide.text,
                      }}
                    />
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {popup && popupSlide ? (
        <div className={styles.popup} role="dialog" aria-modal="true">
          <button
            className={styles.popup_backdrop}
            type="button"
            aria-label="Закрыть попап"
            onClick={closePopup}
          />
          <div className={styles.popup_content}>
            <button
              className={styles.popup_close}
              type="button"
              aria-label="Закрыть попап"
              onClick={closePopup}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#FAF5EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {popup.type === "income" && popupSlide.income ? (
              <Image
                className={styles.popup_image}
                src={popupSlide.income.source_url}
                alt={popupSlide.income.alt_text}
                width={incomeWidth}
                height={incomeHeight}
              />
            ) : null}

            {popup.type === "plans" && popupSlide.plans.length > 0 ? (
              <div className={styles.plans}>
                <Swiper
                  key={`plans-${popup.slideIndex}`}
                  className={styles.plans_slider}
                  slidesPerView={1}
                  onSwiper={setPlansSwiper}
                  onSlideChange={handlePlanSlideChange}
                >
                  {popupSlide.plans.map((plan) => {
                    const planWidth = plan.media_details?.width ?? 838;
                    const planHeight = plan.media_details?.height ?? 568;

                    return (
                      <SwiperSlide key={plan.id}>
                        <Image
                          className={styles.popup_image}
                          src={plan.source_url}
                          alt={plan.alt_text}
                          width={planWidth}
                          height={planHeight}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>

                {popupSlide.plans.length > 1 ? (
                  <div className={styles.plan_controls}>
                    <span className={styles.plan_counter}>
                      <span>{String(activePlanIndex + 1).padStart(2, '0')}</span> | {String(popupSlide.plans.length).padStart(2, '0')}
                    </span>
                    <div className={styles.plan_buttons}>
                      <button
                        className={styles.plan_arrow}
                        type="button"
                        onClick={goPrevPlan}
                        disabled={activePlanIndex === 0}
                        aria-label="Предыдущая планировка"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 12H5M12 5L5 12L12 19" stroke="#4A3B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      
                      <button
                        className={styles.plan_arrow}
                        type="button"
                        onClick={() => goNextPlan(popupSlide.plans.length)}
                        disabled={activePlanIndex === popupSlide.plans.length - 1}
                        aria-label="Следующая планировка"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19M12 19L19 12L12 5" stroke="#4A3B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
