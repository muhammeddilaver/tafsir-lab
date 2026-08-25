"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Kayit = { no: number; name: string; id: string; ayah?: string; ts: number };

const POS = /^tefsir:pos:(\d+)$/;

/** En son okunan yer. tefsir:last silinmis olabilir diye kayitlar taranir. */
function sonKayit(): Kayit | null {
  try {
    const son = JSON.parse(localStorage.getItem("tefsir:last") || "null") as Kayit | null;
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

function neZaman(ts: number) {
  const gun = Math.floor((Date.now() - ts) / 86400000);
  if (gun <= 0) return "bugün";
  if (gun === 1) return "dün";
  if (gun < 30) return `${gun} gün önce`;
  return new Date(ts).toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
}

export default function ContinueCard() {
  const [kayit, setKayit] = useState<Kayit | null>(null);

  useEffect(() => setKayit(sonKayit()), []);

  if (!kayit) return null;

  return (
    <Link className="continue" href={`/sure/${kayit.no}#${kayit.id}`}>
      <span className="continue-k">Kaldığınız yer</span>
      <strong>
        {kayit.name}
        {kayit.ayah ? ` · ${kayit.ayah}` : ""}
      </strong>
      <span className="continue-m">{neZaman(kayit.ts)} · okumaya devam et →</span>
    </Link>
  );
}
