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

function Beranda() {
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
            .hero-menu__content { padding: 0 24px 40px; }
            .hero-menu__stats { right: 24px; bottom: 28px; }
          }
          @media (max-width: 600px) {
            .hero-menu__stats { display: none; }
          }
        `}</style>
      </section>
    </div>
  );
}

export default Beranda;