"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LOCALE, NS, ROUTES, T, type Lang } from "@/lib/i18n";

type Kayit = { no: number; name: string; id: string; ayah?: string; ts: number };

/** Where the reader left off. <ns>last may be gone, so entries are scanned. */
function sonKayit(lang: Lang): Kayit | null {
  const ns = NS[lang];
  const POS = new RegExp(`^${ns}pos:(\\d+)$`);
  try {
    const son = JSON.parse(localStorage.getItem(`${ns}last`) || "null") as Kayit | null;
    if (son?.no && son.id) return son;
    const hepsi: Kayit[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !POS.test(k)) continue;
      const v = JSON.parse(localStorage.getItem(k) || "null") as Kayit | null;
      if (v?.no && v.id) hepsi.push(v);
    }
    return hepsi.sort((a, b) => b.ts - a.ts)[0] ?? null;
  } catch {
    return null;
  }
}

function neZaman(ts: number, lang: Lang) {
  const t = T[lang];
  const gun = Math.floor((Date.now() - ts) / 86400000);
  if (gun <= 0) return t.today;
  if (gun === 1) return t.yesterday;
  if (gun < 30) return t.daysAgo(gun);
  return new Date(ts).toLocaleDateString(LOCALE[lang], { day: "numeric", month: "long" });
}

export default function ContinueCard({ lang }: { lang: Lang }) {
  const [kayit, setKayit] = useState<Kayit | null>(null);
  const t = T[lang];

  useEffect(() => setKayit(sonKayit(lang)), [lang]);

  if (!kayit) return null;

  return (
    <Link className="continue" href={`${ROUTES[lang].sura}/${kayit.no}#${kayit.id}`}>
      <span className="continue-k">{t.continueKicker}</span>
      <strong>
        {kayit.name}
        {kayit.ayah ? ` · ${kayit.ayah}` : ""}
      </strong>
      <span className="continue-m">
        {neZaman(kayit.ts, lang)} · {t.continueGo}
      </span>
    </Link>
  );
}
