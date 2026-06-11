import Image from "next/image";
import type { WpMedia } from "@/types/wordpress";
import styles from "./InvestmentsSection.module.css";

type InvestmentsSectionProps = {
  top_title: string;
  title: string;
  img: WpMedia | null;
  text_one: string;
  text_two: string;
  list: {
    title: string;
    text: string;
  }[];
};

export function InvestmentsSection({
  top_title,
  title,
  img,
  text_one,
  text_two,
  list
}: InvestmentsSectionProps) {
  const imgWidth = img?.media_details?.width ?? 200;
  const imgHeight = img?.media_details?.height ?? 280;

  return (
    <section className={styles.investments} data-investments-section>
      <div className={styles.container}>
        <h3 className={`${styles.title} section-title`} data-investments-reveal>
          <span
            className={`${styles.top_title} section-title-top`}
            dangerouslySetInnerHTML={{ __html: top_title }}
          />
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </h3>

        <div className={styles.img_wrap} data-investments-reveal>
          {img ? (
            <Image
              className={styles.img}
              src={img.source_url}
              alt={img.alt_text}
              priority
              width={imgWidth}
              height={imgHeight}
            />
          ) : null}
        </div>

        <p
          className={styles.text_one}
          data-investments-reveal
          dangerouslySetInnerHTML={{ __html: text_one }}
        ></p>
        <p
          className={styles.text_two}
          data-investments-reveal
          dangerouslySetInnerHTML={{ __html: text_two }}
        ></p>
      </div>

      {list.length > 0 ? (
          <ul className={styles.list} data-investments-list>
            {list.map((item, index) => {
              return (
                <li key={`${item.title}-${index}`} data-investments-reveal>
                  <span className={styles.list_title} dangerouslySetInnerHTML={{ __html: item.title }}></span>
                  <span className={styles.list_text} dangerouslySetInnerHTML={{ __html: item.text }}></span>
                </li>
              );
            })}
          </ul>
        ) : null}
    </section>
  );
}
 
