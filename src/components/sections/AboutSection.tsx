import Image from "next/image";
import type { WpMedia } from "@/types/wordpress";
import styles from "./AboutSection.module.css";
import {Button} from "@/components/Button";

type AboutSectionProps = {
  top_title: string;
  title: string;
  text: string;
  bgImg: WpMedia | null;
  logos?: WpMedia[];
};

export function AboutSection({
  top_title,
  title,
  text,
  bgImg,
  logos = [],
}: AboutSectionProps) {
  const bgWidth = bgImg?.media_details?.width ?? 1920;
  const bgHeight = bgImg?.media_details?.height ?? 1536;

  return (
    <section className={styles.about}>
      {bgImg ? (
        <Image
          className={styles.bg}
          data-scroll-about-bg
          src={bgImg.source_url}
          alt={bgImg.alt_text}
          priority
          width={bgWidth}
          height={bgHeight}
        />
      ) : null}
      <div className={styles.container}> 
        <div className={styles.wrap} data-scroll-about-wrap>
          
          <h3 className={`${styles.title} section-title`} >
            <span
              className={`${styles.top_title} section-title-top`}
              dangerouslySetInnerHTML={{ __html: top_title }}
            />
            <span dangerouslySetInnerHTML={{ __html: title }} />
          </h3>
          <div className={styles.bottom}>
            <p className={styles.text} dangerouslySetInnerHTML={{ __html: text }}></p>

            {logos.length > 0 ? (
              <div className={styles.logos}>
                {logos.map((logo) => {
                  const logoWidth = logo.media_details?.width ?? 157;
                  const logoHeight = logo.media_details?.height ?? 40;

                  return (
                    <Image
                      key={logo.id}
                      className={styles.logo}
                      src={logo.source_url}
                      alt={logo.alt_text || logo.title.rendered}
                      width={logoWidth}
                      height={logoHeight}
                    />
                  );
                })}
              </div>
            ) : null}

            <Button className={`${styles.button} main-button`}>
              Стать инвестором
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 
