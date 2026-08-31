import { LOCALE, REPO, SITE, T, type Lang } from "./i18n";
import { abs } from "./meta";

/**
 * Authorship has to be stated truthfully here: a language model wrote the
 * text. schema.org has no type for "AI author", and presenting Claude as a
 * Person would be a lie. So the publishing project is the `author`, the
 * model that produced the text is the `creator` (a SoftwareApplication),
 * and `creditText` repeats the disclaimer that sits on every page.
 */
const author = () => ({
  "@type": "Organization",
  name: SITE,
  url: abs("/"),
});

const creator = () => ({
  "@type": "SoftwareApplication",
  name: "Claude",
  applicationCategory: "Large language model",
  publisher: { "@type": "Organization", name: "Anthropic", url: "https://www.anthropic.com" },
});

const QURAN: Record<Lang, string> = { tr: "Kur'an-ı Kerîm", en: "The Qurʾān" };

const about = (lang: Lang) => ({ "@type": "Book", name: QURAN[lang] });

/** Home page: this is what makes Google show the site name, not the domain. */
export function webSiteLd(lang: Lang) {
  const t = T[lang];
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${abs(lang === "tr" ? "/" : "/en")}#website`,
    name: SITE,
    url: abs(lang === "tr" ? "/" : "/en"),
    description: t.metaDesc,
    inLanguage: LOCALE[lang],
    about: about(lang),
    author: author(),
    creator: creator(),
    creditText: t.footNote,
    isAccessibleForFree: true,
    license: REPO,
  };
}

/** Shared body for section and sura pages. */
export function articleLd(opts: {
  lang: Lang;
  url: string;
  headline: string;
  description: string;
  partOf?: string;
}) {
  const t = T[opts.lang];
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${abs(opts.url)}#article`,
    url: abs(opts.url),
    headline: opts.headline,
    description: opts.description,
    inLanguage: LOCALE[opts.lang],
    about: about(opts.lang),
    author: author(),
    creator: creator(),
    creditText: t.footNote,
    isAccessibleForFree: true,
    license: REPO,
    ...(opts.partOf ? { isPartOf: { "@type": "Article", "@id": `${abs(opts.partOf)}#article` } } : {}),
  };
}

/** The breadcrumb trail shown in search results: Home › Bakara › verse 255 */
export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((x, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: x.name,
      item: abs(x.url),
    })),
  };
}
