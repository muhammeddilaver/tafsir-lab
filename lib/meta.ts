import type { Metadata } from "next";
import { getSura, section } from "./content";
import { LANGS, OG_LOCALE, ROUTES, SITE, T, type Lang } from "./i18n";

// The published address comes from the environment: in production Vercel sets
// VERCEL_PROJECT_PRODUCTION_URL. Without it the alternates stay relative —
// fine locally and in previews.
const base =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

export const metadataBase = base ? new URL(base) : undefined;

// sitemap.xml and robots.txt need absolute URLs, and metadataBase is not
// applied to them. With no address configured we fall back to the local
// server: the build passes and production corrects itself once
// NEXT_PUBLIC_SITE_URL is set.
export const SITE_URL = (base ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * Search Console / Bing Webmaster ownership tags. Both are read from the
 * environment so the tokens are not committed, and both are optional: with
 * the variable unset nothing is emitted. DNS TXT verification works just as
 * well and survives redeploys better — these are the fallback for whoever
 * prefers the meta-tag route.
 */
function verification(): Metadata["verification"] | undefined {
  const google = process.env.GOOGLE_SITE_VERIFICATION;
  const bing = process.env.BING_SITE_VERIFICATION;
  if (!google && !bing) return undefined;
  return {
    ...(google ? { google } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  };
}

/** Joins a relative path to the site address; the root "/" drops its slash. */
export const abs = (p: string) => (p === "/" ? SITE_URL : `${SITE_URL}${p}`);

/**
 * A page's address in both languages: the hreflang tags come from here.
 * x-default points at the Turkish version — the language the text was
 * written in.
 */
export function alternates(paths: Record<Lang, string>): Metadata["alternates"] {
  return {
    languages: {
      ...Object.fromEntries(LANGS.map((l) => [l, paths[l]])),
      "x-default": paths.tr,
    },
  };
}

/**
 * Trims a description without cutting through a word.
 * It used to be slice(0, 180), which split words in half.
 */
export function clamp(text: string, n = 155): string {
  const s = text.replace(/\s+/g, " ").trim();
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > n * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:.—–-]+$/u, "")}…`;
}

/** Metadata for a root layout. */
export function rootMetadata(lang: Lang): Metadata {
  const t = T[lang];
  return {
    metadataBase,
    title: { default: t.metaTitle, template: t.metaTemplate },
    description: t.metaDesc,
    applicationName: SITE,
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
    twitter: { card: "summary_large_image" },
    verification: verification(),
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

/**
 * Metadata for a sura page. Both languages go through the same shape; the
 * title and description strings are written per language in lib/i18n.ts —
 * Turkish "Bakara Suresi Tefsiri", English "Surat al-Baqara Commentary".
 *
 * openGraph is deliberately left undefined: when a page supplies its own
 * openGraph block, Next replaces the one inherited from the root layout
 * entirely, and the file-convention og:image together with og:site_name and
 * og:locale drop out. Leaving it out means og:title comes from the title and
 * og:description from the description field below, while the image and site
 * name stay inherited.
 */
export function suraMetadata(lang: Lang, no: number): Metadata {
  const sura = getSura(lang, no);
  if (!sura) return {};
  const t = T[lang];
  const paths = { tr: `${ROUTES.tr.sura}/${no}`, en: `${ROUTES.en.sura}/${no}` };
  const description = clamp(t.suraSeoDesc(sura.name, sura.ayahCount, sura.lead));
  return {
    title: t.suraSeoTitle(sura.name),
    description,
    alternates: { canonical: paths[lang], ...alternates(paths) },
  };
}

/**
 * Metadata for a section page. Because the section boundaries are identical
 * in both languages (3,003 headings, zero differences), the hreflang pairing
 * is safe: /sure/2/255 and /en/sura/2/255 always show the same verses.
 */
export function sectionMetadata(lang: Lang, no: number, start: number): Metadata {
  const sec = section(lang, no, start);
  if (!sec) return {};
  const t = T[lang];
  const range = t.secRange(no, sec.from, sec.to);
  const paths = {
    tr: `${ROUTES.tr.sura}/${no}/${start}`,
    en: `${ROUTES.en.sura}/${no}/${start}`,
  };
  return {
    title: t.secSeoTitle(sec.name, range, sec.title),
    description: clamp(t.secSeoDesc(sec.name, range, sec.lead)),
    alternates: { canonical: paths[lang], ...alternates(paths) },
  };
}
