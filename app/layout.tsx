import type { Metadata } from "next";
import Link from "next/link";
import Peek from "@/components/Peek";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Claude Tefsir — ayet ayet Kur'an tefsiri",
    template: "%s — Claude Tefsir",
  },
  description:
    "Claude ile yazılmış, ayet ayet kök tahlili esaslı Türkçe Kur'an tefsiri. 114 sûrenin tamamı.",
  openGraph: { type: "website", siteName: "Claude Tefsir", locale: "tr_TR" },
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
            <Link className="home" href="/">Claude Tefsir</Link>
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
