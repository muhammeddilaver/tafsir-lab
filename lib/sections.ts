// Hangi ayet hangi bolumde isleniyor? — ucuz on gecis.
// parse() tam ayristirma yapiyor ama inline() baglanti kurarken *baska*
// surelerin bolumlerini de bilmek zorunda; tam ayristirma cagirmak dongu
// olurdu. Burada yalnizca "## N/a-b" basliklari taranir.
import fs from "node:fs";
import path from "node:path";
import { AYET } from "./ayet";
import { type Lang } from "./i18n";

// Bkz. lib/content.ts: kaynak klasoru duz yazilir.
const srcDir = (lang: Lang) =>
  lang === "en" ? path.join(process.cwd(), "tefsir-en") : path.join(process.cwd(), "tefsir");

// parse() ile birebir ayni kural: baslik "N/a", "N/a-b" ya da "N/a · b"
// bicimindeyse bolumdur. "## 2/134 ve 2/141 — ..." gibi serbest basliklar
// bolum sayilmaz; oradaki ayet en yakin onceki bolume baglanir.
const HEAD = /^##\s+(\d{1,3})\/(\d{1,3})(?:\s*[·\-–]\s*(\d{1,3}))?\s*(?:—\s*.*)?$/gm;

export type SectionIndex = Map<number, Map<number, number>>; // sure -> ayet -> bolum baslangici

const _idx = new Map<Lang, SectionIndex>();

export function sectionIndex(lang: Lang): SectionIndex {
  const hit = _idx.get(lang);
  if (hit) return hit;
  const src = srcDir(lang);
  const idx: SectionIndex = new Map();
  for (const f of fs.readdirSync(src)) {
    const m = /^(\d{3})-.*\.md$/.exec(f);
    if (!m) continue;
    const no = parseInt(m[1], 10);
    const raw = fs.readFileSync(path.join(src, f), "utf8");
    const map = new Map<number, number>();
    HEAD.lastIndex = 0;
    let h: RegExpExecArray | null;
    while ((h = HEAD.exec(raw))) {
      if (parseInt(h[1], 10) !== no) continue;
      const from = parseInt(h[2], 10);
      const to = h[3] ? parseInt(h[3], 10) : from;
      for (let a = from; a <= to; a++) if (!map.has(a)) map.set(a, from);
    }
    // Basligi olmayan ayetler en yakin onceki bolume baglanir (sayfadaki
    // capalarla ayni kural).
    const total = AYET[no - 1];
    let last = 0;
    for (let a = 1; a <= total; a++) {
      const hit = map.get(a);
      if (hit) last = hit;
      else if (last) map.set(a, last);
    }
    const first = map.get(1) ?? [...map.values()][0];
    if (first) for (let a = 1; a <= total; a++) if (!map.has(a)) map.set(a, first);
    idx.set(no, map);
  }
  _idx.set(lang, idx);
  return idx;
}

export function sectionOf(lang: Lang, sura: number, ayah: number): number | null {
  return sectionIndex(lang).get(sura)?.get(ayah) ?? null;
}
