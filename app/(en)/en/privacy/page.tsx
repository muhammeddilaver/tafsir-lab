import Link from "next/link";
import ConsentSwitch from "@/components/ConsentSwitch";
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
          <p className="meta">Last updated: 1 September 2026</p>
        </div>

        <p>
          In short: <strong>the site asks you for no identifying information.</strong> There
          are no accounts, no forms, no email collection, no advertising and no advertising
          trackers. To see how many people read which page, <strong>one analytics tool
          (Google Analytics)</strong> is used; it writes <strong>no cookie at all until you
          explicitly consent.</strong> The detail follows.
        </p>

        <h2>The site itself</h2>
        <p>
          The site consists entirely of <strong>static</strong> pages: there is no application
          running on a server that receives or stores data from you. The only cookie the site
          sets of its own is the language preference written when you click the language link
          in the top bar (<code>tefsir-lang</code>); it decides nothing but which language
          you are taken to when you arrive at &quot;/&quot;, and carries no identifier.
        </p>

        <h2>Analytics</h2>
        <p>
          Google Analytics 4 is used to see which sūras are read, which pages are never
          opened, and where the text tends to be abandoned. The aim is the totals, not the
          trail of any one reader.
        </p>
        <p>
          The measurement is set up in <strong>Google&apos;s Consent Mode v2</strong>, and
          every storage permission begins in the <em>denied</em> state the moment the page
          opens. In practice:
        </p>
        <ul>
          <li>
            <strong>Before you consent</strong>, no analytics cookie is written to your
            browser. A cookieless signal goes to Google; it carries no identifier that would
            recognise your device across visits, your IP address is processed by Google in
            truncated form, and your visit enters the totals only as a statistical estimate.
          </li>
          <li>
            <strong>If you consent</strong>, Google Analytics writes its own cookies (
            <code>_ga</code> and <code>_ga_&lt;id&gt;</code>). They give your device a random
            number so that repeat visits can be told apart as coming from the same person;
            they are not linked to your name, your email, or any other identity, and Google
            expires them after two years.
          </li>
          <li>
            <strong>The advertising permissions stay off either way.</strong> Ad targeting,
            personalisation, and the sharing of any advertising identifier are never turned
            on; no advertising is embedded in the site.
          </li>
        </ul>
        <p>
          What is collected is Google Analytics&apos; ordinary scope: the address and title of
          the page opened, the referring address, approximate location (country or city
          level), browser and device type, language. What you search for within the text,
          which line you copy, and where you left off are <strong>not sent</strong> to the
          analytics.
        </p>
        <p>
          The data is processed by Google Ireland Limited under Google&apos;s{" "}
          <a
            href="https://business.safety.google/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            privacy terms
          </a>{" "}
          and may be transferred to its servers outside your country. Where you have
          consented, your explicit consent is the legal basis for that transfer.
        </p>

        <h2>Changing your consent</h2>
        <p>
          Your decision is kept in your browser under <code>tefsir:consent</code> and can be
          withdrawn at any time. Withdrawing returns the measurement to its cookieless mode
          at once.
        </p>
        <ConsentSwitch lang="en" />

        <h2>What is kept in your browser</h2>
        <p>
          For the sake of the reading experience and the preference above, these records are
          written to your browser&apos;s <code>localStorage</code>:
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
              <tr>
                <td>
                  <code>tefsir:consent</code>
                </td>
                <td>
                  Your answer on analytics cookies. One decision covers both languages, so
                  switching language does not ask you again
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The Turkish version of the site keeps the two reading records under keys without
          the <code>en</code> part, so the two languages do not overwrite each other&apos;s
          reading position.
        </p>
        <p>
          These records <strong>stay in your browser alone</strong>; they are not sent to any
          server, are not linked to your identity, and do not travel to your other devices.
          You can delete them at any time by clearing the site data in your browser, or avoid
          them by browsing in a private window. Deleting them brings the consent question
          back.
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
          <code>fonts.gstatic.com</code>), and the analytics script from{" "}
          <code>googletagmanager.com</code>. During those requests your IP address and browser
          information reach Google. Beyond this, no third-party script, advertisement, pixel,
          or tracker is embedded in the pages.
        </p>

        <h2>The sharing function</h2>
        <p>
          When you copy or share the link to a line, the whole operation happens on your
          device: the link is written to your clipboard, or your device&apos;s own share sheet
          opens. No information is sent to the site or to the analytics while this happens.
        </p>

        <h2>Children</h2>
        <p>
          Since the site asks no one for a name, an email address, or any similar identifier,
          no such data belonging to children is processed either. The analytics draws no
          distinction by age; what it gathers is the same, and equally anonymous, for every
          visitor.
        </p>

        <h2>Your rights</h2>
        <p>
          Because the site keeps no record that identifies you, there is no personal data of
          yours that could be found by your name and erased. Even so:
        </p>
        <ul>
          <li>You may withdraw your analytics consent at any time with the button above.</li>
          <li>
            The reading position and preferences kept in your browser are entirely under your
            control; clearing the site data deletes them.
          </li>
          <li>
            If you would rather block the measurement outright, Google&apos;s{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
            >
              opt-out add-on
            </a>{" "}
            or your browser&apos;s own tracking protection will also do it.
          </li>
        </ul>

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
