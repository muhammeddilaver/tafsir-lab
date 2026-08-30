"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ROUTES, T, type Lang } from "@/lib/i18n";

type Item = { no: number; name: string; ayahCount: number };

// Arama icin sadelestirme. Turkce'de "İ/ı" cifti, Ingilizce'de cevriyazi
// isaretleri (ā ī ū ḥ ṣ ṭ ʿ ʾ) elenir; okur "Fatiha" yazip al-Fātiḥa'yi bulur.
function norm(s: string, lang: Lang) {
  if (lang === "tr") {
    return s
      .toLocaleLowerCase("tr")
      .replaceAll("â", "a").replaceAll("î", "i").replaceAll("û", "u")
      .replaceAll("ı", "i").replaceAll("ğ", "g").replaceAll("ş", "s")
      .replaceAll("ö", "o").replaceAll("ü", "u").replaceAll("ç", "c")
      .replace(/[^a-z0-9]/g, "");
  }
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // aksan ve nokta/cizgi isaretleri
    .replace(/[^a-z0-9]/g, "");      // ʿ ʾ ve tireler de burada duser
}

export default function SuraFilter({ items, lang }: { items: Item[]; lang: Lang }) {
  const [q, setQ] = useState("");
  const t = T[lang];
  const nq = norm(q, lang);
  const list = useMemo(
    () =>
      nq
        ? items.filter((s) => norm(s.name, lang).includes(nq) || String(s.no) === q.trim())
        : items,
    [items, nq, q, lang]
  );

  return (
    <>
      <input
        className="filter"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.filterPlaceholder}
        aria-label={t.filterLabel}
      />
      <ol className="sura-grid">
        {list.map((s) => (
          <li key={s.no}>
            <Link href={`${ROUTES[lang].sura}/${s.no}`}>
              <span className="sn">{s.no}</span>
              <span className="snm">{s.name}</span>
              <span className="sc">{t.ayahCountShort(s.ayahCount)}</span>
            </Link>
          </li>
        ))}
      </ol>
      {!list.length && <p className="muted">{t.noMatch}</p>}
    </>
  );
}
