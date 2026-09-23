import { getSura, section, suraNumbers } from "@/lib/content";
import { renderBare } from "@/lib/render";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  const out: { no: string; start: string }[] = [];
  for (const no of suraNumbers("id")) {
    for (const s of getSura("id", no)?.sections ?? []) {
      out.push({ no: String(no), start: String(s.from) });
    }
  }
  return out;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ no: string; start: string }> }
) {
  const { no, start } = await params;
  const sec = section("id", Number(no), Number(start));
  if (!sec) return new Response("tidak ditemukan", { status: 404 });

  return Response.json({
    no: sec.no,
    name: sec.name,
    label: sec.label,
    url: `/id/surah/${sec.no}#${sec.id}`,
    html: renderBare(sec.blocks, "id"),
  });
}
