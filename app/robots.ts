import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/i18n";
import { abs, SITE_URL } from "@/lib/meta";

// The JSON fragments the citation modal fetches: 2,996 in each language,
// 5,992 URLs in total. Not pages, but the body of one section of a sura page
// — there is nothing to index, and crawling them only spends crawl budget.
const fragments = [`${ROUTES.tr.part}/`, `${ROUTES.en.part}/`];

// The AI crawlers are listed explicitly. All of them were already allowed by
// the "*" rule; they are written out to document the intent: both the
// citing/searching bots (OAI-SearchBot, PerplexityBot, Claude-SearchBot) and
// the training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot) are
// allowed on purpose. If the policy changes, this is the only place to edit.
const ai = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: fragments },
      { userAgent: ai, allow: "/", disallow: fragments },
    ],
    sitemap: abs("/sitemap.xml"),
    host: SITE_URL,
  };
}
