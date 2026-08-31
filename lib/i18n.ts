// A bilingual publication: Turkish at the root (/), English under /en.
// Single source of truth: route names and interface strings live here; pages
// and client components only carry the language.

export type Lang = "tr" | "en";
export const LANGS: Lang[] = ["tr", "en"];

/** Route roots per language. The English segments are named in English too. */
export const ROUTES = {
  tr: {
    home: "/",
    sura: "/sure",
    part: "/parca",
    roots: "/kok",
    method: "/usul",
    about: "/hakkinda",
    terms: "/kosullar",
    privacy: "/gizlilik",
  },
  en: {
    home: "/en",
    sura: "/en/sura",
    part: "/en/section",
    roots: "/en/roots",
    method: "/en/method",
    about: "/en/about",
    terms: "/en/terms",
    privacy: "/en/privacy",
  },
} as const;

export const REPO = "https://github.com/muhammeddilaver/llm-tefsir-project";

/**
 * The explicit language choice. middleware.ts reads it on "/"; it is written
 * only when the language link in the top bar is clicked. A cookie rather than
 * localStorage, because middleware cannot see localStorage.
 */
export const LANG_COOKIE = "tefsir-lang";

/** localStorage prefix. The Turkish keys stay as they were in the old version. */
export const NS: Record<Lang, string> = { tr: "tefsir:", en: "tefsir:en:" };

export const LOCALE: Record<Lang, string> = { tr: "tr-TR", en: "en-GB" };
export const OG_LOCALE: Record<Lang, string> = { tr: "tr_TR", en: "en_GB" };

export const SITE = "LLM Tefsir Project";

type Dict = {
  navRoots: string;
  navMethod: string;
  navAbout: string;
  navTerms: string;
  navPrivacy: string;
  langSwitch: string;
  langSwitchLabel: string;
  footNote: string;

  metaTitle: string;
  metaTemplate: string;
  metaDesc: string;
  /** The sura page's title tag. The template appends " — LLM Tefsir Project". */
  suraSeoTitle: (name: string) => string;
  /** The sura page's description; clamp() in lib/meta.ts trims it. */
  suraSeoDesc: (name: string, ayahs: number, lead: string) => string;
  /** The bottom line of the OG image — the authorship statement. */
  ogNote: string;

  // --- Section page (/sure/2/255) ---
  navHome: string;
  /** Citation form differs by language: Turkish "255. ayet", English "2:255". */
  secRange: (sura: number, from: number, to: number) => string;
  /** The page's h1. `title` is only filled for sections with a descriptive heading. */
  secHeading: (name: string, range: string, title: string) => string;
  secSeoTitle: (name: string, range: string, title: string) => string;
  secSeoDesc: (name: string, range: string, lead: string) => string;
  secMeta: (name: string, ayahs: number) => string;
  secWhole: (name: string) => string;
  secIndexTitle: (n: number) => string;
  secPrev: string;
  secNext: string;
  /**
   * The coordinate line. Language models take the page in chunks, and a chunk
   * has to answer "which book, which sura, which verse" on its own. Before
   * this, the word "Kur'an" appeared nowhere in the page's visible text and
   * the sura number only inside the "2/255" label.
   */
  coords: (sura: number, name: string, tail: string) => string;
  /** The tail of the coordinate line: the sura number is already up front. */
  secVerses: (from: number, to: number) => string;
  /** A short authorship note: the footer disclaimer only reaches the last chunk. */
  chunkNote: string;
  secRoots: string;

  heroTitle: string;
  heroLead: string;
  /** Three parts: text — a /usul link — text. The page assembles the JSX. */
  heroDisclaimerA: string;
  heroDisclaimerLink: string;
  heroDisclaimerB: string;
  heroTip: string;
  statSuras: string;
  statAyahs: string;

  filterPlaceholder: string;
  filterLabel: string;
  noMatch: string;
  ayahCountShort: (n: number) => string;

  suraMeta: (ayahs: number, sections: number) => string;
  jumpToAyahs: string;
  prevLabel: string;
  nextLabel: string;

  rootsTitle: string;
  rootsMeta: (n: number) => string;
  rootsHits: (n: number) => string;

  methodTitle: string;
  methodMeta: string;

  shareLine: string;
  continueKicker: string;
  continueGo: string;
  today: string;
  yesterday: string;
  daysAgo: (n: number) => string;

  resumedAt: (label: string) => string;
  resumed: string;
  backToTop: string;
  linkCopied: string;

  peekFallbackTitle: string;
  peekNotFound: string;
  peekLoading: string;
  peekFailed: string;
  peekShare: string;
  peekOpen: string;
  peekClose: string;
  peekBack: string;
};

export const T: Record<Lang, Dict> = {
  tr: {
    navRoots: "Kök dizini",
    navMethod: "Usul",
    navAbout: "Hakkında",
    navTerms: "Kullanım koşulları",
    navPrivacy: "Gizlilik",
    langSwitch: "English",
    langSwitchLabel: "Switch to English",
    footNote:
      "Metnin tamamı bir dil modeli (Claude, Anthropic) tarafından yazılmıştır. Dinî otoritesi yoktur; klasik kaynaklardan doğrulanmalıdır.",

    metaTitle: "LLM Tefsir Project — ayet ayet Kur'an tefsiri",
    metaTemplate: "%s — LLM Tefsir Project",
    metaDesc:
      "Claude ile yazılmış, ayet ayet kök tahlili esaslı Türkçe Kur'an tefsiri. 114 sûrenin tamamı.",
    suraSeoTitle: (name) => `${name} Sûresi Tefsiri`,
    suraSeoDesc: (name, ayahs, lead) =>
      `${name} sûresi (${ayahs} ayet) — ayet ayet, kök tahlili esaslı tefsir. ${lead}`,
    ogNote: "Metnin tamamı Claude (Anthropic) tarafından yazıldı.",

    navHome: "Ana sayfa",
    secRange: (_s, from, to) => (from === to ? `${from}. ayet` : `${from}-${to}. ayetler`),
    secHeading: (name, range, title) =>
      title ? `${name} ${range} — ${title}` : `${name} ${range}`,
    secSeoTitle: (name, range, title) =>
      title ? `${name} ${range} — ${title}` : `${name} ${range} tefsiri`,
    secSeoDesc: (name, range, lead) =>
      `${name} sûresi ${range} — kök tahlili esaslı tefsir. ${lead}`,
    secMeta: (name, ayahs) => `${name} sûresi · ${ayahs} ayet`,
    secWhole: (name) => `${name} sûresinin tamamı`,
    secIndexTitle: (n) => `${n} bölüm`,
    secPrev: "Önceki bölüm",
    secNext: "Sonraki bölüm",
    coords: (sura, name, tail) => `Kur'an · ${sura}. sûre: ${name} · ${tail}`,
    secVerses: (from, to) => (from === to ? `${from}. ayet` : `${from}-${to}. ayetler`),
    chunkNote:
      "Bu tefsiri Claude (Anthropic) yazdı; dinî otoritesi yoktur, klasik kaynaklardan doğrulanmalıdır.",
    secRoots: "Bu bölümde çözümlenen kökler",

    heroTitle: "Ayet ayet Kur'an tefsiri",
    heroLead:
      "Kur'an'ın tamamı: her sûre, her ayet. Kelimeler köklerine kadar açılıyor; müfessirler ayrıldığında ihtilaf gizlenmiyor, tablo hâlinde veriliyor.",
    heroDisclaimerA:
      "Metnin tamamı Claude (Anthropic) tarafından yazılmıştır; klasik tefsir literatürünün yerine geçmez, önemli konularda kaynaklarından doğrulanmalıdır. Uygulanan kurallar için ",
    heroDisclaimerLink: "Usul",
    heroDisclaimerB: " sayfasına bakınız.",
    heroTip:
      "Her satırın yanındaki bağlantı işaretine dokunarak o satırı paylaşabilirsiniz. Kaldığınız yer tarayıcınızda saklanır.",
    statSuras: "sûre",
    statAyahs: "ayet",

    filterPlaceholder: "Sûre ara — ad ya da numara",
    filterLabel: "Sûre ara",
    noMatch: "Eşleşme yok.",
    ayahCountShort: (n) => `${n} ayet`,

    suraMeta: (a, s) => `${a} ayet · ${s} bölüm`,
    jumpToAyahs: "Ayetlere git",
    prevLabel: "Önceki sûre",
    nextLabel: "Sonraki sûre",

    rootsTitle: "Kök dizini",
    rootsMeta: (n) => `Metin boyunca çözümlenen ${n} kök. Her bağlantı, kökün işlendiği bölüme gider.`,
    rootsHits: (n) => `${n} yer`,

    methodTitle: "Usul ve üslup",
    methodMeta: "Metnin tamamında bağlayıcı olan kurallar.",

    shareLine: "Bu satırı paylaş",
    continueKicker: "Kaldığınız yer",
    continueGo: "okumaya devam et →",
    today: "bugün",
    yesterday: "dün",
    daysAgo: (n) => `${n} gün önce`,

    resumedAt: (label) => `Kaldığınız yer: ${label}`,
    resumed: "Kaldığınız yere dönüldü",
    backToTop: "başa dön",
    linkCopied: "Bağlantı kopyalandı",

    peekFallbackTitle: "Atıf",
    peekNotFound: "Bulunamadı",
    peekLoading: "Yükleniyor…",
    peekFailed: "Bu bölüm getirilemedi.",
    peekShare: "Paylaş",
    peekOpen: "Sûrede aç →",
    peekClose: "Kapat",
    peekBack: "Önceki atıfa dön",
  },

  en: {
    navRoots: "Root index",
    navMethod: "Method",
    navAbout: "About",
    navTerms: "Terms of use",
    navPrivacy: "Privacy",
    langSwitch: "Türkçe",
    langSwitchLabel: "Türkçe sürüme geç",
    footNote:
      "The whole text was written by a language model (Claude, Anthropic). It carries no religious authority and must be checked against the classical sources.",

    metaTitle: "LLM Tefsir Project — a verse-by-verse commentary on the Qurʾān",
    metaTemplate: "%s — LLM Tefsir Project",
    metaDesc:
      "A verse-by-verse English commentary on the Qurʾān written with Claude, built on root analysis. All 114 sūras.",
    suraSeoTitle: (name) => `Sūrat ${name} Commentary`,
    suraSeoDesc: (name, ayahs, lead) =>
      `Sūrat ${name} (${ayahs} verses) — a verse-by-verse commentary built on root analysis. ${lead}`,
    ogNote: "The whole text was written by Claude (Anthropic).",

    navHome: "Home",
    secRange: (sura, from, to) => (from === to ? `${sura}:${from}` : `${sura}:${from}-${to}`),
    secHeading: (name, range, title) =>
      title ? `${name} ${range} — ${title}` : `${name} ${range}`,
    secSeoTitle: (name, range, title) =>
      title ? `${name} ${range} — ${title}` : `${name} ${range} commentary`,
    secSeoDesc: (name, range, lead) =>
      `${name} ${range} — a commentary built on root analysis. ${lead}`,
    secMeta: (name, ayahs) => `Sūrat ${name} · ${ayahs} verses`,
    secWhole: (name) => `The whole of Sūrat ${name}`,
    secIndexTitle: (n) => `${n} sections`,
    secPrev: "Previous section",
    secNext: "Next section",
    coords: (sura, name, tail) => `The Qurʾān · Sūra ${sura}: ${name} · ${tail}`,
    secVerses: (from, to) => (from === to ? `verse ${from}` : `verses ${from}-${to}`),
    chunkNote:
      "This commentary was written by Claude (Anthropic); it carries no religious authority and should be checked against the classical sources.",
    secRoots: "Roots analysed in this section",

    heroTitle: "A verse-by-verse commentary on the Qurʾān",
    heroLead:
      "The whole Qurʾān: every sūra, every verse. Words are opened down to their roots; where the commentators divide, the disagreement is not hidden but set out in a table.",
    heroDisclaimerA:
      "The whole text was written by Claude (Anthropic). It does not stand in for the classical commentary literature, and on anything that matters it should be checked against the sources. For the rules it follows, see the ",
    heroDisclaimerLink: "Method",
    heroDisclaimerB: " page.",
    heroTip:
      "Tap the link mark beside any line to share that line. Where you left off is kept in your browser.",
    statSuras: "sūras",
    statAyahs: "verses",

    filterPlaceholder: "Find a sūra — by name or number",
    filterLabel: "Find a sūra",
    noMatch: "No match.",
    ayahCountShort: (n) => `${n} verses`,

    suraMeta: (a, s) => `${a} verses · ${s} sections`,
    jumpToAyahs: "Jump to a verse",
    prevLabel: "Previous sūra",
    nextLabel: "Next sūra",

    rootsTitle: "Root index",
    rootsMeta: (n) => `${n} roots analysed across the text. Each link goes to the section where the root is treated.`,
    rootsHits: (n) => `${n} places`,

    methodTitle: "Method and style",
    methodMeta: "The rules that bind the whole text.",

    shareLine: "Share this line",
    continueKicker: "Where you left off",
    continueGo: "carry on reading →",
    today: "today",
    yesterday: "yesterday",
    daysAgo: (n) => `${n} days ago`,

    resumedAt: (label) => `Where you left off: ${label}`,
    resumed: "Returned to where you left off",
    backToTop: "back to top",
    linkCopied: "Link copied",

    peekFallbackTitle: "Reference",
    peekNotFound: "Not found",
    peekLoading: "Loading…",
    peekFailed: "This section could not be fetched.",
    peekShare: "Share",
    peekOpen: "Open in the sūra →",
    peekClose: "Close",
    peekBack: "Back to the previous reference",
  },
};
