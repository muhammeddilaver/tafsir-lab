"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Page views for client-side navigation.
 *
 * gtag's own page_view fires once per document load, and the App Router never
 * reloads the document — without this, a reader moving from sûra to sûra would
 * count as a single view. usePathname alone is enough here: the site carries
 * no query strings, and useSearchParams would force every page out of static
 * rendering.
 *
 * The send is synchronous inside the effect. React commits the metadata
 * <title> before passive effects run, so the title is already the new page's;
 * deferring by a frame would only have made views in a background tab go
 * unreported, since requestAnimationFrame does not run there.
 */
export default function GaPageviews() {
  const path = usePathname();
  const sent = useRef<string | null>(null);

  useEffect(() => {
    if (!path || path === sent.current) return;
    sent.current = path;
    window.gtag?.("event", "page_view", {
      page_path: path,
      page_location: location.href,
      page_title: document.title,
    });
  }, [path]);

  return null;
}
