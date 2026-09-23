import SectionView from "@/components/SectionView";
import { sectionStarts, suraNumbers } from "@/lib/content";
import { sectionMetadata } from "@/lib/meta";

export const dynamicParams = false;

// The same list as the /id/bagian route: each sura's section start verses.
export function generateStaticParams() {
  const out: { no: string; start: string }[] = [];
  for (const no of suraNumbers("id")) {
    for (const s of sectionStarts("id", no)) {
      out.push({ no: String(no), start: String(s.from) });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ no: string; start: string }>;
}) {
  const { no, start } = await params;
  return sectionMetadata("id", Number(no), Number(start));
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ no: string; start: string }>;
}) {
  const { no, start } = await params;
  return <SectionView lang="id" no={Number(no)} start={Number(start)} />;
}
