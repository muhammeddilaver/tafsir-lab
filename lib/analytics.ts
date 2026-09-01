// Google Analytics 4, behind Consent Mode v2.
//
// The measurement ID comes from the environment, like the verification tokens
// in lib/meta.ts: with the variable unset nothing at all is emitted and the
// site stays script-free — which is what local builds and forks get.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/**
 * The visitor's answer to the consent bar. Deliberately outside the NS
 * prefixes in i18n.ts: reading position is per language, but consent is one
 * decision about the site, so it must not be asked again after a language
 * switch.
 */
export const CONSENT_KEY = "tefsir:consent";

declare global {
  interface Window {
    /** Defined by the bootstrap below; absent when GA_ID is unset. */
    gtag?: (...args: unknown[]) => void;
  }
}

export type Consent = "granted" | "denied";

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;   // private mode, storage blocked — treat as undecided
  }
}

/** Persists the answer and tells gtag about it in the same breath. */
export function writeConsent(v: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, v);
  } catch {
    /* the update below still applies for this page view */
  }
  window.gtag?.("consent", "update", { analytics_storage: v });
}

/**
 * The bootstrap that has to run before gtag.js does.
 *
 * gtag.js replays window.dataLayer in order when it loads, so what matters is
 * not which script lands first but that the consent defaults sit in the queue
 * ahead of the config call. Rendering this inline — rather than through
 * next/script — guarantees it: the browser runs it while parsing, before
 * hydration has begun.
 *
 * Everything starts denied, including the two ad signals Consent Mode v2 added
 * (ad_user_data, ad_personalization); GA then sends cookieless pings until the
 * visitor says otherwise. A stored "granted" is restored synchronously here so
 * a returning reader is not measured as a fresh session while React boots.
 */
export function consentBootstrap(id: string) {
  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments)}window.gtag=gtag;",
    "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',",
    "ad_personalization:'denied',analytics_storage:'denied'});",
    `try{if(localStorage.getItem('${CONSENT_KEY}')==='granted')`,
    "gtag('consent','update',{analytics_storage:'granted'})}catch(e){}",
    "gtag('js',new Date());",
    // send_page_view is off because the App Router keeps the document alive
    // across navigations: GaPageviews sends every view, the first one included,
    // so there is one code path rather than two.
    `gtag('config','${id}',{send_page_view:false});`,
  ].join("");
}
