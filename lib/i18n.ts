// Iki dilli yayin: Turkce kokte (/), Ingilizce /en altinda.
// Tek kaynak: rota adlari ve arayuz metinleri burada durur; sayfalar ve
// istemci bilesenleri yalnizca dili tasir.

export type Lang = "tr" | "en";
export const LANGS: Lang[] = ["tr", "en"];

/** Dile gore rota kokleri. Ingilizce bolutler de Ingilizce adlandirilir. */
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

/** localStorage on eki. Turkce anahtarlar eski surumle ayni kalir. */
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

  heroTitle: string;
  heroLead: string;
  /** Uc parca: metin — /usul baglantisi — metin. JSX'i sayfa kuruyor. */
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
