import Link from "next/link";
import LangSwitch from "./LangSwitch";
import { REPO, ROUTES, SITE, T, type Lang } from "@/lib/i18n";

export function SiteHeader({ lang }: { lang: Lang }) {
  const R = ROUTES[lang];
  const t = T[lang];
  return (
    <header className="top">
      <div className="top-in">
        <Link className="home" href={R.home}>
          {SITE}
        </Link>
        <span className="sp" />
        {/* The root index was taken out of the top bar: the project presents
            itself as a commentary, not as a dictionary of roots. The page
            itself stays — in the footer, in the roots block on section pages,
            and in the sitemap. */}
        <Link href={R.method}>{t.navMethod}</Link>
        <a className="gh" href={REPO} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <LangSwitch lang={lang} />
      </div>
      <div id="progress" />
    </header>
  );
}

export function SiteFooter({ lang }: { lang: Lang }) {
  const R = ROUTES[lang];
  const t = T[lang];
  return (
    <footer className="foot">
      <div className="foot-in">
        <nav className="foot-nav">
          <Link href={R.about}>{t.navAbout}</Link>
          <Link href={R.method}>{t.navMethod}</Link>
          <Link href={R.roots}>{t.navRoots}</Link>
          <Link href={R.terms}>{t.navTerms}</Link>
          <Link href={R.privacy}>{t.navPrivacy}</Link>
          <a className="foot-gh" href={REPO} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
        <p className="foot-note">{t.footNote}</p>
      </div>
    </footer>
  );
}
