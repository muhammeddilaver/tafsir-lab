# Claude Tefsir

Claude ile yazılmış, ayet ayet kök tahlili esaslı Türkçe Kur'an tefsiri.
114 sûrenin tamamı, 6.236 ayet.

---

## Bu metni kim yazdı

**Tefsirin tamamı Claude (Anthropic) tarafından yazıldı.** Bunu başa koyuyorum,
çünkü okurun neyi okuduğunu bilmeye hakkı var.

Bu ne demek:

- Metin bir âlimin eseri değil, bir dil modelinin ürünüdür. **Dinî otoritesi
  yoktur** ve klasik tefsir literatürünün yerine geçmez.
- Bir dil modeli, ikna edici görünen yanlışlar üretebilir. Kelime kökleri,
  gramer açıklamaları, kıraat ve nakil bilgileri **yanlış olabilir**.
- Önemli bir konuda bu metne dayanacaksanız, önce klasik kaynaklardan
  doğrulayın.
- Amaç, tefsir geleneğinin yerini almak değil; ayetin dil dokusunu — kökleri,
  dizimi, sûre içi tekrarları — okunur biçimde önünüze koymak.

Yazım sırasında uyulan kurallar `USLUP.md` dosyasında ve sitedeki **Usul**
sayfasındadır. Öne çıkanlar:

| Kural | Karşılığı |
|---|---|
| Uydurma nakil yasak | Kaynağı verilemeyen söz bir müfessire/hadise nispet edilmez; emin olunmayan yerde "nakledilir" dili kullanılır |
| İhtilaf gizlenmez | Müfessirler ayrıldığında görüşler tablo hâlinde verilir, tercih dayatılmaz |
| Fıkhî hüküm verilmez | Mezhep görüşleri aktarılır, hüküm kurulmaz |
| Toptan hüküm yok | Hiçbir etnik ya da dinî grup hakkında topluca hüküm kurulmaz; ayetin tarif ettiği **vasıflardır** |
| Fennî mucize avcılığı yok | Ayete modern bilgi zorla giydirilmez; ebced/sayı hesabı kullanılmaz |
| Güncel siyaset yok | Taraf tutulmaz |
| Kendi okuması ayrılır | Metnin kendi çıkarımları "bunu kendi okumam olarak kaydediyorum" ibaresiyle nakilden ayrılır |

Depodaki denetim araçları **yapıyı** doğrular (her ayet işlenmiş mi, referanslar
geçerli mi), **doğruluğu değil**. Bir açıklamanın isabetli olup olmadığını
makine söyleyemez.

---

## İçerik

| Yol | Ne |
|---|---|
| `tefsir/NNN-ad.md` | 114 dosya — tek kaynak, sûre başına bir dosya |
| `USLUP.md` | Bağlayıcı usul ve üslup kuralları |
| `FIHRIST.md` | Dizin ve sûreler arası kurulan bağlar |

Ayet numaralandırması besmelesiz sayılır (Fâtiha'da 1 = *el-hamdü lillâh*).
Bölüm başlıkları `## <sûre>/<ayet> — <Arapça metin>` biçimindedir.

---

## Site

Next.js (App Router). Markdown build sırasında okunur, sayfaların tamamı
statik üretilir — sunucuda çalışan bir şey yok.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 3.116 sayfa, ~20 sn
npm start
```

### Bağlantı şeması

Her satır ve her ayet ayrı ayrı paylaşılabilir:

| Bağlantı | Gittiği yer |
|---|---|
| `/sure/9` | Sûrenin başı |
| `/sure/9#9/114` | 114. ayet — hangi bölümde işlendiyse oraya |
| `/sure/9#9/113-116` | Bölümün kendisi |
| `/sure/9#b0r19phq` | Tek bir paragraf, tablo ya da başlık |

Ayet bağlantıları 6.236 ayetin **tamamı** için tanımlıdır. Paragraf
bağlantıları içeriğin özetinden (hash) üretilir: o paragrafın metni
değişmedikçe kalıcıdır, metni düzenlerseniz eski bağlantı kırılır.

### Atıflar

Metindeki iki atıf biçimi de otomatik bağlanır:

| Metinde | Olur |
|---|---|
| `` `056-vakia.md` 56/25 `` | **Vâkıa 56/25** → `/sure/56#56/25` |
| `` `019-meryem.md` `` | **Meryem** → `/sure/19` |
| cümle içinde `9/122`, `(51/54)`, `2/196-203` | aynı ayete bağlanır; aynı sûreyse sayfa içinde kalır |

Toplam **23.892** bağlantı (10.795 dosya atıfı + 13.097 çıplak ayet referansı);
hepsinin hedefi build sonrası doğrulanır.

Miras paylarındaki kesirler (`1/2`, `1/4`, `1/8`) bağlanmaz: bir tablo
hücresinin tamamı kesirse ayet referansı sayılmaz. Geçersiz numaralar
(ör. `1/8` — Fâtiha 7 ayet) zaten elenir.

### Atıf modalı

Bir atıfa tıklamak sayfadan çıkarmaz: hedef bölüm modal olarak açılır, okunan
yer olduğu gibi kalır. Modal içindeki atıflar da modalda açılır (üstte iz
bırakarak, geri gidilebilir). Altta "Sûrede aç" ve "Paylaş" var.

- Geri tuşu modalı kapatır, sayfadan atmaz (Esc ve arka plana tıklama da).
- Cmd/Ctrl+tık, orta tık ve "yeni sekmede aç" normal davranışını korur.
- JS kapalıysa bağlantılar düz gezinme olarak çalışmaya devam eder.

İçerik `/parca/<sûre>/<bölüm>` adresinden gelir: build sırasında 2.996 bölüm
ayrı ayrı üretilir (medyan 7 KB, en büyüğü 44 KB), sayfanın tamamı indirilmez.

### Okuma konumu

Okunan yer `localStorage`'a yazılır (`tefsir:pos:<sûre>`, `tefsir:last`) — ama
**ancak okunmaya başlandığında**: sayfada 25 saniye kalmak ya da indiği ayet
bölümünden başka bir bölüme geçmek. Şöyle bir uğranan sayfa kaldığınız yeri
ezmez. Sayfa yeniden açıldığında kalınan yere dönülür; ana sayfada "Kaldığınız
yer" kartı çıkar. Sunucuya hiçbir şey gönderilmez.

---

## Denetim

```bash
python3 kontrol.py        # ayet kapsamı — eksik ayet var mı
python3 kontrol.py atif   # dosya atıfları geçerli mi
python3 kontrol.py ayet   # ayet referansları aralıkta mı
```

Bunlar metnin **yapısını** denetler: her ayetin işlendiğini, verilen
referansların var olduğunu ve aralıkta kaldığını. İçeriğin doğruluğu
denetlenmez.

---

## Vercel

Depoyu GitHub'a gönderip Vercel'de "Import Project" demek yeterli — ayar
gerekmiyor (framework otomatik algılanır, kök dizin depo kökü).

```bash
git remote add origin <repo-url> && git push -u origin main
```

Ya da CLI ile: `npx vercel` (ilk seferde `npx vercel login`).

---

## Not

`build.py` + `template.html` eski tek sayfalık HTML üreticisidir; hâlâ çalışır
(`site/index.html`), ama site artık Next tarafından üretiliyor.
