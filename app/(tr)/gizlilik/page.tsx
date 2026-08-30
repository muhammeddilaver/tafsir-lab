import Link from "next/link";
import { ROUTES } from "@/lib/i18n";
import { alternates } from "@/lib/meta";

export const metadata = {
  title: "Gizlilik politikası",
  description: "Bu sitede hangi veriler işleniyor, hangileri işlenmiyor.",
  alternates: {
    canonical: ROUTES.tr.privacy,
    ...alternates({ tr: ROUTES.tr.privacy, en: ROUTES.en.privacy }),
  },
};

const REPO = "https://github.com/muhammeddilaver/llm-tefsir-project";

export default function GizlilikPage() {
  return (
    <div className="wrap">
      <main className="doc">
        <div className="sura-head">
          <h1>Gizlilik politikası</h1>
          <p className="meta">Son güncelleme: 25 Ağustos 2026</p>
        </div>

        <p>
          Kısaca: <strong>bu site sizden hiçbir veri toplamıyor.</strong> Üyelik yok, form
          yok, e-posta toplanmıyor, ölçümleme (analytics) aracı kullanılmıyor, reklam ve
          izleme çerezi yok. Aşağıda ayrıntısı var.
        </p>

        <h2>Sitenin kendisi</h2>
        <p>
          Site tamamen <strong>statik</strong> sayfalardan oluşur: sunucuda çalışan, veri
          alan ya da kaydeden bir uygulama yoktur. Sitenin kendi kurduğu bir çerez de yoktur.
        </p>

        <h2>Tarayıcınızda saklananlar</h2>
        <p>
          Okuma deneyimi için tarayıcınızın <code>localStorage</code> alanına iki tür kayıt
          yazılır:
        </p>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Kayıt</th>
                <th>İçeriği</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>tefsir:pos:&lt;sûre&gt;</code>
                </td>
                <td>O sûrede en son okuduğunuz bölüm ve konum</td>
              </tr>
              <tr>
                <td>
                  <code>tefsir:last</code>
                </td>
                <td>En son okuduğunuz sûre — ana sayfadaki &quot;Kaldığınız yer&quot; kartı için</td>
              </tr>
              <tr>
                <td>
                  <code>tefsir:en:…</code>
                </td>
                <td>
                  Aynı iki kaydın İngilizce sürüm karşılığı; iki dilin okuma konumu ayrı
                  tutulur
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Bu kayıtlar <strong>yalnızca sizin tarayıcınızda kalır</strong>; hiçbir sunucuya
          gönderilmez, kimliğinizle ilişkilendirilmez ve başka bir cihazınıza taşınmaz.
          Tarayıcınızın site verilerini temizleyerek ya da gizli sekmede gezerek istediğiniz
          zaman silebilirsiniz.
        </p>

        <h2>Barındırma</h2>
        <p>
          Site Vercel üzerinde barındırılmaktadır. Her internet sitesinde olduğu gibi,
          sayfaları görüntülerken barındırma sağlayıcısı teknik kayıtlar (IP adresi, tarayıcı
          bilgisi, istenen adres, zaman) tutabilir. Bu kayıtlar sağlayıcının altyapı ve
          güvenlik amaçlı işlemesi kapsamındadır; site sahibi bu kayıtlar üzerinden kişisel
          veri toplamaz ve ayrı bir analiz yapmaz.
        </p>

        <h2>Dış kaynaklar</h2>
        <p>
          Sayfa yazı tipleri Google Fonts üzerinden yüklenir (
          <code>fonts.googleapis.com</code> ve <code>fonts.gstatic.com</code>). Bu istekler
          sırasında IP adresiniz ve tarayıcı bilginiz Google&apos;a ulaşır. Bunun dışında
          sayfalara üçüncü taraf betiği, reklam, piksel ya da izleyici gömülmemiştir.
        </p>

        <h2>Paylaşma işlevi</h2>
        <p>
          Bir satırın bağlantısını kopyaladığınızda ya da paylaştığınızda, işlem tamamen
          cihazınızda gerçekleşir: bağlantı panonuza yazılır veya cihazınızın kendi paylaşım
          penceresi açılır. Bu sırada siteye hiçbir bilgi gönderilmez.
        </p>

        <h2>Çocuklar</h2>
        <p>
          Site herhangi bir yaş grubundan veri toplamadığı için çocuklara ait veri de
          işlenmez.
        </p>

        <h2>Haklarınız</h2>
        <p>
          Site sizinle ilgili bir kayıt tutmadığı için silinmesini ya da düzeltilmesini
          isteyebileceğiniz bir kişisel veriniz bulunmamaktadır. Tarayıcınızda saklanan okuma
          konumu tamamen sizin denetiminizdedir.
        </p>

        <h2>Değişiklikler</h2>
        <p>
          Bu politika güncellenebilir; güncel sürüm her zaman bu sayfada yayımlanır ve
          başındaki tarih son güncellemeyi gösterir.
        </p>

        <h2>İletişim</h2>
        <p>
          Sorularınız için depodaki <em>Issues</em> bölümünü kullanabilirsiniz:{" "}
          <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">
            {REPO.replace("https://", "")}/issues
          </a>
          .
        </p>

        <p className="muted">
          <Link href="/kosullar">Kullanım koşulları</Link> ·{" "}
          <Link href="/hakkinda">Hakkında</Link>
        </p>
      </main>
    </div>
  );
}
