import Link from "next/link";
import { notFound } from "next/navigation";
import Reader from "@/components/Reader";
import { AYET, getSura, suraList } from "@/lib/content";
import { renderBlocks } from "@/lib/render";

export const dynamicParams = false;

export function generateStaticParams() {
  return AYET.map((_, i) => ({ no: String(i + 1) }));
}

export async function generateMetadata({ params }: { params: Promise<{ no: string }> }) {
  const { no } = await params;
  const sura = getSura(Number(no));
  if (!sura) return {};
  return {
    title: sura.name,
    description: sura.lead.slice(0, 180),
    openGraph: { title: `${sura.title}`, description: sura.lead.slice(0, 180) },
  };
}

export default async function SuraPage({ params }: { params: Promise<{ no: string }> }) {
  const no = Number((await params).no);
  const sura = getSura(no);
  if (!sura) notFound();

  const list = suraList();
  const prev = list.find((x) => x.no === no - 1);
  const next = list.find((x) => x.no === no + 1);

  return (
    <div className="wrap">
      <main>
        <div className="sura-head">
          <h1>{sura.title}</h1>
          <p className="meta">
            {sura.ayahCount} ayet · {sura.sections.length} bölüm
          </p>
        </div>

        {sura.sections.length > 1 && (
          <details className="jump">
            <summary>Ayetlere git</summary>
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
            __html: renderBlocks(sura.blocks, sura.anchorsBySection),
          }}
        />

        <nav className="pager">
          {prev ? <Link href={`/sure/${prev.no}`}>← {prev.no}. {prev.name}</Link> : <span />}
          {next ? <Link href={`/sure/${next.no}`}>{next.no}. {next.name} →</Link> : <span />}
        </nav>
      </main>
      <Reader no={no} name={sura.name} ayahCount={sura.ayahCount} />
    </div>
  );
}
