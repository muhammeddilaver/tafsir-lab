import Link from "next/link";
import ContinueCard from "@/components/ContinueCard";
import JsonLd from "@/components/JsonLd";
import SuraFilter from "@/components/SuraFilter";
import { stats, suraList } from "@/lib/content";
import { LOCALE, ROUTES, T, type Lang } from "@/lib/i18n";
import { webSiteLd } from "@/lib/jsonld";

export default function HomeView({ lang }: { lang: Lang }) {
  const list = suraList(lang);
  const s = stats(lang);
  const t = T[lang];

  return (
    <div className="wrap">
      <section className="hero">
        <h1>{t.heroTitle}</h1>
        <p>{t.heroLead}</p>
        <p className="muted">
          {t.heroDisclaimerA}
          <Link href={ROUTES[lang].method}>{t.heroDisclaimerLink}</Link>
          {t.heroDisclaimerB}
        </p>
        <p className="muted">{t.heroTip}</p>
        <div className="stats">
          <span>
            <b>{s.suras}</b> {t.statSuras}
          </span>
          <span>
            <b>{s.ayahs.toLocaleString(LOCALE[lang])}</b> {t.statAyahs}
          </span>
        </div>
      </section>

      <ContinueCard lang={lang} />
      <SuraFilter
        lang={lang}
        items={list.map((x) => ({ no: x.no, name: x.name, ayahCount: x.ayahCount }))}
      />
      <JsonLd data={webSiteLd(lang)} />
    </div>
  );
}
