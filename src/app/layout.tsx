import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getSiteOptions, fetchMediaById } from "@/lib/wordpress";
import { Header } from "@/components/Header";
import { PopupProvider } from "@/components/PopupProvider";

const corsaGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/CorsaGrotesk-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/CorsaGrotesk-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-corsa-grotesk",
});

const tenorSans = localFont({
  src: "../../public/fonts/TenorSans-Regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-tenor-sans",
});

const ttLoveliesScript = localFont({
  src: "../../public/fonts/TT Lovelies Script.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-tt-lovelies-script",
});

export const metadata: Metadata = {
  title: "Alean",
  description: "Лендинг Alean",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const options = await getSiteOptions();
  
  const popupLogo = options?.popup?.logo
    ? await fetchMediaById(options?.popup.logo)
    : null;

  const popupImage = options?.popup?.img
      ? await fetchMediaById(options?.popup.img)
      : null;
  return (
    <html
      lang="ru"
      className={`${corsaGrotesk.variable} ${tenorSans.variable} ${ttLoveliesScript.variable}`}
    >
      <body>
          <PopupProvider
            logo={popupLogo}
            image={popupImage}
            text={options?.popup?.text}
          >
            <Header data={options?.header} />
            {children}
          </PopupProvider>
      </body>
    </html>
  );
}
