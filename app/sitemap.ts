import type { MetadataRoute } from "next";
import { VERSES, sectionStarts } from "@/lib/content";
import { ROUTES } from "@/lib/i18n";
import { abs } from "@/lib/meta";

// lastModified is deliberately omitted. The mtime of the source .md files
// means nothing in the deployed environment: Vercel re-fetches the repository
// on every build, so every file carries the same timestamp and every page
// looks like it changed today. A wrong lastmod is worse than none — once a
// search engine stops trusting it, it ignores the date signal for the whole
// sitemap.

/** One sitemap entry, together with its counterparts in both languages. */
function entry(paths: { tr: string; en: string }, lang: "tr" | "en", priority: number) {
  return {
    url: abs(paths[lang]),
    priority,
    alternates: {
      languages: {
        tr: abs(paths.tr),
        en: abs(paths.en),
        "x-default": abs(paths.tr),
      },
    },
  };
}

/** The same page in both languages: two entries sharing one alternates block. */
const pair = (paths: { tr: string; en: string }, priority: number) => [
  entry(paths, "tr", priority),
  entry(paths, "en", priority),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  // Home page
  out.push(...pair({ tr: ROUTES.tr.home, en: ROUTES.en.home }, 1));

  // 114 suras plus each sura's sections. The section boundaries are the same
  // in both languages, so one pass produces both.
  for (let no = 1; no <= VERSES.length; no++) {
    out.push(...pair({ tr: `${ROUTES.tr.sura}/${no}`, en: `${ROUTES.en.sura}/${no}` }, 0.8));
    for (const s of sectionStarts("tr", no)) {
      out.push(
        ...pair(
          { tr: `${ROUTES.tr.sura}/${no}/${s.from}`, en: `${ROUTES.en.sura}/${no}/${s.from}` },
          0.7
        )
      );
    }
  }

  // Root index — a genuine reader need and the widest internal-link hub
  out.push(...pair({ tr: ROUTES.tr.roots, en: ROUTES.en.roots }, 0.7));

  // Method: the rules the text is bound by; the basis of the authorship note
  out.push(...pair({ tr: ROUTES.tr.method, en: ROUTES.en.method }, 0.6));
  out.push(...pair({ tr: ROUTES.tr.about, en: ROUTES.en.about }, 0.5));

  out.push(...pair({ tr: ROUTES.tr.terms, en: ROUTES.en.terms }, 0.2));
  out.push(...pair({ tr: ROUTES.tr.privacy, en: ROUTES.en.privacy }, 0.2));

  return out;
}
