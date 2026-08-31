import { names, stats } from "@/lib/content";
import { REPO, ROUTES, SITE, T } from "@/lib/i18n";
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
  const tr = names("tr");
  const en = names("en");

  const lines = [
    `# ${SITE}`,
    "",
    `> ${T.tr.metaDesc}`,
    `> ${T.en.metaDesc}`,
    "",
    "## Uyarı / Disclaimer",
    "",
    T.tr.footNote,
    "",
    T.en.footNote,
    "",
    "Bu metin klasik tefsir literatürünün yerine geçmez. Bir dil modeli ikna",
    "edici görünen yanlışlar üretebilir: kelime kökleri, gramer açıklamaları,",
    "kıraat ve nakil bilgileri yanlış olabilir. Buradan alıntı yapılacaksa",
    "kaynağın bir dil modeli olduğu belirtilmelidir.",
    "",
    "This text does not stand in for the classical commentary literature.",
    "If you quote it, say that the source was written by a language model.",
    "",
    "## Yapı / Structure",
    "",
    `- ${s.suras} sûre, ${s.ayahs.toLocaleString("tr-TR")} ayet; her ayet işlenmiş.`,
    "- Türkçe kökte (`/`), İngilizce `/en` altında. İkisi birebir aynı bölümlere ayrılır.",
    `- Sûre sayfası: \`${ROUTES.tr.sura}/<no>\` · \`${ROUTES.en.sura}/<no>\``,
    `- Bölüm sayfası (tek ayet ya da ayet öbeği): \`${ROUTES.tr.sura}/<no>/<ilk-ayet>\``,
    "  — alıntı için en uygun birim; her biri tek konu, kendi başlığı ve adresi.",
    `- Kök dizini: \`${ROUTES.tr.roots}\` · \`${ROUTES.en.roots}\``,
    `- Usul ve üslup kuralları: \`${ROUTES.tr.method}\` · \`${ROUTES.en.method}\``,
    "",
    `Bütün adreslerin listesi: ${abs("/sitemap.xml")}`,
    `Kaynak metin ve denetim araçları: ${REPO}`,
    "",
    "## Sûreler / Sūras",
    "",
  ];

  for (let no = 1; no <= s.suras; no++) {
    lines.push(`- [${no}. ${tr.get(no)} / ${en.get(no)}](${abs(`${ROUTES.tr.sura}/${no}`)})`);
  }

  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
