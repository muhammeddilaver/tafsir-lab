import { ImageResponse } from "next/og";
import { getSura, sectionStarts, stats } from "./content";
import { LOCALE, SITE, T, type Lang } from "./i18n";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export const ogAlt = (lang: Lang) => `${SITE} — ${T[lang].heroTitle}`;

// Satori needs every container to be explicitly flex. No font is fetched:
// we stay on the built-in default so the build makes no network request.
export function ogImage(lang: Lang) {
  const t = T[lang];
  const { suras, ayahs } = stats(lang);
  const n = (x: number) => x.toLocaleString(LOCALE[lang]);
  return shell(t.heroTitle, `${n(suras)} ${t.statSuras} · ${n(ayahs)} ${t.statAyahs}`, t.ogNote);
}

/**
 * One image per sura. Section pages (/sure/2/255) inherit it: an
 * opengraph-image declared on a parent segment applies to its children, so
 * there is no need to render a separate image for 5,992 section pages.
 */
export function ogSuraImage(lang: Lang, no: number) {
  const t = T[lang];
  const sura = getSura(lang, no);
  if (!sura) return ogImage(lang);
  return shell(
    t.suraSeoTitle(sura.name),
    t.suraMeta(sura.ayahCount, sectionStarts(lang, no).length),
    t.ogNote
  );
}

function shell(headline: string, meta: string, note: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#EFF1EF",
          borderTop: "14px solid #1F4E85",
          padding: "64px 72px",
          color: "#15181A",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="46" height="46" viewBox="0 0 32 32">
            <g fill="none" stroke="#1F4E85" strokeWidth="2.4" strokeLinejoin="round">
              <rect x="9.2" y="9.2" width="13.6" height="13.6" />
              <rect x="9.2" y="9.2" width="13.6" height="13.6" transform="rotate(45 16 16)" />
            </g>
          </svg>
          <div style={{ display: "flex", fontSize: 27, color: "#4E555A", letterSpacing: 0.4 }}>
            {SITE}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", fontSize: 66, lineHeight: 1.12, letterSpacing: -1.4 }}>
            {headline}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#4E555A" }}>{meta}</div>
        </div>

        <div style={{ display: "flex", borderTop: "1px solid #CDD3CF", paddingTop: 22 }}>
          <div style={{ display: "flex", fontSize: 23, color: "#7C848A" }}>{note}</div>
        </div>
      </div>
    ),
    ogSize
  );
}
