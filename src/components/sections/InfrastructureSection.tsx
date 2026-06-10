import Image from "next/image";
import type { WpMedia } from "@/types/wordpress";
import styles from "./InfrastructureSection.module.css";

type InfrastructureSectionProps = {
  top_title: string;
  title: string;
  text: string;
  img: WpMedia | null;
};

export function InfrastructureSection({
  top_title,
  title, 
  text,
  img,
}: InfrastructureSectionProps) {
  const imgWidth = img?.media_details?.width ?? 1920;
  const imgHeight = img?.media_details?.height ?? 1024;

  return (
    <section className={styles.infrastructure} data-infrastructure-section>
      <div className={styles.container} data-infrastructure-content>
        <h3
          className={`${styles.title} section-title`}
          data-infrastructure-title
        >
          <span
            className={`${styles.top_title} section-title-top`}
            dangerouslySetInnerHTML={{ __html: top_title }}
          />
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </h3>

        <div className={styles.textWrap} data-infrastructure-text>
          <div
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      </div>

      {img ? (
        <div className={styles.imageWrap} data-infrastructure-image>
          <Image
            className={styles.img}
            src={img.source_url}
            alt={img.alt_text}
            width={imgWidth}
            height={imgHeight}
            priority={false}
          />
        </div>
      ) : null}
    </section>
  );
}
