import Link from "next/link";
import { roots } from "@/lib/content";

export const metadata = { title: "Kök dizini" };

export default function KokPage() {
  const list = roots();
  return (
    <div className="wrap">
      <main>
        <div className="sura-head">
          <h1>Kök dizini</h1>
          <p className="meta">
            Metin boyunca çözümlenen {list.length} kök. Her bağlantı, kökün işlendiği bölüme gider.
          </p>
        </div>
        <ul className="roots">
          {list.map((r) => (
            <li key={r.root}>
              <span className={/^[a-z]/i.test(r.root) ? "rl" : "rk"}>{r.root}</span>
              <span className="rl">{r.hits.length} yer</span>
              <div className="hits">
                {r.hits.slice(0, 40).map((h, i) => (
                  <Link key={i} href={`/sure/${h.sura}${h.anchor ? `#${h.anchor}` : ""}`} title={h.ctx}>
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
