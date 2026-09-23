#!/usr/bin/env python3
"""Compare the three corpora line for line.

check.py tests one directory at a time: is every verse treated, do the
references resolve. It cannot see the invariant that matters once a file
exists in three languages — that the three are the *same* text, line for
line, with the Arabic, the verse references and the file citations in the
same order and the same number of times.

    python3 align.py                 # every file
    python3 align.py 002-bakara.md   # named files only
"""
import collections
import glob
import os
import re
import sys

DIRS = ("tafsir", "tafsir-en", "tafsir-id")
ARABIC = r"[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]"
R_RUN = re.compile(rf"{ARABIC}(?:[\s‏]*{ARABIC})*")
R_VERSE = re.compile(r"\b\d{1,3}/\d{1,3}(?:-\d{1,3})?\b")
R_FILE = re.compile(r"`(\d{3}-[a-z\-]+\.md)`")
R_HEAD = re.compile(r"^## (\d+/[\d–\-·]+)", re.M)


def shape(line):
    """What kind of line this is — enough to catch a lost paragraph."""
    if not line.strip():
        return "blank"
    if line.startswith("---"):
        return "rule"
    m = re.match(r"(#+)\s", line)
    if m:
        return f"h{len(m.group(1))}"
    stripped = line.lstrip()
    if stripped.startswith("|"):
        return f"table{line.count('|')}"
    if stripped.startswith(">"):
        return "quote"
    return "text"


def features(text):
    return {
        "runs": R_RUN.findall(text),
        "verses": collections.Counter(R_VERSE.findall(text)),
        "files": collections.Counter(R_FILE.findall(text)),
        "heads": R_HEAD.findall(text),
        "shapes": [shape(l) for l in text.split("\n")],
    }


def compare(name):
    text = {d: open(os.path.join(d, name), encoding="utf-8").read() for d in DIRS}
    f = {d: features(text[d]) for d in DIRS}
    lines = {d: len(text[d].split("\n")) for d in DIRS}
    problems = []
    if len(set(lines.values())) != 1:
        problems.append("line counts " + ", ".join(f"{d}={n}" for d, n in lines.items()))
    for d in DIRS[1:]:
        if f[d]["runs"] != f[DIRS[0]]["runs"]:
            problems.append(f"{d}: the Arabic runs differ")
        if f[d]["verses"] != f[DIRS[0]]["verses"]:
            problems.append(f"{d}: the verse references differ")
        if f[d]["files"] != f[DIRS[0]]["files"]:
            problems.append(f"{d}: the file citations differ")
        if f[d]["heads"] != f[DIRS[0]]["heads"]:
            problems.append(f"{d}: the ## headings differ")
        if len(set(lines.values())) == 1 and f[d]["shapes"] != f[DIRS[0]]["shapes"]:
            n = next(i for i, (x, y) in
                     enumerate(zip(f[DIRS[0]]["shapes"], f[d]["shapes"])) if x != y)
            problems.append(f"{d}: line {n + 1} is a different kind of line")
    return problems


def main():
    names = sys.argv[1:] or sorted(
        os.path.basename(p) for p in glob.glob(os.path.join(DIRS[0], "*.md")))
    bad = 0
    for name in names:
        if not all(os.path.exists(os.path.join(d, name)) for d in DIRS):
            continue
        problems = compare(name)
        if problems:
            bad += 1
            print(f"{name:22s} " + "; ".join(problems))
    print(f"{len(names)} files compared, {bad} out of line." if bad
          else f"{len(names)} files, all three languages line up.")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
