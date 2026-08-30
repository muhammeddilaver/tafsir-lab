import Link from "next/link";
import { stats } from "@/lib/content";
import { REPO, ROUTES } from "@/lib/i18n";
import { alternates } from "@/lib/meta";

export const metadata = {
  title: "About",
  description:
    "What the LLM Tefsir Project is, who wrote the text, and the rules it was written under.",
  alternates: {
    canonical: ROUTES.en.about,
    ...alternates({ tr: ROUTES.tr.about, en: ROUTES.en.about }),
  },
};

export default function AboutPage() {
  const s = stats("en");
  return (
    <div className="wrap">
      <main className="doc">
        <div className="sura-head">
          <h1>About</h1>
          <p className="meta">
            {s.suras} sūras · {s.ayahs.toLocaleString("en-GB")} verses
          </p>
        </div>

        <h2>What this is</h2>
        <p>
          An attempt at a commentary on the Qurʾān covering all 114 sūras verse by verse. In
          every section the words are opened down to their roots, the build of the sentence
          and the repetitions within the sūra are shown, and where the commentators divide,
          the disagreement is not hidden but set out in a table.
        </p>
        <p>
          The English text is a translation of the Turkish original, which remains the source
          of record. Verse numbering, Arabic text, root letters and cross-references are
          identical in both, so a link to a verse points at the same place in either language.
        </p>

        <h2>Who wrote the text</h2>
        <p>
          <strong>The whole text was written by a language model — Claude (Anthropic).</strong>{" "}
          We say so in the most visible place on the page, because a reader has the right to
          know what they are reading.
        </p>
        <p>In practice this means:</p>
        <ul>
          <li>
            The text is not the work of a scholar. It carries{" "}
            <strong>no religious authority</strong> and does not stand in for the classical
            commentary literature.
          </li>
          <li>
            A language model can produce convincing-looking mistakes. Word roots, grammatical
            explanations, and statements about the variant readings and the transmitted
            reports <strong>may be wrong</strong>.
          </li>
          <li>
            If you are going to rely on this text for anything that matters, check it first
            against the classical sources.
          </li>
        </ul>
        <p>
          The aim is not to replace the exegetical tradition, but to put the linguistic
          texture of the verse — its roots, its syntax, its echoes within the sūra — in front
          of you in readable form.
        </p>

        <h2>The rules it follows</h2>
        <p>
          A binding statement of method was applied throughout. The whole of it is on the{" "}
          <Link href={ROUTES.en.method}>Method</Link> page; the main points:
        </p>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Rule</th>
                <th>What it means</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>No invented transmission</td>
                <td>
                  A saying whose source cannot be given is never attributed to a commentator
                  or to a ḥadīth; where there is no certainty, the language of &quot;it is
                  transmitted that&quot; is used
                </td>
              </tr>
              <tr>
                <td>Disagreement is not hidden</td>
                <td>The views are set out in a table; no preference is imposed</td>
              </tr>
              <tr>
                <td>No legal rulings</td>
                <td>The schools&apos; positions are reported; no ruling is issued</td>
              </tr>
              <tr>
                <td>No collective verdicts</td>
                <td>
                  No ethnic or religious group is judged as a whole; what the verse describes
                  are <strong>qualities</strong>
                </td>
              </tr>
              <tr>
                <td>No hunting for scientific miracles</td>
                <td>
                  Modern knowledge is not forced onto the verse; numerological or letter-value
                  (abjad) reckoning is not used
                </td>
              </tr>
              <tr>
                <td>No present-day politics</td>
                <td>No side is taken</td>
              </tr>
              <tr>
                <td>Its own readings are marked off</td>
                <td>
                  The text&apos;s own inferences are separated from what is transmitted by the
                  phrase &quot;I record this as my own reading&quot;
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The checking tools in the repository verify the <strong>structure</strong> of the
          text: that every verse is treated, that the references given exist and fall within
          range. <strong>Whether an explanation is sound is not something a machine can
          say.</strong>
        </p>

        <h2>How to read it</h2>
        <ul>
          <li>
            The link mark beside each line gives that line its own address; tap it and the
            line becomes shareable.
          </li>
          <li>
            Click a reference in the text and the target section opens in a panel — you do not
            lose your place.
          </li>
          <li>
            Where you left off is kept in your browser; close the page and open it again and
            you carry on from there.
          </li>
        </ul>

        <h2>Source code</h2>
        <p>
          The site&apos;s code and the whole of the commentary are in an open repository:{" "}
          <a href={REPO} target="_blank" rel="noopener noreferrer">
            github.com/muhammeddilaver/llm-tefsir-project
          </a>
          . If you find a mistake — a wrong root, a report that looks invented, a broken link
          — you can report it through the <em>Issues</em> section there.
        </p>

        <p className="muted">
          <Link href={ROUTES.en.terms}>Terms of use</Link> ·{" "}
          <Link href={ROUTES.en.privacy}>Privacy</Link>
        </p>
      </main>
    </div>
  );
}
