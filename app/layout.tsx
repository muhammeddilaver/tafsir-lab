import type { Metadata } from "next";
import Link from "next/link";
import Peek from "@/components/Peek";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Tefsir — ayet ayet Kur'an tefsiri", template: "%s — Tefsir" },
  description:
    "Kur'an'ın 114 sûresinin tamamı: ayet ayet, kök tahlili esaslı Türkçe tefsir.",
  openGraph: { type: "website", siteName: "Tefsir", locale: "tr_TR" },
};

export const viewport = { themeColor: "#EFF1EF" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=IBM+Plex+Sans:wght@400;500;600&family=Literata:opsz,wght@7..72,400;7..72,600&family=Petrona:wght@500;600;700&display=swap"
        />
      </head>
      <body>
        <header className="top">
          <div className="top-in">
            <Link className="home" href="/">Tefsir</Link>
            <span className="sp" />
            <Link href="/kok">Kök dizini</Link>
            <Link href="/usul">Usul</Link>
          </div>
          <div id="progress" />
        </header>
        {children}
        <Peek />
      </body>
    </html>
  );
}
