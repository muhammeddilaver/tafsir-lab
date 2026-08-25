"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Item = { no: number; name: string; ayahCount: number };

// Turkce arama icin sadelestirme
function norm(s: string) {
  return s
    .toLocaleLowerCase("tr")
    .replaceAll("â", "a").replaceAll("î", "i").replaceAll("û", "u")
    .replaceAll("ı", "i").replaceAll("ğ", "g").replaceAll("ş", "s")
    .replaceAll("ö", "o").replaceAll("ü", "u").replaceAll("ç", "c")
    .replace(/[^a-z0-9]/g, "");
}

export default function SuraFilter({ items }: { items: Item[] }) {
  const [q, setQ] = useState("");
  const nq = norm(q);
  const list = useMemo(
    () => (nq ? items.filter((s) => norm(s.name).includes(nq) || String(s.no) === q.trim()) : items),
    [items, nq, q]
  );

  return (
    <>
      <input
        className="filter"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Sûre ara — ad ya da numara"
        aria-label="Sûre ara"
      />
      <ol className="sura-grid">
        {list.map((s) => (
          <li key={s.no}>
            <Link href={`/sure/${s.no}`}>
              <span className="sn">{s.no}</span>
              <span className="snm">{s.name}</span>
              <span className="sc">{s.ayahCount} ayet</span>
            </Link>
          </li>
        ))}
      </ol>
      {!list.length && <p className="muted">Eşleşme yok.</p>}
    </>
  );
}
