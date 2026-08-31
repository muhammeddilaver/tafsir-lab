"use client";

import { usePathname } from "next/navigation";
import { LANG_COOKIE, ROUTES, T, type Lang } from "@/lib/i18n";

// Verse anchors are identical in both languages ("2/255"). Block anchors are
// derived from a hash of the content, so they do not survive a language
// change; those are not carried over.
const AYAH_HASH = /^#\d{1,3}\/\d{1,3}(-\d{1,3})?$/;

/** The current page's counterpart in the other language; its home page if none. */
export function counterpart(path: string, from: Lang) {
  const to: Lang = from === "tr" ? "en" : "tr";
  const src = ROUTES[from];
  const dst = ROUTES[to];
  const keys = (Object.keys(src) as (keyof typeof src)[])
    .filter((k) => k !== "home")
    .sort((a, b) => src[b].length - src[a].length);
  for (const k of keys) {
    if (path === src[k] || path.startsWith(`${src[k]}/`)) return dst[k] + path.slice(src[k].length);
  }
  return dst.home;
}

/** Store the explicit choice for a year; it wins the next time "/" is visited. */
function remember(to: Lang) {
  const secure = location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${LANG_COOKIE}=${to}; path=/; max-age=31536000; samesite=lax${secure}`;
}

export default function LangSwitch({ lang }: { lang: Lang }) {
  const path = usePathname() ?? ROUTES[lang].home;
  const other: Lang = lang === "tr" ? "en" : "tr";
  const href = counterpart(path, lang);
  const t = T[lang];

  return (
    <a
      className="lang"
      href={href}
      hrefLang={other}
      aria-label={t.langSwitchLabel}
      onClick={(e) => {
        remember(other);
        // Land on the same verse in the other language when the anchor carries.
        const h = location.hash;
        if (!AYAH_HASH.test(decodeURIComponent(h))) return;
        e.preventDefault();
        location.href = href + h;
      }}
    >
      {t.langSwitch}
    </a>
  );
}
