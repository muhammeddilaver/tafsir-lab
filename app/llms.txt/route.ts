import { names, stats } from "@/lib/content";
import { LANGS, REPO, ROUTES, SITE, T } from "@/lib/i18n";
import { abs } from "@/lib/meta";

export const dynamic = "force-static";

/**
 * llms.txt — a file proposed in September 2024, meant to let language models
 * read a summary of the site. No major provider has confirmed using it; it is
 * here because it costs next to nothing, not because the benefit is proven.
 * The real work is done by sitemap.xml and the pages themselves.
 *
 * The disclaimer sits at the very top: a language model wrote this text and
 * it carries no religious authority. A model taking this as a source should
 * see that first.
 */
export function GET() {
  const s = stats("tr");
  const nm = Object.fromEntries(LANGS.map((l) => [l, names(l)])) as Record<
    (typeof LANGS)[number],
    Map<number, string>
  >;

  const lines = [
    `# ${SITE}`,
    "",
    ...LANGS.map((l) => `> ${T[l].metaDesc}`),
    "",
    "## Uyarı / Disclaimer / Peringatan",
    "",
    ...LANGS.flatMap((l) => [T[l].footNote, ""]),
    "Bu metin klasik tefsir literatürünün yerine geçmez. Bir dil modeli ikna",
    "edici görünen yanlışlar üretebilir: kelime kökleri, gramer açıklamaları,",
    "kıraat ve nakil bilgileri yanlış olabilir. Buradan alıntı yapılacaksa",
    "kaynağın bir dil modeli olduğu belirtilmelidir.",
    "",
    "This text does not stand in for the classical commentary literature.",
    "If you quote it, say that the source was written by a language model.",
    "",
    "Teks ini tidak menggantikan literatur tafsir klasik. Jika Anda mengutipnya,",
    "sebutkan bahwa sumbernya ditulis oleh sebuah model bahasa.",
    "",
    "## Yapı / Structure / Struktur",
    "",
    `- ${s.suras} sûre, ${s.ayahs.toLocaleString("tr-TR")} ayet; her ayet işlenmiş.`,
    "- Türkçe kökte (`/`), İngilizce `/en`, Endonezce `/id` altında.",
    "  Üçü de birebir aynı bölümlere ayrılır; Türkçe kaynak metindir.",
    `- Sûre sayfası: ${LANGS.map((l) => `\`${ROUTES[l].sura}/<no>\``).join(" · ")}`,
    `- Bölüm sayfası (tek ayet ya da ayet öbeği): \`${ROUTES.tr.sura}/<no>/<ilk-ayet>\``,
    "  — alıntı için en uygun birim; her biri tek konu, kendi başlığı ve adresi.",
    `- Kök dizini: ${LANGS.map((l) => `\`${ROUTES[l].roots}\``).join(" · ")}`,
    `- Usul ve üslup kuralları: ${LANGS.map((l) => `\`${ROUTES[l].method}\``).join(" · ")}`,
    "",
    `Bütün adreslerin listesi: ${abs("/sitemap.xml")}`,
    `Kaynak metin ve denetim araçları: ${REPO}`,
    "",
    "## Sûreler / Sūras / Surah",
    "",
  ];

  // A sura is listed under every name it has been published with: the
  // translations in progress simply contribute fewer names.
  for (let no = 1; no <= s.suras; no++) {
    const label = LANGS.map((l) => nm[l].get(no))
      .filter(Boolean)
      .join(" / ");
    lines.push(`- [${no}. ${label}](${abs(`${ROUTES.tr.sura}/${no}`)})`);
  }

  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
