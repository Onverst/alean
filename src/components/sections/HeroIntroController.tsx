"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

declare global {
  interface Window {
    __heroIntroScrollLocked?: boolean;
    __lenis?: Lenis;
  }
}

const INTRO_MIN_DURATION = 2800;
const EXPAND_DURATION = 1200;
const TEXT_ONE_STEP_DELAY = 120;
const VIDEO_STEP_DELAY = 900;
const TEXT_TWO_STEP_DELAY = 1750;
const LOAD_FALLBACK_DELAY = 3600;
const FORCE_UNLOCK_DELAY = 7000;
const HERO_INTRO_LOCK_EVENT = "hero-intro-lock-change";
const SCROLL_KEYS = new Set([
  " ",
  "ArrowDown",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
]);

export function HeroIntroController() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero-section]");

    if (!hero) {
      return;
    }

    const root = document.documentElement;
    const body = document.body;
    let isCancelled = false;
    let isComplete = false;
    let isExpandScheduled = false;
    const stepTimers: ReturnType<typeof setTimeout>[] = [];
    let expandTimer: ReturnType<typeof setTimeout> | null = null;
    let completeTimer: ReturnType<typeof setTimeout> | null = null;
    let loadFallbackTimer: ReturnType<typeof setTimeout> | null = null;
    let forceUnlockTimer: ReturnType<typeof setTimeout> | null = null;
    const startedAt = window.performance.now();

    const preventScroll = (event: Event) => {
      event.preventDefault();
    };

    const preventScrollKeys = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) {
        event.preventDefault();
      }
    };

    const addScrollBlockers = () => {
      window.addEventListener("wheel", preventScroll, {
        capture: true,
        passive: false,
      });
      window.addEventListener("touchmove", preventScroll, {
        capture: true,
        passive: false,
      });
      window.addEventListener("keydown", preventScrollKeys, {
        capture: true,
      });
    };

    const removeScrollBlockers = () => {
      window.removeEventListener("wheel", preventScroll, { capture: true });
      window.removeEventListener("touchmove", preventScroll, { capture: true });
      window.removeEventListener("keydown", preventScrollKeys, {
        capture: true,
      });
    };

    const lockScroll = () => {
      window.__heroIntroScrollLocked = true;
      addScrollBlockers();
      root.classList.add("hero-intro-is-active");
      body.classList.add("hero-intro-is-active");
      window.dispatchEvent(new Event(HERO_INTRO_LOCK_EVENT));
    };

    const unlockScroll = () => {
      window.__heroIntroScrollLocked = false;
      removeScrollBlockers();
      window.__lenis?.start();
      window.__lenis?.resize();
      root.classList.remove("hero-intro-is-active");
      body.classList.remove("hero-intro-is-active");
      root.style.overflow = "";
      body.style.overflow = "";
      window.dispatchEvent(new Event(HERO_INTRO_LOCK_EVENT));
    };

    const completeIntro = () => {
      if (isCancelled || isComplete) {
        return;
      }

      isComplete = true;
      hero.dataset.heroIntro = "complete";
      unlockScroll();
    };

    const expandIntro = () => {
      if (isCancelled) {
        return;
      }

      hero.dataset.heroIntro = "expanding";
      completeTimer = setTimeout(completeIntro, EXPAND_DURATION);
    };

    const scheduleExpand = () => {
      if (isCancelled || isExpandScheduled || isComplete) {
        return;
      }

      isExpandScheduled = true;
      const elapsed = window.performance.now() - startedAt;
      const delay = Math.max(INTRO_MIN_DURATION - elapsed, 0);

      expandTimer = setTimeout(expandIntro, delay);
    };

    lockScroll();
    window.__lenis?.scrollTo?.(0, { immediate: true });
    window.scrollTo(0, 0);
    hero.dataset.heroIntro = "loading";

    stepTimers.push(
      setTimeout(() => {
        if (!isCancelled) {
          hero.dataset.heroIntro = "text-one";
        }
      }, TEXT_ONE_STEP_DELAY),
      setTimeout(() => {
        if (!isCancelled) {
          hero.dataset.heroIntro = "video";
        }
      }, VIDEO_STEP_DELAY),
      setTimeout(() => {
        if (!isCancelled) {
          hero.dataset.heroIntro = "text-two";
        }
      }, TEXT_TWO_STEP_DELAY),
    );

    if (document.readyState === "complete") {
      scheduleExpand();
    } else {
      window.addEventListener("load", scheduleExpand, { once: true });
      loadFallbackTimer = setTimeout(scheduleExpand, LOAD_FALLBACK_DELAY);
    }

    forceUnlockTimer = setTimeout(completeIntro, FORCE_UNLOCK_DELAY);

    return () => {
      isCancelled = true;
      window.removeEventListener("load", scheduleExpand);

      if (expandTimer) {
        clearTimeout(expandTimer);
      }

      if (completeTimer) {
        clearTimeout(completeTimer);
      }

      if (loadFallbackTimer) {
        clearTimeout(loadFallbackTimer);
      }

      if (forceUnlockTimer) {
        clearTimeout(forceUnlockTimer);
      }

      stepTimers.forEach(clearTimeout);

      unlockScroll();
    };
  }, []);

  return null;
}
