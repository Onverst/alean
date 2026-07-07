import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
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
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`
              (function(m,e,t,r,i,k,a){
                  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                  m[i].l=1*new Date();
                  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');

              ym(98657632, 'init', {webvisor:true, clickmap:true, referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
            `}
          </Script>
          <noscript
            dangerouslySetInnerHTML={{
              __html:
                '<div><img src="https://mc.yandex.ru/watch/98657632" style="position:absolute; left:-9999px;" alt="" /></div>',
            }}
          />
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
