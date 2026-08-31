import type { MetadataRoute } from "next";
import { SITE, T } from "@/lib/i18n";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE,
    short_name: "Tefsir",
    description: T.tr.metaDesc,
    lang: "tr",
    start_url: "/",
    display: "standalone",
    background_color: "#EFF1EF",
    theme_color: "#EFF1EF",
    icons: [{ src: "/icon.svg", type: "image/svg+xml", sizes: "any", purpose: "any" }],
  };
}
