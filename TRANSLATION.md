# Translation guide — Turkish → English

Binding for every translator working on `tafsir/*.md` → `tafsir-en/*.md`.
Read this together with `STYLE.md`: the source obeys those rules, and the
translation must not break them.

The goal is **publishable English prose**, not a gloss. A reader who knows no
Turkish should never sense a translation underneath. But the argument, the
hedging, and the evidential distinctions are the substance of this text — they
are preserved exactly, even when that costs elegance.

---

## 1. What must NOT change

These carry the site's linking machinery. Alter one and thousands of links break.

| Element | Rule |
|---|---|
| File name | Identical. `tafsir/056-vakia.md` → `tafsir-en/056-vakia.md` |
| Ayah headings | `## 56/25-26 — <Arabic>` — numbers **and** Arabic verbatim |
| Arabic text | Never translated, transliterated away, or re-typed. Copy exactly, including diacritics |
| Root letters | `أ-ل-ف`, `ك-ت-ب` — copy exactly |
| Ayah references | `9/122`, `(51/54)`, `2/196-203` — digits and slash unchanged |
| File cross-references | `` `019-meryem.md` `` stays exactly, including the `.md` |
| `STYLE.md` reference | Keep as `` `STYLE.md` `` — the site turns it into a link |
| Tables | Same number of columns and rows, same order |
| `---` rules, heading levels | Same |
| Emphasis markers | `**bold**` and `*italic*` land on the equivalent English words |

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

**Also not a defect:** a paragraph beginning `3. ayet…` or `7. yüzyıl…`. In
CommonMark that parses as an ordered-list item, but `lib/md.ts` has no
ordered-list rule at all — it renders as an ordinary paragraph. Do not report it.

**Not a defect:** `**word**suffix` (a Turkish suffix glued to the closing `**`).
Strict CommonMark cannot close an intraword delimiter, but this site does not use
CommonMark — `lib/md.ts` matches `**…**` with a plain regex and renders it
correctly. Do not report these, and never move the delimiter: doing so changes
which words carry the emphasis.

---

## 2. Transliteration

The source uses Turkish orthography (*el-hamdü lillâh*, *îlâf*, *fe'l-ya'büdû*).
English uses **IJMES-light**: long vowels with macrons, `ʿayn` and `hamza`
marked, emphatic consonants dotted. No Turkish letters survive.

| Turkish | English | Example |
|---|---|---|
| el- / el-'l- | al- / al-…'l- | el-hamdü → al-ḥamdu |
| â î û | ā ī ū | îlâf → īlāf |
| ı | i | Kureyş → Quraysh |
| ü ö | u o | *büyût* → buyūt |
| ş | sh | Kureyş → Quraysh |
| ç | ch | — |
| c | j | *cîm* → jīm |
| ' (ayn) | ʿ | *fe'l-ya'büdû* → fa'l-yaʿbudū |
| ' (hamza) | ʾ | *kırâat* → qirāʾa |
| k (ق) | q | Kur'an → Qurʾān |
| h (ح) | ḥ | *hamd* → ḥamd |
| s (ص) | ṣ | *sırât* → ṣirāṭ |
| d (ض) | ḍ | *dalâl* → ḍalāl |
| t (ط) | ṭ | *tayyib* → ṭayyib |
| z (ظ) | ẓ | *zulm* → ẓulm |

Sūra names use the common English form: al-Fātiḥa, al-Baqara, Āl ʿImrān,
al-Nisāʾ, al-Māʾida, al-Anʿām, al-Aʿrāf, al-Anfāl, al-Tawba, Yūnus, Hūd, Yūsuf,
al-Raʿd, Ibrāhīm, al-Ḥijr, al-Naḥl, al-Isrāʾ, al-Kahf, Maryam, Ṭāhā …

Prophet names use the English-conventional form on first mention and after:
Abraham (Ibrāhīm), Moses (Mūsā), Jesus (ʿĪsā), Noah (Nūḥ), Joseph (Yūsuf),
Mary (Maryam), Lot (Lūṭ), Shuʿayb, Ṣāliḥ, Hūd. Give the Arabic in parentheses
at first mention **per file**, then use the English form alone.

File title line: **always** `# <no>. Sūrat <name>`, whether or not the Turkish
says "Sûresi" — the Turkish corpus is inconsistent here (67 of 114 have it), the
English is not. `# 106. Kureyş Sûresi` → `# 106. Sūrat Quraysh`;
`# 13. Ra'd` → `# 13. Sūrat al-Raʿd`. The site derives the display name by
stripping `Sūrat `, so the form must be uniform.

---

## 3. Fixed phrases

These recur thousands of times and encode the text's evidential grammar. Use the
right-hand column verbatim — never a synonym, never a paraphrase.

| Turkish | English |
|---|---|
| Bunu kendi okumam olarak kaydediyorum | I record this as my own reading |
| …ve bağlayıcı değildir | …and it is not binding |
| Bunu bir gözlem olarak kaydediyorum | I record this as an observation |
| Bunu bir dil gözlemi olarak kaydediyorum | I record this as an observation about the language |
| Bunu bir yapı gözlemi olarak kaydediyorum | I record this as an observation about the structure |
| Tercih yapılmıyor / tercih yapılmadı | No preference is adopted |
| Tercih dayatmıyorum | I do not impose a preference |
| Tekrarlamıyorum | I do not repeat it here |
| Bu tefsirde tercihim | My preference in this commentary |
| Hüküm kurulmuyor / kurulmadı | No ruling is issued |
| STYLE gereği | Per the method (`STYLE.md`) |
| KURAL gereği | Per the rule |
| …nakledilir | …is transmitted / it is reported that… |
| Klasik kaynaklarda yaygın olarak nakledilir | It is widely reported in the classical sources |
| …işlendi; oraya dayanıyorum | …was treated there; I rely on that treatment |
| …da işlendi | …was also treated at… |
| Bu, metinden doğrulanabilir bir tekrardır | This is a repetition that can be verified from the text |
| Bu, metinden doğrulanabilir bir veridir | This is a datum that can be verified from the text |
| Müfessirler ayrılır / ayrıldığında | The exegetes differ / where the exegetes differ |
| İhtilaf gizlenmez | The disagreement is not concealed |
| Bu bölümde kesin konuşulmayan yerler | Where this section does not speak with certainty |
| Sûrenin bütünü — geriye bakış | The sūra as a whole — looking back |
| Bugüne bakan yönü | What this says to the present |
| Sûrenin yapısı | The structure of the sūra |
| Sûrenin adı | The name of the sūra |
| Mekkî mi Medenî mi | Meccan or Medinan |
| Ne yapılmadı | What was not done |
| Dilciler … kaydeder | The lexicographers record… |
| Kökün somut anlamı | The concrete sense of the root |

Section sub-headings: `### Kelimeler` → `### The words`; `### Dizim` → `### Word
order`; `### Siyak` → `### Context`; `### Tarihî arka plan` → `### Historical
background`.

---

## 4. Terminology

| Turkish | English |
|---|---|
| kök | root |
| türev | derivative |
| kalıp / vezin | pattern / form |
| bâb (I., IV., X. bâb) | form (Form I, Form IV, Form X) |
| masdar | verbal noun |
| ism-i fâil / ism-i mef'ûl | active participle / passive participle |
| mübalağa kalıbı | intensive form |
| ettirgen | causative |
| dizim | word order |
| hasr | restriction |
| teb'îz (min) | partitive |
| te'kid | emphasis |
| iltifat | shift of address |
| siyak | context |
| nakil / rivayet | transmitted report / report |
| müfessir | exegete |
| tefsir | tafsīr, exegesis |
| kıraat | variant reading |
| nüzul sebebi | occasion of revelation |
| mushaf | muṣḥaf, the written codex |
| fıkhî hüküm | legal ruling |
| mezhep | school of law |
| vasıf | attribute |
| ayet | verse (use "verse" in prose; keep digits in references) |
| sûre | sūra |
| besmele | the basmala |
| ehl-i kitap | the People of the Book |

Where a term is genuinely technical, give the transliteration once with a gloss
— *iltifāt* (a shift in the direction of address) — then use the English.

---

## 5. Voice

The source is calm, exact and unsentimental. It explains; it never preaches,
never addresses the reader as "O mankind", never scolds. Keep that.

- Short declarative sentences. The Turkish often front-loads emphasis with bold;
  keep the bold on the English words that carry the same weight.
- Keep the first person singular where the source uses it ("I record", "I rely
  on", "my reading"). It is what separates the text's own claims from
  transmitted material — the single most important distinction in the whole
  corpus.
- Keep hedges exactly as strong or as weak as the original. Never upgrade
  "it is reported" into "it is established". Never downgrade a flat statement
  into a hedge.
- Do not add. Do not explain what the source leaves unexplained. Do not insert
  a scholar's name, a hadith source, or a date that is not in the Turkish.
- Do not omit. Every sentence in the source has a counterpart in the output.

---

## 4b. Corpus precedents

These were fixed while translating al-Fātiḥa and Quraysh — the two most-cited
files. Follow them everywhere; do not re-decide them per file.

| Turkish | English |
|---|---|
| besmele | the basmala |
| hamd | praise (*ḥamd* where the word itself is under discussion) |
| medih / şükür / hamd | commendation (*madḥ*) / thanks (*shukr*) / *ḥamd* |
| rab | Lord; *Rabbü'l-âlemîn* → the Lord of all the worlds |
| terbiye | nurture |
| Rahmân / Rahîm | **al-Raḥmān / al-Raḥīm** — kept as names, not translated; glossed once |
| sırât-ı müstakîm | the straight path |
| sebîl / tarîk / sırât / sübül | sabīl / ṭarīq / ṣirāṭ / subul |
| ibadet | service (the act generally: worship); *ʿibāda* |
| istiâne | asking for help; *istiʿāna* |
| Mâlik / Melik | Mālik (owner) / Malik (sovereign) |
| mütevatir kıraat | a variant reading transmitted by mass transmission |
| kesik / ebter | cut off |
| hasr | restriction (*ḥaṣr*) |
| fasıla | verse-ending |
| azamet çoğulu | plural of majesty (*taʿẓīm*) |
| taskhīr (سخّر) | to make subservient — keep verb and noun visibly one family |
| ehad / vâhid | **aḥad / wāḥid** — kept transliterated; the argument turns on the pair |
| samed | **al-Ṣamad** — kept as a name, glossed once |
| küfüv / kefâet | **kufuw / kafāʾa** — "equal, match"; keep distinct from *mithl* → "like" |
| lem yelid ve lem yûled | "He has not begotten, and He has not been begotten" |
| zât / sıfat | Essence / attribute |
| müşrikler | the mushrikūn |
| Allah | **God** in prose; *Allāh* only where the name itself is under discussion |
| tevhîd / tenzîh / teşbîh | tawḥīd / tanzīh / tashbīh |
| nefy / isbat | negation (*nafy*) / affirmation (*ithbāt*) |
| muzâri / mâzî | imperfect (*muḍāriʿ*) / perfect (*māḍī*) |
| velâyet | **walāya**, glossed once as "the bond of mutual protection" |
| enfâl / ganimet | spoils |
| künye | **kunya**, glossed "(his by-name)" at first use |

Sūra names follow the source: if the Turkish names sūra 40 as *Mü'min*, write
**al-Muʾmin**, not Ghāfir.

---

## 5b. Remarks about Turkish

The source sometimes argues from Turkish itself: a word borrowed from Arabic has
drifted in Turkish (*hüsran* has taken on an emotional colour), or Turkish splits
a single Arabic root across two unrelated words. A reader with no Turkish cannot
follow these, and leaving them untouched makes the English read like a report on
a third language.

**Recast the remark onto English**, keeping the argument and its function:

- *"Türkçede tek kelimeyle karşılanamaz"* → "no single English word carries it"
- *"Türkçedeki karşılıkları ilginç bir sapma göstermiş"* → "the usual English
  renderings show an interesting drift"
- The gap between *vasiyet* and *tavsiye* → the gap between **bequest** and
  **advice**

**Hard limit: never invent a fact about English.** If the Turkish argument rests
on the two words sharing a root, and the English pair does not, say so — "English
covers the two ends of this root with two unconnected words" is correct and
usable; claiming an English etymology that does not exist is a fabrication and
breaks `STYLE.md` outright. When no honest English recasting exists, keep the
Turkish example and gloss it: *"in Turkish, the borrowed word X has come to
mean Y"*.

Note every recasting in your final report.

---

## 6. Mechanics

Write with `cat >> tafsir-en/NNN-name.md <<'MDEOF' … MDEOF` in chunks, in order,
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
python3 check.py --dir tafsir-en <sûre no>   # must print "tam"
python3 check.py --dir tafsir-en atif
python3 check.py --dir tafsir-en ayet
python3 check.py kalin <sûre no>             # source: nested bold
python3 check.py --dir tafsir-en kalin <sûre no>
```

### Nested bold — use the checker, do not hand-roll one

`check.py kalin` is the authority on nested bold. Do **not** write your own
scan: counting `**` gives false positives on `**word**suffix`, and an
open/close state machine gives false positives on `*a **b***`, which is a
settled idiom in this corpus and renders correctly. The checker replicates
`lib/md.ts` — it flags a line only when a `<strong>` would open or close in the
wrong place. Report what it prints for the source, and make sure it prints
nothing for your translation beyond what the source already has.

`atif` prints "(N hedef henuz cevrilmedi)" while the corpus is partial — that is
information, not a failure. A real failure names a file and a missing target.

Then report: which sūra, line count, and anything you flagged.

Do not touch `INDEX.md`, `README.md`, the `app/` directory, or any Turkish
file. Do not run `npm run build`.
