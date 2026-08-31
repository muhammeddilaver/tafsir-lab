// Turns blocks straight into an HTML string.
// Why not JSX: a sura page holds close to 30,000 nodes and the content is
// entirely static. As a JSX tree the same content was also carried in the
// RSC payload (66% of the page) and hydrated on the client. Rendering to a
// single string halves the payload and removes hydration.
import type { Block } from "./md";
import { T, type Lang } from "./i18n";

// The chain (link) icon lives in CSS as a mask: a § sign meant nothing to
// most readers, but inlining the SVG on every line cost 624 KB in the
// longest sura (2,124 anchors x 301 bytes). The mark is now .anchor::before.
const anchor = (id: string, label: string) =>
  `<a class="anchor" href="#${id}" data-anchor="${id}" aria-label="${label}" title="${label}"></a>`;

/** For the modal fragment: a bare body with no ids, anchors or § marks. */
export function renderBare(blocks: Block[], lang: Lang = "tr"): string {
  return renderBlocks(blocks, {}, lang)
    .replace(/<a class="anchor"[\s\S]*?<\/a>/g, "")
    .replace(/ id="[^"]*"/g, "")
    .replace(/ data-blk="[^"]*"/g, "")
    .replace(/<span class="a-anchor"><\/span>/g, "");
}

export function renderBlocks(
  blocks: Block[],
  anchorsBySection: Record<string, number[]> = {},
  lang: Lang = "tr"
): string {
  const a = (id: string) => anchor(id, T[lang].shareLine);
  const out: string[] = [];
  // Do not emit a span for verse numbers that are already a section id of
  // their own, so the same id is not produced twice (for example the
  // "42/36-39" section plus a separate "42/36" section).
  const sectionIds = new Set(blocks.filter((b) => b.k === "h" && b.ayah).map((b) => b.id));

  for (const b of blocks) {
    if (b.k === "hr") {
      out.push("<hr>");
      continue;
    }

    if (b.k === "h") {
      if (b.ayah) {
        const { sura, from, to } = b.ayah;
        const label = from === to ? `${sura}/${from}` : `${sura}/${from}-${to}`;
        // In a single-verse section the section id is already "N/a" — do
        // not repeat the anchor.
        const spans = (anchorsBySection[b.id] ?? [])
          .filter((n) => !sectionIds.has(`${sura}/${n}`))
          .map((n) => `<span class="a-anchor" id="${sura}/${n}"></span>`)
          .join("");
        const body = b.arabic
          ? `<p class="ayah-ar" dir="rtl" lang="ar">${b.arabic}</p>`
          : `<h2>${b.html}</h2>`;
        out.push(
          `<section class="blk ayah" id="${b.id}" data-blk="${b.id}" data-ayah="${label}">` +
            spans +
            `<div class="ayah-head"><span class="ayah-no">${label}</span>${a(b.id)}</div>` +
            body +
            `</section>`
        );
        continue;
      }
      const t = b.lvl === 2 ? "h2" : b.lvl === 3 ? "h3" : "h4";
      out.push(
        `<div class="blk hblk" id="${b.id}" data-blk="${b.id}"><${t}>${b.html}</${t}>${a(b.id)}</div>`
      );
      continue;
    }

    if (b.k === "table") {
      out.push(
        `<div class="blk tw" id="${b.id}" data-blk="${b.id}">${a(b.id)}<table><thead><tr>` +
          b.head.map((h) => `<th>${h}</th>`).join("") +
          `</tr></thead><tbody>` +
          b.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("") +
          `</tbody></table></div>`
      );
      continue;
    }

    if (b.k === "ul") {
      out.push(
        `<div class="blk" id="${b.id}" data-blk="${b.id}">${a(b.id)}<ul>` +
          b.items.map((x) => `<li>${x}</li>`).join("") +
          `</ul></div>`
      );
      continue;
    }

    if (b.k === "quote") {
      out.push(
        `<div class="blk" id="${b.id}" data-blk="${b.id}">${a(b.id)}<blockquote>${b.html}</blockquote></div>`
      );
      continue;
    }

    out.push(
      `<div class="blk${b.rtl ? " rtl" : ""}" id="${b.id}" data-blk="${b.id}">${a(b.id)}` +
        `<p${b.rtl ? ' dir="rtl"' : ""}>${b.html}</p></div>`
    );
  }

  return out.join("");
}
