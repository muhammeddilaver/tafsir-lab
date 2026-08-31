import { VERSES } from "@/lib/content";
import { T } from "@/lib/i18n";
import { ogContentType, ogSize, ogSuraImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = T.tr.heroTitle;

export function generateStaticParams() {
  return VERSES.map((_, i) => ({ no: String(i + 1) }));
}

export default async function Image({ params }: { params: Promise<{ no: string }> }) {
  return ogSuraImage("tr", Number((await params).no));
}
