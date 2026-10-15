import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Section penutup halaman: carousel Daya Tarik, daftar Fasilitas, dan FAQ.
// Tampilannya sama dengan bagian bawah halaman Galeri.

const dayaTarikGradients = [
  'linear-gradient(160deg, #042C53 0%, #185FA5 55%, #5DCAA5 100%)',
  'linear-gradient(160deg, #7A2E0E 0%, #B85C1E 55%, #E8A24C 100%)',
  'linear-gradient(160deg, #1B3A0F 0%, #3B6D11 55%, #A8D96A 100%)',
  'linear-gradient(160deg, #04342C 0%, #0B2313 55%, #3B6D11 100%)',
];

const fasilitasGradients = [
  'linear-gradient(160deg, #0B3B2E 0%, #0F6E56 60%, #5DCAA5 100%)',
  'linear-gradient(160deg, #042C53 0%, #185FA5 60%, #7FD9C4 100%)',
  'linear-gradient(160deg, #1B3A0F 0%, #3B6D11 60%, #A8D96A 100%)',
  'linear-gradient(160deg, #04342C 0%, #0B2313 60%, #3B6D11 100%)',
];

function fetchList(endpoint) {
  return fetch(`http://localhost:5000/api/${endpoint}`)
    .then((res) => {
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return res.json();
    })
    .then((data) => (Array.isArray(data) ? data : []));
}

function photoStyle(item, gradients, i) {
  return item.gambar
    ? {
        backgroundImage: `url(http://localhost:5000${item.gambar})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { background: gradients[i % gradients.length] };
}

function JelajahSections({ faq }) {
  const [dayaTarik, setDayaTarik] = useState([]);
  const [fasilitas, setFasilitas] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    fetchList('daya-tarik')
      .then(setDayaTarik)
      .catch((err) => console.error('Gagal ambil data daya tarik:', err));
    fetchList('fasilitas')
      .then(setFasilitas)
      .catch((err) => console.error('Gagal ambil data fasilitas:', err));
  }, []);

  const scrollTrack = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <div className="jelajah">
      {/* ===== DAYA TARIK ===== */}
      <section className="sec-explore">
        <div className="sec-explore__head">
          <div>
            <p className="eyebrow">Discover</p>
            <h2>Jelajahi daya tarik di sekitar danau</h2>
          </div>
          <Link to="/daya-tarik" className="btn-dark">Lihat Semua</Link>
        </div>

        {dayaTarik.length === 0 && <p className="muted">Belum ada data untuk ditampilkan.</p>}

        <div className="sec-explore__track" ref={trackRef}>
          {dayaTarik.map((item, i) => (
            <Link key={item.id} to="/daya-tarik" className="ex-card">
              <div className="ex-card__photo" style={photoStyle(item, dayaTarikGradients, i)}>
                <span className="ex-card__badge">Daya Tarik</span>
              </div>
              <div className="ex-card__footer">
                <h3>{item.nama}</h3>
                <span className="ex-card__loc">📍 Manggarai Barat</span>
              </div>
            </Link>
          ))}
        </div>

        {dayaTarik.length > 0 && (
          <div className="sec-explore__nav">
            <button type="button" onClick={() => scrollTrack(-1)} aria-label="Sebelumnya">←</button>
            <button type="button" onClick={() => scrollTrack(1)} aria-label="Berikutnya">→</button>
          </div>
        )}
      </section>

      {/* ===== FASILITAS ===== */}
      <section className="sec-articles">
        <div className="sec-articles__head">
          <div>
            <p className="eyebrow">Fasilitas</p>
            <h2>Fasilitas yang tersedia</h2>
          </div>
          <Link to="/fasilitas" className="btn-dark">Lihat Semua</Link>
        </div>

        <div className="sec-articles__grid">
          {fasilitas.length === 0 && <p className="muted">Belum ada data untuk ditampilkan.</p>}
          {fasilitas.map((item, i) => (
            <div key={item.id} className="art-card">
              <div className="art-card__photo" style={photoStyle(item, fasilitasGradients, i)}>
                <span className="art-card__tag">Fasilitas</span>
              </div>
              <div className="art-card__body">
                <h3>{item.nama}</h3>
                <p>{item.deskripsi}</p>
                <Link to="/fasilitas" className="art-card__link">Lihat Detail →</Link>
              </div>
            </div>
          ))}
        </div>
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
            {faq.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={item.q} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
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
        .jelajah { background: #FBFAF6; }
        .jelajah .eyebrow {
          font-family: sans-serif;
          color: #0F6E56;
          font-size: 11.5px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0 0 12px;
        }
        .jelajah h2 { font-weight: normal; color: #04342C; margin: 0 0 16px; }
        .jelajah .muted { font-family: sans-serif; color: #999; }
        .jelajah .btn-dark {
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
        .jelajah .btn-dark:hover { transform: translateY(-2px); }

        /* DAYA TARIK */
        .jelajah .sec-explore { padding: 88px 48px 96px; max-width: 1200px; margin: 0 auto; }
        .jelajah .sec-explore__head,
        .jelajah .sec-articles__head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .jelajah .sec-explore__head h2,
        .jelajah .sec-articles__head h2 { font-size: 26px; margin: 0; }
        .jelajah .sec-explore__track {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 8px;
          scrollbar-width: none;
        }
        .jelajah .sec-explore__track::-webkit-scrollbar { display: none; }
        .jelajah .ex-card {
          flex: 0 0 300px;
          scroll-snap-align: start;
          text-decoration: none;
          display: block;
          border-radius: 18px;
          overflow: hidden;
          background: #fff;
          border: 1px solid #E2E0D5;
        }
        .jelajah .ex-card__photo { position: relative; height: 220px; padding: 14px; }
        .jelajah .ex-card__badge,
        .jelajah .art-card__tag {
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          color: #FAEEDA;
          font-family: sans-serif;
          font-size: 11px;
          padding: 5px 12px;
          border-radius: 999px;
        }
        .jelajah .ex-card__footer { padding: 16px 18px 20px; }
        .jelajah .ex-card__footer h3 { color: #04342C; font-size: 17px; font-weight: normal; margin: 0 0 6px; }
        .jelajah .ex-card__loc { font-family: sans-serif; color: #999; font-size: 12px; }
        .jelajah .sec-explore__nav { display: flex; gap: 10px; margin-top: 24px; }
        .jelajah .sec-explore__nav button {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid #D8D6CA; background: #fff; color: #04342C;
          font-size: 16px; cursor: pointer;
        }
        .jelajah .sec-explore__nav button:hover { background: #F4F2E8; }

        /* FASILITAS */
        .jelajah .sec-articles { padding: 0 48px 96px; max-width: 1200px; margin: 0 auto; }
        .jelajah .sec-articles__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .jelajah .art-card {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 18px;
          border: 1px solid #E2E0D5;
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
        }
        .jelajah .art-card__photo { position: relative; min-height: 150px; padding: 12px; }
        .jelajah .art-card__body { padding: 18px 18px 18px 0; display: flex; flex-direction: column; justify-content: center; }
        .jelajah .art-card__body h3 { color: #04342C; font-size: 16px; font-weight: normal; margin: 0 0 8px; }
        .jelajah .art-card__body p { font-family: sans-serif; color: #5F5E5A; font-size: 12.5px; line-height: 1.6; margin: 0 0 10px; }
        .jelajah .art-card__link { font-family: sans-serif; color: #0F6E56; font-size: 12.5px; font-weight: 600; text-decoration: none; }

        /* FAQ */
        .jelajah .sec-faq { padding: 0 48px 96px; max-width: 1200px; margin: 0 auto; }
        .jelajah .sec-faq__inner {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 56px;
          background: #ffffff;
          border: 1px solid #E2E0D5;
          border-radius: 24px;
          padding: 48px;
        }
        .jelajah .sec-faq__left { display: flex; flex-direction: column; justify-content: space-between; gap: 48px; }
        .jelajah .faq-pill {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: sans-serif; font-size: 11px; color: #04342C;
          background: #F4F2E8; padding: 5px 12px; border-radius: 999px; margin-bottom: 18px;
        }
        .jelajah .faq-pill i { width: 6px; height: 6px; border-radius: 50%; background: #0F6E56; display: inline-block; }
        .jelajah .sec-faq__left h2 { font-size: clamp(1.8rem, 3.2vw, 2.4rem); line-height: 1.15; margin: 0; }
        .jelajah .faq-help h3 { font-family: sans-serif; font-size: 15px; font-weight: 600; color: #04342C; margin: 0 0 8px; }
        .jelajah .faq-help p { font-family: sans-serif; font-size: 12.5px; line-height: 1.6; color: #5F5E5A; margin: 0 0 18px; max-width: 260px; }
        .jelajah .faq-help__btn {
          display: inline-block; background: #0B2313; color: #EAF3DE; text-decoration: none;
          font-family: sans-serif; font-size: 13.5px; font-weight: 600;
          padding: 12px 26px; border-radius: 12px;
          box-shadow: 0 8px 20px rgba(11, 35, 19, 0.25);
          transition: transform 0.25s ease;
        }
        .jelajah .faq-help__btn:hover { transform: translateY(-2px); }
        .jelajah .sec-faq__list { display: flex; flex-direction: column; gap: 12px; }
        .jelajah .faq-item { background: #F8F7F2; border-radius: 14px; transition: background 0.25s ease; }
        .jelajah .faq-item.is-open { background: #F1EFE4; }
        .jelajah .faq-item__head {
          width: 100%; display: flex; align-items: center; gap: 20px;
          background: none; border: none; cursor: pointer; text-align: left;
          padding: 20px 24px; font-family: sans-serif;
        }
        .jelajah .faq-item__num { color: #999; font-size: 14px; min-width: 22px; }
        .jelajah .faq-item__q { flex: 1; color: #04342C; font-size: 14.5px; font-weight: 600; }
        .jelajah .faq-item__icon { color: #04342C; font-size: 20px; line-height: 1; width: 20px; text-align: center; }
        .jelajah .faq-item__body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s ease; }
        .jelajah .faq-item.is-open .faq-item__body { grid-template-rows: 1fr; }
        .jelajah .faq-item__body p {
          overflow: hidden; margin: 0;
          font-family: sans-serif; font-size: 13px; line-height: 1.7; color: #5F5E5A;
          padding: 0 24px 0 66px;
        }
        .jelajah .faq-item.is-open .faq-item__body p { padding-bottom: 22px; }

        @media (max-width: 900px) {
          .jelajah .sec-articles { padding: 0 24px 64px; }
          .jelajah .sec-articles__grid { grid-template-columns: 1fr; }
          .jelajah .art-card { grid-template-columns: 1fr; }
          .jelajah .art-card__body { padding: 0 16px 16px; }
          .jelajah .sec-faq { padding: 0 24px 64px; }
          .jelajah .sec-faq__inner { grid-template-columns: 1fr; padding: 28px 20px; gap: 32px; }
          .jelajah .faq-item__head { padding: 16px; gap: 14px; }
          .jelajah .faq-item__body p { padding-left: 52px; padding-right: 16px; }
        }
        @media (max-width: 700px) {
          .jelajah .sec-explore { padding: 48px 24px 64px; }
        }
      `}</style>
    </div>
  );
}

export default JelajahSections;
