"use client";

import { usePopup } from "@/components/PopupProvider";

export function Button({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { openPopup } = usePopup();

  return (
    <button
      type="button"
      className={className}
      onClick={openPopup}
    >
      <span>{children}</span>
    </button>
  );
}