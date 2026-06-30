import Image from "next/image";
import type { WpMedia } from "@/types/wordpress";
import { HeroIntroController } from "./HeroIntroController";
import styles from "./HeroSection.module.css";

type HeroSectionProps = {
  title: string;
  text: string;
  logo: WpMedia | null;
  bgImg: WpMedia | null;
};

export function HeroSection({
  title,
  text,
  logo,
}: HeroSectionProps) {
  const logoWidth = logo?.media_details?.width ?? 302;
  const logoHeight = logo?.media_details?.height ?? 211;

  return (
    <section className={styles.hero}
    data-hero-section
    data-hero-intro="loading">
      <HeroIntroController />
      <p className={styles.loader_text_one}>Инвестируй</p>

      <div className={styles.video_wrap}>
        <video
            className={`${styles.video} ${styles.desktop_video}`}
            data-scroll-hero-bg
            autoPlay
            muted
            loop
            playsInline
        >
          <source src="/hero_desktop.mp4" type="video/mp4" />
        </video>
        <video
            className={`${styles.video} ${styles.mobile_video}`}
            data-scroll-hero-bg
            autoPlay
            muted
            loop
            playsInline
        >
          <source src="/hero_mobile.mp4" type="video/mp4" />
        </video>
      </div>
      
      <p className={styles.loader_text_two}>в будущее</p>

      <div 
        className={styles.container}
        data-scroll-hero-container
      >
        {logo ? ( 
          <Image
            className={styles.logo}
            src={logo.source_url}
            alt={logo.alt_text} 
            width={logoWidth}
            height={logoHeight}
            priority
          />
        ) : null}
        <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
        <div
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    </section>
  );
}
