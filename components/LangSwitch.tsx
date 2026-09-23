"use client";

import { usePathname } from "next/navigation";
import {
  LANGS,
  LANG_NAME,
  LANG_COOKIE,
  ROUTES,
  T,
  type Lang,
} from "@/lib/i18n";

// Verse anchors are identical in every language ("2/255"). Block anchors are
// derived from a hash of the content, so they do not survive a language
// change; those are not carried over.
const AYAH_HASH = /^#\d{1,3}\/\d{1,3}(-\d{1,3})?$/;

/**
 * Which suras a language has, for the languages that do not yet have all of
 * them. A complete language is absent from the record — the header does not
 * ship 114 numbers per page to say "all of them".
 */
export type Have = Partial<Record<Lang, number[]>>;

/** The current page's counterpart in another language; its home page if none. */
export function counterpart(path: string, from: Lang, to: Lang, have: Have = {}) {
  const src = ROUTES[from];
  const dst = ROUTES[to];
  const keys = (Object.keys(src) as (keyof typeof src)[])
    .filter((k) => k !== "home")
    .sort((a, b) => src[b].length - src[a].length);
  for (const k of keys) {
    if (path !== src[k] && !path.startsWith(`${src[k]}/`)) continue;
    const rest = path.slice(src[k].length);
    // A sura the target language has not translated yet has no page at all:
    // sending the reader there would be a 404, so the home page is the honest
    // landing. Only the sura and fragment routes carry a sura number.
    if (k === "sura" || k === "part") {
      const no = Number(/^\/(\d{1,3})(?:\/|$)/.exec(rest)?.[1]);
      const list = have[to];
      if (no && list && !list.includes(no)) return dst.home;
    }
    return dst[k] + rest;
  }
  return dst.home;
}

/** Store the explicit choice for a year; it wins the next time "/" is visited. */
function remember(to: Lang) {
  const secure = location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${LANG_COOKIE}=${to}; path=/; max-age=31536000; samesite=lax${secure}`;
}

/**
 * A select rather than a row of links: with three languages the row took as
 * much of the bar as the nav did, and it had to hide the names behind
 * two-letter codes to fit. The select shows the language being read — which
 * the row could not — and stays one control wide whatever the list grows to.
 *
 * A select needs script to navigate, so the plain links are kept in
 * `<noscript>`: without JavaScript the switcher still works, as it did
 * before. (Search engines read the `hreflang` alternates from the document
 * head, not from here.)
 */
export default function LangSwitch({ lang, have = {} }: { lang: Lang; have?: Have }) {
  const path = usePathname() ?? ROUTES[lang].home;
  const t = T[lang];

  const go = (to: Lang) => {
    if (to === lang) return;
    remember(to);
    const href = counterpart(path, lang, to, have);
    // Land on the same verse in the other language when the anchor carries.
    const h = location.hash;
    location.href = AYAH_HASH.test(decodeURIComponent(h)) ? href + h : href;
  };

  return (
    <span className="langs">
      <select
        className="lang-select"
        aria-label={t.langLabel}
        value={lang}
        onChange={(e) => go(e.target.value as Lang)}
      >
        {LANGS.map((l) => (
          <option key={l} value={l} lang={l}>
            {LANG_NAME[l]}
          </option>
        ))}
      </select>
      <noscript>
        {LANGS.filter((l) => l !== lang).map((other) => (
          <a
            key={other}
            className="lang"
            href={counterpart(path, lang, other, have)}
            hrefLang={other}
            aria-label={t.langSwitchLabel(LANG_NAME[other])}
          >
            {LANG_NAME[other]}
          </a>
        ))}
      </noscript>
    </span>
  );
}
