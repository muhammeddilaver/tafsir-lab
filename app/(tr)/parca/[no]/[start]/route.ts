import { AYET, getSura, section } from "@/lib/content";
import { renderBare } from "@/lib/render";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  const out: { no: string; start: string }[] = [];
  for (let no = 1; no <= AYET.length; no++) {
    for (const s of getSura("tr", no)?.sections ?? []) {
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
  const sec = section("tr", Number(no), Number(start));
  if (!sec) return new Response("yok", { status: 404 });

  return Response.json({
    no: sec.no,
    name: sec.name,
    label: sec.label,
    url: `/sure/${sec.no}#${sec.id}`,
    html: renderBare(sec.blocks, "tr"),
  });
}
