// A small Markdown-subset parser for tafsir/*.md.
// The same rules as build.py: h2/h3/h4, **bold**, *italic*, `code`, tables,
// ---, - list items, > quotes. Arabic runs are marked up.
// The difference: every block gets a stable id (for sharing a single line)
// and cross references (`056-vakia.md` 56/25) become real links.

const AR = "؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿";
const AR_RUN = new RegExp(
  `[${AR}][${AR}\\s\\u064B-\\u0652\\u0670\\u06D6-\\u06ED]*[${AR}]|[${AR}]`,
  "g"
);
const AR_CHAR = new RegExp(`[${AR}]`);

import { isValidVerse, FRACTIONS } from "./verses";
import { ROUTES, type Lang } from "./i18n";

// The function that says which section treats a target verse is injected from
// outside; the modal uses it to fetch the fragment. Without it the links still
// work, they just navigate normally instead of opening the modal.
let sectionLookup: ((lang: Lang, sura: number, ayah: number) => number | null) | null = null;
export function setSectionLookup(fn: (lang: Lang, sura: number, ayah: number) => number | null) {
  sectionLookup = fn;
}
// data-p carries only "sura/section"; the modal knows from its own language
// which one to fetch, so the anchor text stays identical in both languages.
const peek = (lang: Lang, sura: number, ayah: number) => {
  const start = sectionLookup?.(lang, sura, ayah) ?? null;
  return start === null ? "" : ` data-p="${sura}/${start}"`;
};

export type Ayah = { sura: number; from: number; to: number };

export type Block =
  | { k: "h"; id: string; lvl: 2 | 3 | 4; html: string; ayah?: Ayah; arabic?: string; plain: string }
  | { k: "p"; id: string; html: string; rtl?: boolean; plain: string }
  | { k: "ul"; id: string; items: string[]; plain: string }
  | { k: "table"; id: string; head: string[]; rows: string[][]; plain: string }
  | { k: "quote"; id: string; html: string; plain: string }
  | { k: "hr"; id: string };

export type SuraMeta = { no: number; name: string; title: string; slug: string };

// ---------- helpers ----------
export function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function hash(s: string) {
  // FNV-1a -> base36, short and stable
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36).padStart(7, "0").slice(0, 7);
}

function wrapArabic(s: string) {
  return s.replace(AR_RUN, (m) => `<span class="ar">${m}</span>`);
}

export function isMostlyArabic(s: string) {
  const letters = Array.from(s).filter((c) => /\p{L}/u.test(c));
  if (!letters.length) return false;
  const ar = letters.filter((c) => AR_CHAR.test(c));
  return ar.length / letters.length > 0.6;
}

export function stripMd(s: string) {
  return s.replace(/[*`#|]/g, "").replace(/\s+/g, " ").trim();
}

// ---------- inline ----------
// `NNN-slug.md` (plus an optional "12/34" or "12/34-36") -> a link
const XREF = /`(\d{3})-([a-z0-9-]+)\.md`(?:(\s+)(\d{1,3})\/(\d{1,3})(?:-(\d{1,3}))?)?/g;

export type InlineOpts = {
  /** Whether to wrap Arabic runs in <span class="ar"> */
  wrapAr?: boolean;
  /** Whether to link bare "9/122" references inside a sentence */
  bareRefs?: boolean;
  /** The current sura — a reference to it stays within the page */
  sura?: number;
  /** Which language's routes the links should point at */
  lang?: Lang;
};

// A bare verse reference inside a sentence: "9/122", "(51/54)", "2/196-203"
const BARE = /(?<![\d/\w])(\d{1,3})\/(\d{1,3})(?:-(\d{1,3}))?(?![\d/])/g;

export function inline(s: string, names: Map<number, string>, opts: InlineOpts = {}) {
  const { wrapAr = true, bareRefs = true, sura = 0, lang = "tr" } = opts;
  const R = ROUTES[lang];
  let out = esc(s);

  // Park the file references in placeholders first, so the bare-reference
  // pass does not link the "19/47" inside them a second time.
  const held: string[] = [];
  const hold = (html: string) => `\u0000${held.push(html) - 1}\u0000`;

  out = out.replace(XREF, (_m, noStr, slug, gap, refS, refA, refB) => {
    const no = parseInt(noStr, 10);
    const label = names.get(no) ?? `${noStr}-${slug}`;
    const file = `${noStr}-${slug}.md`;
    if (refS && parseInt(refS, 10) === no) {
      const an = parseInt(refA, 10);
      const href = `${R.sura}/${no}#${no}/${an}`;
      const refTxt = refB ? `${refS}/${refA}-${refB}` : `${refS}/${refA}`;
      const p = peek(lang, no, an);
      return hold(
        `<a class="xref" href="${href}" title="${file}"${p}>${label}</a>` +
          `${gap}<a class="xref" href="${href}"${p}>${refTxt}</a>`
      );
    }
    return hold(`<a class="xref" href="${R.sura}/${no}" title="${file}">${label}</a>`);
  });

  out = out.replace(/`STYLE\.md`/g, () =>
    hold(`<a class="xref" href="${R.method}">${lang === "tr" ? "STYLE" : "Method"}</a>`)
  );

  if (bareRefs) {
    out = out.replace(BARE, (m, a, b, c) => {
      const sn = parseInt(a, 10);
      const an = parseInt(b, 10);
      if (!isValidVerse(sn, an)) return m;
      if (c && !isValidVerse(sn, parseInt(c, 10))) return m;
      // Same sura: stay in the page, no reload.
      const href = sn === sura ? `#${sn}/${an}` : `${R.sura}/${sn}#${sn}/${an}`;
      return hold(`<a class="ref" href="${href}"${peek(lang, sn, an)}>${m}</a>`);
    });
  }
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  // ***x*** -> bold+italic; a single-star italic may appear inside **x**.
  out = out.replace(/\*\*\*([^*\n]+)\*\*\*/g, "<strong><em>$1</em></strong>");
  // ***x** y* -> bold at the start of an italic block
  out = out.replace(/\*\*\*([^*\n]+)\*\*([^*\n]*)\*(?!\*)/g,
                    "<em><strong>$1</strong>$2</em>");
  // **... *x*** -> italic at the end of a bold block: stops R2 swallowing the star
  out = out.replace(/\*\*((?:[^*\n]|\*(?!\*))*?)\*([^*\n]+)\*\*\*/g,
                    "<strong>$1<em>$2</em></strong>");
  out = out.replace(/\*\*((?:[^*]|\*(?!\*))+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");
  out = wrapAr ? wrapArabic(out) : out;
  return out.replace(/\u0000(\d+)\u0000/g, (_m, i) => held[Number(i)]);
}

// ---------- block parsing ----------
export function parse(md: string, suraNo: number, names: Map<number, string>, lang: Lang = "tr") {
  const lines = md.split("\n");
  const blocks: Block[] = [];
  const used = new Set<string>();
  const ayahAnchors = new Map<number, string>(); // ayet no -> bolum id
  let lead = ""; // sure girisi (ilk paragraf) — liste sayfasinda kullanilir

  const mkId = (seed: string) => {
    let id = "b" + hash(seed);
    if (used.has(id)) {
      let n = 2;
      while (used.has(`${id}-${n}`)) n++;
      id = `${id}-${n}`;
    }
    used.add(id);
    return id;
  };

  let i = 0;
  const n = lines.length;
  while (i < n) {
    const st = lines[i].trim();

    if (!st) { i++; continue; }
    if (st.startsWith("# ")) { i++; continue; } // dosya basligi ayri tutulur

    if (st === "---") {
      blocks.push({ k: "hr", id: mkId("hr" + i) });
      i++;
      continue;
    }

    const h = /^(#{2,4})\s+(.*)$/.exec(st);
    if (h) {
      const lvl = h[1].length as 2 | 3 | 4;
      const txt = h[2].trim();
      let ayah: Ayah | undefined;
      let arabic: string | undefined;
      let id: string;

      const am = /^(\d{1,3})\/(\d{1,3})(?:\s*[·\-–]\s*(\d{1,3}))?\s*(?:—\s*(.*))?$/.exec(txt);
      if (lvl === 2 && am && parseInt(am[1], 10) === suraNo) {
        const from = parseInt(am[2], 10);
        const to = am[3] ? parseInt(am[3], 10) : from;
        ayah = { sura: suraNo, from, to };
        const tail = am[4]?.trim();
        if (tail && isMostlyArabic(tail)) arabic = tail;
        id = `${suraNo}/${from}${to !== from ? `-${to}` : ""}`;
        if (used.has(id)) id = mkId(txt);
        else used.add(id);
        for (let a = from; a <= to; a++) if (!ayahAnchors.has(a)) ayahAnchors.set(a, id);
      } else {
        id = mkId(txt);
      }

      blocks.push({
        k: "h",
        id,
        lvl,
        html: inline(
          arabic ? txt.slice(0, txt.length - arabic.length).replace(/\s*—\s*$/, "") : txt,
          names,
          { sura: suraNo, bareRefs: false, lang }
        ),
        ayah,
        arabic,
        plain: stripMd(txt),
      });
      i++;
      continue;
    }

    // table
    if (st.startsWith("|") && i + 1 < n && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
      const head = st.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      i += 2;
      const rows: string[][] = [];
      while (i < n && lines[i].trim().startsWith("|")) {
        rows.push(lines[i].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
        i++;
      }
      const plain = stripMd([head.join(" "), ...rows.map((r) => r.join(" "))].join(" "));
      blocks.push({
        k: "table",
        id: mkId(plain.slice(0, 160)),
        head: head.map((c) => inline(c, names, { sura: suraNo, bareRefs: !FRACTIONS.has(c.trim()), lang })),
        rows: rows.map((r) =>
          r.map((c) => inline(c, names, { sura: suraNo, bareRefs: !FRACTIONS.has(c.trim()), lang }))
        ),
        plain,
      });
      continue;
    }

    // list
    if (/^[-*]\s+/.test(st)) {
      const items: string[] = [];
      while (i < n && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      const plain = stripMd(items.join(" "));
      blocks.push({
        k: "ul",
        id: mkId(plain.slice(0, 160)),
        items: items.map((x) => inline(x, names, { sura: suraNo, lang })),
        plain,
      });
      continue;
    }

    // quote
    if (st.startsWith(">")) {
      const buf: string[] = [];
      while (i < n && lines[i].trim().startsWith(">")) {
        buf.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      const raw = buf.join(" ");
      blocks.push({ k: "quote", id: mkId(stripMd(raw).slice(0, 160)), html: inline(raw, names, { sura: suraNo, lang }), plain: stripMd(raw) });
      continue;
    }

    // paragraph
    const buf: string[] = [];
    while (i < n && lines[i].trim() && !/^(#{2,4}\s|[-*]\s|\||>|---$)/.test(lines[i].trim())) {
      buf.push(lines[i].trim());
      i++;
    }
    if (!buf.length) { buf.push(st); i++; } // hicbir dala girmeyen satir: sonsuz donguyu onle
    const raw = buf.join(" ");
    const plain = stripMd(raw);
    if (!lead && plain.length > 40) lead = plain;
    blocks.push({
      k: "p",
      id: mkId(plain.slice(0, 160)),
      // Emphasis is resolved in an RTL paragraph too; wrapping the Arabic is
      // unnecessary because the <p> already carries the Arabic font.
      html: isMostlyArabic(raw)
        ? inline(raw, names, { sura: suraNo, wrapAr: false, lang })
        : inline(raw, names, { sura: suraNo, lang }),
      rtl: isMostlyArabic(raw),
      plain,
    });
  }

  return { blocks, ayahAnchors, lead };
}
