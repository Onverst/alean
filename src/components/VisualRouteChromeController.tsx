"use client";

import { useEffect } from "react";

/**
 * Помечает document.body как visual route, чтобы глобальные chrome-элементы
 * (Header, закрытые overlay) можно было скрыть через globals.css без отдельного layout.
 *
 * Подключать только на изолированных dev-only страницах в /visual/sections/*.
 */
export function VisualRouteChromeController() {
  useEffect(() => {
    document.body.dataset.visualRoute = "true";

    return () => {
      delete document.body.dataset.visualRoute;
    };
  }, []);

  return null;
}
