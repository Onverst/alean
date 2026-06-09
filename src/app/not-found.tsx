import Image from "next/image";
import styles from "./page.module.css";

export default function NotFound() {
  return (
    <div className={styles.not_found}>
        <div className={styles.not_found_wrap}>
            <div className={styles.not_found_left}>
                <span className={styles.not_found_numb}>404</span>
                <span className={styles.not_found_title}>Этой страницы не существует</span>
                <span className={styles.not_found_text}>Страница, на&nbsp;которую вы&nbsp;зашли не&nbsp;зарегистрирована или её&nbsp;не&nbsp;сущесвтует</span>

                <a href="/" className={`${styles.not_found_link} main-button`} type="button">
                    <span>на главную</span>
                </a>
            </div>
            <div className={styles.not_found_right}>
                <Image
                    className={styles.not_found_img}
                    src={`/not-found.jpg`}
                    alt="img"
                    width={592}
                    height={720}
                />
            </div>
        </div>
    </div>
  );
}  