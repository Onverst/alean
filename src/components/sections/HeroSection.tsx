import Image from "next/image";
import type { WpMedia } from "@/types/wordpress";
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
  bgImg,
}: HeroSectionProps) {
  const logoWidth = logo?.media_details?.width ?? 302;
  const logoHeight = logo?.media_details?.height ?? 211;

  const bgWidth = bgImg?.media_details?.width ?? 1920;
  const bgHeight = bgImg?.media_details?.height ?? 1024;

  return (
    <section className={styles.hero}
    data-hero-section={1}>
      {/*{bgImg ? (
        <Image
          className={styles.bg}
          data-scroll-hero-bg
          src={bgImg.source_url}
          alt={bgImg.alt_text}
          priority
          width={bgWidth}
          height={bgHeight}
        />
      ) : null}*/}
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
