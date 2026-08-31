import SuraView from "@/components/SuraView";
import { VERSES } from "@/lib/content";
import { suraMetadata } from "@/lib/meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return VERSES.map((_, i) => ({ no: String(i + 1) }));
}

export async function generateMetadata({ params }: { params: Promise<{ no: string }> }) {
  return suraMetadata("tr", Number((await params).no));
}

export default async function SuraPage({ params }: { params: Promise<{ no: string }> }) {
  return <SuraView lang="tr" no={Number((await params).no)} />;
}
