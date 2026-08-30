import { method } from "@/lib/content";
import { T, type Lang } from "@/lib/i18n";
import { renderBlocks } from "@/lib/render";

export default function MethodView({ lang }: { lang: Lang }) {
  const { title, blocks } = method(lang);
  const t = T[lang];
  return (
    <div className="wrap">
      <main>
        <div className="sura-head">
          <h1>{title}</h1>
          <p className="meta">{t.methodMeta}</p>
        </div>
        <article dangerouslySetInnerHTML={{ __html: renderBlocks(blocks, {}, lang) }} />
      </main>
    </div>
  );
}
