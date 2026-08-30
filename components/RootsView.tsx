import Link from "next/link";
import { roots } from "@/lib/content";
import { ROUTES, T, type Lang } from "@/lib/i18n";

export default function RootsView({ lang }: { lang: Lang }) {
  const list = roots(lang);
  const t = T[lang];
  const R = ROUTES[lang];

  return (
    <div className="wrap">
      <main>
        <div className="sura-head">
          <h1>{t.rootsTitle}</h1>
          <p className="meta">{t.rootsMeta(list.length)}</p>
        </div>
        <ul className="roots">
          {list.map((r) => (
            <li key={r.root}>
              <span className={/^[a-zʿʾ]/i.test(r.root) ? "rl" : "rk"}>{r.root}</span>
              <span className="rl">{t.rootsHits(r.hits.length)}</span>
              <div className="hits">
                {r.hits.slice(0, 40).map((h, i) => (
                  <Link
                    key={i}
                    href={`${R.sura}/${h.sura}${h.anchor ? `#${h.anchor}` : ""}`}
                    title={h.ctx}
                  >
                    {h.suraName} {h.anchor || ""}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
