import Link from "next/link";
import ConsentSwitch from "@/components/ConsentSwitch";
import { REPO, REPO_LABEL, ROUTES } from "@/lib/i18n";
import { alternates } from "@/lib/meta";

export const metadata = {
  title: "Gizlilik politikası",
  description: "Bu sitede hangi veriler işleniyor, hangileri işlenmiyor.",
  alternates: {
    canonical: ROUTES.tr.privacy,
    ...alternates({ tr: ROUTES.tr.privacy, en: ROUTES.en.privacy }),
  },
};

export default function GizlilikPage() {
  return (
    <div className="wrap">
      <main className="doc">
        <div className="sura-head">
          <h1>Gizlilik politikası</h1>
          <p className="meta">Son güncelleme: 1 Eylül 2026</p>
        </div>

        <p>
          Kısaca: <strong>site sizden kimlik bilgisi istemiyor.</strong> Üyelik yok, form
          yok, e-posta toplanmıyor, reklam ve reklam izleyicisi yok. Kaç kişinin hangi
          sayfayı okuduğunu görebilmek için <strong>bir ölçümleme aracı (Google
          Analytics)</strong> kullanılıyor; bu araç <strong>siz açıkça onay verene kadar
          hiçbir çerez yazmıyor.</strong> Aşağıda ayrıntısı var.
        </p>

        <h2>Sitenin kendisi</h2>
        <p>
          Site tamamen <strong>statik</strong> sayfalardan oluşur: sunucuda çalışan, sizden
          veri alan ya da kaydeden bir uygulama yoktur. Sitenin kendi kurduğu tek çerez,
          üst çubuktaki dil bağlantısına tıkladığınızda yazılan dil tercihidir (
          <code>tefsir-lang</code>); bu çerez yalnızca &quot;/&quot; adresine geldiğinizde
          hangi dile götürüleceğinizi belirler, bir kimlik taşımaz.
        </p>

        <h2>Ölçümleme</h2>
        <p>
          Hangi sûrelerin okunduğunu, hangi sayfaların hiç açılmadığını ve metnin nerede
          yarıda bırakıldığını görebilmek için Google Analytics 4 kullanılıyor. Amaç
          toplamları görmek: tek tek okuyucuların izini sürmek değil.
        </p>
        <p>
          Ölçümleme <strong>Google&apos;ın Consent Mode v2 kipiyle</strong> kurulmuştur ve
          sayfa açıldığı anda bütün saklama izinleri <em>reddedilmiş</em> durumda başlar.
          Pratik karşılığı şudur:
        </p>
        <ul>
          <li>
            <strong>Onay vermeden önce</strong> tarayıcınıza hiçbir ölçümleme çerezi
            yazılmaz. Google&apos;a çerezsiz bir sinyal gider; bu sinyalde cihazınızı
            ziyaretler boyunca tanıyacak bir kimlik bulunmaz, IP adresiniz Google
            tarafından kısaltılarak işlenir ve ziyaretiniz ancak istatistiksel bir tahmin
            olarak toplama katılır.
          </li>
          <li>
            <strong>Onay verirseniz</strong> Google Analytics kendi çerezlerini yazar (
            <code>_ga</code> ve <code>_ga_&lt;kimlik&gt;</code>). Bu çerezler cihazınıza
            rastgele bir numara vererek tekrar eden ziyaretlerin aynı kişiden geldiğini
            ayırt eder; adınızla, e-postanızla ya da başka bir kimlikle
            ilişkilendirilmezler ve Google tarafından iki yıl sonra düşerler.
          </li>
          <li>
            <strong>Reklam izinleri her iki durumda da kapalıdır.</strong> Reklam
            hedeflemesi, kişiselleştirme ve reklam kimliği paylaşımı hiçbir koşulda
            açılmaz; siteye reklam gömülü değildir.
          </li>
        </ul>
        <p>
          Toplanan alanlar Google Analytics&apos;in olağan kapsamındadır: açılan sayfanın
          adresi ve başlığı, yönlendiren adres, kabaca konum (ülke/şehir düzeyinde),
          tarayıcı ve cihaz türü, dil. Metnin içinde ne aradığınız, hangi satırı
          kopyaladığınız ya da nerede kaldığınız ölçümlemeye <strong>gönderilmez</strong>.
        </p>
        <p>
          Veriler Google tarafından, Google&apos;ın{" "}
          <a
            href="https://business.safety.google/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            gizlilik şartları
          </a>{" "}
          kapsamında işlenir ve başka ülkelerdeki sunucularına aktarılabilir. Onay
          verdiğiniz durumda bu aktarımın hukuki dayanağı açık rızanızdır.
        </p>

        <h2>Onayınızı değiştirmek</h2>
        <p>
          Kararınız tarayıcınızda <code>tefsir:consent</code> kaydında tutulur ve
          istediğiniz zaman geri alınabilir. Geri aldığınızda ölçümleme aynı anda çerezsiz
          kipe döner.
        </p>
        <ConsentSwitch lang="tr" />

        <h2>Tarayıcınızda saklananlar</h2>
        <p>
          Okuma deneyimi ve yukarıdaki tercih için tarayıcınızın{" "}
          <code>localStorage</code> alanına şu kayıtlar yazılır:
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
              <tr>
                <td>
                  <code>tefsir:consent</code>
                </td>
                <td>
                  Ölçümleme çerezlerine verdiğiniz cevap. Tek bir karar iki dil için de
                  geçerlidir; dil değiştirdiğinizde soru yeniden sorulmaz
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Bu kayıtlar <strong>yalnızca sizin tarayıcınızda kalır</strong>; hiçbir sunucuya
          gönderilmez, kimliğinizle ilişkilendirilmez ve başka bir cihazınıza taşınmaz.
          Tarayıcınızın site verilerini temizleyerek ya da gizli sekmede gezerek istediğiniz
          zaman silebilirsiniz. Sildiğinizde onay sorusu yeniden sorulur.
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
          <code>fonts.googleapis.com</code> ve <code>fonts.gstatic.com</code>), ölçümleme
          betiği ise <code>googletagmanager.com</code> adresinden. Bu istekler sırasında IP
          adresiniz ve tarayıcı bilginiz Google&apos;a ulaşır. Bunun dışında sayfalara
          üçüncü taraf betiği, reklam, piksel ya da izleyici gömülmemiştir.
        </p>

        <h2>Paylaşma işlevi</h2>
        <p>
          Bir satırın bağlantısını kopyaladığınızda ya da paylaştığınızda, işlem tamamen
          cihazınızda gerçekleşir: bağlantı panonuza yazılır veya cihazınızın kendi paylaşım
          penceresi açılır. Bu sırada siteye ya da ölçümlemeye hiçbir bilgi gönderilmez.
        </p>

        <h2>Çocuklar</h2>
        <p>
          Site hiç kimseden ad, e-posta ya da benzeri bir kimlik bilgisi istemediği için
          çocuklara ait böyle bir veri de işlenmez. Ölçümleme yaş ayrımı yapmaz; toplananlar
          her ziyaretçi için aynı ve kimliksizdir.
        </p>

        <h2>Haklarınız</h2>
        <p>
          Site sizi tanımlayan bir kayıt tutmadığı için, adınıza bağlı olarak silinmesini
          isteyebileceğiniz bir kişisel veriniz bulunmamaktadır. Yine de:
        </p>
        <ul>
          <li>
            Ölçümleme onayınızı yukarıdaki düğmeden dilediğiniz an geri alabilirsiniz.
          </li>
          <li>
            Tarayıcınızda saklanan okuma konumu ve tercihler tamamen sizin
            denetiminizdedir; site verilerini temizleyerek silebilirsiniz.
          </li>
          <li>
            Ölçümlemeyi büsbütün engellemek isterseniz Google&apos;ın{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
            >
              devre dışı bırakma eklentisi
            </a>{" "}
            ya da tarayıcınızın izleme koruması da işe yarar.
          </li>
        </ul>

        <h2>Değişiklikler</h2>
        <p>
          Bu politika güncellenebilir; güncel sürüm her zaman bu sayfada yayımlanır ve
          başındaki tarih son güncellemeyi gösterir.
        </p>

        <h2>İletişim</h2>
        <p>
          Sorularınız için depodaki <em>Issues</em> bölümünü kullanabilirsiniz:{" "}
          <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">
            {REPO_LABEL}/issues
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
