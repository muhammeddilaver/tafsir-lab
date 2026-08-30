import Link from "next/link";
import { notFound } from "next/navigation";
import Reader from "@/components/Reader";
import { getSura, suraList } from "@/lib/content";
import { ROUTES, T, type Lang } from "@/lib/i18n";
import { renderBlocks } from "@/lib/render";

export default function SuraView({ lang, no }: { lang: Lang; no: number }) {
  const sura = getSura(lang, no);
  if (!sura) notFound();

  const t = T[lang];
  const R = ROUTES[lang];
  const list = suraList(lang);
  const prev = list.find((x) => x.no === no - 1);
  const next = list.find((x) => x.no === no + 1);

  return (
    <div className="wrap">
      <main>
        <div className="sura-head">
          <h1>{sura.title}</h1>
          <p className="meta">{t.suraMeta(sura.ayahCount, sura.sections.length)}</p>
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
    </div>
  );
}
