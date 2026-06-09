import Image from "next/image";
import type { WpMedia } from "@/types/wordpress";
import styles from "./LocationSection.module.css";
import {Button} from "@/components/Button";

type LocationSectionProps = {
  top_title: string;
  title: string;
  text_one: string;
  text_two: string;
  img: WpMedia | null;
};

export function LocationSection({
  top_title,
  title, 
  text_one,
  text_two,
  img,
}: LocationSectionProps) {
  const imgWidth = img?.media_details?.width ?? 1920;
  const imgHeight = img?.media_details?.height ?? 1024;

  return (
    <section className={styles.location}>
      <div className={styles.container}>
        <h3 className={`${styles.title} section-title`}>
          <span
            className={`${styles.top_title} section-title-top`}
            dangerouslySetInnerHTML={{ __html: top_title }}
          />
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </h3>

        <div className={styles.wrap}>
          <p
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: text_one }}
          />

          <p
            className={styles.text_two}
            dangerouslySetInnerHTML={{ __html: text_two }}
          />

          <Button className={`${styles.button} main-button-white`}>
            начать инвестировать
          </Button>
        </div>
      </div>

      {img ? (
        <Image
          className={styles.img}
          src={img.source_url}
          alt={img.alt_text}
          width={imgWidth}
          height={imgHeight}
        />
      ) : null}
    </section>
  );
}
