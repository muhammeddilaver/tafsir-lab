#!/usr/bin/env python3
"""tefsir/*.md -> site/index.html

Markdown alt kumesi: h1/h2/h3, **kalin**, *egik*, `kod`, tablolar,
--- yatay cizgi, - madde, > alinti. Arapca metin otomatik isaretlenir.
"""
import re, os, json, html, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "tefsir")
OUT = os.path.join(ROOT, "site")

AR = r"؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿"
AR_RE = re.compile(f"[{AR}][{AR}\\s\\u064B-\\u0652\\u0670\\u06D6-\\u06ED]*[{AR}]|[{AR}]")

SURA_NAMES = {}

# ---------- inline ----------
def esc(s):
    return html.escape(s, quote=False)

def wrap_arabic(s):
    """Arapca kosularini <span class=ar> ile sar (escape SONRASI calisir)."""
    return AR_RE.sub(lambda m: f'<span class="ar">{m.group(0)}</span>', s)

def inline(s):
    s = esc(s)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"<em>\1</em>", s)
    s = wrap_arabic(s)
    return s

def is_mostly_arabic(s):
    letters = [c for c in s if c.isalpha()]
    if not letters:
        return False
    ar = [c for c in letters if re.match(f"[{AR}]", c)]
    return len(ar) / len(letters) > 0.6

# ---------- roots ----------
ROOT_AR = re.compile(f"\\*\\*?([{AR}]\\s*-\\s*[{AR}]\\s*-\\s*[{AR}](?:\\s*-\\s*[{AR}])?)\\*\\*?")
ROOT_LAT = re.compile(r"\*\*?([a-zçğışöü]{1,2}-[a-zçğışöü]{1,2}-[a-zçğışöü]{1,2}(?:-[a-zçğışöü]{1,2})?)\*\*?", re.I)

def find_roots(text, sura_no, sura_name, anchor):
    out = []
    for rx in (ROOT_AR, ROOT_LAT):
        for m in rx.finditer(text):
            r = re.sub(r"\s+", "", m.group(1))
            if re.match(r"[A-Za-zçğışöüÇĞİŞÖÜ]", r):
                r = r.lower()
            if r.count("-") < 2:
                continue
            start = max(0, m.start() - 90)
            ctx = re.sub(r"[*`#]", "", text[start:m.end() + 130]).replace("\n", " ").strip()
            out.append({"root": r, "sura": sura_no, "suraName": sura_name,
                        "anchor": anchor, "ctx": ctx})
    return out

# ---------- block ----------
def render_blocks(lines, sura_no, sura_name, roots, counters):
    out, i, n = [], 0, len(lines)
    cur_anchor = f"s{sura_no}"
    while i < n:
        ln = lines[i]
        st = ln.strip()

        if not st:
            i += 1; continue

        if st == "---":
            out.append('<hr>'); i += 1; continue

        m = re.match(r"^(#{2,4})\s+(.*)$", st)
        if m:
            lvl = len(m.group(1)); txt = m.group(2).strip()
            if lvl == 2:
                counters[0] += 1
                cur_anchor = f"s{sura_no}-{counters[0]}"
                # "2/6 — <arabic>" bicimini ayir
                mm = re.match(r"^(.*?)\s+—\s+(.*)$", txt)
                if mm and is_mostly_arabic(mm.group(2)):
                    label, arab = mm.group(1), mm.group(2)
                    out.append(f'<section class="ayah" id="{cur_anchor}">')
                    out.append(f'<div class="ayah-head"><span class="ayah-no">{inline(label)}</span></div>')
                    out.append(f'<p class="ayah-ar" dir="rtl" lang="ar">{esc(arab)}</p>')
                    out.append('</section>')
                else:
                    out.append(f'<h2 id="{cur_anchor}">{inline(txt)}</h2>')
            else:
                out.append(f'<h{lvl}>{inline(txt)}</h{lvl}>')
            i += 1; continue

        if st.startswith("|") and i + 1 < n and re.match(r"^\|[\s:|-]+\|$", lines[i+1].strip()):
            head = [c.strip() for c in st.strip("|").split("|")]
            i += 2
            rows = []
            while i < n and lines[i].strip().startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")])
                i += 1
            t = ['<div class="tw"><table><thead><tr>']
            for h in head:
                t.append(f"<th>{inline(h)}</th>")
            t.append("</tr></thead><tbody>")
            for r in rows:
                t.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>")
            t.append("</tbody></table></div>")
            out.append("".join(t)); continue

        if re.match(r"^[-*]\s+", st):
            items = []
            while i < n and re.match(r"^[-*]\s+", lines[i].strip()):
                items.append(re.sub(r"^[-*]\s+", "", lines[i].strip()))
                i += 1
            out.append("<ul>" + "".join(f"<li>{inline(x)}</li>" for x in items) + "</ul>")
            continue

        if st.startswith(">"):
            buf = []
            while i < n and lines[i].strip().startswith(">"):
                buf.append(re.sub(r"^>\s?", "", lines[i].strip())); i += 1
            out.append(f'<blockquote>{inline(" ".join(buf))}</blockquote>')
            continue

        # paragraf
        buf = []
        while i < n and lines[i].strip() and not re.match(r"^(#{2,4}\s|[-*]\s|\||>|---$)", lines[i].strip()):
            buf.append(lines[i].strip()); i += 1
        if not buf:
            # hicbir dala girmeyen satir (ornegin basliksiz tablo satiri):
            # oldugu gibi paragraf yap ve ILERLE — yoksa sonsuz dongu olur.
            buf.append(st); i += 1
        para = " ".join(buf)
        roots.extend(find_roots(para, sura_no, sura_name, cur_anchor))
        if is_mostly_arabic(para):
            out.append(f'<p class="ayah-ar standalone" dir="rtl" lang="ar">{esc(para)}</p>')
        else:
            out.append(f"<p>{inline(para)}</p>")
    return "\n".join(out)

# ---------- main ----------
def build():
    suras, roots = [], []
    for path in sorted(glob.glob(os.path.join(SRC, "*.md"))):
        base = os.path.basename(path)
        m = re.match(r"^(\d+)-", base)
        if not m:
            continue
        no = int(m.group(1))
        raw = open(path, encoding="utf-8").read()
        lines = raw.split("\n")
        title = base
        for ln in lines:
            if ln.startswith("# "):
                title = ln[2:].strip(); break
        name = re.sub(r"^\d+\.\s*", "", title).replace(" Sûresi", "").strip()
        SURA_NAMES[no] = name
        body_lines = [l for l in lines if not l.startswith("# ")]
        counters = [0]
        htmlbody = render_blocks(body_lines, no, name, roots, counters)
        words = len(re.findall(r"\S+", raw))
        ayah_ct = len(re.findall(r"^##\s+\d+/", raw, re.M))
        suras.append({"no": no, "name": name, "title": title, "html": htmlbody,
                      "words": words, "ayahs": ayah_ct})

    # kok dizini
    agg = {}
    seen = {}
    for r in roots:
        key = r["root"]
        e = agg.setdefault(key, {"root": key, "hits": []})
        sk = seen.setdefault(key, set())
        hk = (r["sura"], r["anchor"])
        if hk not in sk:
            sk.add(hk)
            e["hits"].append({"sura": r["sura"], "suraName": r["suraName"],
                              "anchor": r["anchor"], "ctx": r["ctx"][:190]})
    rootlist = sorted(agg.values(), key=lambda x: (-len(x["hits"]), x["root"]))
    rootlist = [r for r in rootlist if len(r["hits"]) >= 1][:400]

    total_words = sum(s["words"] for s in suras)
    total_ayahs = sum(s["ayahs"] for s in suras)

    os.makedirs(OUT, exist_ok=True)
    tpl = open(os.path.join(ROOT, "template.html"), encoding="utf-8").read()
    page = tpl.replace("/*__DATA__*/", "const SURAS=" + json.dumps(suras, ensure_ascii=False)
                       + ";const ROOTS=" + json.dumps(rootlist, ensure_ascii=False)
                       + ";const STATS=" + json.dumps({"words": total_words, "ayahs": total_ayahs,
                                                       "suras": len(suras)}, ensure_ascii=False) + ";")
    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(page)
    print(f"{len(suras)} sure | {total_ayahs} ayet bolumu | {total_words} kelime | "
          f"{len(rootlist)} kok | {len(page)//1024} KB")

if __name__ == "__main__":
    build()
