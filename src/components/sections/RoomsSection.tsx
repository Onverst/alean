"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import "swiper/css/effect-fade";
import type { Swiper as SwiperClass } from "swiper/types";
import type { WpMedia } from "@/types/wordpress";
import styles from "./RoomsSection.module.css";

type RoomsSection = {
  title: string;
  square: string;
  text: string;
  images: WpMedia[];
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
  const sectionRef = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [popup, setPopup] = useState<PopupState>(null);
  const [activePlanIndex, setActivePlanIndex] = useState(0);

  const [imageSwiper, setImageSwiper] = useState<SwiperClass | null>(null);
  const [titleSwiper, setTitleSwiper] = useState<SwiperClass | null>(null);
  const [textSwiper, setTextSwiper] = useState<SwiperClass | null>(null);
  const [plansSwiper, setPlansSwiper] = useState<SwiperClass | null>(null);
  const progressWidth =
    slides.length > 1
      ? ((progressValue * (slides.length - 1) + 1) / slides.length) * 100
      : 100;

  const syncProgress = useCallback((progress: number) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 1);
    const nextIndex = Math.round(clampedProgress * (slides.length - 1));

    imageSwiper?.setProgress(clampedProgress, 0);
    /*titleSwiper?.setProgress(clampedProgress, 0);
    textSwiper?.setProgress(clampedProgress, 0);*/

    setProgressValue(clampedProgress);

    /*if (nextIndex !== activeIndexRef.current) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }*/
    if (nextIndex !== activeIndexRef.current) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      titleSwiper?.slideTo(nextIndex);
      textSwiper?.slideTo(nextIndex);
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

    imageSwiper?.slideTo(nextIndex, 1000);
    titleSwiper?.slideTo(nextIndex, 1000);
    textSwiper?.slideTo(nextIndex, 1000);

    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
    setProgressValue(slides.length > 1 ? nextIndex / (slides.length - 1) : 1);
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
    plansSwiper?.slideTo(Math.max(activePlanIndex - 1, 0), 1000);
  };

  const goNextPlan = (plansLength: number) => {
    plansSwiper?.slideTo(Math.min(activePlanIndex + 1, plansLength - 1), 1000);
  };

  const popupSlide = popup ? slides[popup.slideIndex] : null;
  const incomeWidth = popupSlide?.income?.media_details?.width ?? 1024;
  const incomeHeight = popupSlide?.income?.media_details?.height ?? 694;

  return (
    <section
      className={styles.fullscreen_slider}
      data-scroll-driven-slider
      data-scroll-duration={Math.max(slides.length - 1, 0)}
      ref={sectionRef}
      data-room-section={1}
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
            watchSlidesProgress={true}
            updateOnWindowResize={false}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            modules={[EffectFade]}
            speed={1000}
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
                width: `${progressWidth}%`,
              }}
            />
          </div>

          <Swiper
            className={styles.content_swiper}
            slidesPerView={1}
            allowTouchMove={false}
            autoHeight
            watchSlidesProgress={true}
            updateOnWindowResize={false}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            modules={[EffectFade]}
            speed={1000}
            onSwiper={setTextSwiper}
            onSlideChange={handleSlideChange}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={`text-${index}`}>
                <div className={styles.slide_content}>
                    <div>
                    <div
                      className={styles.text}
                      >
                      <div className={styles.text_outer}>
                      <p
                          className={styles.square}
                          dangerouslySetInnerHTML={{
                            __html: slide.square,
                          }}/>
                        <div className={styles.text_inner}
                             dangerouslySetInnerHTML={{
                               __html: slide.text,
                             }}
                        >
                        </div>
                    </div>
                      </div>
                    </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      {/* </div> */}

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
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  modules={[EffectFade]}
                  speed={1000}
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

function InnerBackgroundSlider({ images }: { images: WpMedia[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const goPrev = () => {
    swiper?.slideTo(Math.max(activeIndex - 1, 0), 1000);
  };

  const goNext = () => {
    swiper?.slideTo(Math.min(activeIndex + 1, images.length - 1), 1000);
  };

  return (
    <div className={styles.bg_inner_slider}>
      <Swiper
        className={styles.bg_inner_swiper}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        modules={[EffectFade]}
        speed={1000}
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
