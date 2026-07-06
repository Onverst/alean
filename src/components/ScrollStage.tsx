"use client";

import {
  Children,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import styles from "./ScrollStage.module.css";

type ScrollStageProps = {
  children: ReactNode;
};

declare global {
  interface Window {
    __heroIntroScrollLocked?: boolean;
    __lenis?: Lenis;
    __scrollStageScrollToHash?: (hash: string) => boolean;
  }
}

const INFRASTRUCTURE_REVEAL_DURATION = 1.35;
const INFRASTRUCTURE_SCROLL_DURATION = 0.9;
const INVESTMENTS_REVEAL_DURATION = 1.15;
const INVESTMENTS_EXIT_DURATION = 1.4;
const FINANCE_REVEAL_DURATION = 1.15;
// Зарезервировано для опционального fade-out Finance → Gallery.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- будет использовано при добавлении exit-анимации
const FINANCE_EXIT_DURATION = 1.4;
const INVESTMENTS_TO_ADVANTAGES_OVERLAP = 0.26;
const ADVANTAGES_REVEAL_DURATION = 1;
const LOCATION_REVEAL_DURATION = 1.5;
const LOCATION_EXIT_DURATION = 0.75;
const CONCEPT_REVEAL_DURATION = 1.15;
const HERO_INTRO_LOCK_EVENT = "hero-intro-lock-change";
const PRODUCT_PANEL_SCROLL_CLASS = "product-panel-scroll-active";

export function ScrollStage({ children }: ScrollStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
      prevent: (node) =>
        Boolean(
          node.closest(
            "[data-lenis-prevent], .iti__country-list, .iti__country-selector, .iti--detached-country-selector",
          ),
        ),
    });

    window.__lenis = lenis;

    const syncHeroIntroLock = () => {
      if (!window.__heroIntroScrollLocked) {
        lenis.start();
        lenis.resize();
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }
    };

    syncHeroIntroLock();
    window.addEventListener(HERO_INTRO_LOCK_EVENT, syncHeroIntroLock);

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    let removeAnchorNavigation: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const stage = stageRef.current;
      const panels = gsap.utils.toArray<HTMLElement>("[data-scroll-panel]");
      const [heroPanel, aboutPanel, thirdPanel] = panels;
      const overlayPanels = panels.slice(3);
      const heroBg = heroPanel?.querySelector<HTMLElement>(
        "[data-scroll-hero-bg]",
      );
      const heroContainer = heroPanel?.querySelector<HTMLElement>(
        "[data-scroll-hero-container]",
      );
      const aboutBg = aboutPanel?.querySelector<HTMLElement>(
        "[data-scroll-about-bg]",
      );
      const aboutWrap = aboutPanel?.querySelector<HTMLElement>(
        "[data-scroll-about-wrap]",
      );
      
      const getPanelOverflow = (panel: HTMLElement) =>
        Math.max(panel.scrollHeight - window.innerHeight, 0);

      const getConceptPanelScrollOffset = (panel: HTMLElement) => {
        const conceptSection = panel.querySelector<HTMLElement>(
          "[data-concept-section]",
        );

        if (!conceptSection) {
          return getPanelOverflow(panel);
        }

        return Math.max(conceptSection.scrollHeight - window.innerHeight, 0);
      };

      /*
       * GenplanSection — fit-slide / panzoom на всех breakpoint'ах:
       * отключаем vertical panel-scroll, иначе снизу виден предыдущий panel.
       */
      const shouldLockGenplanVerticalScroll = (panel: HTMLElement) =>
        Boolean(panel.querySelector("[data-genplan-section]"));

      const getFinancePanelScrollOffset = (panel: HTMLElement) => {
        const financeSection = panel.querySelector<HTMLElement>(
          "[data-finance-section]",
        );

        return financeSection
          ? Math.max(financeSection.scrollHeight - window.innerHeight, 0)
          : getPanelOverflow(panel);
      };

      const getProductPanelScrollOffset = (panel: HTMLElement) => {
        const productSection = panel.querySelector<HTMLElement>(
          "[data-product-section]",
        );
        const productScrollContent = productSection?.querySelector<HTMLElement>(
          "[data-product-scroll-content]",
        );

        if (!productSection) {
          return getPanelOverflow(panel);
        }

        if (!window.matchMedia("(max-width: 1200px)").matches) {
          return 0;
        }

        const productScrollContentHeight =
          productScrollContent?.offsetHeight ?? productSection.offsetHeight;

        return Math.max(
          productScrollContentHeight - window.innerHeight,
          0,
        );
      };

      /*
       * OpenFormSection — fit-slide на всех breakpoint'ах:
       * отключаем vertical panel-scroll, иначе снизу виден ProductSection.
       */
      const shouldLockOpenFormVerticalScroll = (panel: HTMLElement) =>
        Boolean(panel.querySelector("[data-body-form-section]"));

      const getGalleryPanelScrollOffset = (panel: HTMLElement) => {
        const gallerySection = panel.querySelector<HTMLElement>(
          "[data-gallery]",
        );

        return gallerySection
          ? Math.max(gallerySection.scrollHeight - window.innerHeight, 0)
          : getPanelOverflow(panel);
      };

      const getPanelScrollOffset = (panel: HTMLElement) => {
        if (shouldLockGenplanVerticalScroll(panel)) {
          return 0;
        }

        if (panel.querySelector("[data-finance-section]")) {
          return getFinancePanelScrollOffset(panel);
        }

        if (panel.querySelector("[data-product-section]")) {
          return getProductPanelScrollOffset(panel);
        }

        if (shouldLockOpenFormVerticalScroll(panel)) {
          return 0;
        }

        if (panel.querySelector("[data-gallery]")) {
          return getGalleryPanelScrollOffset(panel);
        }

        return panel.querySelector("[data-concept-section]")
          ? getConceptPanelScrollOffset(panel)
          : getPanelOverflow(panel);
      };

      const getThirdPanelOverflow = () => {
        if (!thirdPanel) {
          return 0;
        }

        const investmentsSection = thirdPanel.querySelector<HTMLElement>(
          "[data-investments-section]",
        );

        return investmentsSection
          ? Math.max(investmentsSection.scrollHeight - window.innerHeight, 0)
          : getPanelOverflow(thirdPanel);
      };
      const getThirdPanelScrollDuration = () =>
        Math.max(getThirdPanelOverflow() / window.innerHeight, 0.01);
      const getThirdPanelPassDuration = () =>
        0.95 + getThirdPanelScrollDuration();
      const getAboutScrollDuration = () =>
        Math.max(getAboutBgOverflow() / window.innerHeight, 0.01);
      const getPanelScrollDuration = (panel: HTMLElement) =>
        getPanelScrollOffset(panel) / window.innerHeight;
      const getPanelScrollDrivenDuration = (panel: HTMLElement) => {
        const slider = panel.querySelector<HTMLElement>(
          "[data-scroll-driven-slider]",
        );

        if (!slider) {
          return 0;
        }

        return Number(slider.dataset.scrollDuration) || 0;
      };
      const getInfrastructureAnimationDuration = (panel: HTMLElement) =>
        panel.querySelector("[data-infrastructure-section]")
          ? INFRASTRUCTURE_REVEAL_DURATION + INFRASTRUCTURE_SCROLL_DURATION
          : 0;
      const getLocationAnimationDuration = (panel: HTMLElement) =>
        panel.querySelector("[data-location-section]")
          ? LOCATION_EXIT_DURATION
          : 0;
      const getInvestmentsAnimationDuration = () =>
        thirdPanel?.querySelectorAll("[data-investments-reveal]").length
          ? INVESTMENTS_EXIT_DURATION +
            (thirdPanel.querySelectorAll("[data-investments-reveal]").length -
              1) *
              0.08
          : 0;
      /* На desktop (>1200px) Advantages не должен начинаться раньше завершения Investments —
         overlap отключён, на mobile/tablet сохраняется INVESTMENTS_TO_ADVANTAGES_OVERLAP. */
      const getInvestmentsToAdvantagesOverlap = () =>
        window.innerWidth > 1200 ? 0 : INVESTMENTS_TO_ADVANTAGES_OVERLAP;
      const getAboutBgOverflow = () => {
        if (!aboutBg) {
          return 0;
        }

        return Math.max(aboutBg.offsetHeight - window.innerHeight, 0);
      };
      const getOverlayPanelsDuration = () =>
        overlayPanels.reduce(
          (duration, panel) =>
            duration +
            0.95 +
            getLocationAnimationDuration(panel) +
            getInfrastructureAnimationDuration(panel) +
            getPanelScrollDrivenDuration(panel) +
            (panel.querySelector("[data-location-section]")
              ? 0
              : getPanelScrollDuration(panel)),
          0,
        );

      // gsap.set(PreloaderSection, { yPercent: 0, zIndex: 3 });
      gsap.set(heroPanel, { yPercent: 0, zIndex: 25 });
      gsap.set(aboutPanel, { yPercent: 0, zIndex: 2 });
      gsap.set(thirdPanel, { y: 0, yPercent: 100, zIndex: 4 });
      overlayPanels.forEach((panel, index) => {
        gsap.set(panel, { y: 0, yPercent: 100, zIndex: 5 + index });
      });
      if (heroBg) {
        gsap.set(heroBg, { y: 0 });
      }
      if(heroContainer) {
        gsap.set(heroBg, { y: 0 });
      }
      if (aboutBg) {
        gsap.set(aboutBg, { y: 0 });
      }

      if (aboutWrap) {
        gsap.set(aboutWrap, {
          y: () => window.innerHeight * 0,
          opacity: 1,
        });
      }

      const aboutScrollDuration = getAboutScrollDuration();
      const thirdPanelRevealStart = 1 + aboutScrollDuration;
      const thirdPanelPassStart = thirdPanelRevealStart + 0.3;
      const investmentsRevealElements = thirdPanel
        ? gsap.utils.toArray<HTMLElement>(
            thirdPanel.querySelectorAll("[data-investments-reveal]"),
          )
        : [];
      const investmentsList = thirdPanel?.querySelector<HTMLElement>(
        "[data-investments-list]",
      );
      const investmentsExitTotalDuration =
        investmentsRevealElements.length > 0
          ? INVESTMENTS_EXIT_DURATION +
            (investmentsRevealElements.length - 1) * 0.08
          : 0;
      const investmentsToAdvantagesOverlap =
        investmentsExitTotalDuration > 0
          ? Math.min(
              getInvestmentsToAdvantagesOverlap(),
              investmentsExitTotalDuration * 0.75,
            )
          : 0;

      if (investmentsRevealElements.length > 0) {
        gsap.set(investmentsRevealElements, {
          autoAlpha: 0,
          // y: 28,
          y: 0,
        });
      }

      let overlayStart = 0;
      const snapPoints = [
        0,
        1,
      ];
      const anchorTimelineTimes = new Map<string, number>();
      let productPanelScrollStart = -1;
      let productPanelScrollEnd = -1;
      const setAnchorTimelineTime = (panel: HTMLElement | undefined, time: number) => {
        const anchor = panel?.querySelector<HTMLElement>("[id]");

        if (!anchor?.id) {
          return;
        }

        anchorTimelineTimes.set(anchor.id, time);
      };
      const getThirdPanelTopAlignedTime = () => {
        if (!thirdPanel) {
          return thirdPanelPassStart;
        }

        const panelHeight = Math.max(thirdPanel.offsetHeight, window.innerHeight);
        const overflow = getThirdPanelOverflow();
        const topAlignedProgress =
          overflow > 0 ? panelHeight / (panelHeight + overflow) : 1;

        return (
          thirdPanelPassStart +
          getThirdPanelPassDuration() *
            gsap.utils.clamp(0, 1, topAlignedProgress)
        );
      };
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () =>
            `+=${
              window.innerHeight *
                (thirdPanelRevealStart +
                  0.95 +
                  getInvestmentsAnimationDuration() +
                  getOverlayPanelsDuration()) +
              getThirdPanelOverflow()
            }`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.8,
          snap: {
            duration: { min: 0.18, max: 0.45 },
            ease: "power1.inOut",
            snapTo: (progress) => {
              const timelineProgress = progress * timeline.duration();

              if (
                timelineProgress > thirdPanelRevealStart &&
                timelineProgress < overlayStart
              ) {
                return progress;
              }

              return gsap.utils.snap(
                snapPoints.map((point) => point / timeline.duration()),
                progress,
              );
            },
          },
          invalidateOnRefresh: true,
          onUpdate: () => {
            const timelineTime = timeline.time();
            const isProductPanelScrollActive =
              productPanelScrollEnd > productPanelScrollStart &&
              timelineTime >= productPanelScrollStart &&
              timelineTime <= productPanelScrollEnd;

            document.documentElement.classList.toggle(
              PRODUCT_PANEL_SCROLL_CLASS,
              isProductPanelScrollActive,
            );
          },
        },
      });

      setAnchorTimelineTime(heroPanel, 0);
      setAnchorTimelineTime(aboutPanel, 1);
      setAnchorTimelineTime(thirdPanel, getThirdPanelTopAlignedTime());

      timeline.to(heroPanel, {
        yPercent: -100,
        ease: "none",
        duration: 1,
      });

      if (heroBg) {
        timeline.to(
          heroBg,
          {
            y: () => window.innerHeight * 0.22,
            ease: "none",
            duration: 1,
          },
          0,
        );
      }

      if(heroContainer) {
        timeline.to(
          heroContainer,
          {
            y: () => window.innerHeight * 1,
            ease: "none",
            duration: 1,
          },
          0,
        );
      }

      if (aboutBg) {
        timeline
          .to(
            aboutBg,
            {
              y: () => 0,
              ease: "none",
              duration: 1,
            },
            0,
          )
          .to(
            aboutBg,
            {
              y: () => -getAboutBgOverflow(),
              ease: "none",
              duration: aboutScrollDuration,
            },
            1,
          );
      }

      if (aboutWrap) {
        timeline
          .to(
            aboutWrap,
            {
              y: () => window.innerHeight * 0,
              ease: "none",
              duration: 1,
            },
            0,
          )
          .to(
            aboutWrap,
            {
              y: () => window.innerHeight * -0.48,
              opacity: 0,
              ease: "none",
              duration: Math.min(aboutScrollDuration, 0.95),
            },
            1 + aboutScrollDuration * 0.2,
          );
      }

      timeline.to(
        thirdPanel,
        {
          yPercent: 0,
          y: () => -getThirdPanelOverflow(),
          ease: "none",
          duration: getThirdPanelPassDuration,
        },
        thirdPanelPassStart,
      );

      if (investmentsRevealElements.length > 0) {
        timeline.to(
          investmentsRevealElements,
          {
            autoAlpha: 1,
            y: 0,
            ease: "power1.out",
            stagger: 0.12,
            duration: INVESTMENTS_REVEAL_DURATION,
          },
          thirdPanelRevealStart + 0.18,
        );
      }

      const investmentsExitStart =
        thirdPanelPassStart + getThirdPanelPassDuration();

      if (investmentsRevealElements.length > 0) {
        timeline.to(
          investmentsRevealElements,
          {
            autoAlpha: 0,
            // y: -24,
            y: 0,
            ease: "power1.in",
            stagger: 0.08,
            duration: INVESTMENTS_EXIT_DURATION,
          },
          investmentsExitStart,
        );
      }

      /*if (investmentsList) {
        timeline.to(
          investmentsList,
          {
            autoAlpha: 0,
            ease: "power1.inOut",
            duration: INVESTMENTS_EXIT_DURATION,
          },
          investmentsExitStart,
        );
      }*/

      overlayStart =
        investmentsExitStart +
        investmentsExitTotalDuration -
        investmentsToAdvantagesOverlap;
      snapPoints.push(overlayStart);

      overlayPanels.forEach((panel) => {
          const advantagesSection = gsap.utils.toArray<HTMLElement>(
              panel.querySelectorAll("[data-advantages-section]"),
          );
          const advantagesRevealElements = gsap.utils.toArray<HTMLElement>(
              panel.querySelectorAll("[data-advantages-reveal]"),
          );
          const incomeLeft = panel.querySelector<HTMLElement>(
              "[data-income-side='left']",
          );
          const incomeRight = panel.querySelector<HTMLElement>(
              "[data-income-side='right']",
          );
          const incomeButtons = panel.querySelector<HTMLElement>(
              "[data-income-buttons]",
          );
          const isIncomePanel = Boolean(incomeLeft && incomeRight);
          const locationSection = panel.querySelector<HTMLElement>(
              "[data-location-section]",
          );
          const locationImage = panel.querySelector<HTMLElement>(
              "[data-location-image]",
          );
          const locationContent = panel.querySelector<HTMLElement>(
              "[data-location-content]",
          );
          const isLocationPanel = Boolean(locationSection);
          const conceptRevealElements = gsap.utils.toArray<HTMLElement>(
              panel.querySelectorAll("[data-concept-reveal]"),
          );
          const gallerySection = panel.querySelector<HTMLElement>(
              "[data-gallery]",
          );
          const PointSection = panel.querySelector<HTMLElement>(
              "[data-point-section]",
          );
          const isMobilePointPanel = Boolean(
              PointSection && window.matchMedia("(max-width: 1200px)").matches,
          );
          const ConceptSection = panel.querySelector<HTMLElement>(
              "[data-concept-section]",
          );
          const ConceptImageLeft = panel.querySelector<HTMLElement>(
              "[data-concept-img='left']",
          );
          const ConceptImageRight = panel.querySelector<HTMLElement>(
              "[data-concept-img='right']",
          );
          const IncomeSection = panel.querySelector<HTMLElement>(
              "[data-income-section]",
          );
          const ProductSection = panel.querySelector<HTMLElement>(
              "[data-product-section]",
          );
          const FinanceSection = panel.querySelector<HTMLElement>(
              "[data-finance-section]",
          );
          const financeRevealElements = gsap.utils.toArray<HTMLElement>(
              panel.querySelectorAll("[data-finance-reveal]"),
          );
          const BodyFormSection = panel.querySelector<HTMLElement>(
              "[data-body-form-section]",
          );
          const InfrastructureSection = panel.querySelector<HTMLElement>(
              "[data-infrastructure-section]",
          );
          // Infrastructure panel: отдельная stable snap-точка вместо раннего generic snap после входа.
          const isInfrastructurePanel = Boolean(InfrastructureSection);
          const GenplanSection = panel.querySelector<HTMLElement>(
              "[data-genplan-section]",
          );
          const InfrastructureSliderSection = panel.querySelector<HTMLElement>(
              "[data-infrastruture-slider-section]",
          );
          const InfrastructureFullSection = panel.querySelector<HTMLElement>(
              "[data-infrastructure-full]",
          );
          const ServiceSection = panel.querySelector<HTMLElement>(
              "[data-service-section]",
          );
          const ServiceSliderSection = panel.querySelector<HTMLElement>(
              "[data-service-slider-section]",
          );
          const RoomSection = panel.querySelector<HTMLElement>(
              "[data-room-section]",
          );
          const FormBodyTitle = panel.querySelector<HTMLElement>(
              "[data-form-title]",
          );
          const FormBodyText = panel.querySelector<HTMLElement>(
              "[data-form-text]",
          );
          const FormBodyArea = panel.querySelector<HTMLElement>(
              "[data-form-area]",
          );


          if ( advantagesSection ) {
              timeline.to(
                  IncomeSection,
                  {
                      y: 0,
                      duration: 1,
                      ease: "power1.out",
                  },
                  overlayStart += 0.3
              );
          }

          if (advantagesRevealElements.length > 0) {
              gsap.set(advantagesRevealElements, {
                  autoAlpha: 0,
                  y: 18,
              });
            }

          if ( IncomeSection ) {
                gsap.set(IncomeSection, {
                    y: 0,
                });
                timeline.to(
                    IncomeSection,
                    {
                        y: 0,
                        duration: 1,
                        ease: "power1.out",
                    },
                    overlayStart += 0.3
                );
            }

          if (incomeLeft) {
              gsap.set(incomeLeft, {
                autoAlpha: 1,
                yPercent: isMobilePointPanel ? 100 : -100,
              });
            }

          if (incomeRight) {
              gsap.set(incomeRight, {
                autoAlpha: 1,
                yPercent: 100,
              });
            }

          if (incomeButtons) {
              gsap.set(incomeButtons, {
                autoAlpha: 0,
                y: 18,
              });
            }

          if ( ProductSection ) {
              gsap.set(locationSection, {
                  y: 0,
              });
              timeline.to(
                  ProductSection,
                  {
                      y: 0,
                      ease: "power1.in",
                      duration: 1,
                  },
                  overlayStart += 0.3,
              );
          }

          if (locationSection) {
              gsap.set(locationSection, {
                  y: 0,
              });
              timeline.to(
                  locationSection,
                  {
                      y: 0,
                      duration: 1,
                      ease: "power1.out",
                  },
                  overlayStart += 0.5
              );
          }

          if (ConceptSection) {
              gsap.set(ConceptSection, {
                  y: 0,
              });
              timeline.to(
                  ConceptSection,
                  {
                      y: 0,
                      duration: 1,
                      ease: "power1.out",
                  },
                  overlayStart += 0.5
              );
          }

          if ( ConceptImageLeft ) {
              timeline.fromTo(
                  ConceptImageLeft,
                  {
                      autoAlpha: 0,
                  },
                  {
                      autoAlpha: 1,
                      ease: "power1.out",
                      duration: 2,
                  },
                  overlayStart,
              );
              timeline.fromTo(
                  ConceptImageLeft,
                  {
                      yPercent: -80,
                  },
                  {
                      yPercent: 0,
                      ease: "none",
                      duration: 1.5,
                  },
                  overlayStart,
              );
          }

          if ( ConceptImageRight ) {
              timeline.fromTo(
                  ConceptImageRight,
                  {
                      autoAlpha: 0,
                  },
                  {
                      autoAlpha: 1,
                      ease: "power1.out",
                      duration: 2,
                  },
                  overlayStart,
              );
              timeline.fromTo(
                  ConceptImageRight,
                  {
                      yPercent: 80,
                  },
                  {
                      yPercent: 0,
                      ease: "none",
                      duration: 1.5,
                  },
                  overlayStart,
              );
          }

          if ( BodyFormSection ) {
              timeline.to(
                  BodyFormSection,
                  {
                      y: 0,
                      duration: 1,
                      ease: "power1.out",
                  },
                  overlayStart += 0.5
              );
          }

          if ( InfrastructureSection ) {
              timeline.to(
                  InfrastructureSection,
                  {
                      y: 0,
                      duration: 1,
                      ease: "power1.out",
                  },
                  overlayStart += 0.3
              );
          }

          if ( GenplanSection ) {
              timeline.to(
                  GenplanSection,
                  {
                      y: 0,
                      duration: 1,
                      ease: "power1.out",
                  },
                  overlayStart += 0.3
              );
          }

          if ( InfrastructureSliderSection ) {
              timeline.to(
                  InfrastructureSliderSection,
                  {
                      y: 0,
                      duration: 1,
                      ease: "power1.out",
                  },
                  overlayStart += 0.3
              );
          }

          if ( InfrastructureFullSection ) {
              timeline.to(
                  InfrastructureFullSection,
                  {
                      y: 0,
                      duration: 1,
                      ease: "power1.out",
                  },
                  overlayStart += 0.3
              );
          }

          if ( ServiceSection ) {
              timeline.to(
                  ServiceSection,
                  {
                      y: 0,
                      duration: 1,
                      ease: "power1.out",
                  },
                  overlayStart += 0.3
              );
          }

          if ( ServiceSliderSection ) {
              timeline.to(
                  ServiceSliderSection,
                  {
                      y: 0,
                      duration: 1,
                      ease: "power1.out",
                  },
                  overlayStart += 0.3
              );
          }

          if ( RoomSection ) {
              timeline.to(
                  RoomSection,
                  {
                      y: 0,
                      duration: 1,
                      ease: "power1.out",
                  },
                  overlayStart += 0.3
              );
          }

          if (FinanceSection) {
              overlayStart += 0.3;
              const financeRevealStart = overlayStart;

              timeline.to(
                  FinanceSection,
                  {
                      y: 0,
                      duration: 1,
                      ease: "power1.out",
                  },
                  financeRevealStart,
              );

              if (financeRevealElements.length > 0) {
                  timeline.to(
                      financeRevealElements,
                      {
                          autoAlpha: 1,
                          y: 0,
                          ease: "power1.out",
                          stagger: 0.12,
                          duration: FINANCE_REVEAL_DURATION,
                      },
                      financeRevealStart + 0.18,
                  );
              }
          }

          if (locationImage) {
              gsap.set(locationImage, {
                  //y: () => window.innerHeight * 0.16,
              });
          }

          if (locationContent) {
              gsap.set(locationContent, {
                  autoAlpha: 0,
                  y: () => window.innerHeight * 0.28,
              });
          }

          if (conceptRevealElements.length > 0) {
              gsap.set(conceptRevealElements, {
                  autoAlpha: 0,
                  y: 28,
              });
          }

          if (financeRevealElements.length > 0) {
              gsap.set(financeRevealElements, {
                  autoAlpha: 0,
                  y: 0,
              });
          }

          if ( FormBodyTitle ) {
              gsap.set(FormBodyTitle, {
                  autoAlpha: 0,
                  y: 200,
              });
              timeline.to(
                  FormBodyTitle,
                  {
                      autoAlpha: 1,
                      y: 0,
                      ease: "none",
                      duration: 0.55,
                  },
                  overlayStart + 0.015,
              );
          }

          if ( FormBodyText ) {
              gsap.set(FormBodyText, {
                  autoAlpha: 0,
                  y: 100,
              });
              timeline.to(
                  FormBodyText,
                  {
                      autoAlpha: 1,
                      y: 0,
                      ease: "none",
                      duration: 0.7,
                  },
                  overlayStart + 0.15,
              );
          }

          if ( FormBodyArea ) {
              gsap.set(FormBodyArea, {
                  autoAlpha: 0,
                  y: 140,
              });
              timeline.to(
                  FormBodyArea,
                  {
                      autoAlpha: 1,
                      y: 0,
                      ease: "none",
                      duration: 1,
                  },
                  overlayStart + 0.25,
              );
          }



          setAnchorTimelineTime(
              panel,
              overlayStart +
                (isIncomePanel ? 0 : isLocationPanel ? LOCATION_REVEAL_DURATION : 0.95),
          );

          if (isIncomePanel) {
              timeline.set(panel, {yPercent: 0}, overlayStart);
          } else if (isLocationPanel) {
              timeline.to(
                  panel,
                  {
                      yPercent: 0,
                      ease: "none",
                      duration: LOCATION_REVEAL_DURATION,
                  },
                  overlayStart,
              );
          } else {
              timeline.to(
                  panel,
                  {
                      yPercent: 0,
                      ease: "none",
                      duration: 0.95,
                  },
                  overlayStart,
              );
          }

          if (isLocationPanel) {
              if (locationImage) {
                  timeline.to(
                      locationImage,
                      {
                          //y: () => -window.innerHeight * 0.06,
                          ease: "none",
                          duration: LOCATION_REVEAL_DURATION,
                      },
                      overlayStart,
                  );
              }

              if (locationContent) {
                  timeline.to(
                      locationContent,
                      {
                          autoAlpha: 1,
                          y: 0,
                          ease: "none",
                          duration: LOCATION_REVEAL_DURATION,
                      },
                      overlayStart,
                  );
              }
          }

          if (incomeLeft && incomeRight) {
              timeline.to(
                  [incomeLeft, incomeRight],
                  {
                      yPercent: 0,
                      ease: "none",
                      duration: 0.95,
                  },
                  overlayStart,
              );
          }

          if (incomeButtons) {
              timeline.to(
                  incomeButtons,
                  {
                      autoAlpha: 1,
                      y: 0,
                      ease: "power1.out",
                      duration: 0.35,
                  },
                  overlayStart + 1,
              );
          }

          if (advantagesRevealElements.length > 0) {
              timeline.to(
                  advantagesRevealElements,
                  {
                      autoAlpha: 1,
                      y: 0,
                      ease: "power1.out",
                      stagger: 0.12,
                      duration: ADVANTAGES_REVEAL_DURATION,
                  },
                  overlayStart + 0.18,
              );
          }

          if (conceptRevealElements.length > 0) {
              timeline.to(
                  conceptRevealElements,
                  {
                      autoAlpha: 1,
                      y: 0,
                      ease: "power1.out",
                      stagger: 0.12,
                      duration: CONCEPT_REVEAL_DURATION,
                  },
                  overlayStart + 0.18,
              );
          }

          if ( gallerySection ) {
              gsap.set(panel, {
                  y: 0,
              });
              timeline.to(
                  panel,
                  {
                      y: 0,
                      ease: "power1.out",
                      duration: 1,
                  },
                  overlayStart,
              );
          }

        overlayStart += isLocationPanel ? LOCATION_REVEAL_DURATION : 0.95;

        // Для Infrastructure ранний snap после входа panel фиксирует transition-состояние.
        if (!isInfrastructurePanel) {
          snapPoints.push(overlayStart);
        }

        if (isLocationPanel) {
          if (locationContent) {
            timeline.to(
              locationContent,
              {
                autoAlpha: 0,
                y: () => -window.innerHeight * 0.18,
                ease: "power1.in",
                duration: LOCATION_EXIT_DURATION,
              },
              overlayStart,
            );
          }

          overlayStart += LOCATION_EXIT_DURATION;
          snapPoints.push(overlayStart);
        }

        const scrollDrivenSlider = panel.querySelector<HTMLElement>(
          "[data-scroll-driven-slider]",
        );
        const scrollDrivenDuration = getPanelScrollDrivenDuration(panel);
        const infrastructureImage = panel.querySelector<HTMLElement>(
          "[data-infrastructure-image]",
        );
        const infrastructureContent = panel.querySelector<HTMLElement>(
          "[data-infrastructure-content]",
        );
        const infrastructureTitle = panel.querySelector<HTMLElement>(
          "[data-infrastructure-title]",
        );
        const infrastructureText = panel.querySelector<HTMLElement>(
          "[data-infrastructure-text]",
        );
        const infrastructureDuration = getInfrastructureAnimationDuration(panel);

        if (infrastructureDuration > 0) {
          // Начало infrastructure-анимаций совпадает с overlayStart после входа panel.
          const infrastructureAnimStart = overlayStart;
          /*
           * Стабильная точка: panel вошёл, image раскрыт, текст полностью виден.
           * text reveal: start + 0.36 * REVEAL + REVEAL duration.
           */
          const infrastructureReadyAt =
            infrastructureAnimStart +
            INFRASTRUCTURE_REVEAL_DURATION * 0.36 +
            INFRASTRUCTURE_REVEAL_DURATION;

          if (infrastructureImage) {
            gsap.set(infrastructureImage, { xPercent: 0 });
          }
          if (infrastructureContent) {
            gsap.set(infrastructureContent, { y: 0 });
          }
          if (infrastructureTitle) {
            gsap.set(infrastructureTitle, { autoAlpha: 1, y: 0 });
          }
          if (infrastructureText) {
            gsap.set(infrastructureText, {
              autoAlpha: 0,
              // height: 0,
              y: 32,
            });
          }
          snapPoints.push(infrastructureReadyAt);

          if (infrastructureImage) {
            timeline.to(
              infrastructureImage,
              {
                xPercent: -50,
                ease: "power1.inOut",
                duration: INFRASTRUCTURE_REVEAL_DURATION,
              },
              overlayStart,
            );
          }

          if (infrastructureText) {
            timeline.to(
              infrastructureText,
              {
                autoAlpha: 1,
                height: "auto",
                y: 0,
                ease: "power1.out",
                duration: INFRASTRUCTURE_REVEAL_DURATION,
              },
              overlayStart + INFRASTRUCTURE_REVEAL_DURATION * 0.36,
            );
          }

          if (infrastructureTitle) {
            timeline.to(
              infrastructureTitle,
              {
                autoAlpha: 0,
                y: -24,
                ease: "power1.out",
                duration: INFRASTRUCTURE_REVEAL_DURATION * 0.48,
              },
              overlayStart + INFRASTRUCTURE_REVEAL_DURATION * 0.36,
            );
          }

          if (infrastructureContent) {
            timeline.to(
              infrastructureContent,
              {
                y: () => -window.innerHeight * 0.42,
                ease: "none",
                duration: INFRASTRUCTURE_SCROLL_DURATION //* 0.2,
              },
              overlayStart + INFRASTRUCTURE_REVEAL_DURATION,
            );
          }

          overlayStart += infrastructureDuration * 0.6;
        }

        if (scrollDrivenSlider && scrollDrivenDuration > 0) {
          const scrollDrivenState = { progress: 0 };
          const scrollDrivenSteps = Math.max(
            Math.round(scrollDrivenDuration),
            1,
          );

          for (let step = 1; step <= scrollDrivenSteps; step += 1) {
            snapPoints.push(
              overlayStart +
                scrollDrivenDuration * (step / scrollDrivenSteps),
            );
          }

          timeline.to(
            scrollDrivenState,
            {
              progress: 1,
              ease: "none",
              duration: scrollDrivenDuration,
              onUpdate: () => {
                scrollDrivenSlider.dispatchEvent(
                  new CustomEvent("scroll-driven-slider-progress", {
                    detail: {
                      progress: scrollDrivenState.progress,
                    },
                  }),
                );
              },
            },
            overlayStart,
          );

          overlayStart += scrollDrivenDuration;
        }

        const scrollDuration = getPanelScrollDuration(panel);

        if (scrollDuration > 0 && !isLocationPanel) {
          if (panel.querySelector("[data-product-section]")) {
            productPanelScrollStart = overlayStart;
            productPanelScrollEnd = overlayStart + scrollDuration;
          }

          timeline.to(
            panel,
            {
              y: () => -getPanelScrollOffset(panel),
              ease: "none",
              duration: scrollDuration,
            },
            overlayStart,
          );

          overlayStart += scrollDuration;
          snapPoints.push(overlayStart);
        }

      });

      const scrollToTimelineTime = (time: number, immediate = false) => {
        const scrollTrigger = timeline.scrollTrigger;
        const duration = timeline.duration();

        if (!scrollTrigger || duration <= 0) {
          return false;
        }

        ScrollTrigger.refresh();

        const progress = gsap.utils.clamp(0, 1, time / duration);
        const scrollY =
          scrollTrigger.start +
          (scrollTrigger.end - scrollTrigger.start) * progress;

        lenis.start();
        lenis.resize();
        lenis.scrollTo(scrollY, {
          immediate,
          duration: immediate ? 0 : 1.65,
          easing: (time: number) => 1 - Math.pow(1 - time, 3),
        });

        return true;
      };

      const scrollToAnchorHash = (hash: string, immediate = false) => {
        const anchorId = decodeURIComponent(hash.replace(/^#/, ""));

        if (!anchorId) {
          return scrollToTimelineTime(0, immediate);
        }

        const anchorTime = anchorTimelineTimes.get(anchorId);

        if (anchorTime === undefined) {
          return false;
        }

        return scrollToTimelineTime(anchorTime, immediate);
      };

      const isSamePageHashLink = (link: HTMLAnchorElement) => {
        if (!link.hash) {
          return false;
        }

        return (
          link.origin === window.location.origin &&
          link.pathname.replace(/\/$/, "") ===
            window.location.pathname.replace(/\/$/, "")
        );
      };

      const handleAnchorClick = (event: MouseEvent) => {
        const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
          "a[href]",
        );

        if (!link || !isSamePageHashLink(link)) {
          return;
        }

        if (!scrollToAnchorHash(link.hash)) {
          return;
        }

        event.preventDefault();
        window.history.pushState(null, "", link.hash || window.location.pathname);
      };

      const handleHashChange = () => {
        if (window.location.hash) {
          scrollToAnchorHash(window.location.hash);
        }
      };

      window.__scrollStageScrollToHash = scrollToAnchorHash;
      document.addEventListener("click", handleAnchorClick);
      window.addEventListener("hashchange", handleHashChange);

      removeAnchorNavigation = () => {
        document.removeEventListener("click", handleAnchorClick);
        window.removeEventListener("hashchange", handleHashChange);

        if (window.__scrollStageScrollToHash === scrollToAnchorHash) {
          window.__scrollStageScrollToHash = undefined;
        }
      };

      requestAnimationFrame(() => {
        if (window.location.hash) {
          scrollToAnchorHash(window.location.hash, true);
        }
      });
    }, stageRef);

    ScrollTrigger.refresh();

    return () => {
      // ctx.revert();
      removeAnchorNavigation?.();
      window.removeEventListener(HERO_INTRO_LOCK_EVENT, syncHeroIntroLock);
      document.documentElement.classList.remove(PRODUCT_PANEL_SCROLL_CLASS);
      gsap.ticker.remove(updateLenis);
      if (window.__lenis === lenis) {
        window.__lenis = undefined;
      }
      lenis.destroy();
    };
  }, []);

  return (
    <div className={styles.stage} data-scroll-stage ref={stageRef}>
      <div className={styles.viewport}>
        {Children.map(children, (child, index) => (
          <div
            key={index}
            className={styles.panel}
            data-scroll-panel
            style={{ "--panel-index": index === 0 ? 25 : index + 1, } as CSSProperties}
          >
            <div className={styles.panelInner}>{child}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
