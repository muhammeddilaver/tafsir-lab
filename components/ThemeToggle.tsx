"use client";

import { T, type Lang } from "@/lib/i18n";
import { THEME_KEY } from "@/lib/theme";

/**
 * Flips between light and dark. The icon is chosen by CSS from the same
 * attribute, so the server HTML and the hydrated button are identical and
 * nothing depends on reading localStorage during render.
 */
export default function ThemeToggle({ lang }: { lang: Lang }) {
  const flip = () => {
    const root = document.documentElement;
    const now =
      root.getAttribute("data-theme") ??
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = now === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
  };

  return (
    <button type="button" className="theme-toggle" aria-label={T[lang].themeLabel} title={T[lang].themeLabel} onClick={flip}>
      <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
      <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
