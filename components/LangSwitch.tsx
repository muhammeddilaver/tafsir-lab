"use client";

import { usePathname } from "next/navigation";
import { ROUTES, T, type Lang } from "@/lib/i18n";

// Ayet capasi: iki dilde ayni ("2/255"). Blok capalari icerik ozetinden
// uretildigi icin dil degisince tutmaz; onlar tasinmaz.
const AYAH_HASH = /^#\d{1,3}\/\d{1,3}(-\d{1,3})?$/;

/** Bulunulan sayfanin oteki dildeki karsiligi; eslesmezse o dilin ana sayfasi. */
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

export default function LangSwitch({ lang }: { lang: Lang }) {
  const path = usePathname() ?? ROUTES[lang].home;
  const href = counterpart(path, lang);
  const t = T[lang];

  return (
    <a
      className="lang"
      href={href}
      hrefLang={lang === "tr" ? "en" : "tr"}
      aria-label={t.langSwitchLabel}
      onClick={(e) => {
        // Ayni ayete karsi dilde in: capa tasinabiliyorsa tasi.
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
