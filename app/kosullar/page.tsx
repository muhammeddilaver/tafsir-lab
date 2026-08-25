import Link from "next/link";

export const metadata = {
  title: "Kullanım koşulları",
  description: "LLM Tefsir Project'i kullanırken geçerli koşullar.",
};

const REPO = "https://github.com/muhammeddilaver/llm-tefsir-project";

export default function KosullarPage() {
  return (
    <div className="wrap">
      <main className="doc">
        <div className="sura-head">
          <h1>Kullanım koşulları</h1>
          <p className="meta">Son güncelleme: 25 Ağustos 2026</p>
        </div>

        <p>
          Bu siteyi kullanarak aşağıdaki koşulları kabul etmiş olursunuz. Kabul etmiyorsanız
          siteyi kullanmayınız.
        </p>

        <h2>1. İçeriğin niteliği</h2>
        <p>
          Sitedeki tefsir metninin tamamı bir <strong>dil modeli tarafından üretilmiştir</strong>{" "}
          (Claude, Anthropic). Bir âlimin eseri değildir.
        </p>
        <ul>
          <li>
            Metnin <strong>dinî otoritesi yoktur</strong>. Fetva, dinî hüküm ya da bağlayıcı
            görüş kaynağı olarak kullanılamaz.
          </li>
          <li>
            İçerik hukukî, malî, tıbbî ya da mesleki tavsiye değildir ve böyle bir amaçla
            kullanılamaz.
          </li>
          <li>
            Kelime kökleri, gramer açıklamaları, kıraat bilgileri ve nakiller dâhil olmak
            üzere metnin herhangi bir kısmı <strong>hatalı olabilir</strong>. Önemli
            konularda klasik kaynaklardan doğrulayınız.
          </li>
        </ul>
        <p>
          Ayrıntı için <Link href="/hakkinda">Hakkında</Link> ve <Link href="/usul">Usul</Link>{" "}
          sayfalarına bakınız.
        </p>

        <h2>2. Garanti verilmemesi</h2>
        <p>
          Site ve içeriği &quot;olduğu gibi&quot; sunulmaktadır. İçeriğin doğruluğu,
          eksiksizliği, güncelliği ya da belirli bir amaca uygunluğu konusunda açık veya
          zımnî hiçbir garanti verilmez. Sitenin kesintisiz veya hatasız çalışacağı taahhüt
          edilmez.
        </p>

        <h2>3. Sorumluluk</h2>
        <p>
          Site içeriğine dayanarak alınan kararlardan ve bunların sonuçlarından doğabilecek
          doğrudan veya dolaylı zararlardan site sahibi sorumlu tutulamaz. İçeriği
          değerlendirme ve doğrulama sorumluluğu kullanıcıya aittir.
        </p>

        <h2>4. Alıntı ve kullanım</h2>
        <p>
          Metin, <strong>kaynak gösterilerek ve bu siteye bağlantı verilerek</strong>{" "}
          alıntılanabilir. Metnin tamamının ya da büyük bölümlerinin başka bir yerde kendi
          eseri gibi yayımlanması, kaynak belirtilmeden çoğaltılması ya da yapay zekâ ürünü
          olduğu gizlenerek dağıtılması kabul edilmez.
        </p>
        <p>
          Sitenin kaynak kodu ve metnin tamamı açık depodadır:{" "}
          <a href={REPO} target="_blank" rel="noopener noreferrer">
            github.com/muhammeddilaver/llm-tefsir-project
          </a>
          .
        </p>

        <h2>5. Kullanıcının yükümlülüğü</h2>
        <p>
          Siteyi hukuka aykırı amaçlarla, sitenin işleyişini bozacak biçimde ya da otomatik
          araçlarla aşırı yük bindirerek kullanmayınız.
        </p>

        <h2>6. Dış bağlantılar</h2>
        <p>
          Site, üçüncü taraf sitelere (ör. GitHub) bağlantı verebilir. Bu sitelerin
          içeriğinden ve gizlilik uygulamalarından site sahibi sorumlu değildir.
        </p>

        <h2>7. Değişiklikler</h2>
        <p>
          Bu koşullar önceden bildirilmeksizin güncellenebilir. Güncel sürüm her zaman bu
          sayfada yayımlanır; sayfanın başındaki tarih son güncellemeyi gösterir.
        </p>

        <h2>8. İletişim</h2>
        <p>
          Soru, hata bildirimi ve talepler için depodaki <em>Issues</em> bölümünü
          kullanabilirsiniz:{" "}
          <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">
            {REPO.replace("https://", "")}/issues
          </a>
          .
        </p>

        <p className="muted">
          <Link href="/gizlilik">Gizlilik politikası</Link> ·{" "}
          <Link href="/hakkinda">Hakkında</Link>
        </p>
      </main>
    </div>
  );
}
