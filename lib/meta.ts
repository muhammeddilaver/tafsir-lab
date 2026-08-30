import type { Metadata } from "next";
import { LANGS, OG_LOCALE, ROUTES, SITE, T, type Lang } from "./i18n";

// Yayin adresi ortamdan gelir: Vercel uretimde VERCEL_PROJECT_PRODUCTION_URL
// tanimlar. Yoksa alternates goreli kalir — yerelde ve onizlemede sorun degil.
const base =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

export const metadataBase = base ? new URL(base) : undefined;

/** Bir sayfanin iki dildeki adresi: hreflang etiketleri buradan cikar. */
export function alternates(paths: Record<Lang, string>): Metadata["alternates"] {
  return {
    languages: Object.fromEntries(LANGS.map((l) => [l, paths[l]])),
  };
}

/** Kok yerlesimin ust verisi. */
export function rootMetadata(lang: Lang): Metadata {
  const t = T[lang];
  return {
    metadataBase,
    title: { default: t.metaTitle, template: t.metaTemplate },
    description: t.metaDesc,
    alternates: {
      canonical: ROUTES[lang].home,
      ...alternates({ tr: ROUTES.tr.home, en: ROUTES.en.home }),
    },
    openGraph: {
      type: "website",
      siteName: SITE,
      locale: OG_LOCALE[lang],
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
    },
  };
}
