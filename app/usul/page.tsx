import { usul } from "@/lib/content";
import { renderBlocks } from "@/lib/render";

export const metadata = { title: "Usul ve üslup" };

export default function UsulPage() {
  const { title, blocks } = usul();
  return (
    <div className="wrap">
      <main>
        <div className="sura-head">
          <h1>{title}</h1>
          <p className="meta">Metnin tamamında bağlayıcı olan kurallar.</p>
        </div>
        <article dangerouslySetInnerHTML={{ __html: renderBlocks(blocks) }} />
      </main>
    </div>
  );
}
