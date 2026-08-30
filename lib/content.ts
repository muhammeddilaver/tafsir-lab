import fs from "node:fs";
import path from "node:path";
import { parse, inline, setSectionLookup, stripMd, type Block, type SuraMeta } from "./md";
import { sectionOf } from "./sections";
import { type Lang } from "./i18n";

setSectionLookup(sectionOf);

// Yollar duz yazilir: path.join(cwd, degisken) veriuince Turbopack kaynak
// klasorunu cozemiyor ve butun projeyi sunucu paketine izliyor.
const srcDir = (lang: Lang) =>
  lang === "en" ? path.join(process.cwd(), "tefsir-en") : path.join(process.cwd(), "tefsir");
const methodFile = (lang: Lang) =>
  lang === "en" ? path.join(process.cwd(), "USLUP-en.md") : path.join(process.cwd(), "USLUP.md");

// sure no -> ayet sayisi (kontrol.py ile ayni liste)
export { AYET } from "./ayet";
import { AYET } from "./ayet";

export type Sura = SuraMeta & {
  blocks: Block[];
  ayahAnchors: [number, string][];
  anchorsBySection: Record<string, number[]>;
  ayahCount: number;
  sections: { id: string; label: string; from: number }[];
  lead: string;
};

type FileRef = { no: number; file: string; slug: string };

const _files = new Map<Lang, FileRef[]>();
function files(lang: Lang): FileRef[] {
  const hit = _files.get(lang);
  if (hit) return hit;
  const list = fs
    .readdirSync(srcDir(lang))
    .filter((f) => /^\d{3}-.*\.md$/.test(f))
    .map((f) => ({ no: parseInt(f.slice(0, 3), 10), file: f, slug: f.slice(4, -3) }))
    .sort((a, b) => a.no - b.no);
  _files.set(lang, list);
  return list;
}

// Baslik -> kisa ad. Turkce'de ek sonda ("Bakara Sûresi"), Ingilizce'de
// basta ("Sūrat al-Baqara"); ikisi de kirpilir, kalan liste/gezinme adidir.
function shortName(title: string, slug: string, lang: Lang) {
  const t = title.replace(/^\d+\.\s*/, "").trim();
  if (!t) return slug;
  return lang === "tr"
    ? t.replace(/\s*Sûresi\s*$/u, "").trim() || slug
    : t.replace(/^S[uū]ra[th]?\s+/iu, "").trim() || slug;
}

const _names = new Map<Lang, Map<number, string>>();
export function names(lang: Lang): Map<number, string> {
  const hit = _names.get(lang);
  if (hit) return hit;
  const m = new Map<number, string>();
  for (const f of files(lang)) {
    const raw = fs.readFileSync(path.join(srcDir(lang), f.file), "utf8");
    const t = /^#\s+(.*)$/m.exec(raw)?.[1] ?? f.slug;
    m.set(f.no, shortName(t, f.slug, lang));
  }
  _names.set(lang, m);
  return m;
}

export function suraList(lang: Lang): (SuraMeta & { ayahCount: number; lead: string })[] {
  const nm = names(lang);
  return files(lang).map((f) => {
    const raw = fs.readFileSync(path.join(srcDir(lang), f.file), "utf8");
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

const _cache = new Map<string, Sura>();

export function getSura(lang: Lang, no: number): Sura | null {
  const key = `${lang}:${no}`;
  if (_cache.has(key)) return _cache.get(key)!;
  const f = files(lang).find((x) => x.no === no);
  if (!f) return null;
  const raw = fs.readFileSync(path.join(srcDir(lang), f.file), "utf8");
  const title = /^#\s+(.*)$/m.exec(raw)?.[1] ?? f.slug;
  const nm = names(lang);
  const { blocks, ayahAnchors, lead } = parse(raw, no, nm, lang);

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
  _cache.set(key, sura);
  return sura;
}

// ---------- kok dizini ----------
const AR = "؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿";
const ROOT_AR = new RegExp(`\\*\\*?([${AR}]\\s*-\\s*[${AR}]\\s*-\\s*[${AR}](?:\\s*-\\s*[${AR}])?)\\*\\*?`, "g");

// Latin harfli kok yazimi dile gore degisir:
//   Turkce  *k-t-b*, *ktb* harfleri sade Latin + Turkce harfler
//   Ingilizce *q-w-m*, *kh-t-m*, *ʿ-q-l* — cift harfli sesler (kh/sh/gh/th/dh)
//   ve harf-uzeri isaretler (ḥ ṣ ṭ ẓ ḍ ʿ ʾ ā ī ū) kullanilir
const LAT: Record<Lang, string> = {
  tr: "a-zçğışöü",
  en: "a-zʿʾāīūḥṣṭẓḍṯḏšġḫḳẖ",
};
const rootLat = (lang: Lang) => {
  const c = LAT[lang];
  const seg = lang === "tr" ? `[${c}]{1,2}` : `[${c}]{1,3}`;
  return new RegExp(`\\*\\*?(${seg}-${seg}-${seg}(?:-${seg})?)\\*\\*?`, "gi");
};

export type RootHit = { sura: number; suraName: string; anchor: string; ctx: string };
export type RootEntry = { root: string; hits: RootHit[] };

const _roots = new Map<Lang, RootEntry[]>();
export function roots(lang: Lang): RootEntry[] {
  const hit = _roots.get(lang);
  if (hit) return hit;
  const nm = names(lang);
  const ROOT_LAT = rootLat(lang);
  const agg = new Map<string, RootEntry>();
  const seen = new Map<string, Set<string>>();

  for (const f of files(lang)) {
    const raw = fs.readFileSync(path.join(srcDir(lang), f.file), "utf8");
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
          if (/^[A-Za-z]/.test(r)) r = lang === "tr" ? r.toLocaleLowerCase("tr") : r.toLowerCase();
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
  const list = [...agg.values()]
    .sort((a, b) => b.hits.length - a.hits.length || a.root.localeCompare(b.root))
    .slice(0, 400);
  _roots.set(lang, list);
  return list;
}

/** Tek bir ayet bolumu: basliktan bir sonraki ust duzey baslige kadar. */
export function section(lang: Lang, no: number, start: number) {
  const sura = getSura(lang, no);
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

/** Usul metni (USLUP.md / USLUP-en.md). */
export function method(lang: Lang) {
  const raw = fs.readFileSync(methodFile(lang), "utf8");
  const title = /^#\s+(.*)$/m.exec(raw)?.[1] ?? "Usul";
  const { blocks } = parse(raw, 0, names(lang), lang);
  return { title, blocks };
}

export function stats(lang: Lang) {
  return { suras: files(lang).length, ayahs: AYET.reduce((a, b) => a + b, 0) };
}

export { inline };
