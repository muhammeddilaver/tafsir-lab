import Link from "next/link";
import ContinueCard from "@/components/ContinueCard";
import SuraFilter from "@/components/SuraFilter";
import { stats, suraList } from "@/lib/content";

export default function Home() {
  const list = suraList();
  const s = stats();
  return (
    <div className="wrap">
      <section className="hero">
        <h1>Ayet ayet Kur&apos;an tefsiri</h1>
        <p>
          Kur&apos;an&apos;ın tamamı: her sûre, her ayet. Kelimeler köklerine kadar açılıyor;
          müfessirler ayrıldığında ihtilaf gizlenmiyor, tablo hâlinde veriliyor.
        </p>
        <p className="muted">
          Metnin tamamı Claude (Anthropic) tarafından yazılmıştır; klasik tefsir
          literatürünün yerine geçmez, önemli konularda kaynaklarından doğrulanmalıdır.
          Uygulanan kurallar için <Link href="/usul">Usul</Link> sayfasına bakınız.
        </p>
        <p className="muted">
          Her satırın yanındaki bağlantı işaretine dokunarak o satırı paylaşabilirsiniz.
          Kaldığınız yer tarayıcınızda saklanır.
        </p>
        <div className="stats">
          <span><b>{s.suras}</b> sûre</span>
          <span><b>{s.ayahs.toLocaleString("tr-TR")}</b> ayet</span>
        </div>
      </section>

      <ContinueCard />
      <SuraFilter items={list.map((x) => ({ no: x.no, name: x.name, ayahCount: x.ayahCount }))} />
    </div>
  );
}
