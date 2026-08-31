import SectionView from "@/components/SectionView";
import { VERSES, sectionStarts } from "@/lib/content";
import { sectionMetadata } from "@/lib/meta";

export const dynamicParams = false;

// The same list as the /en/section route: each sura's section start verses.
export function generateStaticParams() {
  const out: { no: string; start: string }[] = [];
  for (let no = 1; no <= VERSES.length; no++) {
    for (const s of sectionStarts("en", no)) {
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
  return sectionMetadata("en", Number(no), Number(start));
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ no: string; start: string }>;
}) {
  const { no, start } = await params;
  return <SectionView lang="en" no={Number(no)} start={Number(start)} />;
}
