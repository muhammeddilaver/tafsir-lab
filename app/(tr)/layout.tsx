import type { Metadata } from "next";
import Fonts from "@/components/Fonts";
import Peek from "@/components/Peek";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { rootMetadata } from "@/lib/meta";
import "../globals.css";

export const metadata: Metadata = rootMetadata("tr");

export const viewport = { themeColor: "#EFF1EF" };

export default function TrLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <Fonts />
      </head>
      <body>
        <SiteHeader lang="tr" />
        {children}
        <SiteFooter lang="tr" />
        <Peek lang="tr" />
      </body>
    </html>
  );
}
