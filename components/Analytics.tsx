import Script from "next/script";
import { GA_ID, consentBootstrap } from "@/lib/analytics";
import type { Lang } from "@/lib/i18n";
import ConsentBar from "./ConsentBar";
import GaPageviews from "./GaPageviews";

/**
 * Everything Google Analytics touches, in one mount point per layout.
 *
 * With NEXT_PUBLIC_GA_ID unset this returns null and the pages go out exactly
 * as they did before: no script tag, no consent bar, nothing to consent to.
 */
export default function Analytics({ lang }: { lang: Lang }) {
  if (!GA_ID) return null;

  return (
    <>
      {/* Plain inline script, not next/script: the consent defaults must be in
          the dataLayer before gtag.js replays it, and this runs at parse time. */}
      <script dangerouslySetInnerHTML={{ __html: consentBootstrap(GA_ID) }} />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <GaPageviews />
      <ConsentBar lang={lang} />
    </>
  );
}
