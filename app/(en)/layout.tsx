import type { Metadata } from "next";
import Analytics from "@/components/Analytics";
import { fontVars } from "@/components/Fonts";
import Peek from "@/components/Peek";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { rootMetadata } from "@/lib/meta";
import "../globals.css";

export const metadata: Metadata = rootMetadata("en");

export const viewport = { themeColor: "#EFF1EF" };

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body>
        <SiteHeader lang="en" />
        {children}
        <SiteFooter lang="en" />
        <Peek lang="en" />
        <Analytics lang="en" />
      </body>
    </html>
  );
}
