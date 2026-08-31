# SEO plan

Search visibility for a bilingual publication (`/` Turkish, `/en` English):
what the state was, what was done, and in what order.

Phases 1–3 and the GEO and entry-language work are complete. Phase 4 is
waiting on a domain.

---

## Where things stood

Already in place — the metadata layer built on `lib/meta.ts` was working:

| Present | Where |
|---|---|
| `metadataBase` (from the environment) | `lib/meta.ts` |
| Title template (`%s — LLM Tefsir Project`) | `rootMetadata()` |
| Description, separate per language | `T[lang].metaDesc` |
| `canonical` + `hreflang` (tr/en) | Home, sūra pages, five static pages |
| OpenGraph basics | `rootMetadata()` |
| `lang="ar"` + `dir="rtl"` on Arabic | `lib/render.ts` |
| Fully static generation, no server | Next App Router |

Missing:

| Absent | Consequence |
|---|---|
| `app/sitemap.ts` | None of the pages were declared through a sitemap |
| `app/robots.ts` | No crawl guidance; the `/parca` JSON routes were crawled too |
| `public/` directory | No favicon, no apple-touch-icon, no manifest |
| OG image | An empty card when shared |
| `x-default` hreflang | No default for a visitor of unknown language |
| JSON-LD | Breadcrumbs, authorship and the work's relations were not machine-readable |
| Section-level pages | 6,236 verse commentaries buried as anchors inside 114 pages |

---

## The real problem: 6,236 verses, 114 pages

The value of this site is at verse level, and so is the search demand —
"bakara 255 tefsiri", "ayetel kürsi anlamı", "surah baqara 255 commentary".
What answered those queries was al-Baqara's single 286-verse page, carrying
one title tag and standing no chance in any verse-level query.

The fix was to give the sections their own addresses. The infrastructure was
already there: `lib/sections.ts` extracts the sections, `section()` in
`lib/content.ts` returns one, and the `/parca` route already generated exactly
those sections statically. What remained was to publish the same data as pages.

### Scale

| | TR | EN |
|---|---|---|
| Home | 1 | 1 |
| Sūra page | 114 | 114 |
| **Section page (new)** | **2,996** | **2,996** |
| Static page | 5 | 5 |
| **Total indexable** | **3,116** | **3,116** |

The section headings are identical in both languages (3,003 headings, zero
differences) — the `/sure/2/255` ↔ `/en/sura/2/255` pairing was verified, so
hreflang is safe.

### URL scheme

| URL | What |
|---|---|
| `/sure/2` | al-Baqara — hub: lead-in, section index, links to 166 sections |
| `/sure/2/255` | The Throne Verse section — its own title, description, canonical |
| `/en/sura/2/255` | The same in English |
| `/sure/2#2/255` | **Kept** — stays an anchor inside the hub, not a redirect |

The existing 23,892 internal links and any shared `#2/255` anchors are
untouched. Section pages are an additional surface; the old one stands.

---

## Phases

### Phase 1 — technical foundation ✅ done

1. **`app/sitemap.ts`** — every URL in both languages, each entry carrying its
   `tr` / `en` / `x-default` counterparts.

   `lastModified` was **deliberately omitted.** The plan called for the `.md`
   files' mtime, but that value is meaningless in the deployed environment:
   Vercel re-fetches the repository on every build, so every file carries the
   same timestamp and every page looks like it changed today. A wrong
   `lastmod` is worse than none — once a search engine stops trusting it, it
   ignores the date signal for the whole sitemap. The correct date only exists
   in git history, which is not reliably available at build time.
2. **`app/robots.ts`** — `/parca/` and `/en/section/` (the JSON routes, 5,992
   URLs) disallowed; sitemap and host declared.
3. **`x-default`** — `alternates()` in `lib/meta.ts` points it at the Turkish
   version; every page carries three `hreflang` tags.
4. **Icons** — `app/icon.svg` (the rub el hizb ۞, the Qurʾān's own section
   mark), `app/apple-icon.tsx` (180×180 PNG generated at build with
   `next/og`), `app/manifest.ts`. No `public/` directory was needed.
5. **OG image** — one per language, through `lib/og.tsx`. No font is fetched
   (the build makes no network request).

   > **Watch out:** if a page declares its own `openGraph` block, Next
   > replaces the one inherited from the root layout **entirely** —
   > `og:image`, `og:site_name` and `og:locale` all drop out. That is why
   > `suraMetadata()` declares no `openGraph`: `og:title` comes from the title
   > and `og:description` from the description field. When adding a page, mind
   > the same trap: if you write `openGraph`, you must add the image yourself.
6. **Title tags** — language-specific patterns added to `lib/i18n.ts`, so the
   two languages are no longer forced through one English shape.

   | Page | Before | After |
   |---|---|---|
   | `/sure/2` | `Bakara — LLM Tefsir Project` | `Bakara Sûresi Tefsiri — LLM Tefsir Project` |
   | `/en/sura/2` | `al-Baqara — LLM Tefsir Project` | `Sūrat al-Baqara Commentary — LLM Tefsir Project` |

   Descriptions are trimmed at a word boundary by `clamp()` (it used to be
   `slice(0, 180)`, which split words). Four pages had no description of their
   own (`/kok`, `/usul`, `/en/roots`, `/en/method`) and were all repeating the
   root description; they were given their own.

### Phase 2 — section pages ✅ done

The centre of gravity. 2,996 section pages per language; 12,462 pages in
total, ~50 s build.

1. **`app/(tr)/sure/[no]/[start]/page.tsx`** and its English counterpart —
   `generateStaticParams` produces the same list as the `/parca` route.
2. **Metadata per page** — title, description (from the section's first plain
   paragraph), `canonical` and `hreflang`. All 5,992 section pages have unique
   titles and descriptions.
3. **Internal linking** — previous/next section, a breadcrumb back to the
   sūra, and the roots analysed in that section.
4. **The sūra page became a hub** — a section index with titles now sits at
   the end of the page, so all sections are crawlable with descriptive anchor
   text. The in-page "jump to a verse" list was left as it was; the two serve
   different purposes.
5. **JSON-LD** — `Article` + `BreadcrumbList` on section and sūra pages,
   `WebSite` on the home pages. Authorship is modelled honestly: see below.

#### Two traps found in Phase 2

**Two headings starting at the same verse.** In seven places the source has
this shape:

```
## 7/46-49 — A'râf ehli        ← group lead-in
## 7/46-47 — <Arabic>          ← body, starts at the same verse
```

`section()` cut at the first, so `/sure/7/46` showed only the lead-in
paragraph and the verse itself was missing from the section-page surface
entirely. Because both entries also sat in `sections` separately, the same URL
entered the sitemap twice. Headings starting at the same verse are now merged
into one page, and every place that generates pages uses `sectionStarts()`.

**Arabic meta descriptions.** In sections with a descriptive heading the verse
itself arrives as its own paragraph, and `lead` was picking it up — 26 pages
had a meta description that was Arabic from start to finish. `lead` now skips
Arabic-dominant paragraphs. One page still slips through, where a Latin
transliteration drops the Arabic ratio below the threshold; 1 in 2,996, not
worth chasing with a more aggressive heuristic that would drop legitimate
paragraphs.

### Phase 3 — speed and presentation ✅ done

1. **Fonts served from our own origin.** All four families are now downloaded
   at build time with `next/font/google`; **not a single request to
   `fonts.googleapis.com` remains**. The render-blocking stylesheet and the
   connection setup to two extra origins (DNS + TLS) are gone.

   The naive version would have been a regression — preloading every subset of
   all four families cost **565 KB across 10 files** on the home page, whereas
   the old Google Fonts setup only downloaded what was needed thanks to
   `unicode-range`. Four decisions brought it to **258 KB across 4 files**:

   | Decision | Saved |
   |---|---|
   | Dropped Amiri 700 — none of the four Arabic rules asks for bold | 2 files |
   | Dropped IBM Plex Sans 500 — it appeared in no rule | 2 files |
   | Amiri `preload: false` — the home page, root index and static pages contain no Arabic; `unicode-range` still fetches it where needed | ~200 KB |
   | IBM Plex Sans `preload: false` — top bar and meta lines, never the LCP element | 64 KB |

   Only the body (Literata) and heading (Petrona) faces are preloaded now.

   > **A lever left unpulled:** Literata's `opsz` axis alone accounts for
   > 194 KB of the preload. Dropping the axis saves **another 103 KB**
   > (258 → 155 KB). The axis looked like a deliberate choice — the previous
   > Google Fonts URL asked for `opsz,wght@7..72` — so it was left alone. The
   > optical-size difference at 17 px body text is very slight; to take the
   > saving, delete the `axes: ["opsz"]` line in `components/Fonts.tsx`.

2. **Page weight** — solved by the section pages: in a long sūra a reader
   arriving from a search result downloads one section instead of all 166.
3. **One OG image per sūra** — 228 images (`next/og`). Section pages inherit
   the image from their parent segment, so there was no need to render one for
   each of the 5,992; it added ~7 s to the build.
4. **Breadcrumbs** were added to `/kok`, `/usul`, `/en/roots` and
   `/en/method` as well. Terms and privacy were left out — they are not search
   targets.

### Phase 4 — after launch ⏸ waiting on a domain

1. Register in Search Console and Bing Webmaster Tools as one property
   (`/` and `/en` together, separated by hreflang).
2. Submit the sitemap, and use **IndexNow** — natural crawling of a new
   6,232-URL site takes months; IndexNow speeds up the Bing/Yandex side.
3. Revise titles and descriptions once query data arrives. For the first three
   months watch **indexation rate**, not rankings.

---

## What has to be said plainly

This text was written by a language model, and the site does not hide it.
Religious content is one of the areas where Google weighs author expertise
(E-E-A-T) most strictly. Technical SEO does not change that:

- Competing head-to-head with the institutional authority of established
  commentary sites is not a realistic goal.
- The realistic goal is the **long tail**: individual verses, root analyses,
  the links between sūras. That is where this site differs — all 6,236 verses
  treated at root level, with disagreements set out in tables, is a surface
  not easily found elsewhere.
- The disclaimer (`Usul`, `Hakkında`) is not something to hide for SEO; it
  should be structured and brought forward: a clear authorship statement, a
  method page, contact. Here honesty is both right and in our favour in a
  rater's eyes.

`/kok` (the root index) is especially valuable for this reason: it is both a
genuine reader need and the widest internal-link hub into the 2,996 section
pages.

---

## GEO — appearing in LLM answers ✅ done

Most of what is sold under this heading has no evidence behind it. The part
that genuinely works is this: language models take a page in **chunks**, and a
chunk is only useful if it makes sense on its own.

### Already in place

Opening the section pages in Phase 2 had, without our noticing, done GEO's
most expensive job: 2,996 section pages are exactly the right citation unit —
one verse, one subject, its own heading and a permanent address. On top of
that, static HTML (no JavaScript required), clean URLs,
`WebSite`/`Article`/`BreadcrumbList` markup and a 6,232-URL sitemap were
already there.

### The gap that was closed

The word "Kur'an" **appeared nowhere in the visible text** of a section page,
and the sūra number only inside the `2/255` label. A chunk saying "Bakara 255.
ayet" had little chance of matching a "Kur'an 2:255" query. Every sūra and
section page now carries its coordinates in plain prose:

| | |
|---|---|
| `/sure/2/255` | Kur'an · 2. sûre: Bakara · 255. ayet |
| `/en/sura/2/255` | The Qurʾān · Sūra 2: al-Baqara · verse 255 |
| `/sure/2` | Kur'an · 2. sûre: Bakara · 286 ayet · 166 bölüm |

### The disclaimer now travels with the chunk

The authorship note used to live only in the page footer; when a long page is
split into chunks, the middle ones travelled without it. A short note
(`.chunk-note`) now sits just under the heading on sūra and section pages.
This is not an SEO trick: it is the text's own statement about itself, and it
should go wherever the text is quoted.

### Internal linking

- Section pages now list the roots analysed in that section and link to the
  root index.
- The 400 roots in the index were given anchors (`/kok#<root>`).
- Root hits now go to **the section's own page** instead of an anchored sūra
  page — 400 roots × their hits, a new web of links into the section pages.

### robots.txt

Crawler policy: **everything allowed**, both the citing/searching bots
(OAI-SearchBot, Claude-SearchBot, PerplexityBot, ChatGPT-User) and the
training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot). They were
already allowed under `*`; they are written out in `app/robots.ts` to document
the intent, so there is one place to edit if the policy changes.

### llms.txt — no evidence, added anyway

`/llms.txt` (proposed September 2024): a site summary, the disclaimer in both
languages, a map of the structure and a list of the 114 sūras. **No major
provider has confirmed using it**; Google's John Mueller compared it to the
keywords meta tag. It is here because it costs next to nothing, not because
the benefit is proven. The real work is done by the sitemap and the pages.

### What has to be said

This text carries no religious authority and may contain errors. A language
model citing it as a source of tafsir amplifies exactly the risk the site
warns about. The crawler policy was left open deliberately; that is why having
the authorship note in every chunk is not a technical detail but a consequence
of that decision.

---

## Entry language detection ✅ done

`/` now opens in the visitor's language. The order is:

**explicit choice (cookie) → browser language (Accept-Language) → default (Turkish)**

### Only `/` redirects

The trap here is a large one and was avoided on purpose. If someone reached
`/sure/2` from a search result, that is the page they wanted; throwing them to
`/en/sura/2` because their browser is English overrides an explicit choice —
precisely the case Google warns about for language redirects. `/en` is not
redirected either: a link to it was clicked.

| URL | Behaviour |
|---|---|
| `/` | Stays, or 307 to `/en`, depending on language |
| `/en`, `/sure/…`, `/en/sura/…`, static pages | **Never redirected** |

### The cookie is written only on an explicit choice

Clicking the language link in the top bar writes `tefsir-lang` for a year.
Detection alone leaves no cookie — otherwise a one-off browser setting would
become permanent. A cookie rather than localStorage, because middleware cannot
see localStorage.

### Googlebot

Googlebot sends no `Accept-Language` → negotiation returns `null` → no
redirect, and `/` is always crawled in Turkish. `/en` is already found through
hreflang, the sitemap and the link in the top bar. **Bots are not singled
out** — that would be cloaking.

### Cases verified

Tested against a live server, q-ordering included:

| Accept-Language | Cookie | Result |
|---|---|---|
| (none — Googlebot) | — | 200 Turkish |
| `tr-TR,tr;q=0.9,en;q=0.8` | — | 200 Turkish |
| `en-US,en;q=0.9` | — | 307 → `/en` |
| `de-DE,de;q=0.9,en;q=0.8` | — | 307 → `/en` (English as fallback) |
| `de-DE` (unsupported) | — | 200 Turkish (default) |
| `ar-SA,ar;q=0.9` | — | 200 Turkish (default) |
| `en;q=0.5,tr;q=0.9` | — | 200 Turkish (q wins, not order) |
| `tr;q=0.3,en;q=0.7` | — | 307 → `/en` |
| `en-US` | `tr` | 200 Turkish (explicit choice overrides) |
| `tr-TR` | `en` | 307 → `/en` |

Verified end to end in a real browser as well: in a session whose browser
language is `en-US`, `/` stops redirecting after switching to Turkish through
the language link.

### Known limit: `Vary` on `/`

`/` returns two different responses, but Next publishes it with
`Cache-Control: s-maxage=31536000` and **no** `Vary: Accept-Language`. `Vary`
could be set on the redirect; it could not be set on the 200 that continues to
the Turkish page — on a prerendered static page Next discards both middleware
and `next.config` headers (both were tried, both dropped; the non-working
configuration was not left behind).

This causes no harm on Vercel: for a path matching the matcher, middleware
runs before the CDN cache is consulted, so the cached Turkish page only ever
reaches requests middleware judged to be Turkish. **But if another CDN is put
in front of Vercel** (Cloudflare, say), `/` reaches it with no `Vary` and a
one-year lifetime; if the first visitor is Turkish, every English visitor gets
the Turkish page too. Should that day come, `/` must either vary on
`Accept-Language` there or not be cached at all.

### The site is no longer fully static

`middleware.ts` runs on `/` alone; the other 12,461 pages still never touch
the server. The README was updated to match.

---

## Domain

The published address is not decided yet. Every absolute URL comes from one
place:

```
lib/meta.ts → NEXT_PUBLIC_SITE_URL ?? VERCEL_PROJECT_PRODUCTION_URL
```

Once the domain is settled, only `NEXT_PUBLIC_SITE_URL` needs defining;
canonical, hreflang, sitemap and OG addresses correct themselves. Publishing
on a Vercel subdomain until then is fine — but it is cleaner **not** to
register in Search Console before the move and to do it afterwards, since an
address change delays re-crawling.

---

## Order of work

| # | Task | Depends on | Impact |
|---|---|---|---|
| 1 | ~~sitemap + robots + x-default~~ ✅ | — | High |
| 2 | ~~Icons + OG + title patterns~~ ✅ | — | Medium |
| 3 | ~~Section pages + metadata~~ ✅ | — | **Highest** |
| 4 | ~~JSON-LD + breadcrumbs~~ ✅ | 3 | Medium |
| 5 | ~~Internal linking + hub~~ ✅ | 3 | High |
| 6 | ~~Fonts on our own origin~~ ✅ | — | Medium (CWV) |
| 7 | Search Console + IndexNow | Domain | High |
