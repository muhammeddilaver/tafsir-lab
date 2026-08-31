#!/usr/bin/env python3
"""Ayet kapsam kontrolu: her tefsir/*.md dosyasinda hangi ayetler islenmis?

Kullanim:  python3 kontrol.py                    -> eksigi olan sureleri listeler
           python3 kontrol.py 2                  -> tek sure detayi
           python3 kontrol.py atif | ayet        -> referans denetimi
           python3 kontrol.py --dir tefsir-en …  -> baska bir korpus (ceviri)
"""
import re, os, sys, glob

# sure no -> ayet sayisi
AYET = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,
        112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,
        37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,
        44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,
        19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6]

# Ayri basligi olmayan ama toplu islenmis ayetler:
# sure_no -> (ayet listesi, gerekce)
ISTISNA = {
    55: (
        [16, 18, 21, 23, 25, 28, 30],
        "nakarat (fe-bi-eyyi alai rabbikuma tukezziban) — ayri bir bolumde toplu islendi",
    ),
}

def kapsam(path, no):
    s = open(path, encoding="utf-8").read()
    cov = set()
    for m in re.finditer(rf"^##\s+{no}/(\d+)(?:\s*-\s*(\d+))?", s, re.M):
        a = int(m.group(1)); b = int(m.group(2) or a)
        cov.update(range(a, b + 1))
    return cov

def araliklar(nums):
    out, start, prev = [], None, None
    for n in sorted(nums) + [None]:
        if start is None:
            start = prev = n; continue
        if n is not None and n == prev + 1:
            prev = n; continue
        out.append(str(start) if start == prev else f"{start}-{prev}")
        start = prev = n
    return ", ".join(out)

# Hangi korpus denetleniyor: tefsir/ (Turkce) ya da tefsir-en/ (Ingilizce)
DIZIN = "tefsir"

def dosyalar():
    kok = os.path.dirname(os.path.abspath(__file__))
    return sorted(glob.glob(os.path.join(kok, DIZIN, "*.md")))

def atif_kontrol():
    """Dosyalar arasi `NNN-ad.md` atiflari gercekten var mi?

    Ceviri korpusu (tefsir-en) yarim oldugunda, henuz cevrilmemis bir
    sureye yapilan atif KIRIK degildir: hedef kanonik korpusta (tefsir/)
    vardir, yalnizca ceviri sirasi gelmemistir. Ikisi ayri raporlanir.
    """
    kok = os.path.dirname(os.path.abspath(__file__))
    kanonik = {os.path.basename(f)
               for f in glob.glob(os.path.join(kok, "tefsir", "*.md"))}
    var = {os.path.basename(f) for f in dosyalar()}
    kirik, bekleyen = {}, set()
    for f in dosyalar():
        s = open(f, encoding="utf-8").read()
        for m in sorted(set(re.findall(r"`(\d{3}-[a-z]+\.md)`", s))):
            if m in var:
                continue
            if m in kanonik:
                bekleyen.add(m)          # cevrilmeyi bekliyor
            else:
                kirik.setdefault(os.path.basename(f), []).append(m)
    if kirik:
        for k, v in kirik.items():
            print(f"{k} -> olmayan dosyaya atif: {', '.join(v)}")
    else:
        print("Butun dosya atiflari gecerli."
              + (f" ({len(bekleyen)} hedef henuz cevrilmedi)" if bekleyen else ""))

def ayet_kontrol():
    """Metinde gecen 'sure/ayet' referanslari gecerli mi?

    USLUP: "Ayet referanslari (sure adi + numara) dogru olmali."
    Sure numarasi 1-114 disinda ya da ayet numarasi o surenin ayet
    sayisindan buyukse bildirir.
    """
    hatali = {}
    # "12/34" ya da "12/34-56" bicimindeki referanslar
    rx = re.compile(r"\b(\d{1,3})/(\d{1,3})(?:-(\d{1,3}))?\b")
    # miras paylari gibi kesirler ayet referansi degildir
    KESIR = {"1/2", "1/3", "1/4", "1/5", "1/6", "1/8", "2/3", "3/4"}
    for f in dosyalar():
        s = open(f, encoding="utf-8").read()
        for m in rx.finditer(s):
            satir_bas = s.rfind("\n", 0, m.start()) + 1
            satir = s[satir_bas:s.find("\n", m.start())]
            if m.group(0) in KESIR and satir.lstrip().startswith("|"):
                continue
            sure = int(m.group(1))
            for g in (m.group(2), m.group(3)):
                if g is None:
                    continue
                ayet = int(g)
                if not (1 <= sure <= 114):
                    hatali.setdefault(os.path.basename(f), set()).add(m.group(0))
                elif ayet < 1 or ayet > AYET[sure - 1]:
                    hatali.setdefault(os.path.basename(f), set()).add(
                        f"{m.group(0)} (sure {sure} = {AYET[sure-1]} ayet)")
    if hatali:
        for k in sorted(hatali):
            print(f"{k} -> {', '.join(sorted(hatali[k]))}")
    else:
        print("Butun ayet referanslari gecerli araliklarda.")


R_EM3 = re.compile(r"\*\*\*([^*\n]+)\*\*\*")
R_EM2 = re.compile(r"\*\*((?:[^*]|\*(?!\*))+?)\*\*")

def kalin_bozuk(satir):
    """Ic ice kalin vurgu. lib/md.ts once ***x*** kalibini, sonra **x**
    kalibini isler; `**a **b** c**` yazilinca ortadaki kelime <strong>
    disinda kalir ve etiketler ic ice gecer. Isaret: <strong> icerigi
    bosluk ile basliyor ya da bitiyor."""
    t = R_EM3.sub(lambda m: "\x01" + m.group(1) + "\x02", satir)
    if re.search(r"\*{4,}", satir):
        return True          # ****x** gibi cift acilis; render bozulur
    return any(m.group(1) != m.group(1).strip() for m in R_EM2.finditer(t))

def kalin_kontrol(hedef=None):
    toplam = 0
    for path in dosyalar():
        m = re.match(r"^(\d+)-", os.path.basename(path))
        if not m:
            continue
        if hedef and int(hedef) != int(m.group(1)):
            continue
        with open(path, encoding="utf-8") as f:
            kotu = [i + 1 for i, l in enumerate(f.read().split("\n")) if kalin_bozuk(l)]
        if kotu:
            toplam += len(kotu)
            print(f"{os.path.basename(path):22s} {len(kotu):4d} satir: "
                  + ", ".join(str(n) for n in kotu[:20])
                  + (" ..." if len(kotu) > 20 else ""))
    if toplam:
        print(f"Ic ice kalin vurgu: {toplam} satir.")
    else:
        print("Ic ice kalin vurgu yok.")

def main():
    global DIZIN
    args = sys.argv[1:]
    if args and args[0] == "--dir":
        DIZIN = args[1]; args = args[2:]
    sys.argv = [sys.argv[0]] + args
    if len(sys.argv) > 1 and sys.argv[1] == "ayet":
        ayet_kontrol(); return
    if len(sys.argv) > 1 and sys.argv[1] == "atif":
        atif_kontrol(); return
    if len(sys.argv) > 1 and sys.argv[1] == "kalin":
        kalin_kontrol(sys.argv[2] if len(sys.argv) > 2 else None); return
    hedef = sys.argv[1] if len(sys.argv) > 1 else None
    eksikli = 0
    for path in dosyalar():
        m = re.match(r"^(\d+)-", os.path.basename(path))
        if not m:
            continue
        no = int(m.group(1))
        if hedef and int(hedef) != no:
            continue
        toplam = AYET[no - 1]
        cov = kapsam(path, no)
        eksik = [n for n in range(1, toplam + 1) if n not in cov]
        muaf, gerekce = ISTISNA.get(no, ([], ""))
        gecerli = [n for n in eksik if n not in muaf]
        if gerekce and hedef:
            print(f"    not: {araliklar([n for n in eksik if n in muaf])} -> {gerekce}")
        eksik = gecerli
        if eksik or hedef:
            eksikli += 1
            print(f"{no:3d} {os.path.basename(path):22s} {len(cov):4d}/{toplam:3d}"
                  + (f"  EKSIK: {araliklar(eksik)}" if eksik else "  tam"))
    if not eksikli:
        print("Butun dosyalarda ayet kapsami tam.")

if __name__ == "__main__":
    main()
