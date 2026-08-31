import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import Reader from "@/components/Reader";
import { getSura, sectionStarts, suraList } from "@/lib/content";
import { ROUTES, T, type Lang } from "@/lib/i18n";
import { articleLd, breadcrumbLd } from "@/lib/jsonld";
import { clamp } from "@/lib/meta";
import { renderBlocks } from "@/lib/render";

export default function SuraView({ lang, no }: { lang: Lang; no: number }) {
  const sura = getSura(lang, no);
  if (!sura) notFound();

  const t = T[lang];
  const R = ROUTES[lang];
  const list = suraList(lang);
  const starts = sectionStarts(lang, no);
  const prev = list.find((x) => x.no === no - 1);
  const next = list.find((x) => x.no === no + 1);

  return (
    <div className="wrap">
      <main>
        <div className="sura-head">
          <h1>{sura.title}</h1>
          <p className="meta">
            {t.coords(no, sura.name, t.suraMeta(sura.ayahCount, starts.length))}
          </p>
          <p className="chunk-note">{t.chunkNote}</p>
        </div>

        {sura.sections.length > 1 && (
          <details className="jump">
            <summary>{t.jumpToAyahs}</summary>
            <div className="jump-list">
              {sura.sections.map((x) => (
                <Link key={x.id} href={`#${x.id}`}>
                  {x.label}
                </Link>
              ))}
            </div>
          </details>
        )}

        <article
          dangerouslySetInnerHTML={{
            __html: renderBlocks(sura.blocks, sura.anchorsBySection, lang),
          }}
        />

        <section className="sec-index">
          <h2>{t.secIndexTitle(starts.length)}</h2>
          <ol>
            {starts.map((x) => (
              <li key={x.from}>
                <Link href={`${R.sura}/${no}/${x.from}`}>
                  {t.secHeading(sura.name, t.secRange(no, x.from, x.to), x.title)}
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <nav className="pager">
          {prev ? (
            <Link href={`${R.sura}/${prev.no}`} aria-label={t.prevLabel}>
              ← {prev.no}. {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`${R.sura}/${next.no}`} aria-label={t.nextLabel}>
              {next.no}. {next.name} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>
      <Reader lang={lang} no={no} name={sura.name} ayahCount={sura.ayahCount} />

      <JsonLd
        data={[
          articleLd({
            lang,
            url: `${R.sura}/${no}`,
            headline: t.suraSeoTitle(sura.name),
            description: clamp(t.suraSeoDesc(sura.name, sura.ayahCount, sura.lead)),
          }),
          breadcrumbLd([
            { name: t.navHome, url: R.home },
            { name: sura.name, url: `${R.sura}/${no}` },
          ]),
        ]}
      />
    </div>
  );
}
