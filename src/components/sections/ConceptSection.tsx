import Image from "next/image";
import type { WpMedia } from "@/types/wordpress";
import styles from "./ConceptSection.module.css";

type ConceptSectionProps = {
  top_title: string;
  title: string;
  img_one: WpMedia | null;
  text_one: string;
  text_two: string;
  img_two: WpMedia | null;
  img_three: WpMedia | null;
};

export function ConceptSection({
  top_title,
  title,
  img_one,
  text_one,
  text_two,
  img_two,
  img_three,
}: ConceptSectionProps) {
  const imgOneWidth = img_one?.media_details?.width ?? 200;
  const imgOneHeight = img_one?.media_details?.height ?? 280;
  const imgTwoWidth = img_two?.media_details?.width ?? 400;
  const imgTwoHeight = img_two?.media_details?.height ?? 600;
  const imgThreeWidth = img_three?.media_details?.width ?? 640;
  const imgThreeHeight = img_three?.media_details?.height ?? 400;

  return (
    <section className={styles.concept} data-concept-section id="concept">
      <div className={styles.container}>
        <h3 className={`${styles.title} section-title`} data-concept-reveal>
          <span
            className={`${styles.top_title} section-title-top`}
            dangerouslySetInnerHTML={{ __html: top_title }}
          />
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </h3>

        <div className={styles.img_one_wrap} data-concept-reveal>
          {img_one ? (
            <Image
              className={styles.img_one}
              src={img_one.source_url}
              alt={img_one.alt_text}
              width={imgOneWidth}
              height={imgOneHeight}
            />
          ) : null}
        </div>

        <p
          className={styles.text_one}
          data-concept-reveal
          dangerouslySetInnerHTML={{ __html: text_one }}
        />
        <p
          className={styles.text_two}
          data-concept-reveal
          dangerouslySetInnerHTML={{ __html: text_two }}
        />

        <div className={styles.wrapper}>
          <div className={styles.img_two_wrap} data-concept-img="left">
            {img_two ? (
              <Image
                className={styles.img_two}
                src={img_two.source_url}
                alt={img_two.alt_text}
                width={imgTwoWidth}
                height={imgTwoHeight}
              />
            ) : null}
          </div>

          <div className={styles.img_three_wrap} data-concept-img="right">
            {img_three ? (
              <Image
                className={styles.img_three}
                src={img_three.source_url}
                alt={img_three.alt_text}
                width={imgThreeWidth}
                height={imgThreeHeight}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
