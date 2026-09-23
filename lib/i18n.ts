// A trilingual publication: Turkish at the root (/), English under /en,
// Indonesian under /id. Single source of truth: route names and interface
// strings live here; pages and client components only carry the language.
//
// Turkish is the source of record; the other two are translations of it.
// Adding a language means: a branch in this file, a route group under app/,
// a source folder (tafsir-<lang>/) and a method file (STYLE-<lang>.md).

export type Lang = "tr" | "en" | "id";
export const LANGS: Lang[] = ["tr", "en", "id"];

/** The language the text was written in: hreflang x-default points here. */
export const SOURCE_LANG: Lang = "tr";

/** Route roots per language. Each language names its own segments. */
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
  id: {
    home: "/id",
    sura: "/id/surah",
    part: "/id/bagian",
    roots: "/id/akar",
    method: "/id/metode",
    about: "/id/tentang",
    terms: "/id/ketentuan",
    privacy: "/id/privasi",
  },
} as const;

export const REPO = "https://github.com/muhammeddilaver/tafsir-lab";

/** Baglantilarda gosterilen etiket: adres tek yerde dursun. */
export const REPO_LABEL = REPO.replace(/^https:\/\//, "");

/**
 * The explicit language choice. middleware.ts reads it on "/"; it is written
 * only when the language link in the top bar is clicked. A cookie rather than
 * localStorage, because middleware cannot see localStorage.
 */
export const LANG_COOKIE = "tefsir-lang";

/** localStorage prefix. The Turkish keys stay as they were in the old version. */
export const NS: Record<Lang, string> = { tr: "tefsir:", en: "tefsir:en:", id: "tefsir:id:" };

export const LOCALE: Record<Lang, string> = { tr: "tr-TR", en: "en-GB", id: "id-ID" };
export const OG_LOCALE: Record<Lang, string> = { tr: "tr_TR", en: "en_GB", id: "id_ID" };

/**
 * The name of each language in itself, for the switcher in the top bar. With
 * three languages the switcher can no longer say "the other one": it lists
 * every language but the current, so the label has to belong to the target,
 * not to the page. The short form is what narrow screens show.
 */
export const LANG_NAME: Record<Lang, string> = {
  tr: "Türkçe",
  en: "English",
  id: "Indonesia",
};
export const LANG_ABBR: Record<Lang, string> = { tr: "TR", en: "EN", id: "ID" };

export const SITE = "Tafsir Lab";

type Dict = {
  navRoots: string;
  navMethod: string;
  navAbout: string;
  navTerms: string;
  navPrivacy: string;
  /** aria-label for one switcher link; `name` is the target language. */
  langSwitchLabel: (name: string) => string;
  footNote: string;

  metaTitle: string;
  metaTemplate: string;
  metaDesc: string;
  /** The sura page's title tag. The template appends " — Tafsir Lab". */
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

  /**
   * The consent bar and the switch on the privacy page. One decision covers
   * the site, so every language phrases the same choice.
   */
  consentAria: string;
  consentText: string;
  consentAccept: string;
  consentDecline: string;
  consentMore: string;
  consentStatusOn: string;
  consentStatusOff: string;
  consentTurnOn: string;
  consentTurnOff: string;
};

export const T: Record<Lang, Dict> = {
  tr: {
    navRoots: "Kök dizini",
    navMethod: "Usul",
    navAbout: "Hakkında",
    navTerms: "Kullanım koşulları",
    navPrivacy: "Gizlilik",
    langSwitchLabel: (name) => `${name} sürümüne geç`,
    footNote:
      "Metnin tamamı bir dil modeli (Claude, Anthropic) tarafından yazılmıştır. Dinî otoritesi yoktur; klasik kaynaklardan doğrulanmalıdır.",

    metaTitle: "Tafsir Lab — ayet ayet Kur'an tefsiri",
    metaTemplate: "%s — Tafsir Lab",
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

    consentAria: "Ölçümleme onayı",
    consentText:
      "Sitenin nasıl okunduğunu anlamak için Google Analytics kullanılıyor. Onay vermezseniz çerez yazılmaz; ölçüm çerezsiz ve kimliksiz kalır.",
    consentAccept: "Kabul et",
    consentDecline: "Çerezsiz devam et",
    consentMore: "Ayrıntı",
    consentStatusOn: "Şu an ölçümleme çerezlerine onay vermiş durumdasınız.",
    consentStatusOff:
      "Şu an ölçümleme çerezlerine onay vermiş değilsiniz; ölçüm çerezsiz yapılıyor.",
    consentTurnOn: "Onay ver",
    consentTurnOff: "Onayı geri al",
  },

  en: {
    navRoots: "Root index",
    navMethod: "Method",
    navAbout: "About",
    navTerms: "Terms of use",
    navPrivacy: "Privacy",
    langSwitchLabel: (name) => `Switch to ${name}`,
    footNote:
      "The whole text was written by a language model (Claude, Anthropic). It carries no religious authority and must be checked against the classical sources.",

    metaTitle: "Tafsir Lab — a verse-by-verse commentary on the Qurʾān",
    metaTemplate: "%s — Tafsir Lab",
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

    consentAria: "Analytics consent",
    consentText:
      "Google Analytics is used to see how the site is read. If you do not consent, no cookie is written; the measurement stays cookieless and anonymous.",
    consentAccept: "Accept",
    consentDecline: "Continue without cookies",
    consentMore: "Detail",
    consentStatusOn: "You have currently consented to analytics cookies.",
    consentStatusOff:
      "You have currently not consented to analytics cookies; the measurement is cookieless.",
    consentTurnOn: "Give consent",
    consentTurnOff: "Withdraw consent",
  },

  id: {
    navRoots: "Indeks akar kata",
    navMethod: "Metode",
    navAbout: "Tentang",
    navTerms: "Ketentuan penggunaan",
    navPrivacy: "Privasi",
    langSwitchLabel: (name) => `Beralih ke versi ${name}`,
    footNote:
      "Seluruh teks ini ditulis oleh sebuah model bahasa (Claude, Anthropic). Teks ini tidak memiliki otoritas keagamaan dan harus diperiksa terhadap sumber-sumber klasik.",

    metaTitle: "Tafsir Lab — tafsir Al-Qur'an ayat demi ayat",
    metaTemplate: "%s — Tafsir Lab",
    metaDesc:
      "Tafsir Al-Qur'an berbahasa Indonesia yang ditulis bersama Claude, berdasar analisis akar kata. Seluruh 114 surah.",
    suraSeoTitle: (name) => `Tafsir Surah ${name}`,
    suraSeoDesc: (name, ayahs, lead) =>
      `Surah ${name} (${ayahs} ayat) — tafsir ayat demi ayat berdasar analisis akar kata. ${lead}`,
    ogNote: "Seluruh teks ini ditulis oleh Claude (Anthropic).",

    navHome: "Beranda",
    // Indonesian cites a verse the way it is read aloud: "ayat 255",
    // "ayat 255-257". The sura number is carried by the coordinate line.
    secRange: (_s, from, to) => (from === to ? `ayat ${from}` : `ayat ${from}-${to}`),
    secHeading: (name, range, title) =>
      title ? `${name} ${range} — ${title}` : `${name} ${range}`,
    secSeoTitle: (name, range, title) =>
      title ? `${name} ${range} — ${title}` : `Tafsir ${name} ${range}`,
    secSeoDesc: (name, range, lead) =>
      `Surah ${name} ${range} — tafsir berdasar analisis akar kata. ${lead}`,
    secMeta: (name, ayahs) => `Surah ${name} · ${ayahs} ayat`,
    secWhole: (name) => `Seluruh Surah ${name}`,
    secIndexTitle: (n) => `${n} bagian`,
    secPrev: "Bagian sebelumnya",
    secNext: "Bagian berikutnya",
    coords: (sura, name, tail) => `Al-Qur'an · surah ke-${sura}: ${name} · ${tail}`,
    secVerses: (from, to) => (from === to ? `ayat ${from}` : `ayat ${from}-${to}`),
    chunkNote:
      "Tafsir ini ditulis oleh Claude (Anthropic); tidak memiliki otoritas keagamaan dan perlu diperiksa terhadap sumber-sumber klasik.",
    secRoots: "Akar kata yang dibahas dalam bagian ini",

    heroTitle: "Tafsir Al-Qur'an ayat demi ayat",
    heroLead:
      "Seluruh Al-Qur'an: setiap surah, setiap ayat. Kata dibuka sampai ke akarnya; ketika para mufasir berbeda pendapat, perbedaan itu tidak disembunyikan melainkan disajikan dalam tabel.",
    heroDisclaimerA:
      "Seluruh teks ini ditulis oleh Claude (Anthropic). Teks ini tidak menggantikan literatur tafsir klasik, dan untuk hal yang penting harus diperiksa terhadap sumbernya. Untuk aturan yang diikutinya, lihat halaman ",
    heroDisclaimerLink: "Metode",
    heroDisclaimerB: ".",
    heroTip:
      "Sentuh tanda tautan di samping sebuah baris untuk membagikan baris itu. Tempat Anda berhenti membaca disimpan di peramban Anda.",
    statSuras: "surah",
    statAyahs: "ayat",

    filterPlaceholder: "Cari surah — nama atau nomor",
    filterLabel: "Cari surah",
    noMatch: "Tidak ada yang cocok.",
    ayahCountShort: (n) => `${n} ayat`,

    suraMeta: (a, s) => `${a} ayat · ${s} bagian`,
    jumpToAyahs: "Lompat ke ayat",
    prevLabel: "Surah sebelumnya",
    nextLabel: "Surah berikutnya",

    rootsTitle: "Indeks akar kata",
    rootsMeta: (n) =>
      `${n} akar kata yang dibahas di sepanjang teks. Setiap tautan menuju bagian tempat akar itu dibahas.`,
    rootsHits: (n) => `${n} tempat`,

    methodTitle: "Metode dan gaya",
    methodMeta: "Aturan yang mengikat seluruh teks.",

    shareLine: "Bagikan baris ini",
    continueKicker: "Tempat Anda berhenti",
    continueGo: "lanjutkan membaca →",
    today: "hari ini",
    yesterday: "kemarin",
    daysAgo: (n) => `${n} hari lalu`,

    resumedAt: (label) => `Tempat Anda berhenti: ${label}`,
    resumed: "Kembali ke tempat Anda berhenti",
    backToTop: "kembali ke atas",
    linkCopied: "Tautan disalin",

    peekFallbackTitle: "Rujukan",
    peekNotFound: "Tidak ditemukan",
    peekLoading: "Memuat…",
    peekFailed: "Bagian ini tidak dapat diambil.",
    peekShare: "Bagikan",
    peekOpen: "Buka di dalam surah →",
    peekClose: "Tutup",
    peekBack: "Kembali ke rujukan sebelumnya",

    consentAria: "Persetujuan pengukuran",
    consentText:
      "Google Analytics digunakan untuk melihat bagaimana situs ini dibaca. Jika Anda tidak menyetujuinya, tidak ada kuki yang ditulis; pengukuran tetap berjalan tanpa kuki dan tanpa identitas.",
    consentAccept: "Setuju",
    consentDecline: "Lanjut tanpa kuki",
    consentMore: "Rincian",
    consentStatusOn: "Saat ini Anda telah menyetujui kuki pengukuran.",
    consentStatusOff:
      "Saat ini Anda belum menyetujui kuki pengukuran; pengukuran dilakukan tanpa kuki.",
    consentTurnOn: "Beri persetujuan",
    consentTurnOff: "Tarik persetujuan",
  },
};
