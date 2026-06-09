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
    // const shouldUseNativeScroll = window.matchMedia(
    //   "(prefers-reduced-motion: reduce), (max-width: 767px), (max-height: 680px)",
    // ).matches;

    // if (shouldUseNativeScroll) {
    //   return;
    // }

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
      const aboutBg = aboutPanel?.querySelector<HTMLElement>(
        "[data-scroll-about-bg]",
      );
      const aboutWrap = aboutPanel?.querySelector<HTMLElement>(
        "[data-scroll-about-wrap]",
      );

      if (!stage || !heroPanel || !aboutPanel || !thirdPanel) {
        return;
      }

      const getPanelOverflow = (panel: HTMLElement) =>
        Math.max(panel.scrollHeight - window.innerHeight, 0);
      const getThirdPanelOverflow = () => getPanelOverflow(thirdPanel);
      const getThirdPanelScrollDuration = () =>
        Math.max(getThirdPanelOverflow() / window.innerHeight, 0.01);

      gsap.set(heroPanel, { yPercent: 0, zIndex: 3 });
      gsap.set(aboutPanel, { yPercent: 0, zIndex: 2 });
      gsap.set(thirdPanel, { y: 0, yPercent: 100, zIndex: 4 });
      if (aboutBg) {
        gsap.set(aboutBg, { y: 0 });
      }

      if (aboutWrap) {
        gsap.set(aboutWrap, {
          y: () => window.innerHeight * 0,
          opacity: 1,
        });
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () =>
            `+=${window.innerHeight * 2.4 + getThirdPanelOverflow()}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(heroPanel, {
        yPercent: -100,
        ease: "none",
        duration: 1,
      });

      if (aboutBg) {
        timeline
          .to(
            aboutBg,
            {
              y: () => window.innerHeight * -0.14,
              ease: "none",
              duration: 1,
            },
            0,
          )
          .to(
            aboutBg,
            {
              y: () => window.innerHeight * -0.32,
              ease: "none",
              duration: 1.15,
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
              duration: 0.95,
            },
            1.05,
          );
      }

      timeline.to(
        thirdPanel,
        {
          yPercent: 0,
          ease: "none",
          duration: 0.95,
        },
        1.45,
      );

      timeline.to(
        thirdPanel,
        {
          y: () => -getThirdPanelOverflow(),
          ease: "none",
          duration: getThirdPanelScrollDuration,
        },
        2.4,
      );
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
