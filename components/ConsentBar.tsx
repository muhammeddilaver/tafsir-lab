"use client";

import { useEffect, useState } from "react";
import { readConsent, writeConsent, type Consent } from "@/lib/analytics";
import { ROUTES, T, type Lang } from "@/lib/i18n";

/**
 * The consent bar. It only appears while the question is unanswered — the
 * answer lives in localStorage, so nothing renders on the server and the first
 * paint is unchanged for anyone who has already chosen.
 *
 * Declining is one click, in the same weight as accepting: a "reject" that is
 * harder to reach than "accept" is not consent freely given.
 */
export default function ConsentBar({ lang }: { lang: Lang }) {
  const [asking, setAsking] = useState(false);
  const t = T[lang];

  useEffect(() => setAsking(readConsent() === null), []);

  if (!asking) return null;

  const answer = (v: Consent) => {
    writeConsent(v);
    setAsking(false);
  };

  return (
    <div className="consent" role="region" aria-label={t.consentAria}>
      <p>
        {t.consentText}{" "}
        <a href={ROUTES[lang].privacy}>{t.consentMore}</a>
      </p>
      <div className="consent-buttons">
        <button type="button" onClick={() => answer("denied")}>
          {t.consentDecline}
        </button>
        <button type="button" className="consent-yes" onClick={() => answer("granted")}>
          {t.consentAccept}
        </button>
      </div>
    </div>
  );
}
