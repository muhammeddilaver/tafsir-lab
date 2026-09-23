import Link from "next/link";
import { REPO, REPO_LABEL, ROUTES } from "@/lib/i18n";
import { alternates, everywhere } from "@/lib/meta";

export const metadata = {
  title: "Ketentuan penggunaan",
  description: "Ketentuan yang berlaku ketika Anda menggunakan Tafsir Lab.",
  alternates: {
    canonical: ROUTES.id.terms,
    ...alternates(everywhere((r) => r.terms)),
  },
};

export default function KetentuanPage() {
  return (
    <div className="wrap">
      <main className="doc">
        <div className="sura-head">
          <h1>Ketentuan penggunaan</h1>
          <p className="meta">Terakhir diperbarui: 21 September 2026</p>
        </div>

        <p>
          Dengan menggunakan situs ini Anda menerima ketentuan di bawah. Jika Anda tidak
          menerimanya, mohon jangan gunakan situs ini.
        </p>

        <h2>1. Sifat isi situs</h2>
        <p>
          Seluruh tafsir di situs ini <strong>dihasilkan oleh sebuah model bahasa</strong>{" "}
          (Claude, Anthropic). Ini bukan karya seorang ulama.
        </p>
        <ul>
          <li>
            Teks ini <strong>tidak memiliki otoritas keagamaan</strong>. Teks ini tidak boleh
            dijadikan sumber fatwa, ketetapan hukum agama, atau pendapat yang mengikat.
          </li>
          <li>
            Isinya bukan nasihat hukum, keuangan, medis, atau profesional, dan tidak boleh
            digunakan sebagai nasihat semacam itu.
          </li>
          <li>
            Bagian mana pun dari teks ini — termasuk akar kata, penjelasan tata bahasa,
            keterangan tentang qiraat, dan riwayat — <strong>bisa saja keliru</strong>. Untuk
            hal yang penting, periksalah terhadap sumber-sumber klasik.
          </li>
        </ul>
        <p>
          Selengkapnya, lihat halaman <Link href={ROUTES.id.about}>Tentang</Link> dan{" "}
          <Link href={ROUTES.id.method}>Metode</Link>.
        </p>

        <h2>2. Tanpa jaminan</h2>
        <p>
          Situs ini beserta isinya disediakan &quot;sebagaimana adanya&quot;. Tidak ada
          jaminan, tersurat maupun tersirat, atas ketepatan, kelengkapan, kemutakhiran, atau
          kesesuaian isinya untuk tujuan tertentu. Tidak ada pula jaminan bahwa situs ini akan
          berjalan tanpa gangguan atau tanpa galat.
        </p>

        <h2>3. Tanggung jawab</h2>
        <p>
          Pemilik situs tidak dapat dimintai pertanggungjawaban atas keputusan yang diambil
          dengan bersandar pada isi situs ini, atau atas kerugian langsung maupun tidak
          langsung yang timbul karenanya. Tanggung jawab untuk menilai dan memverifikasi isi
          situs ada pada pengguna.
        </p>

        <h2>4. Pengutipan dan penggunaan</h2>
        <p>
          Teks ini boleh dikutip <strong>dengan menyebutkan sumber dan tautan ke situs ini</strong>.
          Menerbitkan seluruh atau sebagian besar teks ini di tempat lain sebagai karya
          sendiri, memperbanyaknya tanpa menyebut sumber, atau menyebarkannya sambil
          menyembunyikan bahwa teks ini produk kecerdasan buatan, tidak dapat diterima.
        </p>
        <p>
          Kode sumber situs dan seluruh isi teksnya ada di repositori terbuka:{" "}
          <a href={REPO} target="_blank" rel="noopener noreferrer">
            {REPO_LABEL}
          </a>
          .
        </p>

        <h2>5. Kewajiban pengguna</h2>
        <p>
          Jangan gunakan situs ini untuk tujuan yang melanggar hukum, dengan cara yang
          mengganggu jalannya situs, atau sedemikian rupa sehingga membebaninya secara
          berlebihan melalui perkakas otomatis.
        </p>

        <h2>6. Tautan keluar</h2>
        <p>
          Situs ini dapat menautkan ke situs pihak ketiga (misalnya GitHub). Pemilik situs
          tidak bertanggung jawab atas isi maupun praktik privasi situs-situs tersebut.
        </p>

        <h2>7. Perubahan</h2>
        <p>
          Ketentuan ini dapat diperbarui tanpa pemberitahuan terlebih dahulu. Versi yang
          berlaku selalu diterbitkan di halaman ini; tanggal di bagian atas menunjukkan
          pembaruan terakhir.
        </p>

        <h2>8. Kontak</h2>
        <p>
          Untuk pertanyaan, laporan kekeliruan, dan permintaan, silakan gunakan bagian{" "}
          <em>Issues</em> di repositori:{" "}
          <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">
            {REPO.replace("https://", "")}/issues
          </a>
          .
        </p>

        <p className="muted">
          <Link href={ROUTES.id.privacy}>Kebijakan privasi</Link> ·{" "}
          <Link href={ROUTES.id.about}>Tentang</Link>
        </p>
      </main>
    </div>
  );
}
