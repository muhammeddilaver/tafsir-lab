import type { Metadata } from "next";
import Link from "next/link";
import Peek from "@/components/Peek";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LLM Tefsir Project — ayet ayet Kur'an tefsiri",
    template: "%s — LLM Tefsir Project",
  },
  description:
    "Claude ile yazılmış, ayet ayet kök tahlili esaslı Türkçe Kur'an tefsiri. 114 sûrenin tamamı.",
  openGraph: { type: "website", siteName: "LLM Tefsir Project", locale: "tr_TR" },
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
            <Link className="home" href="/">LLM Tefsir Project</Link>
            <span className="sp" />
            <Link href="/kok">Kök dizini</Link>
            <Link href="/usul">Usul</Link>
          </div>
          <div id="progress" />
        </header>
        {children}
        <footer className="foot">
          <div className="foot-in">
            <nav className="foot-nav">
              <Link href="/hakkinda">Hakkında</Link>
              <Link href="/usul">Usul</Link>
              <Link href="/kok">Kök dizini</Link>
              <Link href="/kosullar">Kullanım koşulları</Link>
              <Link href="/gizlilik">Gizlilik</Link>
              <a
                className="foot-gh"
                href="https://github.com/muhammeddilaver/llm-tefsir-project"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </nav>
            <p className="foot-note">
              Metnin tamamı bir dil modeli (Claude, Anthropic) tarafından yazılmıştır.
              Dinî otoritesi yoktur; klasik kaynaklardan doğrulanmalıdır.
            </p>
          </div>
        </footer>
        <Peek />
      </body>
    </html>
  );
}
