import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.jpg';

// Nama tempat dipakai untuk peta dan tombol petunjuk arah Google Maps
const MAP_QUERY = 'Danau Sano Nggoang, Manggarai Barat';
const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=12&output=embed`;
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`;

// Angka perkiraan; kondisi jalan bisa berubah, terutama saat musim hujan
const infoSingkat = [
  { label: 'Jarak dari Labuan Bajo', value: '± 55–65 km' },
  { label: 'Waktu tempuh', value: '± 2–3 jam' },
  { label: 'Ketinggian', value: '± 757 mdpl' },
];

const rute = [
  {
    judul: 'Tiba di Labuan Bajo',
    isi: 'Titik awal perjalanan adalah Labuan Bajo, bisa dicapai lewat Bandara Komodo atau Pelabuhan Labuan Bajo.',
  },
  {
    judul: 'Ikuti jalan Trans Flores',
    isi: 'Dari Labuan Bajo, berkendara ke arah timur melalui jalan Trans Flores menuju wilayah Kecamatan Sano Nggoang.',
  },
  {
    judul: 'Masuk jalan desa',
    isi: 'Belok ke jalan desa menuju kawasan danau. Ruas terakhir lebih sempit dan menanjak, sehingga lebih nyaman dengan mobil tinggi atau sepeda motor.',
  },
  {
    judul: 'Sampai di tepi danau',
    isi: 'Danau dikelilingi Desa Wae Sano, Sano Nggoang, dan Pulau Nuncung. Warga setempat siap membantu menunjukkan titik-titik menarik.',
  },
];

const tips = [
  {
    judul: 'Transportasi',
    isi: 'Sewa mobil dengan sopir atau sepeda motor dari Labuan Bajo. Belum ada angkutan umum rutin langsung ke danau.',
  },
  {
    judul: 'Waktu terbaik',
    isi: 'Musim kemarau (sekitar April–Oktober). Saat musim hujan jalan bisa licin, jadi tanyakan kondisi terkini sebelum berangkat.',
  },
  {
    judul: 'Persiapan',
    isi: 'Isi penuh bahan bakar, bawa uang tunai secukupnya, dan pakaian hangat karena udara di ketinggian terasa sejuk.',
  },
];

function Lokasi() {
  return (
    <div className="lok" style={{ fontFamily: 'Georgia, serif', marginTop: -72, background: '#FBFAF6' }}>
      {/* ===== HERO (gaya sama dengan Daya Tarik & Fasilitas) ===== */}
      <header className="lok-hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="lok-hero__overlay" />
        <div className="lok-hero__content">
          <p className="lok-hero__kicker">✦ Lokasi</p>
          <h1>
            Cara Menuju
            <br />
            Danau Sano Nggoang
          </h1>
          <p className="lok-hero__lead">
            Terletak di Kecamatan Sano Nggoang, Manggarai Barat, NTT. Sekitar dua
            hingga tiga jam berkendara dari Labuan Bajo.
          </p>
        </div>
      </header>

      {/* ===== PETA + INFO SINGKAT ===== */}
      <section className="lok-map">
        <div className="lok-map__frame">
          <iframe
            title="Peta lokasi Danau Sano Nggoang"
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <aside className="lok-card">
          <p className="eyebrow">Alamat</p>
          <h2>Danau Sano Nggoang</h2>
          <p className="lok-card__addr">
            Kecamatan Sano Nggoang, Kabupaten Manggarai Barat, Nusa Tenggara Timur
          </p>

          <dl className="lok-card__facts">
            {infoSingkat.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>

          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="lok-btn">
            Petunjuk Arah di Google Maps
          </a>
        </aside>
      </section>

      {/* ===== RUTE ===== */}
      <section className="lok-rute">
        <div className="lok-head">
          <p className="eyebrow">Rute Perjalanan</p>
          <h2>Dari Labuan Bajo ke tepi danau</h2>
        </div>

        <ol className="lok-steps">
          {rute.map((r, i) => (
            <li key={r.judul} className="lok-step">
              <span className="lok-step__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{r.judul}</h3>
              <p>{r.isi}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ===== TIPS ===== */}
      <section className="lok-tips">
        <div className="lok-tips__inner">
          <div className="lok-head lok-head--light">
            <p className="eyebrow">Sebelum Berangkat</p>
            <h2>Tips perjalanan</h2>
          </div>

          <div className="lok-tips__grid">
            {tips.map((t) => (
              <div key={t.judul} className="lok-tip">
                <h3>{t.judul}</h3>
                <p>{t.isi}</p>
              </div>
            ))}
          </div>

          <div className="lok-tips__cta">
            <p>Butuh bantuan mengatur transportasi atau pemandu lokal?</p>
            <Link to="/kontak" className="lok-btn lok-btn--lime">Hubungi Kami</Link>
          </div>
        </div>
      </section>

      <style>{`
        /* HERO */
        .lok-hero {
          position: relative;
          min-height: calc(70vh + 72px);
          background-color: #0B2313;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
        }
        .lok-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(11,35,19,0.35) 0%, rgba(11,35,19,0.9) 100%);
        }
        .lok-hero__content {
          position: relative;
          z-index: 1;
          max-width: 640px;
          padding: 48px 48px 64px;
        }
        .lok-hero__kicker {
          font-family: sans-serif;
          color: #C8E06A;
          font-size: 13px;
          margin: 0 0 14px;
        }
        .lok-hero h1 {
          color: #FAEEDA;
          font-weight: normal;
          font-size: clamp(2rem, 5vw, 3.2rem);
          line-height: 1.15;
          margin: 0 0 18px;
        }
        .lok-hero__lead {
          font-family: sans-serif;
          color: #C9DCC9;
          font-size: 14.5px;
          line-height: 1.7;
          max-width: 460px;
          margin: 0;
        }

        /* UMUM */
        .lok .eyebrow {
          font-family: sans-serif;
          color: #0F6E56;
          font-size: 11.5px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0 0 12px;
        }
        .lok h2 { font-weight: normal; color: #04342C; font-size: 26px; margin: 0; }
        .lok-head { margin-bottom: 36px; }
        .lok-btn {
          display: inline-block;
          font-family: sans-serif;
          background: #0B2313;
          color: #EAF3DE;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 600;
          padding: 13px 26px;
          border-radius: 999px;
          text-align: center;
          transition: transform 0.2s ease;
        }
        .lok-btn:hover { transform: translateY(-2px); }
        .lok-btn--lime { background: #C8E06A; color: #0B2313; }

        /* PETA */
        .lok-map {
          max-width: 1200px;
          margin: 0 auto;
          padding: 88px 48px 64px;
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 28px;
          align-items: stretch;
        }
        .lok-map__frame {
          min-height: 420px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #E2E0D5;
          background: #EDEBE3;
        }
        .lok-map__frame iframe { display: block; width: 100%; height: 100%; min-height: 420px; border: 0; }
        .lok-card {
          background: #fff;
          border: 1px solid #E2E0D5;
          border-radius: 20px;
          padding: 32px;
          display: flex;
          flex-direction: column;
        }
        .lok-card__addr {
          font-family: sans-serif;
          color: #5F5E5A;
          font-size: 13.5px;
          line-height: 1.7;
          margin: 12px 0 24px;
        }
        .lok-card__facts { margin: 0 0 28px; display: flex; flex-direction: column; gap: 14px; }
        .lok-card__facts div {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid #EFEDE4;
        }
        .lok-card__facts dt { font-family: sans-serif; color: #888; font-size: 13px; }
        .lok-card__facts dd { margin: 0; color: #04342C; font-size: 16px; white-space: nowrap; }
        .lok-card .lok-btn { margin-top: auto; }

        /* RUTE */
        .lok-rute { max-width: 1200px; margin: 0 auto; padding: 24px 48px 96px; }
        .lok-steps {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .lok-step {
          background: #fff;
          border: 1px solid #E2E0D5;
          border-radius: 18px;
          padding: 26px 24px;
        }
        .lok-step__num { font-family: sans-serif; color: #0F6E56; font-size: 13px; font-weight: 600; }
        .lok-step h3 { color: #04342C; font-size: 18px; font-weight: normal; margin: 14px 0 10px; }
        .lok-step p { font-family: sans-serif; color: #5F5E5A; font-size: 13px; line-height: 1.7; margin: 0; }

        /* TIPS */
        .lok-tips { background: #0B2313; }
        .lok-tips__inner { max-width: 1200px; margin: 0 auto; padding: 88px 48px; }
        .lok-head--light .eyebrow { color: #C8E06A; }
        .lok-head--light h2 { color: #FAEEDA; }
        .lok-tips__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .lok-tip {
          border: 1px solid rgba(234, 243, 222, 0.15);
          border-radius: 18px;
          padding: 26px 24px;
          background: rgba(255, 255, 255, 0.03);
        }
        .lok-tip h3 { color: #FAEEDA; font-size: 18px; font-weight: normal; margin: 0 0 10px; }
        .lok-tip p { font-family: sans-serif; color: #C9DCC9; font-size: 13px; line-height: 1.7; margin: 0; }
        .lok-tips__cta {
          margin-top: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          border-top: 1px solid rgba(234, 243, 222, 0.15);
          padding-top: 32px;
        }
        .lok-tips__cta p { font-family: sans-serif; color: #EAF3DE; font-size: 15px; margin: 0; }

        @media (max-width: 1000px) {
          .lok-steps { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 800px) {
          .lok-hero__content { padding: 36px 24px 48px; }
          .lok-map { grid-template-columns: 1fr; padding: 56px 24px 40px; }
          .lok-map__frame, .lok-map__frame iframe { min-height: 320px; }
          .lok-card { padding: 24px 20px; }
          .lok-rute { padding: 16px 24px 64px; }
          .lok-tips__inner { padding: 64px 24px; }
          .lok-tips__grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .lok-steps { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

export default Lokasi;
