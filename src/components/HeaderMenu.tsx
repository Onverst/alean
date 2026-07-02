"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import type { WpMedia } from "@/types/wordpress";

const MENU_OPEN_CLASS = "header-menu-is-open";
const HEADER_HIDDEN_CLASS = "header-is-hidden";

type Menu = {
  img: WpMedia | null;
};

export default function HeaderMenu({
    img
}: Menu) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen((v) => !v);
    const closeMenu = () => setIsOpen(false);

    useEffect(() => {
      const root = document.documentElement;

      root.classList.toggle(MENU_OPEN_CLASS, isOpen);

      if (isOpen) {
        root.classList.remove(HEADER_HIDDEN_CLASS);
      }

      return () => {
        root.classList.remove(MENU_OPEN_CLASS);
      };
    }, [isOpen]);

    const menuImgWidth = img?.media_details?.width ?? 1248;
    const menuImgHeight = img?.media_details?.height ?? 960;

  return (
    <>
      <button
        className={`${styles.menu_btn} ${isOpen ? styles.open : ""}`}
        type="button"
        onClick={toggleMenu}
      >
        <span className={styles.menu_btn_icon}><span></span></span>
      </button>

      <div className={`${styles.menu} ${isOpen ? styles.open : ""}`}>
        <nav className={styles.menu_left}>
          <ul className={styles.list_one}>
            <li>
              <a href="/#about" onClick={closeMenu}>О проекте</a>
            </li>
            <li>
              <a href="/#investments" onClick={closeMenu}>Инвестиции</a>
            </li>
            <li>
              <a href="/#advantages" onClick={closeMenu}>Преимущества инвестирования</a>
            </li>
            <li>
              <a href="/#location" onClick={closeMenu}>Расположение</a>
            </li>
            <li>
              <a href="/#concept" onClick={closeMenu}>Концепция</a>
            </li>
            <li>
              <a href="/#infrastructure" onClick={closeMenu}>Инфраструктура</a>
            </li>
            <li>
              <a href="/#rooms" onClick={closeMenu}>Номера и доходность</a>
            </li>
            <li>
              <a href="/#finance" onClick={closeMenu}>Финансовая архитектура</a>
            </li>
          </ul>

          <ul className={styles.list_two}>
            <li>
              <a href="/#advantages" onClick={closeMenu}>Способы оплаты</a>
            </li>
            <li>
              <a href="/#gallery" onClick={closeMenu}>Галерея</a>
            </li>
            <li>
              <a href="/#footer" onClick={closeMenu}>Контакты</a>
            </li>
          </ul>
        </nav>

        <div className={styles.menu_right}>
            {img && (
                <Image
                className={styles.menu_img}
                src={img.source_url}
                alt={img.alt_text || "logo"}
                priority
                width={menuImgWidth}
                height={menuImgHeight}
                />
            )}
        </div>
      </div>
    </>
  );
}
