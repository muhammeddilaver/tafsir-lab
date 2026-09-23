import Link from "next/link";
import ConsentSwitch from "@/components/ConsentSwitch";
import { REPO, ROUTES } from "@/lib/i18n";
import { alternates, everywhere } from "@/lib/meta";

export const metadata = {
  title: "Kebijakan privasi",
  description: "Data apa yang diproses situs ini, dan apa yang tidak.",
  alternates: {
    canonical: ROUTES.id.privacy,
    ...alternates(everywhere((r) => r.privacy)),
  },
};

export default function PrivasiPage() {
  return (
    <div className="wrap">
      <main className="doc">
        <div className="sura-head">
          <h1>Kebijakan privasi</h1>
          <p className="meta">Terakhir diperbarui: 23 September 2026</p>
        </div>

        <p>
          Singkatnya: <strong>situs ini tidak meminta informasi identitas apa pun dari Anda.</strong>{" "}
          Tidak ada akun, tidak ada formulir, tidak ada pengumpulan alamat surel, tidak ada
          iklan dan tidak ada pelacak iklan. Untuk melihat berapa banyak orang membaca halaman
          yang mana, digunakan <strong>satu perkakas pengukuran (Google Analytics)</strong>;
          perkakas itu <strong>tidak menulis kuki sama sekali sampai Anda menyetujuinya secara
          tegas.</strong> Rinciannya di bawah ini.
        </p>

        <h2>Situs ini sendiri</h2>
        <p>
          Situs ini seluruhnya terdiri atas halaman <strong>statis</strong>: tidak ada aplikasi
          yang berjalan di server yang menerima atau menyimpan data dari Anda. Satu-satunya
          kuki yang ditulis situs ini sendiri adalah pilihan bahasa yang disimpan ketika Anda
          menekan tautan bahasa di bilah atas (<code>tefsir-lang</code>); kuki itu tidak
          menentukan apa pun selain ke bahasa mana Anda dibawa ketika tiba di
          &quot;/&quot;, dan tidak membawa pengenal apa pun.
        </p>

        <h2>Pengukuran</h2>
        <p>
          Google Analytics 4 digunakan untuk melihat surah mana yang dibaca, halaman mana yang
          tidak pernah dibuka, dan di bagian mana teks cenderung ditinggalkan. Yang dituju
          adalah angka keseluruhan, bukan jejak seorang pembaca.
        </p>
        <p>
          Pengukuran disiapkan dalam <strong>Consent Mode v2 milik Google</strong>, dan setiap
          izin penyimpanan dimulai dalam keadaan <em>ditolak</em> sejak halaman terbuka. Dalam
          praktiknya:
        </p>
        <ul>
          <li>
            <strong>Sebelum Anda menyetujui</strong>, tidak ada kuki pengukuran yang ditulis ke
            peramban Anda. Sebuah sinyal tanpa kuki dikirim ke Google; sinyal itu tidak membawa
            pengenal yang dapat mengenali perangkat Anda antarkunjungan, alamat IP Anda diproses
            Google dalam bentuk terpotong, dan kunjungan Anda masuk ke angka keseluruhan hanya
            sebagai perkiraan statistik.
          </li>
          <li>
            <strong>Jika Anda menyetujui</strong>, Google Analytics menulis kukinya sendiri (
            <code>_ga</code> dan <code>_ga_&lt;id&gt;</code>). Kuki itu memberi perangkat Anda
            sebuah angka acak agar kunjungan berulang dapat dikenali berasal dari orang yang
            sama; angka itu tidak dikaitkan dengan nama, surel, atau identitas Anda yang lain,
            dan Google mengedaluwarsakannya setelah dua tahun.
          </li>
          <li>
            <strong>Izin periklanan tetap mati dalam kedua keadaan.</strong> Penargetan iklan,
            personalisasi, dan pembagian pengenal iklan apa pun tidak pernah dinyalakan; tidak
            ada iklan yang ditanam di situs ini.
          </li>
        </ul>
        <p>
          Yang dikumpulkan adalah cakupan biasa Google Analytics: alamat dan judul halaman yang
          dibuka, alamat perujuk, perkiraan lokasi (tingkat negara atau kota), jenis peramban
          dan perangkat, bahasa. Apa yang Anda cari di dalam teks, baris mana yang Anda salin,
          dan di mana Anda berhenti membaca <strong>tidak dikirim</strong> ke pengukuran.
        </p>
        <p>
          Data diproses oleh Google menurut{" "}
          <a
            href="https://business.safety.google/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ketentuan privasi
          </a>{" "}
          Google dan dapat dipindahkan ke servernya di negara lain. Bila Anda telah menyetujui,
          persetujuan tegas Anda itulah dasar hukum bagi pemindahan tersebut.
        </p>

        <h2>Mengubah persetujuan Anda</h2>
        <p>
          Keputusan Anda disimpan di peramban Anda dalam <code>tefsir:consent</code> dan dapat
          ditarik kapan saja. Penarikan langsung mengembalikan pengukuran ke mode tanpa kuki.
        </p>
        <ConsentSwitch lang="id" />

        <h2>Apa yang disimpan di peramban Anda</h2>
        <p>
          Demi kenyamanan membaca dan demi pilihan di atas, catatan berikut ditulis ke{" "}
          <code>localStorage</code> peramban Anda:
        </p>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Catatan</th>
                <th>Isinya</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>tefsir:id:pos:&lt;surah&gt;</code>
                </td>
                <td>Bagian dan posisi yang terakhir Anda baca dalam surah itu</td>
              </tr>
              <tr>
                <td>
                  <code>tefsir:id:last</code>
                </td>
                <td>
                  Surah yang terakhir Anda baca — untuk kartu &quot;Tempat Anda berhenti&quot;
                  di beranda
                </td>
              </tr>
              <tr>
                <td>
                  <code>tefsir:consent</code>
                </td>
                <td>
                  Jawaban Anda atas kuki pengukuran. Satu keputusan berlaku untuk ketiga
                  bahasa, sehingga berpindah bahasa tidak membuat Anda ditanya lagi
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Versi Turki situs ini menyimpan kedua catatan bacaan tanpa bagian bahasa
          (<code>tefsir:pos:…</code>) dan versi Inggris dengan <code>en</code>, sehingga
          ketiga bahasa tidak saling menimpa posisi baca.
        </p>
        <p>
          Catatan-catatan ini <strong>tetap berada di peramban Anda saja</strong>; tidak
          dikirim ke server mana pun, tidak dikaitkan dengan identitas Anda, dan tidak berpindah
          ke perangkat Anda yang lain. Anda dapat menghapusnya kapan saja dengan membersihkan
          data situs di peramban, atau menghindarinya dengan menjelajah di jendela pribadi.
          Menghapusnya akan memunculkan kembali pertanyaan persetujuan.
        </p>

        <h2>Hosting</h2>
        <p>
          Situs ini di-hosting di Vercel. Seperti pada situs web mana pun, penyedia hosting
          dapat menyimpan catatan teknis (alamat IP, informasi peramban, alamat yang diminta,
          waktunya) selama Anda melihat halaman. Catatan itu termasuk dalam pemrosesan penyedia
          untuk keperluan infrastruktur dan keamanan; pemilik situs tidak mengumpulkan data
          pribadi darinya dan tidak melakukan analisis tersendiri atasnya.
        </p>

        <h2>Sumber daya luar</h2>
        <p>
          Huruf halaman disajikan <strong>dari situs ini sendiri</strong>: berkas yang
          diambil dari Google Fonts ditanam ke dalam situs pada waktu pembangunan, sehingga
          membuka halaman tidak mengirimkan permintaan huruf apa pun kepada Google. Satu-satunya
          permintaan peramban Anda ke luar adalah pemuatan skrip pengukuran dari{" "}
          <code>googletagmanager.com</code>; selama permintaan itu, alamat IP dan informasi
          peramban Anda sampai ke Google. Selain itu, tidak ada skrip pihak ketiga, iklan,
          piksel, atau pelacak yang ditanam di halaman-halaman ini.
        </p>

        <h2>Fungsi berbagi</h2>
        <p>
          Ketika Anda menyalin atau membagikan tautan sebuah baris, seluruh prosesnya terjadi
          di perangkat Anda: tautan ditulis ke papan klip Anda, atau lembar berbagi milik
          perangkat Anda sendiri yang terbuka. Tidak ada informasi yang dikirim ke situs atau
          ke pengukuran selama itu berlangsung.
        </p>

        <h2>Anak-anak</h2>
        <p>
          Karena situs ini tidak meminta nama, alamat surel, atau pengenal serupa dari
          siapa pun, data semacam itu milik anak-anak pun tidak diproses. Pengukuran tidak
          membedakan berdasarkan usia; apa yang dikumpulkannya sama, dan sama-sama tanpa
          identitas, bagi setiap pengunjung.
        </p>

        <h2>Hak Anda</h2>
        <p>
          Karena situs ini tidak menyimpan catatan yang mengidentifikasi Anda, tidak ada data
          pribadi Anda yang dapat ditemukan berdasarkan nama lalu dihapus. Meskipun begitu:
        </p>
        <ul>
          <li>
            Anda dapat menarik persetujuan pengukuran kapan saja dengan tombol di atas.
          </li>
          <li>
            Posisi baca dan pilihan yang disimpan di peramban Anda sepenuhnya berada dalam
            kendali Anda; membersihkan data situs akan menghapusnya.
          </li>
          <li>
            Jika Anda lebih suka memblokir pengukuran sama sekali,{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
            >
              pengaya opt-out
            </a>{" "}
            dari Google atau perlindungan pelacakan bawaan peramban Anda juga dapat
            melakukannya.
          </li>
        </ul>

        <h2>Perubahan</h2>
        <p>
          Kebijakan ini dapat diperbarui; versi yang berlaku selalu diterbitkan di halaman ini
          dan tanggal di bagian atas menunjukkan pembaruan terakhir.
        </p>

        <h2>Kontak</h2>
        <p>
          Untuk pertanyaan, silakan gunakan bagian <em>Issues</em> di repositori:{" "}
          <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">
            {REPO.replace("https://", "")}/issues
          </a>
          .
        </p>

        <p className="muted">
          <Link href={ROUTES.id.terms}>Ketentuan penggunaan</Link> ·{" "}
          <Link href={ROUTES.id.about}>Tentang</Link>
        </p>
      </main>
    </div>
  );
}
