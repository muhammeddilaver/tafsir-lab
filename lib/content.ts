import fs from "node:fs";
import path from "node:path";
import { parse, inline, setSectionLookup, stripMd, type Block, type SuraMeta } from "./md";
import { sectionOf } from "./sections";

setSectionLookup(sectionOf);

const SRC = path.join(process.cwd(), "tefsir");

// sure no -> ayet sayisi (kontrol.py ile ayni liste)
export const AYET = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89,
  59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30,
  52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15,
  21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

export type Sura = SuraMeta & {
  blocks: Block[];
  ayahAnchors: [number, string][];
  anchorsBySection: Record<string, number[]>;
  ayahCount: number;
  sections: { id: string; label: string; from: number }[];
  lead: string;
};

let _files: { no: number; file: string; slug: string }[] | null = null;
function files() {
  if (_files) return _files;
  _files = fs
    .readdirSync(SRC)
    .filter((f) => /^\d{3}-.*\.md$/.test(f))
    .map((f) => ({ no: parseInt(f.slice(0, 3), 10), file: f, slug: f.slice(4, -3) }))
    .sort((a, b) => a.no - b.no);
  return _files;
}

let _names: Map<number, string> | null = null;
export function names() {
  if (_names) return _names;
  _names = new Map();
  for (const f of files()) {
    const raw = fs.readFileSync(path.join(SRC, f.file), "utf8");
    const t = /^#\s+(.*)$/m.exec(raw)?.[1] ?? f.slug;
    _names.set(f.no, t.replace(/^\d+\.\s*/, "").replace(/\s*Sûresi\s*$/, "").trim());
  }
  return _names;
}

export function suraList(): (SuraMeta & { ayahCount: number; lead: string })[] {
  const nm = names();
  return files().map((f) => {
    const raw = fs.readFileSync(path.join(SRC, f.file), "utf8");
    const title = /^#\s+(.*)$/m.exec(raw)?.[1] ?? f.slug;
    const firstPara = raw
      .split("\n")
      .find((l) => l.trim() && !l.startsWith("#") && !l.startsWith("|") && !l.startsWith("-"));
    return {
      no: f.no,
      slug: f.slug,
      title,
      name: nm.get(f.no)!,
      ayahCount: AYET[f.no - 1],
      lead: stripMd(firstPara ?? "").slice(0, 150),
    };
  });
}

const _cache = new Map<number, Sura>();

export function getSura(no: number): Sura | null {
  if (_cache.has(no)) return _cache.get(no)!;
  const f = files().find((x) => x.no === no);
  if (!f) return null;
  const raw = fs.readFileSync(path.join(SRC, f.file), "utf8");
  const title = /^#\s+(.*)$/m.exec(raw)?.[1] ?? f.slug;
  const nm = names();
  const { blocks, ayahAnchors, lead } = parse(raw, no, nm);

  // Her ayet numarasi bir bolume dussun: bosluk kalirsa en yakin bolume bagla.
  const total = AYET[no - 1];
  const arr: string[] = new Array(total + 1).fill("");
  for (let a = 1; a <= total; a++) arr[a] = ayahAnchors.get(a) ?? "";
  let last = "";
  for (let a = 1; a <= total; a++) {
    if (arr[a]) last = arr[a];
    else arr[a] = last;
  }
  const firstFilled = arr.find((x) => x) ?? "";
  for (let a = 1; a <= total; a++) if (!arr[a]) arr[a] = firstFilled;

  const full: [number, string][] = [];
  const bySection: Record<string, number[]> = {};
  for (let a = 1; a <= total; a++) {
    if (!arr[a]) continue;
    full.push([a, arr[a]]);
    (bySection[arr[a]] ||= []).push(a);
  }

  const sections = blocks
    .filter((b): b is Extract<Block, { k: "h" }> => b.k === "h" && !!b.ayah)
    .map((b) => ({
      id: b.id,
      from: b.ayah!.from,
      label: b.ayah!.from === b.ayah!.to ? `${b.ayah!.from}` : `${b.ayah!.from}-${b.ayah!.to}`,
    }));

  const sura: Sura = {
    no,
    slug: f.slug,
    title,
    name: nm.get(no)!,
    blocks,
    ayahAnchors: full,
    anchorsBySection: bySection,
    ayahCount: total,
    sections,
    lead,
  };
  _cache.set(no, sura);
  return sura;
}

// ---------- kok dizini ----------
const AR = "؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿";
const ROOT_AR = new RegExp(`\\*\\*?([${AR}]\\s*-\\s*[${AR}]\\s*-\\s*[${AR}](?:\\s*-\\s*[${AR}])?)\\*\\*?`, "g");
const ROOT_LAT = /\*\*?([a-zçğışöü]{1,2}-[a-zçğışöü]{1,2}-[a-zçğışöü]{1,2}(?:-[a-zçğışöü]{1,2})?)\*\*?/gi;

export type RootHit = { sura: number; suraName: string; anchor: string; ctx: string };
export type RootEntry = { root: string; hits: RootHit[] };

let _roots: RootEntry[] | null = null;
export function roots(): RootEntry[] {
  if (_roots) return _roots;
  const nm = names();
  const agg = new Map<string, RootEntry>();
  const seen = new Map<string, Set<string>>();

  for (const f of files()) {
    const raw = fs.readFileSync(path.join(SRC, f.file), "utf8");
    const lines = raw.split("\n");
    let anchor = "";
    for (const ln of lines) {
      const h = /^##\s+(\d{1,3})\/(\d{1,3})(?:\s*[·\-–]\s*(\d{1,3}))?/.exec(ln.trim());
      if (h && parseInt(h[1], 10) === f.no) {
        anchor = `${f.no}/${h[2]}${h[3] ? `-${h[3]}` : ""}`;
        continue;
      }
      for (const rx of [ROOT_AR, ROOT_LAT]) {
        rx.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = rx.exec(ln))) {
          let r = m[1].replace(/\s+/g, "");
          if (/^[A-Za-zçğışöüÇĞİŞÖÜ]/.test(r)) r = r.toLocaleLowerCase("tr");
          if ((r.match(/-/g) ?? []).length < 2) continue;
          const key = r;
          const e = agg.get(key) ?? { root: key, hits: [] };
          const sk = seen.get(key) ?? new Set<string>();
          const hk = `${f.no}#${anchor}`;
          if (!sk.has(hk)) {
            sk.add(hk);
            const start = Math.max(0, m.index - 90);
            e.hits.push({
              sura: f.no,
              suraName: nm.get(f.no)!,
              anchor,
              ctx: stripMd(ln.slice(start, m.index + m[0].length + 130)).slice(0, 190),
            });
          }
          agg.set(key, e);
          seen.set(key, sk);
        }
      }
    }
  }
  _roots = [...agg.values()]
    .sort((a, b) => b.hits.length - a.hits.length || a.root.localeCompare(b.root))
    .slice(0, 400);
  return _roots;
}

/** Tek bir ayet bolumu: basliktan bir sonraki ust duzey baslige kadar. */
export function section(no: number, start: number) {
  const sura = getSura(no);
  if (!sura) return null;
  const i = sura.blocks.findIndex((b) => b.k === "h" && b.ayah?.from === start);
  if (i < 0) return null;
  let j = i + 1;
  while (j < sura.blocks.length) {
    const b = sura.blocks[j];
    if (b.k === "h" && b.lvl === 2) break;
    j++;
  }
  const head = sura.blocks[i] as Extract<Block, { k: "h" }>;
  const label =
    head.ayah!.from === head.ayah!.to
      ? `${no}/${head.ayah!.from}`
      : `${no}/${head.ayah!.from}-${head.ayah!.to}`;
  return { no, name: sura.name, label, id: head.id, blocks: sura.blocks.slice(i, j) };
}

export function usul() {
  const raw = fs.readFileSync(path.join(process.cwd(), "USLUP.md"), "utf8");
  const title = /^#\s+(.*)$/m.exec(raw)?.[1] ?? "Usul";
  const { blocks } = parse(raw, 0, names());
  return { title, blocks };
}

export function stats() {
  return { suras: files().length, ayahs: AYET.reduce((a, b) => a + b, 0) };
}

export { inline };
