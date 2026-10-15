import heroImg from '../assets/vestifalcaci.jpg';
import caciImg from '../assets/hero2.jpg';
import JelajahSections from '../components/JelajahSections';

const maknaCaci = [
  {
    judul: 'Ungkapan syukur',
    isi: 'Caci menjadi bagian dari upacara adat, terutama Penti (syukur panen), sebagai tanda terima kasih atas tanah yang subur, hujan, dan hasil panen.',
  },
  {
    judul: 'Ketangkasan & sportivitas',
    isi: 'Dua penari saling berhadapan: satu menyerang dengan cambuk, yang lain menangkis dengan perisai. Yang dinilai adalah keberanian, ketangkasan, dan sikap kesatria.',
  },
  {
    judul: 'Musik & nyanyian',
    isi: 'Pertunjukan diiringi bunyi gong dan gendang serta nyanyian para penari dan warga, sehingga suasananya meriah sekaligus sakral.',
  },
];

const etika = [
  'Berpakaian sopan dan ikuti arahan tetua adat atau panitia setempat.',
  'Jaga jarak aman dari arena, karena cambuk bergerak cepat dan jauh.',
  'Minta izin sebelum memotret penari dari dekat, dan jangan memakai lampu kilat.',
  'Hormati bagian ritual; tidak semua momen boleh disela atau direkam.',
];

const faqFestival = [
  {
    q: 'Kapan Festival Caci diadakan?',
    a: 'Caci digelar pada acara adat tertentu, seperti Penti (syukur panen), pernikahan, atau penyambutan tamu penting. Jadwalnya tidak selalu tetap, jadi hubungi kami untuk informasi jadwal terdekat.',
  },
  {
    q: 'Apakah wisatawan boleh menonton?',
    a: 'Boleh. Wisatawan biasanya disambut dengan ramah, selama tetap menghormati aturan adat dan arahan panitia di lokasi.',
  },
  {
    q: 'Apakah ada biaya untuk menonton?',
    a: 'Ketentuannya berbeda di setiap acara. Untuk pertunjukan khusus bagi rombongan, biasanya ada kontribusi yang disepakati dengan pengelola desa.',
  },
  {
    q: 'Apakah Caci berbahaya bagi penonton?',
    a: 'Selama penonton berada di luar arena dan mengikuti arahan panitia, Caci aman untuk ditonton bersama keluarga.',
  },
  {
    q: 'Bisakah kami meminta pertunjukan Caci untuk rombongan?',
    a: 'Bisa dibicarakan. Silakan hubungi kami jauh hari agar pengelola dan kelompok adat dapat menyiapkannya.',
  },
];

function Festival() {
  return (
    <div className="fes" style={{ fontFamily: 'Georgia, serif', marginTop: -72, background: '#FBFAF6' }}>
      {/* ===== HERO (gaya sama dengan Daya Tarik, Fasilitas, Lokasi) ===== */}
      <header className="fes-hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="fes-hero__overlay" />
        <div className="fes-hero__content">
          <p className="fes-hero__kicker">✦ Budaya Manggarai</p>
          <h1>Festival Caci</h1>
          <p className="fes-hero__lead">
            Tarian perang tradisional masyarakat Manggarai: adu ketangkasan
            cambuk dan perisai yang sarat makna syukur dan persaudaraan.
          </p>
        </div>
      </header>

      {/* ===== TENTANG CACI ===== */}
      <section className="fes-about">
        <div className="fes-about__photo" style={{ backgroundImage: `url(${caciImg})` }} />
        <div className="fes-about__text">
          <p className="eyebrow">Tentang Caci</p>
          <h2>Tarian kesatria dari tanah Manggarai</h2>
          <p>
            Caci berawal dari ritual pertarungan dalam upacara adat seperti syukur
            panen, pernikahan, dan upacara inisiasi. Seiring waktu, Caci berkembang
            menjadi pertunjukan budaya yang memperlihatkan keberanian dan
            ketangkasan para penarinya.
          </p>
          <p>
            Penari laki-laki dari dua kelompok saling berhadapan secara bergiliran.
            Penyerang mengayunkan cambuk, sementara lawannya menangkis dengan
            perisai. Bagi masyarakat setempat, luka yang muncul dipandang sebagai
            simbol pengorbanan dan harapan akan berkah bagi kampung.
          </p>
        </div>
      </section>

      {/* ===== MAKNA ===== */}
      <section className="fes-makna">
        <div className="fes-makna__inner">
          <p className="eyebrow eyebrow--light">Makna Caci</p>
          <h2>Lebih dari sekadar pertunjukan</h2>
          <div className="fes-makna__grid">
            {maknaCaci.map((m, i) => (
              <div key={m.judul} className="fes-card">
                <span className="fes-card__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{m.judul}</h3>
                <p>{m.isi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ETIKA MENONTON ===== */}
      <section className="fes-etika">
        <div>
          <p className="eyebrow">Untuk Pengunjung</p>
          <h2>Etika menonton Caci</h2>
          <p className="fes-etika__lead">
            Caci adalah bagian dari upacara adat. Dengan menghormati aturannya,
            kamu ikut menjaga tradisi ini tetap hidup.
          </p>
        </div>
        <ul className="fes-etika__list">
          {etika.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </section>

      {/* ===== DAYA TARIK, FASILITAS, FAQ ===== */}
      <JelajahSections faq={faqFestival} />

      <style>{`
        /* HERO */
        .fes-hero {
          position: relative;
          min-height: calc(70vh + 72px);
          background-color: #0B2313;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
        }
        .fes-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(11,35,19,0.35) 0%, rgba(11,35,19,0.9) 100%);
        }
        .fes-hero__content {
          position: relative;
          z-index: 1;
          max-width: 640px;
          padding: 48px 48px 64px;
        }
        .fes-hero__kicker {
          font-family: sans-serif;
          color: #C8E06A;
          font-size: 13px;
          margin: 0 0 14px;
        }
        .fes-hero h1 {
          color: #FAEEDA;
          font-weight: normal;
          font-size: clamp(2rem, 5vw, 3.2rem);
          line-height: 1.15;
          margin: 0 0 18px;
        }
        .fes-hero__lead {
          font-family: sans-serif;
          color: #C9DCC9;
          font-size: 14.5px;
          line-height: 1.7;
          max-width: 460px;
          margin: 0;
        }

        /* UMUM */
        .fes .eyebrow {
          font-family: sans-serif;
          color: #0F6E56;
          font-size: 11.5px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0 0 12px;
        }
        .fes .eyebrow--light { color: #C8E06A; }
        .fes h2 { font-weight: normal; color: #04342C; font-size: 28px; line-height: 1.25; margin: 0 0 18px; }

        /* TENTANG */
        .fes-about {
          max-width: 1200px;
          margin: 0 auto;
          padding: 96px 48px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
        }
        .fes-about__photo {
          min-height: 420px;
          border-radius: 24px;
          background-size: cover;
          background-position: center;
        }
        .fes-about__text p:not(.eyebrow) {
          font-family: sans-serif;
          color: #5F5E5A;
          font-size: 14.5px;
          line-height: 1.8;
          margin: 0 0 16px;
        }

        /* MAKNA */
        .fes-makna { background: #0B2313; }
        .fes-makna__inner { max-width: 1200px; margin: 0 auto; padding: 88px 48px; }
        .fes-makna h2 { color: #FAEEDA; margin-bottom: 36px; }
        .fes-makna__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .fes-card {
          border: 1px solid rgba(234, 243, 222, 0.15);
          border-radius: 18px;
          padding: 28px 24px;
          background: rgba(255, 255, 255, 0.03);
        }
        .fes-card__num { font-family: sans-serif; color: #C8E06A; font-size: 13px; font-weight: 600; }
        .fes-card h3 { color: #FAEEDA; font-size: 19px; font-weight: normal; margin: 14px 0 10px; }
        .fes-card p { font-family: sans-serif; color: #C9DCC9; font-size: 13.5px; line-height: 1.7; margin: 0; }

        /* ETIKA */
        .fes-etika {
          max-width: 1200px;
          margin: 0 auto;
          padding: 96px 48px 8px;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 56px;
          align-items: start;
        }
        .fes-etika__lead { font-family: sans-serif; color: #5F5E5A; font-size: 14.5px; line-height: 1.8; margin: 0; }
        .fes-etika__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .fes-etika__list li {
          position: relative;
          background: #fff;
          border: 1px solid #E2E0D5;
          border-radius: 14px;
          padding: 18px 20px 18px 52px;
          font-family: sans-serif;
          color: #04342C;
          font-size: 14px;
          line-height: 1.6;
        }
        .fes-etika__list li::before {
          content: '✓';
          position: absolute;
          left: 18px;
          top: 17px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #E5F0CC;
          color: #0F6E56;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 900px) {
          .fes-hero__content { padding: 36px 24px 48px; }
          .fes-about { grid-template-columns: 1fr; padding: 64px 24px; gap: 32px; }
          .fes-about__photo { min-height: 280px; }
          .fes-makna__inner { padding: 64px 24px; }
          .fes-makna__grid { grid-template-columns: 1fr; }
          .fes-etika { grid-template-columns: 1fr; padding: 64px 24px 0; gap: 28px; }
        }
      `}</style>
    </div>
  );
}

export default Festival;
