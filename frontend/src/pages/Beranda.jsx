import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import danauImg from '../assets/hero.jpg';
import caciImg from '../assets/hero2.jpg';
import hero3Img from '../assets/hero4.jpg'; // ganti dengan nama file gambar ketiga Anda

// 3 gambar slideshow. Ganti isi array ini kalau ingin mengubah urutan atau gambarnya.
const slides = [
  { src: danauImg, alt: 'Danau Sano Nggoang' },
  { src: caciImg, alt: 'Festival Caci' },
  { src: hero3Img, alt: 'Pemandangan sekitar Danau Sano Nggoang' },
];

const SLIDE_INTERVAL = 5000; // ms, jeda antar gambar

// Menu mengikuti route di App.jsx. "Kontak" jadi tombol CTA di ujung kanan.
const navLinks = [
  { to: '/profil', title: 'Profil' },
  { to: '/daya-tarik', title: 'Daya Tarik' },
  { to: '/fasilitas', title: 'Fasilitas' },
  { to: '/galeri', title: 'Galeri' },
  { to: '/lokasi', title: 'Lokasi' },
];

const ctaLink = { to: '/kontak', title: 'Hubungi Kami' };

function Beranda() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  // Pindah otomatis ke gambar berikutnya, kembali ke awal setelah gambar terakhir.
  // Timer dibuat ulang setiap `current` berubah, jadi klik titik juga mengulang hitungan.
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <section className="hero-menu">
        {/* ===== SLIDESHOW LATAR ===== */}
        <div className="hero-menu__slides" aria-hidden="true">
          {slides.map((s, i) => (
            <div
              key={s.src}
              className={`hero-menu__slide ${i === current ? 'is-active' : ''}`}
              style={{ backgroundImage: `url(${s.src})` }}
            />
          ))}
        </div>
        <div className="hero-menu__overlay" />

        {/* ===== NAVBAR ===== */}
        <nav className="hero-menu__navbar">
          <Link to="/" className="hero-menu__brand">
            <span className="hero-menu__brand-name">Sano Nggoang</span>
            <span className="hero-menu__brand-sub">Manggarai Barat · NTT</span>
          </Link>

          <div className="hero-menu__nav-links">
            {navLinks.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.title}
              </Link>
            ))}
          </div>

          <div className="hero-menu__right">
            <Link to={ctaLink.to} className="hero-menu__cta">
              {ctaLink.title}
            </Link>
            <button
              type="button"
              className="hero-menu__burger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Buka menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>

          {menuOpen && (
            <div className="hero-menu__mobile">
              {navLinks.map((item) => (
                <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* ===== TEKS DI TENGAH BAWAH GAMBAR: tombol, judul, deskripsi, indikator ===== */}
        <div className="hero-menu__content">
          <Link to="/profil" className="hero-menu__cta-main">
            Pelajari Lebih Lanjut
          </Link>
          <h1 className="hero-menu__title-main">Danau Sano Nggoang</h1>
          <p className="hero-menu__subtitle">
            Danau vulkanik terbesar di Flores, dikelilingi perbukitan hijau
            dan sumber air panas alami.
          </p>

          {/* ===== INDIKATOR SLIDE ===== */}
          <div className="hero-menu__dots">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                className={i === current ? 'is-active' : ''}
                onClick={() => setCurrent(i)}
                aria-label={`Tampilkan gambar ${i + 1}`}
                aria-current={i === current}
              />
            ))}
          </div>
        </div>

        <style>{`
          .hero-menu {
            position: relative;
            min-height: 100vh;
            overflow: hidden;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            background: #0B2313;
          }

          /* slideshow */
          .hero-menu__slides { position: absolute; inset: 0; }
          .hero-menu__slide {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            opacity: 0;
            transition: opacity 1.2s ease;
          }
          .hero-menu__slide.is-active { opacity: 1; }

          /* gradasi gelap: atas tipis untuk navbar, bawah pekat untuk teks */
          .hero-menu__overlay {
            position: absolute;
            inset: 0;
            background:
              linear-gradient(to bottom, rgba(5, 20, 10, 0.45) 0%, rgba(5, 20, 10, 0) 22%),
              linear-gradient(to top, rgba(5, 20, 10, 0.88) 0%, rgba(5, 20, 10, 0.55) 32%, rgba(5, 20, 10, 0) 62%);
            z-index: 1;
          }

          /* navbar */
          .hero-menu__navbar {
            position: absolute;
            top: 0; left: 0; right: 0;
            display: flex; align-items: center; justify-content: space-between; gap: 24px;
            padding: 28px 40px;
            font-family: sans-serif;
            z-index: 4;
          }
          .hero-menu__brand { display: flex; flex-direction: column; gap: 2px; text-decoration: none; }
          .hero-menu__brand-name { color: #EAF3DE; font-size: 18px; font-weight: 700; letter-spacing: 0.2px; }
          .hero-menu__brand-sub { color: #C8E06A; font-size: 12px; }
          .hero-menu__nav-links { display: flex; align-items: center; gap: 4px; }
          .hero-menu__nav-links a {
            color: rgba(234, 243, 222, 0.9);
            text-decoration: none;
            font-size: 14px;
            padding: 10px 16px;
            border-radius: 999px;
            transition: background 0.25s ease, color 0.25s ease;
          }
          .hero-menu__nav-links a:hover { background: rgba(255, 255, 255, 0.12); color: #C8E06A; }
          .hero-menu__right { display: flex; align-items: center; gap: 10px; }
          .hero-menu__cta {
            background: #C8E06A;
            color: #0B2313;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            padding: 11px 24px;
            border-radius: 999px;
            white-space: nowrap;
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .hero-menu__cta:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3); }
          .hero-menu__burger {
            display: none;
            width: 42px; height: 42px;
            border-radius: 50%;
            border: 1px solid rgba(234, 243, 222, 0.4);
            background: rgba(0, 0, 0, 0.25);
            color: #EAF3DE;
            font-size: 16px;
            cursor: pointer;
          }
          .hero-menu__mobile {
            display: none;
            position: absolute;
            top: 84px; left: 24px; right: 24px;
            flex-direction: column;
            background: rgba(11, 35, 19, 0.95);
            border-radius: 16px;
            padding: 8px;
          }
          .hero-menu__mobile a {
            color: #EAF3DE;
            text-decoration: none;
            font-size: 15px;
            padding: 14px 16px;
            border-radius: 10px;
          }
          .hero-menu__mobile a:hover { background: rgba(255, 255, 255, 0.08); color: #C8E06A; }

          /* teks di tengah bawah */
          .hero-menu__content {
            position: relative;
            z-index: 3;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 16px;
            max-width: 900px;
            padding: 0 40px 48px;
          }
          .hero-menu__title-main {
            color: #EAF3DE;
            font-size: clamp(2.2rem, 5.5vw, 4rem);
            line-height: 1.08;
            margin: 0;
          }
          .hero-menu__subtitle {
            font-family: sans-serif;
            color: #D3E5D3;
            font-size: 15px;
            line-height: 1.65;
            max-width: 500px;
            margin: 0;
          }
          .hero-menu__cta-main {
            display: inline-block;
            margin-bottom: 6px;
            border: 1px solid rgba(234, 243, 222, 0.55);
            border-radius: 999px;
            color: #EAF3DE;
            font-family: sans-serif;
            font-size: 14px;
            text-decoration: none;
            padding: 13px 30px;
            transition: border-color 0.25s ease, background 0.25s ease;
          }
          .hero-menu__cta-main:hover { border-color: #C8E06A; background: rgba(255, 255, 255, 0.1); }

          /* titik indikator slide */
          .hero-menu__dots {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 20px;
          }
          .hero-menu__dots button {
            width: 28px;
            height: 4px;
            padding: 0;
            border: none;
            border-radius: 999px;
            background: rgba(234, 243, 222, 0.35);
            cursor: pointer;
            transition: background 0.3s ease, width 0.3s ease;
          }
          .hero-menu__dots button:hover { background: rgba(234, 243, 222, 0.6); }
          .hero-menu__dots button.is-active { width: 44px; background: #C8E06A; }

          .hero-menu__stats {
            position: absolute;
            bottom: 32px; right: 40px;
            z-index: 3;
            display: flex; align-items: baseline; gap: 12px;
            font-family: sans-serif;
          }
          .hero-menu__stats strong { color: #EAF3DE; font-size: 30px; font-family: Georgia, serif; }
          .hero-menu__stats span { color: #D3E5D3; font-size: 13px; max-width: 150px; line-height: 1.4; }

          @media (prefers-reduced-motion: reduce) {
            .hero-menu__slide { transition: none; }
          }

          @media (max-width: 900px) {
            .hero-menu__navbar { padding: 22px 24px; }
            .hero-menu__nav-links { display: none; }
            .hero-menu__burger { display: block; }
            .hero-menu__mobile { display: flex; }
            .hero-menu__content { padding: 0 24px 40px; }
            .hero-menu__stats { right: 24px; bottom: 28px; }
          }
          @media (max-width: 600px) {
            .hero-menu__brand-sub { display: none; }
            .hero-menu__cta { padding: 10px 16px; font-size: 13px; }
            .hero-menu__stats { display: none; }
          }
        `}</style>
      </section>
    </div>
  );
}

export default Beranda;