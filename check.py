#!/usr/bin/env python3
"""Verse coverage check: which verses does each tafsir/*.md file treat?

Usage:  python3 check.py                    -> list suras with gaps
        python3 check.py 2                  -> detail for one sura
        python3 check.py refs | verses      -> reference checks
        python3 check.py bold               -> nested bold emphasis
        python3 check.py --dir tafsir-en …  -> another corpus (translation)
"""
import re, os, sys, glob

# sura number -> verse count
VERSES = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,
        112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,
        37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,
        44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,
        19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6]

# Verses with no heading of their own, treated together elsewhere:
# sura_no -> (verse list, reason)
EXEMPT = {
    55: (
        [16, 18, 21, 23, 25, 28, 30],
        "refrain (fa-bi-ayyi alai rabbikuma tukazzibani) — treated together in its own section",
    ),
}

def coverage(path, no):
    s = open(path, encoding="utf-8").read()
    cov = set()
    for m in re.finditer(rf"^##\s+{no}/(\d+)(?:\s*-\s*(\d+))?", s, re.M):
        a = int(m.group(1)); b = int(m.group(2) or a)
        cov.update(range(a, b + 1))
    return cov

def ranges(nums):
    out, start, prev = [], None, None
    for n in sorted(nums) + [None]:
        if start is None:
            start = prev = n; continue
        if n is not None and n == prev + 1:
            prev = n; continue
        out.append(str(start) if start == prev else f"{start}-{prev}")
        start = prev = n
    return ", ".join(out)

# Which corpus is checked: tafsir/ (Turkish) or tafsir-en/ (English)
SRC_DIR = "tafsir"

def files():
    root = os.path.dirname(os.path.abspath(__file__))
    return sorted(glob.glob(os.path.join(root, SRC_DIR, "*.md")))

def check_refs():
    """Do the cross-file `NNN-name.md` references actually resolve?

    While the translation corpus (tafsir-en) is incomplete, a reference to a
    not-yet-translated sura is NOT broken: the target exists in the canonical
    corpus (tafsir/), it just has not been translated yet. The two cases are
    reported separately.
    """
    root = os.path.dirname(os.path.abspath(__file__))
    canonical = {os.path.basename(f)
                 for f in glob.glob(os.path.join(root, "tafsir", "*.md"))}
    present = {os.path.basename(f) for f in files()}
    broken, pending = {}, set()
    for f in files():
        s = open(f, encoding="utf-8").read()
        for m in sorted(set(re.findall(r"`(\d{3}-[a-z]+\.md)`", s))):
            if m in present:
                continue
            if m in canonical:
                pending.add(m)           # awaiting translation
            else:
                broken.setdefault(os.path.basename(f), []).append(m)
    if broken:
        for k, v in broken.items():
            print(f"{k} -> reference to a missing file: {', '.join(v)}")
    else:
        print("All file references resolve."
              + (f" ({len(pending)} targets not translated yet)" if pending else ""))

def check_verses():
    """Are the 'sura/verse' references in the text valid?

    STYLE: "Verse references (sura name + number) must be correct."
    Reports a sura number outside 1-114, or a verse number greater than that
    sura's verse count.
    """
    bad = {}
    # references of the form "12/34" or "12/34-56"
    rx = re.compile(r"\b(\d{1,3})/(\d{1,3})(?:-(\d{1,3}))?\b")
    # fractions such as inheritance shares are not verse references
    FRACTIONS = {"1/2", "1/3", "1/4", "1/5", "1/6", "1/8", "2/3", "3/4"}
    for f in files():
        s = open(f, encoding="utf-8").read()
        for m in rx.finditer(s):
            line_start = s.rfind("\n", 0, m.start()) + 1
            line = s[line_start:s.find("\n", m.start())]
            if m.group(0) in FRACTIONS and line.lstrip().startswith("|"):
                continue
            sura = int(m.group(1))
            for g in (m.group(2), m.group(3)):
                if g is None:
                    continue
                verse = int(g)
                if not (1 <= sura <= 114):
                    bad.setdefault(os.path.basename(f), set()).add(m.group(0))
                elif verse < 1 or verse > VERSES[sura - 1]:
                    bad.setdefault(os.path.basename(f), set()).add(
                        f"{m.group(0)} (sura {sura} has {VERSES[sura-1]} verses)")
    if bad:
        for k in sorted(bad):
            print(f"{k} -> {', '.join(sorted(bad[k]))}")
    else:
        print("All verse references are within range.")


R_EM3 = re.compile(r"\*\*\*([^*\n]+)\*\*\*")
R_EM2 = re.compile(r"\*\*((?:[^*]|\*(?!\*))+?)\*\*")

def broken_bold(line):
    """Nested bold emphasis. lib/md.ts handles ***x*** first and **x**
    second; writing `**a **b** c**` leaves the middle word outside <strong>
    and the tags interleave. Tell-tale sign: the <strong> content starts or
    ends with whitespace."""
    t = R_EM3.sub(lambda m: "\x01" + m.group(1) + "\x02", line)
    if re.search(r"\*{4,}", line):
        return True          # a double opener such as ****x**; rendering breaks
    return any(m.group(1) != m.group(1).strip() for m in R_EM2.finditer(t))

def check_bold(target=None):
    total = 0
    for path in files():
        m = re.match(r"^(\d+)-", os.path.basename(path))
        if not m:
            continue
        if target and int(target) != int(m.group(1)):
            continue
        with open(path, encoding="utf-8") as f:
            bad = [i + 1 for i, l in enumerate(f.read().split("\n")) if broken_bold(l)]
        if bad:
            total += len(bad)
            print(f"{os.path.basename(path):22s} {len(bad):4d} lines: "
                  + ", ".join(str(n) for n in bad[:20])
                  + (" ..." if len(bad) > 20 else ""))
    if total:
        print(f"Nested bold emphasis: {total} lines.")
    else:
        print("No nested bold emphasis.")

def main():
    global SRC_DIR
    args = sys.argv[1:]
    if args and args[0] == "--dir":
        SRC_DIR = args[1]; args = args[2:]
    sys.argv = [sys.argv[0]] + args
    if len(sys.argv) > 1 and sys.argv[1] == "verses":
        check_verses(); return
    if len(sys.argv) > 1 and sys.argv[1] == "refs":
        check_refs(); return
    if len(sys.argv) > 1 and sys.argv[1] == "bold":
        check_bold(sys.argv[2] if len(sys.argv) > 2 else None); return
    target = sys.argv[1] if len(sys.argv) > 1 else None
    flagged = 0
    for path in files():
        m = re.match(r"^(\d+)-", os.path.basename(path))
        if not m:
            continue
        no = int(m.group(1))
        if target and int(target) != no:
            continue
        total = VERSES[no - 1]
        cov = coverage(path, no)
        missing = [n for n in range(1, total + 1) if n not in cov]
        exempt, reason = EXEMPT.get(no, ([], ""))
        real = [n for n in missing if n not in exempt]
        if reason and target:
            print(f"    note: {ranges([n for n in missing if n in exempt])} -> {reason}")
        missing = real
        if missing or target:
            flagged += 1
            print(f"{no:3d} {os.path.basename(path):22s} {len(cov):4d}/{total:3d}"
                  + (f"  MISSING: {ranges(missing)}" if missing else "  complete"))
    if not flagged:
        print("Verse coverage is complete in every file.")

if __name__ == "__main__":
    main()
