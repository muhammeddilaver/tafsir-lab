# Tafsir Lab

A verse-by-verse Turkish commentary on the Qurʾān, written with Claude and
built on root analysis. All 114 sūras, 6,236 verses. The whole text has also
been translated into English; the site is published in both languages
(`/` Turkish, `/en` English).

---

## Who wrote this text

**The entire commentary was written by Claude (Anthropic).** This goes first,
because a reader has the right to know what they are reading.

What that means:

- The text is not the work of a scholar but the output of a language model.
  It **carries no religious authority** and does not stand in for the
  classical commentary literature.
- A language model can produce convincing-looking errors. Word roots,
  grammatical explanations, and reports of readings and transmissions **may be
  wrong**.
- If you are going to rely on this text for anything that matters, check it
  against the classical sources first.
- The aim is not to replace the commentary tradition, but to lay out the
  linguistic texture of a verse — its roots, its syntax, its repetitions
  within the sūra — in a readable form.

The rules followed while writing are in `STYLE.md` and on the **Method** page
of the site. The main ones:

| Rule | What it means |
|---|---|
| No invented transmission | A statement whose source cannot be given is not attributed to a commentator or a hadith; where there is doubt, the wording is "it is reported that" |
| Disagreement is not hidden | Where the commentators divide, the views are set out in a table and no preference is imposed |
| No legal rulings | The views of the schools are reported; no ruling is issued |
| No blanket verdicts | No collective verdict is issued about any ethnic or religious group; what the verse describes are **qualities** |
| No scientific-miracle hunting | Modern knowledge is not forced onto a verse; abjad and numerology are not used |
| No current politics | No side is taken |
| The text's own readings are marked | The text's own inferences are separated from transmission with the phrase "I record this as my own reading" |

The checking tools in this repository verify **structure** (is every verse
treated, do the references resolve), **not correctness**. No machine can tell
you whether an explanation is sound.

---

## Content

| Path | What |
|---|---|
| `tafsir/NNN-name.md` | 114 files — the single source, one file per sūra |
| `tafsir-en/NNN-name.md` | The English version of the same 114 files; file names, verse numbers and Arabic text are identical |
| `STYLE.md` · `STYLE-en.md` | The binding method and style rules |
| `TRANSLATION.md` | The Turkish → English translation guide |
| `INDEX.md` | The index and the links drawn between sūras |

Verse numbering does not count the basmala (in al-Fātiḥa, 1 = *al-ḥamdu
lillāh*). Section headings take the form `## <sūra>/<verse> — <Arabic text>`.

---

## The site

Next.js (App Router). The Markdown is read at build time and every page is
generated statically. The only thing that runs on the server is
`middleware.ts`: on `/` alone, it decides whether to open in Turkish or
English based on the visitor's language. No other URL touches the server.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 12,462 pages (both languages), ~50 s
npm start
```

### Two languages

Turkish is published at the root, English under `/en`. They are two separate
root layouts (`app/(tr)` and `app/(en)`); everything shared comes through
`lib/i18n.ts`.

| Turkish | English |
|---|---|
| `/` | `/en` |
| `/sure/9` | `/en/sura/9` |
| `/sure/9/113` | `/en/sura/9/113` (one section on its own page) |
| `/kok` · `/usul` | `/en/roots` · `/en/method` |
| `/hakkinda` · `/kosullar` · `/gizlilik` | `/en/about` · `/en/terms` · `/en/privacy` |
| `/parca/9/113` | `/en/section/9/113` (the fragment the citation modal fetches) |

Verse anchors (`#9/114`) are the same in both languages: the language link in
the top bar opens the verse you are reading in the other language. Paragraph
anchors are derived from the content, so they are language-specific. Reading
position is kept separately too — `tefsir:pos:*` for Turkish,
`tefsir:en:pos:*` for English.

The sūra name is taken from the file's title: Turkish trims the trailing
*Sûresi* (`Bakara Sûresi` → **Bakara**), English the leading *Sūrat*
(`Sūrat al-Baqara` → **al-Baqara**).

### Entry language

`/` opens in the visitor's language. The order is: explicit choice (cookie) →
browser language (`Accept-Language`) → default (Turkish). Only `/` redirects;
every other URL is served as asked for, so arriving at `/sure/2` from a search
result never throws you elsewhere. The cookie is written only when the
language link in the top bar is clicked.

### Link scheme

Every line and every verse can be shared on its own:

| Link | Where it goes |
|---|---|
| `/sure/9` | The start of the sūra |
| `/sure/9/113` | The section starting at verse 113, on its own page |
| `/sure/9#9/114` | Verse 114 — to whichever section treats it |
| `/sure/9#9/113-116` | The section itself |
| `/sure/9#b0r19phq` | A single paragraph, table or heading |

Verse links are defined for **all** 6,236 verses. Paragraph links are derived
from a hash of the content: they are stable as long as that paragraph's text
does not change, and editing the text breaks the old link.

### Citations

Both citation forms in the text are linked automatically:

| In the text | Becomes |
|---|---|
| `` `056-vakia.md` 56/25 `` | **Vâkıa 56/25** → `/sure/56#56/25` |
| `` `019-meryem.md` `` | **Meryem** → `/sure/19` |
| `9/122`, `(51/54)`, `2/196-203` inside a sentence | links to the same verse; stays within the page if it is the same sūra |

**23,892** links in total (10,795 file citations + 13,097 bare verse
references); every target is verified after the build.

Fractions in inheritance shares (`1/2`, `1/4`, `1/8`) are not linked: if a
whole table cell is a fraction it does not count as a verse reference.
Invalid numbers (`1/8`, say — al-Fātiḥa has 7 verses) are filtered out anyway.

### The citation modal

Clicking a citation does not take you off the page: the target section opens
in a modal and your place is kept. Citations inside the modal open in the
modal too (leaving a trail at the top, so you can go back). At the bottom are
"Open in the sūra" and "Share".

- The back button closes the modal rather than leaving the page (so do Esc and
  a click on the backdrop).
- Cmd/Ctrl-click, middle click and "open in new tab" keep their normal
  behaviour.
- With JavaScript off the links keep working as plain navigation.

The content comes from `/parca/<sūra>/<section>`: 2,996 sections are generated
separately at build time (median 7 KB, largest 44 KB), so the whole page is
never downloaded.

### Reading position

Where you are reading is written to `localStorage` (`tefsir:pos:<sūra>`,
`tefsir:last`) — but **only once reading has actually begun**: 25 seconds on
the page, or moving from the verse section you landed on to another one. A
page you merely dropped by does not overwrite your place. Reopening the page
returns you to it; the home page shows a "Where you left off" card. Nothing is
sent to a server.

### Search and AI crawlers

`app/sitemap.ts` publishes 6,232 URLs with `tr` / `en` / `x-default`
alternates; `app/robots.ts` keeps the JSON fragment routes out of the crawl
and lists the AI crawlers explicitly (all of them allowed, on purpose).
`/llms.txt` carries a summary and the disclaimer. The full account, including
the trade-offs and known limits, is in `SEO.md`.

---

## Checks

```bash
python3 check.py          # verse coverage — any verse left untreated
python3 check.py refs     # do the file citations resolve
python3 check.py verses   # are the verse references in range
python3 check.py bold     # nested bold emphasis that breaks rendering

python3 check.py --dir tafsir-en   # the same checks against the translation
```

These check the **structure** of the text: that every verse is treated, that
the references given exist and stay in range. They do not check whether the
content is correct.

---

## Note

`build.py` + `template.html` is the old single-page HTML generator; it still
works (`site/index.html`), but the site is now generated by Next.
