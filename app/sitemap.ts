import type { MetadataRoute } from "next";
import { VERSES, langsWithSura, sectionStarts } from "@/lib/content";
import { LANGS, ROUTES, SOURCE_LANG, type Lang } from "@/lib/i18n";
import { abs, everywhere } from "@/lib/meta";

// lastModified is deliberately omitted. The mtime of the source .md files
// means nothing in the deployed environment: Vercel re-fetches the repository
// on every build, so every file carries the same timestamp and every page
// looks like it changed today. A wrong lastmod is worse than none — once a
// search engine stops trusting it, it ignores the date signal for the whole
// sitemap.

/**
 * One page in every language that publishes it: the entries share a single
 * alternates block, which is what makes the cluster reciprocal.
 *
 * The record is partial because a translation may still be in progress. A
 * sura the Indonesian corpus has not reached yet has no /id page, so it is
 * neither listed nor named as an alternate — the moment the file lands, the
 * next build adds both.
 */
function group(paths: Partial<Record<Lang, string>>, priority: number): MetadataRoute.Sitemap {
  const present = LANGS.filter((l) => paths[l]);
  const languages: Record<string, string> = Object.fromEntries(
    present.map((l) => [l, abs(paths[l]!)])
  );
  if (paths[SOURCE_LANG]) languages["x-default"] = abs(paths[SOURCE_LANG]!);
  return present.map((l) => ({ url: abs(paths[l]!), priority, alternates: { languages } }));
}

/** A page that exists in all languages — everything but the sura pages. */
const everyLang = (path: (r: (typeof ROUTES)[Lang]) => string, priority: number) =>
  group(everywhere(path), priority);

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  // Home page
  out.push(...everyLang((r) => r.home, 1));

  // 114 suras plus each sura's sections. The section boundaries are the same
  // in every language, so one pass over the Turkish source produces them all.
  for (let no = 1; no <= VERSES.length; no++) {
    const langs = langsWithSura(no);
    const at = (make: (r: (typeof ROUTES)[Lang]) => string) =>
      Object.fromEntries(langs.map((l) => [l, make(ROUTES[l])])) as Partial<Record<Lang, string>>;

    out.push(...group(at((r) => `${r.sura}/${no}`), 0.8));
    for (const s of sectionStarts(SOURCE_LANG, no)) {
      out.push(...group(at((r) => `${r.sura}/${no}/${s.from}`), 0.7));
    }
  }

  // Root index — a genuine reader need and the widest internal-link hub
  out.push(...everyLang((r) => r.roots, 0.7));

  // Method: the rules the text is bound by; the basis of the authorship note
  out.push(...everyLang((r) => r.method, 0.6));
  out.push(...everyLang((r) => r.about, 0.5));

  out.push(...everyLang((r) => r.terms, 0.2));
  out.push(...everyLang((r) => r.privacy, 0.2));

  return out;
}
