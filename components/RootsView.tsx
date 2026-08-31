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
            <li key={r.root} id={r.root}>
              <span className={/^[a-zʿʾ]/i.test(r.root) ? "rl" : "rk"}>{r.root}</span>
              <span className="rl">{t.rootsHits(r.hits.length)}</span>
              <div className="hits">
                {r.hits.slice(0, 40).map((h, i) => (
                  <Link
                    key={i}
                    // Section pages exist now: instead of an anchored sura
                    // page, go to the page of the section treating the root.
                    href={
                      h.anchor
                        ? `${R.sura}/${h.sura}/${h.anchor.split("/")[1].split("-")[0]}`
                        : `${R.sura}/${h.sura}`
                    }
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
