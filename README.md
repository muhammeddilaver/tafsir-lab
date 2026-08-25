# Tefsir

Ayet ayet, kök tahlili esaslı Türkçe Kur'an tefsiri. 114 sûrenin tamamı.

- İçerik: `tefsir/NNN-ad.md` (114 dosya, tek kaynak)
- Usul ve üslup kuralları: `USLUP.md`
- Dizin: `FIHRIST.md`

## Site

Next.js (App Router). Markdown build sırasında okunur; 114 sûre sayfasının
tamamı statik olarak üretilir — sunucuda çalışan bir şey yok.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 120 sayfa, ~11 sn
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

Paragraf bağlantıları içeriğin özetinden (hash) üretilir; metin değişmedikçe
kalıcıdır. Ayet bağlantıları 6.236 ayetin **tamamı** için tanımlıdır.

Metindeki atıfların **ikisi de** otomatik bağlanır:

| Metinde | Olur |
|---|---|
| `` `056-vakia.md` 56/25 `` | **Vâkıa 56/25** → `/sure/56#56/25` |
| `` `019-meryem.md` `` | **Meryem** → `/sure/19` |
| cümle içinde `9/122`, `(51/54)`, `2/196-203` | aynı ayete bağlanır; aynı sûreyse sayfa içinde kalır |

Toplam **23.892** bağlantı (10.795 dosya atıfı + 13.097 çıplak ayet
referansı); hepsinin hedefi build sonrası doğrulanıyor.

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

Okunan yer `localStorage`'a yazılır (`tefsir:pos:<sûre>`, `tefsir:last`) —
ama **ancak okunmaya başlandığında**: sayfada 25 saniye kalmak ya da indiği
ayet bölümünden başka bir bölüme geçmek. Şöyle bir uğranan sayfa kaldığınız
yeri ezmez.
Sayfa yeniden açıldığında kalınan yere dönülür; ana sayfada "Kaldığınız yer"
kartı çıkar. Sunucuya hiçbir şey gönderilmez.

## Vercel

Depoyu GitHub'a gönderip Vercel'de "Import Project" demek yeterli — ayar
gerekmiyor (framework otomatik algılanır, kök dizin depo kökü).

```bash
git init && git add -A && git commit -m "tefsir"
git remote add origin <repo-url> && git push -u origin main
```

Ya da CLI ile: `npx vercel` (ilk seferde `npx vercel login`).

## Denetim

```bash
python3 kontrol.py        # ayet kapsamı — eksik ayet var mı
python3 kontrol.py atif   # dosya atıfları geçerli mi
python3 kontrol.py ayet   # ayet referansları aralıkta mı
```

`build.py` + `template.html` eski tek sayfalık HTML üreticisidir; hâlâ
çalışır (`site/index.html`), site artık Next tarafından üretiliyor.
