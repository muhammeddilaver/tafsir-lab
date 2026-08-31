import type { Metadata } from "next";
import { fontVars } from "@/components/Fonts";
import Peek from "@/components/Peek";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { rootMetadata } from "@/lib/meta";
import "../globals.css";

export const metadata: Metadata = rootMetadata("tr");

export const viewport = { themeColor: "#EFF1EF" };

export default function TrLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={fontVars}>
      <body>
        <SiteHeader lang="tr" />
        {children}
        <SiteFooter lang="tr" />
        <Peek lang="tr" />
      </body>
    </html>
  );
}
