import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import danauImg from '../assets/hero.jpg';
import caciImg from '../assets/vestifalcaci.jpg';

const fallbackGradients = [
  'linear-gradient(160deg, #042C53 0%, #185FA5 55%, #5DCAA5 100%)',
  'linear-gradient(160deg, #7A2E0E 0%, #B85C1E 55%, #E8A24C 100%)',
  'linear-gradient(160deg, #1B3A0F 0%, #3B6D11 55%, #A8D96A 100%)',
  'linear-gradient(160deg, #04342C 0%, #0B2313 55%, #3B6D11 100%)',
];

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

function Galeri() {
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dayaTarik, setDayaTarik] = useState([]);
  const [fasilitas, setFasilitas] = useState([]);
  const [openFaq, setOpenFaq] = useState(1);

  const [lightboxIndex, setLightboxIndex] = useState(null);
  // Rasio lebar/tinggi asli tiap foto, dipakai agar setiap baris grid terisi penuh
  const [ratios, setRatios] = useState({});

  const trackRef = useRef(null); // carousel Daya Tarik

  useEffect(() => {
    fetch('http://localhost:5000/api/galeri')
      .then((res) => res.json())
      .then((data) => {
        setGaleri(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal ambil data galeri:', err);
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

    fetch('http://localhost:5000/api/fasilitas')
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => setFasilitas(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Gagal ambil data fasilitas:', err);
        setFasilitas([]);
      });
  }, []);

  const scrollTrack = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  const items = galeri.length > 0
    ? galeri
    : [
        { id: 'f1', judul: 'Pemandangan Danau', gambar: null, img: danauImg },
        { id: 'f2', judul: 'Festival Caci', gambar: null, img: caciImg },
        { id: 'f3', judul: 'Kawah Vulkanik', gambar: null },
        { id: 'f4', judul: 'Air Panas Alami', gambar: null },
        { id: 'f5', judul: 'Jalur Trekking', gambar: null },
      ];

  const getSrc = (item) =>
    item.gambar ? `http://localhost:5000${item.gambar}` : item.img || null;

  const rememberRatio = (id, img) => {
    if (!img.naturalWidth || !img.naturalHeight) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    setRatios((prev) => (prev[id] === ratio ? prev : { ...prev, [id]: ratio }));
  };

  const openLightbox = (i) => setLightboxIndex(i);

  const closeLightbox = () => setLightboxIndex(null);

  const stepLightbox = (dir) => {
    setLightboxIndex((lightboxIndex + dir + items.length) % items.length);
  };

  // Keyboard + kunci scroll saat lightbox terbuka
  useEffect(() => {
    if (lightboxIndex === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, items.length]);

  const activeItem = lightboxIndex !== null ? items[lightboxIndex] : null;
  const activeSrc = activeItem ? getSrc(activeItem) : null;

  return (
    <div className="gal" style={{ fontFamily: 'Georgia, serif', marginTop: -72 }}>
      <section className="gal-hero">
        <div className="gal-hero__head">
          <h1>
            Kamu sedang menjelajahi
            <br />
            Galeri Danau Sano Nggoang
          </h1>
          <p className="gal-hero__count">
            {loading ? 'Memuat galeri...' : `Semua foto (${items.length})`}
          </p>
        </div>

        {/* Grid "justified": tiap baris penuh, lebar foto mengikuti rasio aslinya */}
        <div className="gal-grid">
          {items.map((item, i) => {
            const src = getSrc(item);
            const ratio = ratios[item.id] || 1.5;
            return (
              <button
                key={item.id}
                type="button"
                className="gal-tile"
                onClick={() => openLightbox(i)}
                style={{ '--r': ratio }}
                aria-label={item.judul ? `Buka foto ${item.judul}` : 'Buka foto'}
              >
                {src ? (
                  <img
                    src={src}
                    alt={item.judul || ''}
                    loading="lazy"
                    onLoad={(e) => rememberRatio(item.id, e.currentTarget)}
                  />
                ) : (
                  <span
                    className="gal-tile__fill"
                    style={{ background: fallbackGradients[i % fallbackGradients.length] }}
                  />
                )}
                {item.judul && <span className="gal-tile__caption">{item.judul}</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== LIGHTBOX (foto ukuran penuh) ===== */}
      {activeItem && (
        <div className="gal-lb" role="dialog" aria-modal="true" onClick={closeLightbox}>
          <button type="button" className="gal-lb__close" onClick={closeLightbox} aria-label="Tutup">×</button>
          {items.length > 1 && (
            <>
              <button
                type="button"
                className="gal-lb__nav gal-lb__nav--prev"
                onClick={(e) => { e.stopPropagation(); stepLightbox(-1); }}
                aria-label="Foto sebelumnya"
              >←</button>
              <button
                type="button"
                className="gal-lb__nav gal-lb__nav--next"
                onClick={(e) => { e.stopPropagation(); stepLightbox(1); }}
                aria-label="Foto berikutnya"
              >→</button>
            </>
          )}
          <figure className="gal-lb__figure" onClick={(e) => e.stopPropagation()}>
            {activeSrc ? (
              <img src={activeSrc} alt={activeItem.judul} className="gal-lb__img" />
            ) : (
              <div
                className="gal-lb__placeholder"
                style={{ background: fallbackGradients[lightboxIndex % fallbackGradients.length] }}
              />
            )}
            <figcaption className="gal-lb__caption">
              {activeItem.judul}
              <span>{lightboxIndex + 1} / {items.length}</span>
            </figcaption>
          </figure>
        </div>
      )}

      <div className="gal-more">
        {/* ===== EXPLORE (carousel Daya Tarik) ===== */}
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
                <div key={item.id} className="art-card">
                  <div className="art-card__photo" style={facStyle}>
                    <span className="art-card__tag">Fasilitas</span>
                  </div>
                  <div className="art-card__body">
                    <h3>{item.nama}</h3>
                    <p>{item.deskripsi}</p>
                    <Link to="/fasilitas" className="art-card__link">Lihat Detail →</Link>
                  </div>
                </div>
              );
            })}
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
      </div>

      <style>{`
        .gal-hero {
          background: #FBFAF6;
          padding: calc(72px + 72px) 24px 88px;
        }
        .gal-hero__head {
          max-width: 1100px;
          margin: 0 auto 48px;
          text-align: center;
        }
        .gal-hero h1 {
          font-family: Georgia, serif;
          color: #04342C;
          font-weight: normal;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          line-height: 1.25;
          margin: 0 0 22px;
        }
        .gal-hero__count {
          display: inline-block;
          font-family: sans-serif;
          color: #0F6E56;
          font-size: 13.5px;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin: 0;
          padding-bottom: 4px;
          border-bottom: 2px solid #0F6E56;
        }

        /* ===== GRID JUSTIFIED ===== */
        .gal-grid {
          --row-h: 200px;
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        /* Elemen pengisi: baris terakhir tidak ikut melebar memenuhi layar */
        .gal-grid::after {
          content: '';
          flex-grow: 999999;
        }
        .gal-tile {
          position: relative;
          flex-grow: var(--r);
          flex-basis: calc(var(--r) * var(--row-h));
          aspect-ratio: var(--r);
          max-height: calc(var(--row-h) * 1.6);
          overflow: hidden;
          border: none;
          padding: 0;
          background: #EDEBE3;
          cursor: pointer;
        }
        .gal-tile img,
        .gal-tile__fill {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease, filter 0.3s ease;
        }
        .gal-tile:hover img,
        .gal-tile:hover .gal-tile__fill {
          transform: scale(1.04);
          filter: brightness(0.75);
        }
        .gal-tile:focus-visible { outline: 2px solid #C8E06A; outline-offset: 3px; }
        /* Judul foto dari database selalu tampil di bagian bawah foto */
        .gal-tile__caption {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 28px 14px 12px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
          color: #FAFAF7;
          font-family: sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          text-align: left;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
        }

        /* ===== LIGHTBOX ===== */
        .gal-lb {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(5, 15, 8, 0.92);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: galLbIn 0.25s ease;
        }
        @keyframes galLbIn { from { opacity: 0; } to { opacity: 1; } }

        .gal-lb__figure {
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          max-width: 100%;
        }
        .gal-lb__img {
          display: block;
          max-width: min(90vw, 1200px);
          max-height: 80vh;
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
        }
        .gal-lb__placeholder {
          width: min(80vw, 640px);
          height: min(60vh, 440px);
          border-radius: 12px;
        }
        .gal-lb__caption {
          font-family: Georgia, serif;
          color: #FAEEDA;
          font-size: 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .gal-lb__caption span { font-family: sans-serif; color: #7A9B7A; font-size: 12px; }

        .gal-lb__close {
          position: absolute;
          top: 20px;
          right: 24px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.08);
          color: #FAEEDA;
          font-size: 26px;
          line-height: 1;
          cursor: pointer;
        }
        .gal-lb__nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.08);
          color: #FAEEDA;
          font-size: 20px;
          cursor: pointer;
        }
        .gal-lb__nav--prev { left: 24px; }
        .gal-lb__nav--next { right: 24px; }
        .gal-lb__close:hover,
        .gal-lb__nav:hover { background: rgba(200, 224, 106, 0.25); }

        /* ===== SECTION TAMBAHAN (latar terang) ===== */
        .gal-more { background: #FBFAF6; }

        .gal-more .eyebrow {
          font-family: sans-serif;
          color: #0F6E56;
          font-size: 11.5px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0 0 12px;
        }
        .gal-more h2 { font-weight: normal; color: #04342C; margin: 0 0 16px; }
        .gal-more .muted { font-family: sans-serif; color: #999; }

        .gal-more .btn-dark {
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
        .gal-more .btn-dark:hover { transform: translateY(-2px); }

        /* EXPLORE */
        .sec-explore { padding: 88px 48px 96px; max-width: 1200px; margin: 0 auto; }
        .sec-explore__head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .sec-explore__head h2 { font-size: 26px; margin: 0; }

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

        /* FASILITAS */
        .sec-articles { padding: 0 48px 96px; max-width: 1200px; margin: 0 auto; }
        .sec-articles__head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .sec-articles__head h2 { font-size: 26px; margin: 0; }
        .sec-articles__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        .art-card {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 18px;
          border: 1px solid #E2E0D5;
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
        }
        .art-card__photo {
          position: relative;
          min-height: 150px;
          background-size: cover;
          background-position: center;
          padding: 12px;
        }
        .art-card__tag {
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          color: #FAEEDA;
          font-family: sans-serif;
          font-size: 10.5px;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .art-card__body { padding: 18px 18px 18px 0; display: flex; flex-direction: column; justify-content: center; }
        .art-card__body h3 { color: #04342C; font-size: 16px; font-weight: normal; margin: 0 0 8px; }
        .art-card__body p { font-family: sans-serif; color: #5F5E5A; font-size: 12.5px; line-height: 1.6; margin: 0 0 10px; }
        .art-card__link { font-family: sans-serif; color: #0F6E56; font-size: 12.5px; font-weight: 600; text-decoration: none; }

        /* FAQ */
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
        .sec-faq__left h2 { font-size: clamp(1.8rem, 3.2vw, 2.4rem); line-height: 1.15; margin: 0; }
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
          .gal-grid { --row-h: 180px; gap: 10px; }
          .sec-articles { padding: 0 24px 64px; }
          .sec-articles__grid { grid-template-columns: 1fr; }
          .art-card { grid-template-columns: 1fr; }
          .art-card__body { padding: 0 16px 16px; }
          .sec-faq { padding: 0 24px 64px; }
          .sec-faq__inner { grid-template-columns: 1fr; padding: 28px 20px; gap: 32px; }
          .faq-item__head { padding: 16px; gap: 14px; }
          .faq-item__body p { padding-left: 52px; padding-right: 16px; }
        }
        @media (max-width: 700px) {
          .sec-explore { padding: 48px 24px 64px; }
        }
        @media (max-width: 600px) {
          .gal-hero { padding: calc(56px + 72px) 16px 64px; }
          .gal-grid { --row-h: 100px; gap: 6px; }
          .gal-lb { padding: 16px; }
          .gal-lb__nav { width: 40px; height: 40px; top: auto; bottom: 24px; transform: none; }
          .gal-lb__nav--prev { left: 24px; }
          .gal-lb__nav--next { right: 24px; }
          .gal-lb__img { max-height: 70vh; }
        }
      `}</style>
    </div>
  );
}

export default Galeri;