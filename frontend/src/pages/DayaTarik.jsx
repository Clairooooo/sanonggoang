import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import danauImg from '../assets/hero.jpg';

const faqData = [
  {
    q: 'Apakah ada tiket masuk ke Danau Sano Nggoang?',
    a: 'Untuk informasi tiket terbaru, silakan hubungi kami melalui halaman Kontak. Kami akan bantu menyesuaikan dengan jadwal kunjunganmu.',
  },
  {
    q: 'Kapan waktu terbaik untuk berkunjung?',
    a: 'Musim kemarau (sekitar April–Oktober) umumnya paling nyaman karena akses jalan lebih mudah dan langit lebih cerah untuk menikmati pemandangan danau.',
  },
  {
    q: 'Berapa lama waktu yang dibutuhkan untuk menjelajahi daya tarik di sini?',
    a: 'Tergantung aktivitas yang dipilih, umumnya 1-2 hari sudah cukup untuk menikmati danau, air panas, dan jalur trekking di sekitarnya.',
  },
  {
    q: 'Apakah aman trekking di perbukitan sekitar danau?',
    a: 'Aman selama mengikuti jalur yang disarankan dan ditemani warga lokal atau pemandu, terutama saat musim hujan.',
  },
  {
    q: 'Bagaimana cara menuju lokasi?',
    a: 'Kawasan ini berada di Manggarai Barat, NTT. Petunjuk rute lengkap tersedia di halaman Lokasi.',
  },
];

function DayaTarik() {
  const [dayaTarik, setDayaTarik] = useState([]);
  const [fasilitas, setFasilitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/daya-tarik')
      .then((res) => res.json())
      .then((data) => {
        setDayaTarik(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal ambil data daya tarik:', err);
        setLoading(false);
      });

    fetch('http://localhost:5000/api/fasilitas')
      .then((res) => res.json())
      .then((data) => setFasilitas(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Gagal ambil data fasilitas:', err));
  }, []);

  const tagsPool = [
    ['Alam', 'Vulkanik'],
    ['Relaksasi', 'Air Panas'],
    ['Petualangan', 'Trekking'],
    ['Budaya'],
  ];

  return (
    <div className="dtp" style={{ fontFamily: 'Georgia, serif', marginTop: -72 }}>
      {/* ===== HERO ===== */}
      <header
        className="dtp-hero"
        style={{ backgroundImage: `url(${danauImg})` }}
      >
        <div className="dtp-hero__overlay" />
        <div className="dtp-hero__content">
          <p className="dtp-hero__kicker">✦ Panduan Jelajah</p>
          <h1>
            Siap Menjelajahi
            <br />
            Danau &amp; Sekitarnya
          </h1>
          <p className="dtp-hero__lead">
            Dari kawah vulkanik hingga sumber air panas alami, berikut daya tarik
            utama yang bisa kamu nikmati di kawasan Danau Sano Nggoang.
          </p>
        </div>
      </header>

      {/* ===== DAFTAR BERNOMOR (latar berselang-seling) ===== */}
      <main className="dtp-body">
        {loading && <p className="dtp-muted">Memuat data...</p>}
        {!loading && dayaTarik.length === 0 && (
          <p className="dtp-muted">Belum ada data daya tarik.</p>
        )}

        {dayaTarik.map((item, i) => {
          const isReverse = i % 2 === 1;
          const isDark = i % 2 === 1;
          const tags = tagsPool[i % tagsPool.length];
          const photoStyle = item.gambar
            ? {
                backgroundImage: `url(http://localhost:5000${item.gambar})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : {
                background: [
                  'linear-gradient(160deg, #042C53 0%, #185FA5 55%, #5DCAA5 100%)',
                  'linear-gradient(160deg, #7A2E0E 0%, #B85C1E 55%, #E8A24C 100%)',
                  'linear-gradient(160deg, #1B3A0F 0%, #3B6D11 55%, #A8D96A 100%)',
                  'linear-gradient(160deg, #04342C 0%, #0B2313 55%, #3B6D11 100%)',
                ][i % 4],
              };

          return (
            <section
              key={item.id}
              className={`dtp-row ${isDark ? 'dtp-row--dark' : 'dtp-row--light'}`}
            >
              <div className={`dtp-row__inner ${isReverse ? 'dtp-row--reverse' : ''}`}>
                <div className="dtp-row__photo" style={photoStyle} />
                <div className="dtp-row__text">
                  <span className="dtp-row__num">{String(i + 1).padStart(2, '0')}</span>
                  <p className="dtp-row__kicker">Daya Tarik</p>
                  <h2>{item.nama}</h2>
                  <p className="dtp-row__desc">{item.deskripsi}</p>
                  <div className="dtp-row__tags">
                    {tags.map((tag) => (
                      <span key={tag} className="dtp-row__tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </main>

      {/* ===== FASILITAS ===== */}
      <section className="sec-fasilitas">
        <div className="sec-fasilitas__head">
          <div>
            <p className="eyebrow">Fasilitas</p>
            <h2>Fasilitas yang Tersedia</h2>
          </div>
          <p className="sec-fasilitas__lead">
            Kawasan ini dilengkapi berbagai fasilitas penunjang untuk
            kenyamanan pengunjung selama berkunjung.
          </p>
        </div>

        <div className="sec-fasilitas__track">
          {fasilitas.length === 0 && <p className="muted">Belum ada data untuk ditampilkan.</p>}
          {fasilitas.map((item, i) => {
            const facStyle = item.gambar
              ? {
                  backgroundImage: `url(http://localhost:5000${item.gambar})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : {
                  background: [
                    'linear-gradient(160deg, #0B3B2E 0%, #0F6E56 60%, #5DCAA5 100%)',
                    'linear-gradient(160deg, #042C53 0%, #185FA5 60%, #7FD9C4 100%)',
                    'linear-gradient(160deg, #1B3A0F 0%, #3B6D11 60%, #A8D96A 100%)',
                    'linear-gradient(160deg, #04342C 0%, #0B2313 60%, #3B6D11 100%)',
                  ][i % 4],
                };
            return (
              <div key={item.id} className="fac-card">
                <div className="fac-card__photo" style={facStyle}>
                  <span className="fac-card__badge-left">Fasilitas</span>
                  <span className="fac-card__badge-right">✓</span>
                </div>
                <div className="fac-card__footer">
                  <h3>{item.nama}</h3>
                  <Link to="/fasilitas" className="fac-card__link">Detail →</Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sec-fasilitas__footer">
          <Link to="/fasilitas" className="btn-viewmore">Lihat Semua Fasilitas</Link>
        </div>
      </section>

      {/* ===== FAQ (hijau tua) ===== */}
      <section className="dtp-faq">
        <div className="dtp-faq__inner">
          <div className="dtp-faq__left">
            <div>
              <span className="dtp-faq__pill"><i /> FAQ</span>
              <h2>Pertanyaan yang Sering Diajukan</h2>
            </div>

            <div className="dtp-faq__help">
              <h3>Masih punya pertanyaan?</h3>
              <p>Tim kami siap membantu kamu merencanakan kunjungan ke Danau Sano Nggoang.</p>
              <Link to="/kontak" className="dtp-faq__btn">Hubungi Kami</Link>
            </div>
          </div>

          <div className="dtp-faq__list">
            {faqData.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className={`dtp-faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="dtp-faq-item__head"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="dtp-faq-item__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="dtp-faq-item__q">{item.q}</span>
                    <span className="dtp-faq-item__icon">{isOpen ? '−' : '+'}</span>
                  </button>
                  <div className="dtp-faq-item__body">
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .dtp { background: #ffffff; }

        /* HERO */
        .dtp-hero {
          position: relative;
          min-height: calc(70vh + 72px);
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
        }
        .dtp-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(11,35,19,0.35) 0%, rgba(11,35,19,0.9) 100%);
        }
        .dtp-hero__content {
          position: relative;
          z-index: 1;
          max-width: 640px;
          padding: 48px 48px 64px;
        }
        .dtp-hero__kicker {
          font-family: sans-serif;
          color: #C8E06A;
          font-size: 13px;
          margin: 0 0 14px;
        }
        .dtp-hero h1 {
          color: #FAEEDA;
          font-weight: normal;
          font-size: clamp(2rem, 5vw, 3.2rem);
          line-height: 1.15;
          margin: 0 0 18px;
        }
        .dtp-hero__lead {
          font-family: sans-serif;
          color: #C9DCC9;
          font-size: 14.5px;
          line-height: 1.7;
          max-width: 460px;
          margin: 0;
        }

        /* BODY */
        .dtp-body { margin: 0; }
        .dtp-muted { font-family: sans-serif; color: #999; text-align: center; padding: 40px 0; }

        .dtp-row {
          padding: 72px 48px;
        }
        .dtp-row--light { background: #ffffff; }
        .dtp-row--dark { background: #0B2313; }

        .dtp-row__inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: start;
          max-width: 1100px;
          margin: 0 auto;
        }
        .dtp-row--reverse { direction: rtl; }
        .dtp-row--reverse > * { direction: ltr; }

        .dtp-row__photo {
          height: 360px;
          border-radius: 4px;
          background-size: cover;
          background-position: center;
        }

        .dtp-row__text { font-family: sans-serif; }
        .dtp-row__num {
          display: block;
          font-family: Georgia, serif;
          font-size: 42px;
          line-height: 1;
          margin-bottom: 12px;
        }
        .dtp-row__kicker {
          font-size: 11.5px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0 0 10px;
        }
        .dtp-row__text h2 {
          font-family: Georgia, serif;
          font-weight: normal;
          font-size: 28px;
          margin: 0 0 16px;
        }
        .dtp-row__desc {
          font-size: 14px;
          line-height: 1.75;
          margin: 0 0 20px;
        }
        .dtp-row__tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .dtp-row__tag {
          font-size: 11.5px;
          padding: 5px 14px;
          border-radius: 999px;
        }

        .dtp-row--light .dtp-row__num { color: #04342C; }
        .dtp-row--light .dtp-row__kicker { color: #0F6E56; }
        .dtp-row--light .dtp-row__text h2 { color: #04342C; }
        .dtp-row--light .dtp-row__desc { color: #5F5E5A; }
        .dtp-row--light .dtp-row__tag { color: #04342C; border: 1px solid #D8D6CA; }

        .dtp-row--dark .dtp-row__num { color: #C8E06A; }
        .dtp-row--dark .dtp-row__kicker { color: #C8E06A; }
        .dtp-row--dark .dtp-row__text h2 { color: #FAEEDA; }
        .dtp-row--dark .dtp-row__desc { color: #C9DCC9; }
        .dtp-row--dark .dtp-row__tag { color: #EAF3DE; border: 1px solid #2C5A2C; }

        /* ===== FASILITAS ===== */
        .eyebrow { font-family: sans-serif; color: #0F6E56; font-size: 13px; margin: 0 0 10px; }
        .muted { font-family: sans-serif; color: #999; }
        .btn-viewmore {
          display: inline-block;
          font-family: sans-serif;
          background: #0B2313;
          color: #EAF3DE;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 600;
          padding: 14px 32px;
          border-radius: 999px;
          transition: transform 0.2s ease;
        }
        .btn-viewmore:hover { transform: translateY(-2px); }

        .sec-fasilitas {
          background: #FBFAF6;
          padding: 72px 48px 96px;
        }
        .sec-fasilitas__head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 32px;
          margin-bottom: 32px;
          flex-wrap: wrap;
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
        }
        .sec-fasilitas__head h2 { font-weight: normal; color: #04342C; margin: 0; font-size: 26px; }
        .sec-fasilitas__lead {
          font-family: sans-serif;
          color: #5F5E5A;
          font-size: 13.5px;
          line-height: 1.7;
          max-width: 320px;
          margin: 0;
        }

        .sec-fasilitas__track {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .fac-card {
          border: 1px solid #E2E0D5;
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
        }
        .fac-card__photo {
          position: relative;
          height: 200px;
          padding: 14px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .fac-card__badge-left {
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          color: #FAEEDA;
          font-family: sans-serif;
          font-size: 11px;
          padding: 5px 12px;
          border-radius: 999px;
        }
        .fac-card__badge-right {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          color: #0F6E56;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        }
        .fac-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
        }
        .fac-card__footer h3 {
          font-size: 15.5px;
          color: #04342C;
          font-weight: normal;
          margin: 0;
        }
        .fac-card__link {
          font-family: sans-serif;
          color: #0F6E56;
          font-size: 12.5px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
        }

        .sec-fasilitas__footer { text-align: center; margin-top: 40px; }

        /* ===== FAQ (hijau tua) ===== */
        .dtp-faq { background: #0B2313; padding: 88px 48px; }
        .dtp-faq__inner {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 56px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .dtp-faq__left { display: flex; flex-direction: column; justify-content: space-between; gap: 48px; }
        .dtp-faq__pill {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: sans-serif; font-size: 11px; color: #EAF3DE;
          background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 999px; margin-bottom: 18px;
        }
        .dtp-faq__pill i { width: 6px; height: 6px; border-radius: 50%; background: #C8E06A; display: inline-block; }
        .dtp-faq__left h2 {
          color: #FAEEDA;
          font-weight: normal;
          font-size: clamp(1.8rem, 3.2vw, 2.4rem);
          line-height: 1.15;
          margin: 0;
        }

        .dtp-faq__help h3 { font-family: sans-serif; font-size: 15px; font-weight: 600; color: #FAEEDA; margin: 0 0 8px; }
        .dtp-faq__help p { font-family: sans-serif; font-size: 12.5px; line-height: 1.6; color: #C9DCC9; margin: 0 0 18px; max-width: 260px; }
        .dtp-faq__btn {
          display: inline-block; background: #C8E06A; color: #0B2313; text-decoration: none;
          font-family: sans-serif; font-size: 13.5px; font-weight: 700;
          padding: 12px 26px; border-radius: 12px;
          transition: transform 0.25s ease;
        }
        .dtp-faq__btn:hover { transform: translateY(-2px); }

        .dtp-faq__list { display: flex; flex-direction: column; gap: 12px; }
        .dtp-faq-item { background: rgba(255,255,255,0.05); border-radius: 14px; transition: background 0.25s ease; }
        .dtp-faq-item.is-open { background: rgba(255,255,255,0.09); }
        .dtp-faq-item__head {
          width: 100%; display: flex; align-items: center; gap: 20px;
          background: none; border: none; cursor: pointer; text-align: left;
          padding: 20px 24px; font-family: sans-serif;
        }
        .dtp-faq-item__num { color: #7A9B7A; font-size: 14px; min-width: 22px; }
        .dtp-faq-item__q { flex: 1; color: #EAF3DE; font-size: 14.5px; font-weight: 600; }
        .dtp-faq-item__icon { color: #C8E06A; font-size: 20px; line-height: 1; width: 20px; text-align: center; }
        .dtp-faq-item__body {
          display: grid; grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease;
        }
        .dtp-faq-item.is-open .dtp-faq-item__body { grid-template-rows: 1fr; }
        .dtp-faq-item__body p {
          overflow: hidden; margin: 0;
          font-family: sans-serif; font-size: 13px; line-height: 1.7; color: #C9DCC9;
          padding: 0 24px 0 66px;
        }
        .dtp-faq-item.is-open .dtp-faq-item__body p { padding-bottom: 22px; }

        @media (max-width: 900px) {
          .dtp-faq { padding: 56px 24px; }
          .dtp-faq__inner { grid-template-columns: 1fr; gap: 32px; }
          .dtp-faq__left { gap: 28px; }
          .dtp-faq-item__head { padding: 16px; gap: 14px; }
          .dtp-faq-item__body p { padding-left: 52px; padding-right: 16px; }
        }
        @media (max-width: 800px) {
          .dtp-hero__content { padding: 36px 24px 48px; }
          .dtp-row { padding: 56px 24px; }
          .dtp-row__inner {
            grid-template-columns: 1fr;
            direction: ltr;
            gap: 24px;
          }
          .dtp-row--reverse { direction: ltr; }
          .dtp-row__photo { height: 260px; }
          .sec-fasilitas { padding: 48px 24px; }
          .sec-fasilitas__track { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .sec-fasilitas__track { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

export default DayaTarik;