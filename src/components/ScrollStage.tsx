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

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

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
      const getThirdPanelOverflow = () => getPanelOverflow(thirdPanel);
      const getThirdPanelScrollDuration = () =>
        Math.max(getThirdPanelOverflow() / window.innerHeight, 0.01);
      const getAboutScrollDuration = () =>
        Math.max(getAboutBgOverflow() / window.innerHeight, 0.01);
      const getPanelScrollDuration = (panel: HTMLElement) =>
        getPanelOverflow(panel) / window.innerHeight;
      const getPanelScrollDrivenDuration = (panel: HTMLElement) => {
        const slider = panel.querySelector<HTMLElement>(
          "[data-scroll-driven-slider]",
        );

        if (!slider) {
          return 0;
        }

        return Number(slider.dataset.scrollDuration) || 0;
      };
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
            getPanelScrollDrivenDuration(panel) +
            getPanelScrollDuration(panel),
          0,
        );

      gsap.set(heroPanel, { yPercent: 0, zIndex: 3 });
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
      const thirdPanelScrollStart = thirdPanelRevealStart + 0.95;
      const snapPoints = [
        0,
        1,
        thirdPanelRevealStart,
        thirdPanelScrollStart,
      ];
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () =>
            `+=${
              window.innerHeight *
                (thirdPanelScrollStart + getOverlayPanelsDuration()) +
              getThirdPanelOverflow()
            }`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.8,
          snap: {
            duration: { min: 0.18, max: 0.45 },
            ease: "power1.inOut",
            snapTo: (progress) =>
              gsap.utils.snap(
                snapPoints.map((point) => point / timeline.duration()),
                progress,
              ),
          },
          invalidateOnRefresh: true,
        },
      });

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
          ease: "none",
          duration: 0.95,
        },
        thirdPanelRevealStart,
      );

      timeline.to(
        thirdPanel,
        {
          y: () => -getThirdPanelOverflow(),
          ease: "none",
          duration: getThirdPanelScrollDuration,
        },
        thirdPanelScrollStart,
      );

      let overlayStart = thirdPanelScrollStart + getThirdPanelScrollDuration();
      snapPoints.push(overlayStart);

      overlayPanels.forEach((panel) => {
        timeline.to(
          panel,
          {
            yPercent: 0,
            ease: "none",
            duration: 0.95,
          },
          overlayStart,
        );

        overlayStart += 0.95;
        snapPoints.push(overlayStart);

        const scrollDrivenSlider = panel.querySelector<HTMLElement>(
          "[data-scroll-driven-slider]",
        );
        const scrollDrivenDuration = getPanelScrollDrivenDuration(panel);

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

        if (scrollDuration > 0) {
          timeline.to(
            panel,
            {
              y: () => -getPanelOverflow(panel),
              ease: "none",
              duration: scrollDuration,
            },
            overlayStart,
          );

          overlayStart += scrollDuration;
          snapPoints.push(overlayStart);
        }
      });
    }, stageRef);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      gsap.ticker.remove(updateLenis);
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
            style={{ "--panel-index": index + 1 } as CSSProperties}
          >
            <div className={styles.panelInner}>{child}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
