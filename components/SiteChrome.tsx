import Link from "next/link";
import LangSwitch, { type Have } from "./LangSwitch";
import { VERSES, suraNumbers } from "@/lib/content";
import { LANGS, REPO, ROUTES, SITE, T, type Lang } from "@/lib/i18n";

/**
 * Which suras each unfinished translation actually has. A language whose
 * corpus is complete is left out, so once every language is finished this
 * record is empty and nothing extra is serialised into the page. The
 * switcher uses it to send the reader to the home page rather than to a sura
 * that does not exist in the language they are switching to.
 */
function have(): Have {
  const out: Have = {};
  for (const l of LANGS) {
    const nos = suraNumbers(l);
    if (nos.length < VERSES.length) out[l] = nos;
  }
  return out;
}

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
        <LangSwitch lang={lang} have={have()} />
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
          {/* The same control as in the top bar: a reader who has come down
              the page should not have to go back up to change language. */}
          <LangSwitch lang={lang} have={have()} />
        </nav>
        <p className="foot-note">{t.footNote}</p>
      </div>
    </footer>
  );
}
