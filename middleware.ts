import { NextResponse, type NextRequest } from "next/server";
import { LANG_COOKIE } from "@/lib/i18n";

/**
 * Picks the entry language. Runs on "/" ONLY.
 *
 * Deep URLs are deliberately excluded: if someone reached /sure/2 from a
 * search result, that is the page they asked for. Throwing them to
 * /en/sura/2 because their browser is English would override an explicit
 * choice — and that is exactly the case Google warns about for language
 * redirects. /en is not redirected either, for the same reason: an explicit
 * link to it was clicked.
 *
 * Order: explicit choice (cookie) > browser language (Accept-Language) >
 * default (tr). The cookie is written only when the language link in the top
 * bar is clicked; detection alone leaves no cookie, or a one-off browser
 * setting would become permanent.
 *
 * Googlebot sends no Accept-Language: negotiate() returns null, no redirect
 * happens, and "/" is always crawled in Turkish. /en is already found through
 * hreflang, the sitemap and the link in the top bar. Bots are not singled out
 * — that would be cloaking.
 */

/** Ranks Accept-Language by q value and returns the first language we support. */
function negotiate(header: string | null): "tr" | "en" | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.split(";");
      const q = params.find((p) => p.trim().startsWith("q="))?.split("=")[1];
      return { tag: tag.trim().toLowerCase(), q: q === undefined ? 1 : Number.parseFloat(q) };
    })
    .filter((x) => x.tag && Number.isFinite(x.q) && x.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    // For regional tags such as "tr-TR" and "en-GB" the primary subtag is enough.
    const primary = tag.split("-")[0];
    if (primary === "tr") return "tr";
    if (primary === "en") return "en";
  }
  // If none of the languages we support is listed, fall back to the language
  // the text itself is written in.
  return null;
}

export function middleware(req: NextRequest) {
  const saved = req.cookies.get(LANG_COOKIE)?.value;
  const lang =
    saved === "tr" || saved === "en" ? saved : negotiate(req.headers.get("accept-language"));

  const res =
    lang === "en"
      ? NextResponse.redirect(new URL("/en", req.url), 307)
      : NextResponse.next();

  // Vary goes on the redirect. It cannot go on the 200 that continues to the
  // Turkish page: on a prerendered static page Next drops both middleware and
  // next.config headers (both were tried, both are discarded) and publishes
  // "/" with s-maxage=31536000 and no Vary: Accept-Language.
  //
  // On Vercel this causes no harm: for a path matching the matcher, middleware
  // runs before the CDN cache is consulted, so the cached Turkish page only
  // ever reaches requests middleware judged to be Turkish. But if another CDN
  // (Cloudflare, say) is ever put IN FRONT of Vercel, "/" reaches it with no
  // Vary and a one-year lifetime: if the first visitor is Turkish, every
  // English visitor gets the Turkish page too. Should that day come, "/" must
  // either vary on Accept-Language there or not be cached at all.
  res.headers.set("Vary", "Accept-Language, Cookie");
  return res;
}

export const config = { matcher: "/" };
