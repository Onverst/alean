import Image from "next/image";
import type { WpMedia } from "@/types/wordpress";
import styles from "./FinanceSection.module.css";
import {Button} from "@/components/Button";

type FinanceSectionProps = {
  top_title: string;
  title: string;
  text: string;
  img: WpMedia | null;
  list_one: {
    percent: string;
    text: string;
  }[]; 
  list_two: {
    numb: string;
    text: string;
  }[];
};

export function FinanceSection({
    top_title,
    title,
    img,
    text,
    list_one,
    list_two
}: FinanceSectionProps) {
  const imgWidth = img?.media_details?.width ?? 200;
  const imgHeight = img?.media_details?.height ?? 280;

  return (
    <section className={styles.finance}
             data-finance-section={1}
    >
        <div className={styles.container}>
            <span
                className={styles.top_title}
                data-finance-reveal
                dangerouslySetInnerHTML={{ __html: top_title }}
            />
            <h3 className={styles.title} data-finance-reveal>
                <span dangerouslySetInnerHTML={{ __html: title }} />
            </h3>

            <div className={styles.img_wrap} data-finance-reveal>
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
                className={styles.text}
                data-finance-reveal
                dangerouslySetInnerHTML={{ __html: text }}
            ></p>

            {list_one.length > 0 ? (
            <ul className={styles.list_one} data-finance-reveal>
                {list_one.map((item, index) => {
                    return (
                    <li key={`${item.percent}-${index}`}>
                        <span className={styles.list_one_numb} dangerouslySetInnerHTML={{ __html: item.percent }}></span>
                        <span className={styles.list_one_text} dangerouslySetInnerHTML={{ __html: item.text }}></span>
                    </li>
                    );
                })}
            </ul>
            ) : null}

            {/* Обёртка для reveal: Button не дублируем с родителем по data-атрибуту */}
            <div data-finance-reveal>
                <Button className={`${styles.button} main-button`}>
                    Получить предложение
                </Button>
            </div>
        </div>

        {list_two.length > 0 ? (
        <ul className={styles.list_two} data-finance-reveal>
            {list_two.map((item, index) => {
                return (
                <li key={`${item.numb}-${index}`}>
                    <span className={styles.list_two_numb} dangerouslySetInnerHTML={{ __html: item.numb }}></span>
                    <span className={styles.list_two_text} dangerouslySetInnerHTML={{ __html: item.text }}></span>
                </li>
                );
            })}
        </ul>
        ) : null}
    </section>
  );
}
