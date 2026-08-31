import fs from "node:fs";
import path from "node:path";
import {
  inline,
  isMostlyArabic,
  parse,
  setSectionLookup,
  stripMd,
  type Block,
  type SuraMeta,
} from "./md";
import { sectionOf } from "./sections";
import { type Lang } from "./i18n";

setSectionLookup(sectionOf);

// The paths are written out literally: given path.join(cwd, variable),
// Turbopack cannot resolve the source folder and traces the whole project
// into the server bundle.
const srcDir = (lang: Lang) =>
  lang === "en" ? path.join(process.cwd(), "tafsir-en") : path.join(process.cwd(), "tafsir");
const methodFile = (lang: Lang) =>
  lang === "en" ? path.join(process.cwd(), "STYLE-en.md") : path.join(process.cwd(), "STYLE.md");

// sura number -> verse count (the same list as check.py)
export { VERSES } from "./verses";
import { VERSES } from "./verses";

export type Sura = SuraMeta & {
  blocks: Block[];
  ayahAnchors: [number, string][];
  anchorsBySection: Record<string, number[]>;
  ayahCount: number;
  sections: { id: string; label: string; from: number; to: number; title: string }[];
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

// Title -> short name. Turkish puts the affix last ("Bakara Sûresi"),
// English first ("Sūrat al-Baqara"); both are trimmed and what remains is the
// name used in lists and navigation.
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
      ayahCount: VERSES[f.no - 1],
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

  // Every verse number must land in a section: any gap attaches to the nearest one.
  const total = VERSES[no - 1];
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
      to: b.ayah!.to,
      label: b.ayah!.from === b.ayah!.to ? `${b.ayah!.from}` : `${b.ayah!.from}-${b.ayah!.to}`,
      // The descriptive part of a heading such as "## 2/8-20 — Munafiklar";
      // empty for headings whose tail is Arabic. The index on the sura page
      // displays it.
      title: b.arabic
        ? ""
        : b.plain.replace(/^\d{1,3}\/\d{1,3}(?:-\d{1,3})?\s*[—–-]\s*/, "").trim(),
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

// ---------- root index ----------
const AR = "؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿";
const ROOT_AR = new RegExp(`\\*\\*?([${AR}]\\s*-\\s*[${AR}]\\s*-\\s*[${AR}](?:\\s*-\\s*[${AR}])?)\\*\\*?`, "g");

// How a root is written in Latin script differs by language:
//   Turkish  *k-t-b*, *ktb* — plain Latin plus Turkish letters
//   English  *q-w-m*, *kh-t-m*, *ʿ-q-l* — digraphs (kh/sh/gh/th/dh) and
//            diacritics (ḥ ṣ ṭ ẓ ḍ ʿ ʾ ā ī ū)
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

/**
 * Section start -> the roots analysed in that section. roots() already knows
 * which section heading each hit falls under; this inverts that so a section
 * page can list its own roots. Built once per language.
 */
const _rootsBySec = new Map<Lang, Map<string, string[]>>();
export function rootsBySection(lang: Lang): Map<string, string[]> {
  const hit = _rootsBySec.get(lang);
  if (hit) return hit;
  const m = new Map<string, string[]>();
  for (const e of roots(lang)) {
    for (const h of e.hits) {
      const at = /^(\d{1,3})\/(\d{1,3})/.exec(h.anchor);
      if (!at) continue;
      const key = `${at[1]}/${at[2]}`;
      const arr = m.get(key) ?? [];
      if (!arr.includes(e.root)) arr.push(e.root);
      m.set(key, arr);
    }
  }
  _rootsBySec.set(lang, m);
  return m;
}

/**
 * The starts that get a section page. sura.sections is the raw heading list
 * and carries two headings that begin at the same verse separately; on the
 * page surface those are one address (/sure/7/46), so they are merged here.
 * Page generation, the sitemap and the index on the sura page must all use
 * this list — otherwise the same URL enters the sitemap twice.
 */
export function sectionStarts(lang: Lang, no: number) {
  const sura = getSura(lang, no);
  if (!sura) return [];
  const m = new Map<number, { from: number; to: number; title: string }>();
  for (const s of sura.sections) {
    const hit = m.get(s.from);
    if (!hit) m.set(s.from, { from: s.from, to: s.to, title: s.title });
    else {
      hit.to = Math.max(hit.to, s.to);
      if (!hit.title) hit.title = s.title;
    }
  }
  return [...m.values()];
}

/**
 * A single verse section: from its heading to the next top-level heading.
 * Both the citation modal (/parca) and the section page (/sure/N/a) are fed
 * from here; the extra fields the page needs (title, lead, neighbouring
 * sections) are ignored by the modal.
 */
export function section(lang: Lang, no: number, start: number) {
  const sura = getSura(lang, no);
  if (!sura) return null;
  const i = sura.blocks.findIndex((b) => b.k === "h" && b.ayah?.from === start);
  if (i < 0) return null;
  // Consecutive level-2 headings starting at the same verse are one section:
  //   "## 7/46-49 — A'raf ehli"   group lead-in
  //   "## 7/46-47 — <Arabic>"     body
  // Cutting at the first would leave only the lead-in paragraph on the page
  // and drop the verse itself from the section-page surface entirely.
  // Happens in seven places.
  let j = i + 1;
  while (j < sura.blocks.length) {
    const b = sura.blocks[j];
    if (b.k === "h" && b.lvl === 2 && b.ayah?.from !== start) break;
    j++;
  }
  const head = sura.blocks[i] as Extract<Block, { k: "h" }>;
  const blocks = sura.blocks.slice(i, j);

  // The merged headings' widest range and first descriptive title win.
  const heads = blocks.filter(
    (b): b is Extract<Block, { k: "h" }> => b.k === "h" && b.lvl === 2 && b.ayah?.from === start
  );
  const from = start;
  const to = Math.max(...heads.map((h) => h.ayah!.to));
  const label = from === to ? `${no}/${from}` : `${no}/${from}-${to}`;

  // A section heading comes in two forms: "## 2/255 — <Arabic>" or
  // "## 2/8-20 — Munafiklar". The first has no descriptive title, the second does.
  const title =
    heads
      .filter((h) => !h.arabic)
      .map((h) => h.plain.replace(/^\d{1,3}\/\d{1,3}(?:-\d{1,3})?\s*[—–-]\s*/, "").trim())
      .find(Boolean) ?? "";

  // The first plain paragraph, for the description; headings and tables are
  // skipped. Arabic paragraphs are skipped too: in sections with a descriptive
  // title the verse itself arrives as its own paragraph and filled the meta
  // description end to end with Arabic — unreadable in a Turkish search result.
  const lead =
    blocks.find(
      (b): b is Extract<Block, { k: "p" }> => b.k === "p" && !isMostlyArabic(b.plain)
    )?.plain ?? sura.lead;

  const starts = sectionStarts(lang, no);
  const at = starts.findIndex((x) => x.from === from);
  const nb = (k: number) => (at >= 0 ? starts[at + k] : undefined);

  return {
    no,
    name: sura.name,
    suraTitle: sura.title,
    label,
    id: head.id,
    from,
    to,
    title,
    lead,
    arabic: heads.map((h) => h.arabic).find(Boolean) ?? "",
    ayahs: [...new Set(heads.flatMap((h) => sura.anchorsBySection[h.id] ?? []))].sort(
      (a, b) => a - b
    ),
    prev: nb(-1),
    next: nb(1),
    blocks,
  };
}

/** The method text (STYLE.md / STYLE-en.md). */
export function method(lang: Lang) {
  const raw = fs.readFileSync(methodFile(lang), "utf8");
  const title = /^#\s+(.*)$/m.exec(raw)?.[1] ?? "Usul";
  const { blocks } = parse(raw, 0, names(lang), lang);
  return { title, blocks };
}

export function stats(lang: Lang) {
  return { suras: files(lang).length, ayahs: VERSES.reduce((a, b) => a + b, 0) };
}

export { inline };
