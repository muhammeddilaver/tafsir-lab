import Link from "next/link";
import { stats } from "@/lib/content";
import { ROUTES } from "@/lib/i18n";
import { alternates } from "@/lib/meta";

export const metadata = {
  title: "Hakkında",
  description: "LLM Tefsir Project nedir, metni kim yazdı, hangi kurallara uyuldu.",
  alternates: {
    canonical: ROUTES.tr.about,
    ...alternates({ tr: ROUTES.tr.about, en: ROUTES.en.about }),
  },
};

const REPO = "https://github.com/muhammeddilaver/llm-tefsir-project";

export default function HakkindaPage() {
  const s = stats("tr");
  return (
    <div className="wrap">
      <main className="doc">
        <div className="sura-head">
          <h1>Hakkında</h1>
          <p className="meta">
            {s.suras} sûre · {s.ayahs.toLocaleString("tr-TR")} ayet
          </p>
        </div>

        <h2>Bu nedir</h2>
        <p>
          Kur&apos;an&apos;ın 114 sûresinin tamamının ayet ayet işlendiği Türkçe bir tefsir
          denemesi. Her bölümde kelimeler köklerine kadar açılıyor, cümlenin dizimi ve
          sûre içindeki tekrarlar gösteriliyor, müfessirlerin ayrıldığı yerlerde ihtilaf
          gizlenmeden tablo hâlinde veriliyor.
        </p>

        <h2>Metni kim yazdı</h2>
        <p>
          <strong>Metnin tamamı bir dil modeli — Claude (Anthropic) — tarafından yazıldı.</strong>{" "}
          Bunu sayfanın en görünür yerinde söylüyoruz, çünkü okurun neyi okuduğunu bilmeye
          hakkı var.
        </p>
        <p>Bunun pratikte anlamı şu:</p>
        <ul>
          <li>
            Metin bir âlimin eseri değildir. <strong>Dinî otoritesi yoktur</strong> ve klasik
            tefsir literatürünün yerine geçmez.
          </li>
          <li>
            Bir dil modeli, ikna edici görünen yanlışlar üretebilir. Kelime kökleri, gramer
            açıklamaları, kıraat ve nakil bilgileri <strong>yanlış olabilir</strong>.
          </li>
          <li>
            Önemli bir konuda bu metne dayanacaksanız, önce klasik kaynaklardan doğrulayın.
          </li>
        </ul>
        <p>
          Amaç tefsir geleneğinin yerini almak değil; ayetin dil dokusunu — kökleri, dizimi,
          sûre içi tekrarları — okunur biçimde önünüze koymak.
        </p>

        <h2>Hangi kurallara uyuldu</h2>
        <p>
          Yazım boyunca bağlayıcı bir usul metni uygulandı. Tamamı{" "}
          <Link href="/usul">Usul</Link> sayfasında; öne çıkanlar:
        </p>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Kural</th>
                <th>Karşılığı</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Uydurma nakil yasak</td>
                <td>
                  Kaynağı verilemeyen söz bir müfessire ya da hadise nispet edilmez; emin
                  olunmayan yerde &quot;nakledilir&quot; dili kullanılır
                </td>
              </tr>
              <tr>
                <td>İhtilaf gizlenmez</td>
                <td>Görüşler tablo hâlinde verilir, tercih dayatılmaz</td>
              </tr>
              <tr>
                <td>Fıkhî hüküm verilmez</td>
                <td>Mezhep görüşleri aktarılır, hüküm kurulmaz</td>
              </tr>
              <tr>
                <td>Toptan hüküm yok</td>
                <td>
                  Hiçbir etnik ya da dinî grup hakkında topluca hüküm kurulmaz; ayetin tarif
                  ettiği <strong>vasıflardır</strong>
                </td>
              </tr>
              <tr>
                <td>Fennî mucize avcılığı yok</td>
                <td>Ayete modern bilgi zorla giydirilmez; ebced/sayı hesabı kullanılmaz</td>
              </tr>
              <tr>
                <td>Güncel siyaset yok</td>
                <td>Taraf tutulmaz</td>
              </tr>
              <tr>
                <td>Kendi okuması ayrılır</td>
                <td>
                  Metnin kendi çıkarımları &quot;bunu kendi okumam olarak kaydediyorum&quot;
                  ibaresiyle nakilden ayrılır
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Depodaki denetim araçları metnin <strong>yapısını</strong> doğrular: her ayetin
          işlendiğini, verilen referansların var olduğunu ve aralıkta kaldığını. Bir
          açıklamanın <strong>isabetli olup olmadığını makine söyleyemez</strong>.
        </p>

        <h2>Nasıl okunur</h2>
        <ul>
          <li>
            Her satırın yanındaki bağlantı işareti o satırın kendi adresini verir; dokununca
            paylaşılabilir hâle gelir.
          </li>
          <li>
            Metindeki atıflara tıklayınca hedef bölüm pencere içinde açılır — okuduğunuz
            yerden çıkmazsınız.
          </li>
          <li>
            Kaldığınız yer tarayıcınızda saklanır; sayfayı kapatıp açtığınızda oradan devam
            edersiniz.
          </li>
        </ul>

        <h2>Kaynak kod</h2>
        <p>
          Sitenin kodu ve tefsir metninin tamamı açık depoda:{" "}
          <a href={REPO} target="_blank" rel="noopener noreferrer">
            github.com/muhammeddilaver/llm-tefsir-project
          </a>
          . Hata bulursanız — yanlış bir kök, uydurma görünen bir nakil, kırık bir bağlantı —
          depodaki <em>Issues</em> bölümünden bildirebilirsiniz.
        </p>

        <p className="muted">
          <Link href="/kosullar">Kullanım koşulları</Link> ·{" "}
          <Link href="/gizlilik">Gizlilik</Link>
        </p>
      </main>
    </div>
  );
}
