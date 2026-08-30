// Bloklari dogrudan HTML dizesine cevirir.
// Neden JSX degil: sure sayfalari 30 bine yakin dugum iceriyor ve icerik
// tamamen statik. JSX agaci olarak verilince ayni icerik bir de RSC
// yukunde tasiniyor (sayfanin %66'si) ve istemcide hydrate ediliyordu.
// Tek bir dizeye cevirince hem yuk yariya iniyor hem de hydration kalkiyor.
import type { Block } from "./md";
import { T, type Lang } from "./i18n";

// Zincir (baglanti) ikonu CSS'te maske olarak duruyor: § isareti okurun
// cogu icin anlamsizdi, ama SVG'yi her satira gomunce en buyuk surede
// 624 KB ediyordu (2124 capa x 301 bayt). Isaret artik .anchor::before.
const anchor = (id: string, label: string) =>
  `<a class="anchor" href="#${id}" data-anchor="${id}" aria-label="${label}" title="${label}"></a>`;

/** Modal parcasi icin: id, capa ve § isareti olmadan sade govde. */
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
  // Ayri bir bolumun kendi id'si olan ayet numaralari icin span uretme:
  // ayni id iki kez cikmasin (ornegin "42/36-39" bolumu + ayri "42/36" bolumu).
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
        // Tek ayetlik bolumde bolum id'si zaten "N/a" — capayi tekrar etme.
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
