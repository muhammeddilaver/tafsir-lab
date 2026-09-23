import SuraView from "@/components/SuraView";
import { suraNumbers } from "@/lib/content";
import { suraMetadata } from "@/lib/meta";

export const dynamicParams = false;

// Only the suras the Indonesian corpus actually has. Turkish and English
// generate all 114 from VERSES; this translation is being filled in sura by
// sura, and a page generated for a file that is not there yet would be an
// empty 404 in the sitemap.
export function generateStaticParams() {
  return suraNumbers("id").map((no) => ({ no: String(no) }));
}

export async function generateMetadata({ params }: { params: Promise<{ no: string }> }) {
  return suraMetadata("id", Number((await params).no));
}

export default async function SuraPage({ params }: { params: Promise<{ no: string }> }) {
  return <SuraView lang="id" no={Number((await params).no)} />;
}
