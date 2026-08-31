import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { rootsBySection, section } from "@/lib/content";
import { ROUTES, T, type Lang } from "@/lib/i18n";
import { articleLd, breadcrumbLd } from "@/lib/jsonld";
import { clamp } from "@/lib/meta";
import { renderBlocks } from "@/lib/render";

/**
 * A single verse section on its own page (/sure/2/255).
 * The `#2/255` anchor on the sura page stays where it is — this is an extra
 * surface, not a replacement. In long suras a reader arriving from a search
 * result now downloads one section instead of all 167.
 */
export default function SectionView({
  lang,
  no,
  start,
}: {
  lang: Lang;
  no: number;
  start: number;
}) {
  const sec = section(lang, no, start);
  if (!sec) notFound();

  const t = T[lang];
  const R = ROUTES[lang];
  const range = t.secRange(no, sec.from, sec.to);
  const heading = t.secHeading(sec.name, range, sec.title);
  const url = `${R.sura}/${no}/${start}`;
  const suraUrl = `${R.sura}/${no}`;
  const at = (s: { from: number; to: number; title: string }) =>
    t.secHeading(sec.name, t.secRange(no, s.from, s.to), s.title);
  const rootList = rootsBySection(lang).get(`${no}/${sec.from}`) ?? [];

  return (
    <div className="wrap">
      <main>
        <nav className="crumb">
          <Link href={R.home}>{t.navHome}</Link>
          <span aria-hidden="true">›</span>
          <Link href={suraUrl}>{sec.name}</Link>
        </nav>

        <div className="sura-head">
          <h1>{heading}</h1>
          <p className="meta">{t.coords(no, sec.name, t.secVerses(sec.from, sec.to))}</p>
          <p className="chunk-note">{t.chunkNote}</p>
        </div>

        <article
          dangerouslySetInnerHTML={{
            __html: renderBlocks(sec.blocks, { [sec.id]: sec.ayahs }, lang),
          }}
        />

        {rootList.length > 0 && (
          <section className="sec-roots">
            <h2>{t.secRoots}</h2>
            <p>
              {rootList.map((r) => (
                <Link key={r} href={`${R.roots}#${encodeURIComponent(r)}`}>
                  {r}
                </Link>
              ))}
            </p>
          </section>
        )}

        <nav className="pager">
          {sec.prev ? (
            <Link href={`${R.sura}/${no}/${sec.prev.from}`} aria-label={t.secPrev}>
              ← {at(sec.prev)}
            </Link>
          ) : (
            <span />
          )}
          {sec.next ? (
            <Link href={`${R.sura}/${no}/${sec.next.from}`} aria-label={t.secNext}>
              {at(sec.next)} →
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <p className="whole">
          <Link href={suraUrl}>{t.secWhole(sec.name)} →</Link>
        </p>
      </main>

      <JsonLd
        data={[
          articleLd({
            lang,
            url,
            headline: t.secSeoTitle(sec.name, range, sec.title),
            description: clamp(t.secSeoDesc(sec.name, range, sec.lead)),
            partOf: suraUrl,
          }),
          breadcrumbLd([
            { name: t.navHome, url: R.home },
            { name: sec.name, url: suraUrl },
            { name: heading, url },
          ]),
        ]}
      />
    </div>
  );
}
