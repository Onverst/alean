"use client";

import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { usePopup } from "@/components/PopupProvider";

export function Button({
  className,
  children,
  onClick,
  ...props
}: {
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { openPopup } = usePopup();
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      openPopup();
    }
  };

  return (
    <button
      {...props}
      type="button"
      className={className}
      onClick={handleClick}
    >
      <span>{children}</span>
    </button>
  );
}
