import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const dayaTarikStyle = [
  { gradient: 'linear-gradient(160deg, #042C53 0%, #185FA5 55%, #5DCAA5 100%)' },
  { gradient: 'linear-gradient(160deg, #7A2E0E 0%, #B85C1E 55%, #E8A24C 100%)' },
  { gradient: 'linear-gradient(160deg, #1B3A0F 0%, #3B6D11 55%, #A8D96A 100%)' },
  { gradient: 'linear-gradient(160deg, #04342C 0%, #0B2313 55%, #3B6D11 100%)' },
];

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
    q: 'Apakah tersedia penginapan di sekitar danau?',
    a: 'Ya, tersedia homestay warga di sekitar kawasan. Lihat halaman Fasilitas untuk informasi lengkapnya.',
  },
  {
    q: 'Apakah Festival Caci bisa disaksikan wisatawan?',
    a: 'Caci digelar saat acara adat tertentu. Hubungi kami untuk mengetahui jadwal terdekat dan cara menyaksikannya dengan sopan.',
  },
  {
    q: 'Bagaimana cara menuju lokasi?',
    a: 'Kawasan ini berada di Manggarai Barat, NTT. Petunjuk rute lengkap tersedia di halaman Lokasi.',
  },
];

function Fasilitas() {
  const [fasilitas, setFasilitas] = useState([]);
  const [dayaTarik, setDayaTarik] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gagal, setGagal] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(1);

  const trackRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/fasilitas')
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setFasilitas(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal ambil data fasilitas:', err);
        setGagal(true);
        setLoading(false);
      });

    fetch('http://localhost:5000/api/daya-tarik')
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => setDayaTarik(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Gagal ambil data daya tarik:', err);
        setDayaTarik([]);
      });
  }, []);

  const scrollTrack = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  const gradients = [
    'linear-gradient(160deg, #0B3B2E 0%, #0F6E56 60%, #5DCAA5 100%)',
    'linear-gradient(160deg, #042C53 0%, #185FA5 60%, #7FD9C4 100%)',
    'linear-gradient(160deg, #1B3A0F 0%, #3B6D11 60%, #A8D96A 100%)',
    'linear-gradient(160deg, #04342C 0%, #0B2313 60%, #3B6D11 100%)',
  ];

  return (
    <div style={{ fontFamily: 'Georgia, serif', minHeight: '80vh', background: '#FBFAF6' }}>
      <section className="page-header">
        <p className="eyebrow">Kenyamanan</p>
        <h1>Fasilitas yang Tersedia</h1>
        <p className="lead">
          Kawasan Desa Wisata Danau Sano Nggoang dilengkapi berbagai fasilitas
          penunjang untuk kenyamanan pengunjung selama berkunjung.
        </p>
      </section>

      <section className="fac-list-wrap">
        {loading && <p className="muted">Memuat data...</p>}
        {!loading && gagal && (
          <p className="muted">Data fasilitas gagal dimuat. Silakan coba lagi nanti.</p>
        )}
        {!loading && !gagal && fasilitas.length === 0 && (
          <p className="muted">Belum ada data fasilitas.</p>
        )}

        {fasilitas.map((item, i) => {
          const isOpen = openIndex === i;
          const photoStyle = item.gambar
            ? {
                backgroundImage: `url(http://localhost:5000${item.gambar})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : { background: gradients[i % gradients.length] };

          return (
            <div key={item.id} className={`fac-acc ${isOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="fac-acc__head"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="fac-acc__icon">◆</span>
                <span className="fac-acc__title">{item.nama}</span>
                <span className="fac-acc__toggle">{isOpen ? '−' : '+'}</span>
              </button>

              <div className="fac-acc__body">
                <div className="fac-acc__body-inner">
                  <div className="fac-acc__content">
                    <p className="fac-acc__desc">{item.deskripsi}</p>
                    <div className="fac-acc__photo" style={photoStyle} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ===== DAYA TARIK (carousel) ===== */}
      <section className="sec-explore">
        <div className="sec-explore__head">
          <div>
            <p className="sec-eyebrow">Discover</p>
            <h2>Jelajahi daya tarik di sekitar danau</h2>
          </div>
          <Link to="/daya-tarik" className="btn-dark">Lihat Semua</Link>
        </div>

        {dayaTarik.length === 0 && <p className="muted">Belum ada data untuk ditampilkan.</p>}

        <div className="sec-explore__track" ref={trackRef}>
          {dayaTarik.map((item, i) => {
            const style = dayaTarikStyle[i % dayaTarikStyle.length];
            const cardStyle = item.gambar
              ? {
                  backgroundImage: `url(http://localhost:5000${item.gambar})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : { background: style.gradient };
            return (
              <Link key={item.id} to="/daya-tarik" className="ex-card">
                <div className="ex-card__photo" style={cardStyle}>
                  <span className="ex-card__badge">Daya Tarik</span>
                </div>
                <div className="ex-card__footer">
                  <div>
                    <h3>{item.nama}</h3>
                    <span className="ex-card__loc">📍 Manggarai Barat</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {dayaTarik.length > 0 && (
          <div className="sec-explore__nav">
            <button type="button" onClick={() => scrollTrack(-1)} aria-label="Sebelumnya">←</button>
            <button type="button" onClick={() => scrollTrack(1)} aria-label="Berikutnya">→</button>
          </div>
        )}
      </section>

      {/* ===== FAQ ===== */}
      <section className="sec-faq">
        <div className="sec-faq__inner">
          <div className="sec-faq__left">
            <div>
              <span className="faq-pill"><i /> FAQ</span>
              <h2>Pertanyaan yang Sering Diajukan</h2>
            </div>

            <div className="faq-help">
              <h3>Masih punya pertanyaan?</h3>
              <p>Tenang, tim kami siap membantu kamu merencanakan kunjungan ke Danau Sano Nggoang.</p>
              <Link to="/kontak" className="faq-help__btn">Hubungi Kami</Link>
            </div>
          </div>

          <div className="sec-faq__list">
            {faqData.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="faq-item__head"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-item__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="faq-item__q">{item.q}</span>
                    <span className="faq-item__icon">{isOpen ? '−' : '+'}</span>
                  </button>
                  <div className="faq-item__body">
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .page-header {
          background: #0B2313;
          color: #FAEEDA;
          padding: 72px 48px 56px;
          text-align: center;
        }
        .page-header .eyebrow { font-family: sans-serif; color: #C8E06A; font-size: 13px; margin: 0 0 12px; }
        .page-header h1 { font-size: 34px; font-weight: normal; margin: 0 0 16px; }
        .page-header .lead {
          font-family: sans-serif; color: #C9DCC9; font-size: 15px; line-height: 1.7;
          max-width: 540px; margin: 0 auto;
        }

        .fac-list-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 64px 48px 96px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .muted { font-family: sans-serif; color: #999; text-align: center; }

        .fac-acc {
          background: #ffffff;
          border: 1px solid #E8E6DA;
          border-radius: 20px;
          overflow: hidden;
          transition: box-shadow 0.25s ease;
        }
        .fac-acc.is-open {
          box-shadow: 0 16px 36px rgba(4, 52, 44, 0.08);
        }

        .fac-acc__head {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 18px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          padding: 22px 28px;
          font-family: sans-serif;
        }
        .fac-acc__icon {
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 10px;
          background: #0B2313;
          color: #C8E06A;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .fac-acc__title {
          flex: 1;
          color: #04342C;
          font-size: 17px;
          font-weight: 600;
        }
        .fac-acc__toggle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #0B2313;
          color: #FAEEDA;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          line-height: 1;
        }

        .fac-acc__body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease;
        }
        .fac-acc.is-open .fac-acc__body { grid-template-rows: 1fr; }
        .fac-acc__body-inner { overflow: hidden; }

        /* Deskripsi kiri, foto kanan */
        .fac-acc__content {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 40px;
          align-items: center;
          padding: 4px 28px 28px;
        }
        .fac-acc__desc {
          font-family: sans-serif;
          font-size: 14.5px;
          color: #5F5E5A;
          line-height: 1.8;
          margin: 0;
        }
        .fac-acc__photo {
          height: 300px;
          border-radius: 14px;
          background-size: cover;
          background-position: center;
        }

        /* ===== DAYA TARIK (carousel) ===== */
        .btn-dark {
          display: inline-block;
          font-family: sans-serif;
          background: #0B2313;
          color: #EAF3DE;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 600;
          padding: 13px 28px;
          border-radius: 999px;
          white-space: nowrap;
          transition: transform 0.2s ease;
        }
        .btn-dark:hover { transform: translateY(-2px); }

        .sec-eyebrow {
          font-family: sans-serif;
          color: #0F6E56;
          font-size: 11.5px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0 0 12px;
        }

        .sec-explore { padding: 0 48px 96px; max-width: 1100px; margin: 0 auto; }
        .sec-explore__head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .sec-explore__head h2 { font-weight: normal; color: #04342C; font-size: 26px; margin: 0; }

        .sec-explore__track {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 8px;
          scrollbar-width: none;
        }
        .sec-explore__track::-webkit-scrollbar { display: none; }

        .ex-card {
          flex: 0 0 300px;
          scroll-snap-align: start;
          text-decoration: none;
          display: block;
          border-radius: 18px;
          overflow: hidden;
          background: #fff;
          border: 1px solid #E2E0D5;
        }
        .ex-card__photo {
          position: relative;
          height: 220px;
          background-size: cover;
          background-position: center;
          padding: 14px;
        }
        .ex-card__badge {
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          color: #FAEEDA;
          font-family: sans-serif;
          font-size: 11px;
          padding: 5px 12px;
          border-radius: 999px;
        }
        .ex-card__footer { padding: 16px 18px 20px; }
        .ex-card__footer h3 { color: #04342C; font-size: 17px; font-weight: normal; margin: 0 0 6px; }
        .ex-card__loc { font-family: sans-serif; color: #999; font-size: 12px; }

        .sec-explore__nav { display: flex; gap: 10px; margin-top: 24px; }
        .sec-explore__nav button {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid #D8D6CA; background: #fff; color: #04342C;
          font-size: 16px; cursor: pointer;
        }
        .sec-explore__nav button:hover { background: #F4F2E8; }

        /* ===== FAQ ===== */
        .sec-faq { padding: 0 48px 96px; max-width: 1200px; margin: 0 auto; }
        .sec-faq__inner {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 56px;
          background: #ffffff;
          border: 1px solid #E2E0D5;
          border-radius: 24px;
          padding: 48px;
        }
        .sec-faq__left { display: flex; flex-direction: column; justify-content: space-between; gap: 48px; }
        .faq-pill {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: sans-serif; font-size: 11px; color: #04342C;
          background: #F4F2E8; padding: 5px 12px; border-radius: 999px; margin-bottom: 18px;
        }
        .faq-pill i { width: 6px; height: 6px; border-radius: 50%; background: #0F6E56; display: inline-block; }
        .sec-faq__left h2 {
          font-weight: normal; color: #04342C;
          font-size: clamp(1.8rem, 3.2vw, 2.4rem); line-height: 1.15; margin: 0;
        }
        .faq-help h3 { font-family: sans-serif; font-size: 15px; font-weight: 600; color: #04342C; margin: 0 0 8px; }
        .faq-help p { font-family: sans-serif; font-size: 12.5px; line-height: 1.6; color: #5F5E5A; margin: 0 0 18px; max-width: 260px; }
        .faq-help__btn {
          display: inline-block; background: #0B2313; color: #EAF3DE; text-decoration: none;
          font-family: sans-serif; font-size: 13.5px; font-weight: 600;
          padding: 12px 26px; border-radius: 12px;
          box-shadow: 0 8px 20px rgba(11, 35, 19, 0.25);
          transition: transform 0.25s ease;
        }
        .faq-help__btn:hover { transform: translateY(-2px); }
        .sec-faq__list { display: flex; flex-direction: column; gap: 12px; }
        .faq-item { background: #F8F7F2; border-radius: 14px; transition: background 0.25s ease; }
        .faq-item.is-open { background: #F1EFE4; }
        .faq-item__head {
          width: 100%; display: flex; align-items: center; gap: 20px;
          background: none; border: none; cursor: pointer; text-align: left;
          padding: 20px 24px; font-family: sans-serif;
        }
        .faq-item__num { color: #999; font-size: 14px; min-width: 22px; }
        .faq-item__q { flex: 1; color: #04342C; font-size: 14.5px; font-weight: 600; }
        .faq-item__icon { color: #04342C; font-size: 20px; line-height: 1; width: 20px; text-align: center; }
        .faq-item__body {
          display: grid; grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease;
        }
        .faq-item.is-open .faq-item__body { grid-template-rows: 1fr; }
        .faq-item__body p {
          overflow: hidden; margin: 0;
          font-family: sans-serif; font-size: 13px; line-height: 1.7; color: #5F5E5A;
          padding: 0 24px 0 66px;
        }
        .faq-item.is-open .faq-item__body p { padding-bottom: 22px; }

        @media (max-width: 900px) {
          .sec-faq { padding: 0 24px 64px; }
          .sec-faq__inner { grid-template-columns: 1fr; padding: 28px 20px; gap: 32px; }
          .sec-faq__left { gap: 28px; }
          .faq-item__head { padding: 16px; gap: 14px; }
          .faq-item__body p { padding-left: 52px; padding-right: 16px; }
        }

        @media (max-width: 800px) {
          .page-header { padding: 56px 24px 40px; }
          .fac-list-wrap { padding: 48px 20px 64px; }
          .fac-acc__head { padding: 18px 20px; }
          .fac-acc__content {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 4px 20px 22px;
          }
          .fac-acc__photo { order: -1; height: 200px; }
        }

        @media (max-width: 700px) {
          .sec-explore { padding: 0 24px 64px; }
        }
      `}</style>
    </div>
  );
}

export default Fasilitas;