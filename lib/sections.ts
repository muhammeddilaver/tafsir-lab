// Hangi ayet hangi bolumde isleniyor? — ucuz on gecis.
// parse() tam ayristirma yapiyor ama inline() baglanti kurarken *baska*
// surelerin bolumlerini de bilmek zorunda; tam ayristirma cagirmak dongu
// olurdu. Burada yalnizca "## N/a-b" basliklari taranir.
import fs from "node:fs";
import path from "node:path";
import { AYET } from "./ayet";

const SRC = path.join(process.cwd(), "tefsir");
// parse() ile birebir ayni kural: baslik "N/a", "N/a-b" ya da "N/a · b"
// bicimindeyse bolumdur. "## 2/134 ve 2/141 — ..." gibi serbest basliklar
// bolum sayilmaz; oradaki ayet en yakin onceki bolume baglanir.
const HEAD = /^##\s+(\d{1,3})\/(\d{1,3})(?:\s*[·\-–]\s*(\d{1,3}))?\s*(?:—\s*.*)?$/gm;

export type SectionIndex = Map<number, Map<number, number>>; // sure -> ayet -> bolum baslangici

let _idx: SectionIndex | null = null;

export function sectionIndex(): SectionIndex {
  if (_idx) return _idx;
  const idx: SectionIndex = new Map();
  for (const f of fs.readdirSync(SRC)) {
    const m = /^(\d{3})-.*\.md$/.exec(f);
    if (!m) continue;
    const no = parseInt(m[1], 10);
    const raw = fs.readFileSync(path.join(SRC, f), "utf8");
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
  _idx = idx;
  return idx;
}

export function sectionOf(sura: number, ayah: number): number | null {
  return sectionIndex().get(sura)?.get(ayah) ?? null;
}
