import Link from "next/link";
import { REPO, ROUTES } from "@/lib/i18n";
import { alternates } from "@/lib/meta";

export const metadata = {
  title: "Terms of use",
  description: "The terms that apply when you use the LLM Tefsir Project.",
  alternates: {
    canonical: ROUTES.en.terms,
    ...alternates({ tr: ROUTES.tr.terms, en: ROUTES.en.terms }),
  },
};

export default function TermsPage() {
  return (
    <div className="wrap">
      <main className="doc">
        <div className="sura-head">
          <h1>Terms of use</h1>
          <p className="meta">Last updated: 25 August 2026</p>
        </div>

        <p>
          By using this site you accept the terms below. If you do not accept them, please do
          not use the site.
        </p>

        <h2>1. The nature of the content</h2>
        <p>
          The whole of the commentary on this site was{" "}
          <strong>produced by a language model</strong> (Claude, Anthropic). It is not the
          work of a scholar.
        </p>
        <ul>
          <li>
            The text carries <strong>no religious authority</strong>. It may not be used as a
            source of legal opinion (fatwā), religious ruling, or binding view.
          </li>
          <li>
            The content is not legal, financial, medical, or professional advice and may not
            be used as such.
          </li>
          <li>
            Any part of the text — including word roots, grammatical explanations, statements
            about the variant readings, and transmitted reports —{" "}
            <strong>may be mistaken</strong>. On anything that matters, check it against the
            classical sources.
          </li>
        </ul>
        <p>
          For more, see the <Link href={ROUTES.en.about}>About</Link> and{" "}
          <Link href={ROUTES.en.method}>Method</Link> pages.
        </p>

        <h2>2. No warranty</h2>
        <p>
          The site and its content are provided &quot;as is&quot;. No warranty, express or
          implied, is given as to the accuracy, completeness, currency, or fitness for any
          particular purpose of the content. No undertaking is given that the site will run
          uninterrupted or error-free.
        </p>

        <h2>3. Liability</h2>
        <p>
          The site owner cannot be held liable for decisions taken in reliance on the content
          of the site, or for any direct or indirect loss arising from them. The
          responsibility for evaluating and verifying the content rests with the user.
        </p>

        <h2>4. Quotation and use</h2>
        <p>
          The text may be quoted <strong>with attribution and a link to this site</strong>.
          Publishing the whole or large parts of the text elsewhere as one&apos;s own work,
          reproducing it without attribution, or distributing it while concealing that it is
          the product of an artificial intelligence, is not accepted.
        </p>
        <p>
          The site&apos;s source code and the whole of the text are in an open repository:{" "}
          <a href={REPO} target="_blank" rel="noopener noreferrer">
            github.com/muhammeddilaver/llm-tefsir-project
          </a>
          .
        </p>

        <h2>5. The user&apos;s obligations</h2>
        <p>
          Do not use the site for unlawful purposes, in a way that disrupts its operation, or
          so as to place excessive load on it through automated tools.
        </p>

        <h2>6. External links</h2>
        <p>
          The site may link to third-party sites (for example GitHub). The site owner is not
          responsible for the content or the privacy practices of those sites.
        </p>

        <h2>7. Changes</h2>
        <p>
          These terms may be updated without prior notice. The current version is always
          published on this page; the date at the top shows the last update.
        </p>

        <h2>8. Contact</h2>
        <p>
          For questions, error reports, and requests, please use the <em>Issues</em> section
          of the repository:{" "}
          <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">
            {REPO.replace("https://", "")}/issues
          </a>
          .
        </p>

        <p className="muted">
          <Link href={ROUTES.en.privacy}>Privacy policy</Link> ·{" "}
          <Link href={ROUTES.en.about}>About</Link>
        </p>
      </main>
    </div>
  );
}
