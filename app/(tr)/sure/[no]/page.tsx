import SuraView from "@/components/SuraView";
import { AYET, getSura } from "@/lib/content";
import { ROUTES } from "@/lib/i18n";
import { alternates } from "@/lib/meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return AYET.map((_, i) => ({ no: String(i + 1) }));
}

export async function generateMetadata({ params }: { params: Promise<{ no: string }> }) {
  const { no } = await params;
  const sura = getSura("tr", Number(no));
  if (!sura) return {};
  return {
    title: sura.name,
    description: sura.lead.slice(0, 180),
    alternates: {
      canonical: `${ROUTES.tr.sura}/${no}`,
      ...alternates({ tr: `${ROUTES.tr.sura}/${no}`, en: `${ROUTES.en.sura}/${no}` }),
    },
    openGraph: { title: sura.title, description: sura.lead.slice(0, 180) },
  };
}

export default async function SuraPage({ params }: { params: Promise<{ no: string }> }) {
  return <SuraView lang="tr" no={Number((await params).no)} />;
}
