"use client";

import Image from "next/image";
import { useState, useEffect, useRef, type FormEvent } from "react";
import intlTelInput, { type Iti } from "intl-tel-input";
import { ru } from "intl-tel-input/locale";
import type { WpMedia } from "@/types/wordpress";
import { sendForm } from "@/lib/sendForm";
import styles from "./OpenFormSection.module.css";

type OpenFormSectionProps = {
  title: string;
  text: string;
  bg: WpMedia | null;
};

export function OpenFormSection({
  title,
  text,
  bg,
}: OpenFormSectionProps) {
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const phoneInstanceRef = useRef<Iti | null>(null);

  const bgWidth = bg?.media_details?.width ?? 1920;
  const bgHeight = bg?.media_details?.height ?? 1080;

  useEffect(() => {
    if (!phoneInputRef.current) {
      return;
    }

    phoneInstanceRef.current = intlTelInput(phoneInputRef.current, {
      initialCountry: "ru",
      countryOrder: ["ru", "kz", "by"],
      separateDialCode: true,
      strictMode: true,
      formatAsYouType: true,
      countryNameLocale: "ru",
      uiTranslations: ru,
      loadUtils: () => import("intl-tel-input/utils"),
    });

    return () => {
      phoneInstanceRef.current?.destroy();
      phoneInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    const timer = setTimeout(() => {
      setIsSuccess(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isSuccess]);

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const form = e.currentTarget;

    const name = (
      form.elements.namedItem("name") as HTMLInputElement
    ).value;

    const phone = phoneInstanceRef.current
      ? phoneInstanceRef.current.getNumber()
      : (
          form.elements.namedItem("phone") as HTMLInputElement
        ).value;

    try {
      setIsSending(true);

      await sendForm(name, phone);

      setIsSuccess(true);

      form.reset();

      if (phoneInstanceRef.current) {
        phoneInstanceRef.current.setNumber("");
      }
    } catch (error) {
      console.error(error);
      alert("Ошибка отправки");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className={styles.open_form}
    data-body-form-section={1}>
      {bg ? (
        <Image
          className={styles.bg}
          src={bg.source_url}
          alt={bg.alt_text}
          width={bgWidth}
          height={bgHeight}
        />
      ) : null}

      <div className={styles.container}>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <h3
            className={styles.title}
            dangerouslySetInnerHTML={{
              __html: title,
            }}
            data-form-title={1}
          />

          <p
            className={styles.text}
            dangerouslySetInnerHTML={{
              __html: text,
            }}
            data-form-text={1}
          />

          <div
            className={styles.form_area}
            data-form-area={1}
            >
            <label className={styles.field}>
              <span>Имя</span>
              <input
                  name="name"
                  type="text"
                  placeholder="Имя"
                  required
              />
            </label>

            <label className={styles.field}>
              <span>Телефон</span>
              <input
                  ref={phoneInputRef}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  required
              />
            </label>

            <label className={styles.policy}>
              <input
                  name="policy"
                  type="checkbox"
                  required
              />
              <span>
              Я&nbsp;соглашаюсь
              на&nbsp;обработку
              персональных данных
              согласно политике
              конфиденциальности
            </span>
            </label>

            <button
                className={`${styles.button} main-button`}
                type="submit"
                disabled={isSending}
            >
            <span>
              {isSending
                  ? "Отправка..."
                  : "оставить заявку"}
            </span>
            </button>
          </div>
          {isSuccess ? (
            <div className={styles.thanks}>
              <svg width="80" height="61" viewBox="0 0 80 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M80 21.0326C79.9883 16.289 78.3749 11.688 75.4205 7.97311C72.4661 4.25824 68.3434 1.6466 63.7186 0.560316C59.0939 -0.525973 54.2374 -0.0234397 49.934 1.98669C45.6307 3.99682 42.1319 7.39709 40.0034 11.6379C37.8725 7.39924 34.373 4.00132 30.0699 1.99285C25.7667 -0.015625 20.9112 -0.51742 16.2873 0.568489C11.6634 1.6544 7.54096 4.26463 4.58575 7.97769C1.63053 11.6908 0.0149954 16.2899 0 21.0326V21.1265C0 21.3144 0 21.5023 0 21.6902C0.396539 43.4455 22.3204 61 40.0034 61C57.5586 61 79.6572 43.4857 79.9933 21.7372C79.9933 21.5426 79.9933 21.3547 79.9933 21.1601L80 21.0326Z" fill="#FAF5EF"/>
              </svg>

              <h3>Спасибо!</h3>

              <p>
                Наш&nbsp;менеджер скоро свяжется с&nbsp;вами
              </p>
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
