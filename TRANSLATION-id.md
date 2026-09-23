# Translation guide — Turkish → Indonesian

Binding for every translator working on `tafsir/*.md` → `tafsir-id/*.md`.
Read this together with `STYLE.md` and `STYLE-id.md`: the source obeys those
rules, and the translation must not break them.

The goal is **publishable Indonesian prose** (*bahasa Indonesia baku yang
wajar*), not a gloss. A reader who knows no Turkish should never sense a
translation underneath. But the argument, the hedging, and the evidential
distinctions are the substance of this text — they are preserved exactly, even
when that costs elegance.

The English guide (`TRANSLATION.md`) is the sibling of this file. Where the two
disagree, this one governs the Indonesian corpus; where this one is silent, the
English one is the precedent.

---

## 1. What must NOT change

These carry the site's linking machinery. Alter one and thousands of links break.

| Element | Rule |
|---|---|
| File name | Identical, **including the Turkish slug**. `tafsir/056-vakia.md` → `tafsir-id/056-vakia.md` — never `056-al-waqiah.md` |
| Ayah headings | `## 56/25-26 — <Arabic>` — numbers **and** Arabic verbatim |
| Arabic text | Never translated, transliterated away, or re-typed. Copy exactly, including diacritics |
| Root letters | `أ-ل-ف`, `ك-ت-ب` — copy exactly |
| Ayah references | `9/122`, `(51/54)`, `2/196-203` — digits and slash unchanged |
| File cross-references | `` `019-meryem.md` `` stays exactly, including the `.md` and the Turkish slug |
| `STYLE.md` reference | Keep as `` `STYLE.md` `` — the site turns it into a link, labelled *Metode* |
| Tables | Same number of columns and rows, same order |
| `---` rules, heading levels | Same |
| Emphasis markers | `**bold**` and `*italic*` land on the equivalent Indonesian words |

Never merge or split an ayah section. Never reorder blocks. If the source has a
mistake, translate the mistake and flag it in your final report — do not fix it
silently.

**Report source defects with line numbers.** Two classes recur and cannot be
found by any corpus-wide scan, so your report is the only way they get fixed:

- **Nested bold** — `**… **inner** …**`. Markdown does not nest `**`, so the
  inner span renders as plain text inside a bold run. Mirror it as the source
  has it and list the line numbers; they are repaired afterwards by keeping the
  outer pair and dropping the inner ones.
- **Ragged tables** — a row whose cell count differs from the header's.

Both are silent on the page: no stray `**` is visible, the table simply renders
with the wrong number of columns.

**Not a defect:** a paragraph beginning `3. ayet…` or `7. yüzyıl…`. In
CommonMark that parses as an ordered-list item, but `lib/md.ts` has no
ordered-list rule at all — it renders as an ordinary paragraph. Do not report
it, and do not let it push you into rewording the Indonesian sentence.

**Not a defect:** `**kata**-nya` (a suffix glued to the closing `**`). Strict
CommonMark cannot close an intraword delimiter, but this site does not use
CommonMark — `lib/md.ts` matches `**…**` with a plain regex and renders it
correctly. Do not report these, and never move the delimiter: doing so changes
which words carry the emphasis.

---

## 2. Spelling of Arabic words

Indonesian already owns most of this vocabulary. The rule is a division of
labour between two registers:

| Where | Which form | Example |
|---|---|---|
| Ordinary prose | The **KBBI** form, upright, no diacritics | tafsir, mufasir, ayat, surah, hadis, qiraat, mazhab, tauhid, musyrik, rahmat, ibadah, syukur, sedekah, salat |
| The Arabic word **as an object of discussion** | The **SKB** transliteration, in italics, with diacritics | *ḥamd*, *ṣirāṭ*, *ʻibādah*, *isti'ānah*, *waḥīd* |

So: "kata **hamd** dalam ayat ini" (prose, KBBI) but "*ḥamd* dibentuk dari akar
ح-م-د" (the word itself under discussion, SKB).

The SKB table (Surat Keputusan Bersama 158/1987), as used here:

| Arabic | SKB | Arabic | SKB |
|---|---|---|---|
| ث | ṡ (ts) | ص | ṣ |
| ح | ḥ | ض | ḍ |
| خ | kh | ط | ṭ |
| ذ | ż (dz) | ظ | ẓ |
| ز | z | ع | ʻ |
| ش | sy | غ | g (gh) |
| ق | q | ء | ʼ |
| long vowels | ā ī ū | | |

Turkish orthography never survives. `el-hamdü lillâh` → *al-ḥamdu lillāh*;
`îlâf` → *īlāf*; `Kureyş` → Quraisy; `fe'l-ya'büdû` → *fal-yaʻbudū*;
`kırâat` → qiraat; `sırât` → *ṣirāṭ*; `zulüm` → zalim/kezaliman.

**Sūra names** use the form Indonesian readers know, with the article attached
and the sun letters assimilated: Al-Fatihah, Al-Baqarah, Ali 'Imran, An-Nisa',
Al-Ma'idah, Al-An'am, Al-A'raf, Al-Anfal, At-Taubah, Yunus, Hud, Yusuf,
Ar-Ra'd, Ibrahim, Al-Hijr, An-Nahl, Al-Isra', Al-Kahf, Maryam, Taha …

**Prophet and proper names** take their ordinary Indonesian form — Ibrahim,
Musa, Isa, Nuh, Yusuf, Maryam, Lut, Syu'aib, Saleh, Hud, Jibril. Indonesian
already uses the Arabic names, so nothing is glossed and nothing is doubled.

**File title line:** **always** `# <no>. Surah <Nama>`, whether or not the
Turkish says "Sûresi" — the Turkish corpus is inconsistent here (67 of 114 have
it), the Indonesian is not. `# 106. Kureyş Sûresi` → `# 106. Surah Quraisy`;
`# 13. Ra'd` → `# 13. Surah Ar-Ra'd`. The site derives the display name by
stripping `Surah `, so the form must be uniform.

---

## 3. Fixed phrases

These recur thousands of times and encode the text's evidential grammar. Use the
right-hand column verbatim — never a synonym, never a paraphrase.

| Turkish | Indonesian |
|---|---|
| Bunu kendi okumam olarak kaydediyorum | Saya catat ini sebagai bacaan saya sendiri |
| …ve bağlayıcı değildir | …dan hal itu tidak mengikat |
| Bunu bir gözlem olarak kaydediyorum | Saya catat ini sebagai sebuah pengamatan |
| Bunu bir dil gözlemi olarak kaydediyorum | Saya catat ini sebagai pengamatan kebahasaan |
| Bunu bir yapı gözlemi olarak kaydediyorum | Saya catat ini sebagai pengamatan atas struktur |
| Tercih yapılmıyor / tercih yapılmadı | Tidak ada pilihan yang diambil |
| Tercih dayatmıyorum | Saya tidak memaksakan pilihan |
| Tekrarlamıyorum | Saya tidak mengulanginya di sini |
| Bu tefsirde tercihim | Pilihan saya dalam tafsir ini |
| Hüküm kurulmuyor / kurulmadı | Tidak ada hukum yang ditetapkan |
| STYLE gereği | Sesuai metode (`STYLE.md`) |
| KURAL gereği | Sesuai aturan |
| …nakledilir | …diriwayatkan |
| Klasik kaynaklarda yaygın olarak nakledilir | Hal ini lazim diriwayatkan dalam sumber-sumber klasik |
| …işlendi; oraya dayanıyorum | …telah dibahas di sana; saya bersandar pada pembahasan itu |
| …da işlendi | …juga dibahas pada… |
| Bu, metinden doğrulanabilir bir tekrardır | Ini adalah pengulangan yang dapat diverifikasi dari teks |
| Bu, metinden doğrulanabilir bir veridir | Ini adalah data yang dapat diverifikasi dari teks |
| Müfessirler ayrılır / ayrıldığında | Para mufasir berbeda pendapat / ketika para mufasir berbeda |
| İhtilaf gizlenmez | Perbedaan pendapat tidak disembunyikan |
| Bu bölümde kesin konuşulmayan yerler | Hal-hal yang tidak dibicarakan dengan pasti di bagian ini |
| Sûrenin bütünü — geriye bakış | Surah secara keseluruhan — melihat ke belakang |
| Bugüne bakan yönü | Pesan untuk hari ini |
| Sûrenin yapısı | Struktur surah |
| Sûrenin adı | Nama surah |
| Mekkî mi Medenî mi | Makkiyah atau Madaniyah |
| Ne yapılmadı | Apa yang tidak dilakukan |
| Dilciler … kaydeder | Para ahli bahasa mencatat… |
| Kökün somut anlamı | Makna konkret akar kata |

Section sub-headings: `### Kelimeler` → `### Kata-kata`; `### Dizim` →
`### Susunan`; `### Siyak` → `### Siyaq`; `### Tarihî arka plan` →
`### Latar sejarah`; `### Bugüne bakan yönü` → `### Pesan untuk hari ini`.

---

## 4. Terminology

| Turkish | Indonesian |
|---|---|
| kök | akar kata |
| türev | turunan |
| kalıp / vezin | pola (*wazan*) |
| bâb (I., IV., X. bâb) | bab (bab I, bab IV, bab X) |
| masdar | masdar |
| ism-i fâil / ism-i mef'ûl | isim fa'il (partisipel aktif) / isim maf'ul (partisipel pasif) |
| mübalağa kalıbı | pola mubalagah (bentuk intensif) |
| ettirgen | kausatif |
| dizim | susunan kata |
| hasr | pembatasan (*ḥaṣr*) |
| teb'îz (min) | partitif |
| te'kid | penegasan (*taukid*) |
| iltifat | iltifat (perpindahan arah sapaan) |
| siyak | siyaq (konteks) |
| nakil / rivayet | riwayat |
| müfessir | mufasir |
| tefsir | tafsir |
| kıraat | qiraat |
| nüzul sebebi | sebab turun (*asbābun nuzūl*) |
| mushaf | mushaf |
| fıkhî hüküm | hukum fikih |
| mezhep | mazhab |
| vasıf | sifat |
| ayet | ayat (use the word in prose; keep digits in references) |
| sûre | surah |
| besmele | basmalah |
| ehl-i kitap | Ahli Kitab |

Where a term is genuinely technical, give the transliteration once with a gloss
— *iltifat* (perpindahan arah sapaan) — then use the Indonesian.

---

## 4b. Corpus precedents

Fixed while translating al-Fatihah — the most-cited file. Follow them
everywhere; do not re-decide them per file.

| Turkish | Indonesian |
|---|---|
| Allah | **Allah** — never rendered "Tuhan" when the source says "Allah" |
| Tanrı (the generic word) | Tuhan |
| besmele | basmalah |
| hamd | pujian (*ḥamd* where the word itself is under discussion) |
| medih / şükür / hamd | sanjungan (*madḥ*) / syukur (*syukr*) / *ḥamd* |
| rab | Tuhan; *Rabbü'l-âlemîn* → Tuhan seluruh alam |
| terbiye | pemeliharaan (yang mengasuh sampai matang) |
| Rahmân / Rahîm | **Ar-Rahman / Ar-Rahim** — kept as names, not translated; glossed once |
| sırât-ı müstakîm | jalan yang lurus |
| sebîl / tarîk / sırât / sübül | *sabīl* / *ṭarīq* / *ṣirāṭ* / *subul* |
| ibadet | penghambaan (the act generally: ibadah); *ʻibādah* |
| istiâne | memohon pertolongan; *istiʻānah* |
| Mâlik / Melik | *Mālik* (pemilik) / *Malik* (raja) — the long vowel is the whole distinction; keep it |
| mütevatir kıraat | qiraat mutawatir |
| kesik / ebter | terputus (*abtar*) |
| hasr | pembatasan (*ḥaṣr*) |
| fasıla | penutup ayat (*fāṣilah*) |
| azamet çoğulu | jamak pengagungan (*taʻẓīm*) |
| teshîr (سخّر) | penundukan / menundukkan — keep verb and noun visibly one family |
| ehad / vâhid | **aḥad / wāḥid** — kept transliterated; the argument turns on the pair |
| samed | **aṣ-Ṣamad** — kept as a name, glossed once |
| küfüv / kefâet | **kufu / kafaah** — "sepadan, setara"; keep distinct from *miṡl* → "serupa" |
| lem yelid ve lem yûled | "Dia tidak beranak dan tidak diperanakkan" |
| zât / sıfat | Zat / sifat |
| müşrikler | kaum musyrik |
| tevhîd / tenzîh / teşbîh | tauhid / tanzih / tasybih |
| nefy / isbat | penafian (*nafi*) / penetapan (*iṡbāt*) |
| muzâri / mâzî | *muḍāriʻ* (imperfek) / *māḍī* (perfek) |
| velâyet | **walayah**, glossed once as "ikatan saling melindungi" |
| enfâl / ganimet | rampasan perang |
| künye | **kunyah**, glossed "(nama panggilan kekerabatannya)" at first use |

Sūra names follow the source: if the Turkish names sūra 40 as *Mü'min*, write
**Al-Mu'min**, not Gafir.

---

## 5. Voice

The source is calm, exact and unsentimental. It explains; it never preaches,
never addresses the reader as "wahai manusia", never scolds. Keep that.

- Short declarative sentences. The Turkish often front-loads emphasis with bold;
  keep the bold on the Indonesian words that carry the same weight.
- Keep the first person singular where the source uses it — **saya**, never
  *kami* and never an impersonal construction. "Saya catat", "saya bersandar
  pada", "bacaan saya". It is what separates the text's own claims from
  transmitted material — the single most important distinction in the whole
  corpus.
- Baku register throughout: *tidak* not *nggak*, *hanya* not *cuma*, *karena*
  not *karna*. But not stiff: prefer the natural Indonesian order to a Turkish
  word order carried over whole.
- Passive voice is normal in Indonesian and is the right choice for the
  transmission formulas (*diriwayatkan*, *disebutkan*, *ditafsirkan*). Do not
  turn those into an active sentence with an invented subject.
- Keep hedges exactly as strong or as weak as the original. Never upgrade
  "nakledilir" into "telah ditetapkan". Never downgrade a flat statement into a
  hedge.
- Do not add. Do not explain what the source leaves unexplained. Do not insert
  a scholar's name, a hadith source, or a date that is not in the Turkish.
- Do not omit. Every sentence in the source has a counterpart in the output.

---

## 5b. Remarks about Turkish

The source sometimes argues from Turkish itself: a word borrowed from Arabic has
drifted in Turkish (*hüsran* has taken on an emotional colour), or Turkish
splits a single Arabic root across two unrelated words. A reader with no Turkish
cannot follow these, and leaving them untouched makes the Indonesian read like a
report on a third language.

**Recast the remark onto Indonesian**, keeping the argument and its function.
Indonesian borrowed the same vocabulary, often with its own drift, so a genuine
counterpart usually exists:

- *"Türkçede tek kelimeyle karşılanamaz"* → "tidak ada satu kata Indonesia yang
  memikulnya"
- The Turkish drift of *hüsran* → the Indonesian drift of **rugi / kerugian**
  against *khusrān*
- The gap between *vasiyet* and *tavsiye* → the gap between **wasiat** and
  **tausiah** — both are genuinely from و-ص-ي, so the shared root survives the
  recasting. *Nasihat* (ن-ص-ح) is a different root: name it as the lighter
  word if the argument needs one, never as a cognate

**Hard limit: never invent a fact about Indonesian.** If the Turkish argument
rests on two words sharing a root and the Indonesian pair does not, say so —
"dalam bahasa Indonesia kedua ujung akar ini dipikul dua kata yang tidak
berhubungan" is correct and usable; claiming an Indonesian etymology that does
not exist is a fabrication and breaks `STYLE.md` outright. When no honest
Indonesian recasting exists, keep the Turkish example and gloss it: *"dalam
bahasa Turki, kata serapan X telah bergeser menjadi Y"*.

Note every recasting in your final report.

---

## 6. Mechanics

Write with `cat >> tafsir-id/NNN-name.md <<'MDEOF' … MDEOF` in chunks, in order,
appending. Never rewrite a file you have already appended to.

**Scratch files must carry your sūra number.** Several translators run at the
same time and share the scratchpad directory. A generic name like `runs.json`
*has already been overwritten mid-task by another translator*, injecting another
sūra's Arabic into the wrong file. Name yours `runs-<no>.json`, `map-<no>.txt`,
and verify the Arabic against the source after substituting — a multiset and
sequence comparison catches exactly this.

Long files must be done in several passes — translate an ayah block, append,
continue. Do not summarise a block because it is long.

When finished with a file:

```bash
python3 check.py --dir tafsir-id <sûre no>   # must print "complete"
python3 check.py --dir tafsir-id refs
python3 check.py --dir tafsir-id verses
python3 check.py bold <sûre no>              # source: nested bold
python3 check.py --dir tafsir-id bold <sûre no>
```

### Nested bold — use the checker, do not hand-roll one

`check.py bold` is the authority on nested bold. Do **not** write your own
scan: counting `**` gives false positives on `**kata**-nya`, and an open/close
state machine gives false positives on `*a **b***`, which is a settled idiom in
this corpus and renders correctly. The checker replicates `lib/md.ts` — it flags
a line only when a `<strong>` would open or close in the wrong place. Report what
it prints for the source, and make sure it prints nothing for your translation
beyond what the source already has.

`refs` prints "(N targets not translated yet)" while the corpus is partial —
that is information, not a failure. A real failure names a file and a missing
target.

Then report: which sūra, line count, and anything you flagged.

Do not touch `INDEX.md`, `README.md`, the `app/` directory, or any Turkish or
English file. Do not run `npm run build`.
