"use client";

import { useEffect, useState } from "react";
import { GA_ID, readConsent, writeConsent, type Consent } from "@/lib/analytics";
import { T, type Lang } from "@/lib/i18n";

/**
 * The withdrawal control on the privacy page. Taking consent back has to be as
 * easy as giving it, and the bar is gone once answered — this is where the
 * reader comes back to change their mind.
 *
 * Renders nothing when no measurement ID is configured: on such a build there
 * is no analytics to consent to.
 */
export default function ConsentSwitch({ lang }: { lang: Lang }) {
  const [state, setState] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const t = T[lang];

  useEffect(() => {
    setState(readConsent() ?? "denied");
    setReady(true);
  }, []);

  if (!GA_ID || !ready) return null;

  const next: Consent = state === "granted" ? "denied" : "granted";

  return (
    <p className="consent-switch">
      <span>{state === "granted" ? t.consentStatusOn : t.consentStatusOff}</span>{" "}
      <button
        type="button"
        onClick={() => {
          writeConsent(next);
          setState(next);
        }}
      >
        {next === "granted" ? t.consentTurnOn : t.consentTurnOff}
      </button>
    </p>
  );
}
