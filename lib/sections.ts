// Which section treats which verse? — a cheap pre-pass.
// parse() does the full parse, but inline() has to know the sections of
// *other* suras while building links; calling the full parse there would
// loop. This scans only the "## N/a-b" headings.
import fs from "node:fs";
import path from "node:path";
import { VERSES } from "./verses";
import { type Lang } from "./i18n";

// See lib/content.ts: the source directory is written out literally.
const srcDir = (lang: Lang) =>
  lang === "en" ? path.join(process.cwd(), "tafsir-en") : path.join(process.cwd(), "tafsir");

// Exactly the same rule as parse(): a heading of the form "N/a", "N/a-b"
// or "N/a · b" is a section. Free-form headings such as
// "## 2/134 ve 2/141 — ..." are not; their verses attach to the nearest
// preceding section.
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
    // Verses without a heading of their own attach to the nearest preceding
    // section (the same rule as the anchors on the page).
    const total = VERSES[no - 1];
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
