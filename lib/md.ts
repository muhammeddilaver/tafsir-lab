// tefsir/*.md icin kucuk bir Markdown alt kumesi ayristiricisi.
// build.py'daki kurallarin aynisi: h2/h3/h4, **kalin**, *egik*, `kod`,
// tablolar, --- , - madde, > alinti. Arapca kosular isaretlenir.
// Fark: her blok kalici bir id alir (satir satir paylasim icin) ve
// capraz atiflar (`056-vakia.md` 56/25) gercek baglantiya cevrilir.

const AR = "؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿";
const AR_RUN = new RegExp(
  `[${AR}][${AR}\\s\\u064B-\\u0652\\u0670\\u06D6-\\u06ED]*[${AR}]|[${AR}]`,
  "g"
);
const AR_CHAR = new RegExp(`[${AR}]`);

import { gecerliAyet, KESIR } from "./ayet";

// Hedef ayetin hangi bolumde islendigini soyleyen islev disaridan verilir;
// modal, parcayi bu bilgiyle cekiyor. Verilmezse baglantilar yine calisir,
// yalnizca modal yerine normal gezinme olur.
let sectionLookup: ((sura: number, ayah: number) => number | null) | null = null;
export function setSectionLookup(fn: (sura: number, ayah: number) => number | null) {
  sectionLookup = fn;
}
const peek = (sura: number, ayah: number) => {
  const start = sectionLookup?.(sura, ayah) ?? null;
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

// ---------- yardimcilar ----------
export function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function hash(s: string) {
  // FNV-1a -> base36, kisa ve kararli
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
// `NNN-slug.md` (+ istege bagli "12/34" ya da "12/34-36") -> baglanti
const XREF = /`(\d{3})-([a-z0-9-]+)\.md`(?:(\s+)(\d{1,3})\/(\d{1,3})(?:-(\d{1,3}))?)?/g;

export type InlineOpts = {
  /** Arapca kosulari <span class="ar"> ile sarilsin mi */
  wrapAr?: boolean;
  /** Cumle icindeki ciplak "9/122" referanslari baglansin mi */
  bareRefs?: boolean;
  /** Bulunulan sure — ayni sureye atif sayfa icinde kalir */
  sura?: number;
};

// Cumle icinde gecen ciplak ayet referansi: "9/122", "(51/54)", "2/196-203"
const BARE = /(?<![\d/\w])(\d{1,3})\/(\d{1,3})(?:-(\d{1,3}))?(?![\d/])/g;

export function inline(s: string, names: Map<number, string>, opts: InlineOpts = {}) {
  const { wrapAr = true, bareRefs = true, sura = 0 } = opts;
  let out = esc(s);

  // Dosya atiflarini once yer tutucuya al ki ciplak referans gecisi
  // onlarin icindeki "19/47" metnini tekrar baglamasin.
  const held: string[] = [];
  const hold = (html: string) => `\u0000${held.push(html) - 1}\u0000`;

  out = out.replace(XREF, (_m, noStr, slug, gap, refS, refA, refB) => {
    const no = parseInt(noStr, 10);
    const label = names.get(no) ?? `${noStr}-${slug}`;
    const file = `${noStr}-${slug}.md`;
    if (refS && parseInt(refS, 10) === no) {
      const an = parseInt(refA, 10);
      const href = `/sure/${no}#${no}/${an}`;
      const refTxt = refB ? `${refS}/${refA}-${refB}` : `${refS}/${refA}`;
      const p = peek(no, an);
      return hold(
        `<a class="xref" href="${href}" title="${file}"${p}>${label}</a>` +
          `${gap}<a class="xref" href="${href}"${p}>${refTxt}</a>`
      );
    }
    return hold(`<a class="xref" href="/sure/${no}" title="${file}">${label}</a>`);
  });

  out = out.replace(/`USLUP\.md`/g, () => hold('<a class="xref" href="/usul">USLUP</a>'));

  if (bareRefs) {
    out = out.replace(BARE, (m, a, b, c) => {
      const sn = parseInt(a, 10);
      const an = parseInt(b, 10);
      if (!gecerliAyet(sn, an)) return m;
      if (c && !gecerliAyet(sn, parseInt(c, 10))) return m;
      // Ayni sure: sayfa icinde kal, yeniden yukleme olmasin.
      const href = sn === sura ? `#${sn}/${an}` : `/sure/${sn}#${sn}/${an}`;
      return hold(`<a class="ref" href="${href}"${peek(sn, an)}>${m}</a>`);
    });
  }
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  // ***x*** -> kalin+egik; **x** icinde tek yildizli egik gecebilir.
  out = out.replace(/\*\*\*([^*\n]+)\*\*\*/g, "<strong><em>$1</em></strong>");
  out = out.replace(/\*\*((?:[^*]|\*(?!\*))+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");
  out = wrapAr ? wrapArabic(out) : out;
  return out.replace(/\u0000(\d+)\u0000/g, (_m, i) => held[Number(i)]);
}

// ---------- blok ayristirma ----------
export function parse(md: string, suraNo: number, names: Map<number, string>) {
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
          { sura: suraNo, bareRefs: false }
        ),
        ayah,
        arabic,
        plain: stripMd(txt),
      });
      i++;
      continue;
    }

    // tablo
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
        head: head.map((c) => inline(c, names, { sura: suraNo, bareRefs: !KESIR.has(c.trim()) })),
        rows: rows.map((r) =>
          r.map((c) => inline(c, names, { sura: suraNo, bareRefs: !KESIR.has(c.trim()) }))
        ),
        plain,
      });
      continue;
    }

    // madde listesi
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
        items: items.map((x) => inline(x, names, { sura: suraNo })),
        plain,
      });
      continue;
    }

    // alinti
    if (st.startsWith(">")) {
      const buf: string[] = [];
      while (i < n && lines[i].trim().startsWith(">")) {
        buf.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      const raw = buf.join(" ");
      blocks.push({ k: "quote", id: mkId(stripMd(raw).slice(0, 160)), html: inline(raw, names, { sura: suraNo }), plain: stripMd(raw) });
      continue;
    }

    // paragraf
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
      // RTL paragrafta da vurgular cozulur; Arapca sarmalama gereksiz,
      // cunku <p> zaten Arapca yazi tipiyle geliyor.
      html: isMostlyArabic(raw)
        ? inline(raw, names, { sura: suraNo, wrapAr: false })
        : inline(raw, names, { sura: suraNo }),
      rtl: isMostlyArabic(raw),
      plain,
    });
  }

  return { blocks, ayahAnchors, lead };
}
