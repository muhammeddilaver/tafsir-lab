import Link from "next/link";
import { REPO, ROUTES } from "@/lib/i18n";
import { alternates } from "@/lib/meta";

export const metadata = {
  title: "Privacy policy",
  description: "What data this site processes, and what it does not.",
  alternates: {
    canonical: ROUTES.en.privacy,
    ...alternates({ tr: ROUTES.tr.privacy, en: ROUTES.en.privacy }),
  },
};

export default function PrivacyPage() {
  return (
    <div className="wrap">
      <main className="doc">
        <div className="sura-head">
          <h1>Privacy policy</h1>
          <p className="meta">Last updated: 25 August 2026</p>
        </div>

        <p>
          In short: <strong>this site collects no data from you.</strong> There are no
          accounts, no forms, no email collection, no analytics tool, no advertising or
          tracking cookies. The detail follows.
        </p>

        <h2>The site itself</h2>
        <p>
          The site consists entirely of <strong>static</strong> pages: there is no application
          running on a server that receives or stores data. The site sets no cookie of its
          own.
        </p>

        <h2>What is kept in your browser</h2>
        <p>
          For the sake of the reading experience, two kinds of record are written to your
          browser&apos;s <code>localStorage</code>:
        </p>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Record</th>
                <th>What it holds</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>tefsir:en:pos:&lt;sūra&gt;</code>
                </td>
                <td>The section and position you last read in that sūra</td>
              </tr>
              <tr>
                <td>
                  <code>tefsir:en:last</code>
                </td>
                <td>
                  The sūra you last read — for the &quot;Where you left off&quot; card on the
                  home page
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The Turkish version of the site keeps the same two records under keys without the{" "}
          <code>en</code> part, so the two languages do not overwrite each other&apos;s
          reading position.
        </p>
        <p>
          These records <strong>stay in your browser alone</strong>; they are not sent to any
          server, are not linked to your identity, and do not travel to your other devices.
          You can delete them at any time by clearing the site data in your browser, or avoid
          them by browsing in a private window.
        </p>

        <h2>Hosting</h2>
        <p>
          The site is hosted on Vercel. As with any website, the hosting provider may keep
          technical records (IP address, browser information, the address requested, the time)
          while you view the pages. Those records fall under the provider&apos;s processing
          for infrastructure and security purposes; the site owner does not collect personal
          data from them and performs no separate analysis on them.
        </p>

        <h2>External resources</h2>
        <p>
          The page fonts are loaded from Google Fonts (<code>fonts.googleapis.com</code> and{" "}
          <code>fonts.gstatic.com</code>). During those requests your IP address and browser
          information reach Google. Beyond this, no third-party script, advertisement, pixel,
          or tracker is embedded in the pages.
        </p>

        <h2>The sharing function</h2>
        <p>
          When you copy or share the link to a line, the whole operation happens on your
          device: the link is written to your clipboard, or your device&apos;s own share sheet
          opens. No information is sent to the site while this happens.
        </p>

        <h2>Children</h2>
        <p>
          Since the site collects no data from any age group, no data belonging to children is
          processed either.
        </p>

        <h2>Your rights</h2>
        <p>
          Because the site keeps no record about you, there is no personal data of yours that
          you could ask to have erased or corrected. The reading position kept in your browser
          is entirely under your control.
        </p>

        <h2>Changes</h2>
        <p>
          This policy may be updated; the current version is always published on this page and
          the date at the top shows the last update.
        </p>

        <h2>Contact</h2>
        <p>
          For questions, please use the <em>Issues</em> section of the repository:{" "}
          <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">
            {REPO.replace("https://", "")}/issues
          </a>
          .
        </p>

        <p className="muted">
          <Link href={ROUTES.en.terms}>Terms of use</Link> ·{" "}
          <Link href={ROUTES.en.about}>About</Link>
        </p>
      </main>
    </div>
  );
}
