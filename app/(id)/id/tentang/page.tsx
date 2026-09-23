import Link from "next/link";
import { stats } from "@/lib/content";
import { REPO, REPO_LABEL, ROUTES } from "@/lib/i18n";
import { alternates, everywhere } from "@/lib/meta";

export const metadata = {
  title: "Tentang",
  description:
    "Apa itu Tafsir Lab, siapa yang menulis teksnya, dan aturan yang diikuti saat menulisnya.",
  alternates: {
    canonical: ROUTES.id.about,
    ...alternates(everywhere((r) => r.about)),
  },
};

export default function TentangPage() {
  const s = stats("id");
  return (
    <div className="wrap">
      <main className="doc">
        <div className="sura-head">
          <h1>Tentang</h1>
          <p className="meta">
            {s.suras} surah · {s.ayahs.toLocaleString("id-ID")} ayat
          </p>
        </div>

        <h2>Apa ini</h2>
        <p>
          Sebuah upaya tafsir Al-Qur&apos;an yang mencakup seluruh 114 surah, ayat demi ayat.
          Pada setiap bagian, kata-kata dibuka sampai ke akarnya, susunan kalimat dan
          pengulangan di dalam surah ditunjukkan, dan ketika para mufasir berbeda pendapat,
          perbedaan itu tidak disembunyikan melainkan disajikan dalam tabel.
        </p>
        <p>
          Teks Indonesia ini adalah terjemahan dari naskah Turki, yang tetap menjadi naskah
          rujukan. Penomoran ayat, teks Arab, huruf akar kata, dan rujukan silang sama persis
          di semua versi, sehingga tautan ke sebuah ayat menunjuk ke tempat yang sama dalam
          bahasa mana pun.
        </p>

        <h2>Siapa yang menulis teks ini</h2>
        <p>
          <strong>
            Seluruh teks ini ditulis oleh sebuah model bahasa — Claude (Anthropic).
          </strong>{" "}
          Hal ini kami nyatakan di tempat yang paling terlihat, karena pembaca berhak tahu apa
          yang sedang ia baca.
        </p>
        <p>Dalam praktiknya ini berarti:</p>
        <ul>
          <li>
            Teks ini bukan karya seorang ulama. Teks ini{" "}
            <strong>tidak memiliki otoritas keagamaan</strong> dan tidak menggantikan
            literatur tafsir klasik.
          </li>
          <li>
            Sebuah model bahasa dapat menghasilkan kekeliruan yang tampak meyakinkan. Akar
            kata, penjelasan tata bahasa, serta keterangan tentang qiraat dan riwayat{" "}
            <strong>bisa saja salah</strong>.
          </li>
          <li>
            Jika Anda hendak bersandar pada teks ini untuk sesuatu yang penting, periksalah
            lebih dahulu terhadap sumber-sumber klasik.
          </li>
        </ul>
        <p>
          Tujuannya bukan menggantikan tradisi tafsir, melainkan menyajikan tekstur kebahasaan
          sebuah ayat — akar katanya, sintaksisnya, gemanya di dalam surah — dalam bentuk yang
          terbaca.
        </p>

        <h2>Aturan yang diikutinya</h2>
        <p>
          Sebuah pernyataan metode yang mengikat diterapkan di sepanjang teks. Seluruh isinya
          ada di halaman <Link href={ROUTES.id.method}>Metode</Link>; pokok-pokoknya:
        </p>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Aturan</th>
                <th>Maksudnya</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tidak ada riwayat karangan</td>
                <td>
                  Perkataan yang sumbernya tidak dapat disebutkan tidak pernah dinisbatkan
                  kepada seorang mufasir atau kepada hadis; bila tidak ada kepastian,
                  digunakan ungkapan &quot;diriwayatkan bahwa&quot;
                </td>
              </tr>
              <tr>
                <td>Perbedaan pendapat tidak disembunyikan</td>
                <td>Pendapat-pendapat disajikan dalam tabel; tidak ada pilihan yang dipaksakan</td>
              </tr>
              <tr>
                <td>Tidak ada penetapan hukum</td>
                <td>Pendapat mazhab dilaporkan; tidak ada hukum yang ditetapkan</td>
              </tr>
              <tr>
                <td>Tidak ada vonis kolektif</td>
                <td>
                  Tidak ada kelompok etnis atau agama yang dihakimi secara keseluruhan; yang
                  digambarkan ayat adalah <strong>sifat-sifat</strong>
                </td>
              </tr>
              <tr>
                <td>Tidak berburu mukjizat ilmiah</td>
                <td>
                  Pengetahuan modern tidak dipaksakan ke dalam ayat; perhitungan abjad dan
                  numerologi tidak digunakan
                </td>
              </tr>
              <tr>
                <td>Tidak ada politik kekinian</td>
                <td>Tidak ada pihak yang dibela</td>
              </tr>
              <tr>
                <td>Bacaan penulis sendiri ditandai</td>
                <td>
                  Kesimpulan teks ini sendiri dipisahkan dari yang diriwayatkan dengan kalimat
                  &quot;Saya catat ini sebagai bacaan saya sendiri&quot;
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Perkakas pemeriksa di dalam repositori memverifikasi <strong>struktur</strong> teks:
          bahwa setiap ayat dibahas, bahwa rujukan yang diberikan memang ada dan berada dalam
          rentang yang benar.{" "}
          <strong>
            Apakah sebuah penjelasan benar atau tidak, bukan sesuatu yang dapat dikatakan oleh
            mesin.
          </strong>
        </p>

        <h2>Cara membacanya</h2>
        <ul>
          <li>
            Tanda tautan di samping setiap baris memberi baris itu alamatnya sendiri;
            sentuhlah, dan baris itu menjadi dapat dibagikan.
          </li>
          <li>
            Klik sebuah rujukan di dalam teks, maka bagian yang dituju terbuka dalam panel —
            Anda tidak kehilangan tempat baca Anda.
          </li>
          <li>
            Tempat Anda berhenti disimpan di peramban Anda; tutup halaman lalu buka lagi, dan
            Anda melanjutkan dari sana.
          </li>
        </ul>

        <h2>Kode sumber</h2>
        <p>
          Kode situs ini dan seluruh isi tafsirnya ada di repositori terbuka:{" "}
          <a href={REPO} target="_blank" rel="noopener noreferrer">
            {REPO_LABEL}
          </a>
          . Jika Anda menemukan kekeliruan — akar kata yang salah, riwayat yang tampak
          dikarang, tautan yang putus — Anda dapat melaporkannya melalui bagian{" "}
          <em>Issues</em> di sana.
        </p>

        <p className="muted">
          <Link href={ROUTES.id.terms}>Ketentuan penggunaan</Link> ·{" "}
          <Link href={ROUTES.id.privacy}>Privasi</Link>
        </p>
      </main>
    </div>
  );
}
