import { suraNumbers } from "@/lib/content";
import { T } from "@/lib/i18n";
import { ogContentType, ogSize, ogSuraImage } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = T.id.heroTitle;

export function generateStaticParams() {
  return suraNumbers("id").map((no) => ({ no: String(no) }));
}

export default async function Image({ params }: { params: Promise<{ no: string }> }) {
  return ogSuraImage("id", Number((await params).no));
}
