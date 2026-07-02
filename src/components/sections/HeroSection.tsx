import Image from "next/image";
import type { WpMedia } from "@/types/wordpress";
import { HeroIntroController } from "./HeroIntroController";
import styles from "./HeroSection.module.css";

type HeroSectionProps = {
  title: string;
  text: string;
  logo: WpMedia | null;
  bgImg: WpMedia | null;
  video: WpMedia | null;
  mobileVideo: WpMedia | null;
};

export function HeroSection({
  title,
  text,
  logo,
  video,
  mobileVideo,
}: HeroSectionProps) {
  const logoWidth = logo?.media_details?.width ?? 302;
  const logoHeight = logo?.media_details?.height ?? 211;
  const desktopVideoSrc = video?.source_url ?? mobileVideo?.source_url;
  const mobileVideoSrc = mobileVideo?.source_url ?? video?.source_url;
  const desktopVideoType = video?.mime_type ?? "video/mp4";
  const mobileVideoType = mobileVideo?.mime_type ?? desktopVideoType;

  return (
    <section className={styles.hero} data-hero-section data-hero-intro="loading">
      <HeroIntroController />
      
      <p className={styles.loader_text_one}>Инвестируй</p>

      <div className={styles.video_wrap}>
        {desktopVideoSrc ? (
          <video
            className={styles.video}
            data-scroll-hero-bg
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            {mobileVideoSrc ? (
              <source
                src={mobileVideoSrc}
                type={mobileVideoType}
                media="(max-width: 480px)"
              />
            ) : null}
            <source
              src={desktopVideoSrc}
              type={desktopVideoType}
            />
          </video>
        ) : null}
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
