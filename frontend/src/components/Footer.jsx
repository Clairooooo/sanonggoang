import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import danauImg from '../assets/hero.jpg';

// Dipakai jika data kontak di database belum diisi atau gagal dimuat
const KONTAK_DEFAULT = {
  telepon: '+62 812-0000-0000',
  email: 'info@sanonggoang.id',
  alamat: 'Kecamatan Sano Nggoang, Kabupaten Manggarai Barat, NTT',
};

function Footer() {
  const [kontak, setKontak] = useState(KONTAK_DEFAULT);

  // Kontak pengelola diambil dari database (dikelola admin di menu Kontak)
  useEffect(() => {
    fetch('http://localhost:5000/api/kontak')
      .then((res) => (res.ok ? res.json() : []))
      .then((rows) => {
        const k = Array.isArray(rows) ? rows[0] : null;
        if (k) setKontak({ telepon: k.telepon || KONTAK_DEFAULT.telepon, email: k.email || KONTAK_DEFAULT.email, alamat: k.alamat || KONTAK_DEFAULT.alamat });
      })
      .catch(() => {});
  }, []);

  return (
    <footer
      className="site-footer"
      style={{
        backgroundImage: `linear-gradient(rgba(5,20,10,0.55), rgba(5,20,10,0.75)), url(${danauImg})`,
      }}
    >
      <div className="site-footer__inner">
        {/* ===== AJAKAN & NEWSLETTER ===== */}
        <div className="site-footer__cta">
          <h2>
            Rencanakan kunjunganmu ke
            <br />
            Danau Sano Nggoang
          </h2>

          <form
            className="site-footer__form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="email" placeholder="Alamat email kamu" />
            <button type="submit" aria-label="Kirim">→</button>
          </form>

          <Link to="/kontak" className="site-footer__cta-btn">
            Hubungi Kami <span>↗</span>
          </Link>
        </div>

        {/* ===== KOLOM BAWAH ===== */}
        <div className="site-footer__bottom">
          <div className="site-footer__icons">
            <div className="site-footer__icon-item">
              <span>📍</span>
              <p>Akses Mudah</p>
            </div>
            <div className="site-footer__icon-item">
              <span>☎</span>
              <p>Dukungan Lokal</p>
            </div>
            <div className="site-footer__icon-item">
              <span>✓</span>
              <p>Info Terpercaya</p>
            </div>
          </div>

          <div className="site-footer__cols">
            <div className="site-footer__col">
              <p className="site-footer__col-title">Jelajahi</p>
              <Link to="/daya-tarik">Daya Tarik</Link>
              <Link to="/fasilitas">Fasilitas</Link>
              <Link to="/galeri">Galeri</Link>
              <Link to="/festival">Festival</Link>
              <Link to="/lokasi">Lokasi</Link>
            </div>

            <div className="site-footer__col">
              <p className="site-footer__col-title">Tentang</p>
              <Link to="/profil">Profil Kawasan</Link>
              <Link to="/kontak">Kontak</Link>
            </div>

            <div className="site-footer__col">
              <p className="site-footer__col-title">Kontak Kami</p>
              <span className="site-footer__text">{kontak.telepon}</span>
              <span className="site-footer__text">{kontak.email}</span>
              <Link to="/kontak" className="site-footer__underline-link">
                Hubungi kami
              </Link>
            </div>
          </div>
        </div>

        {/* ===== SOSIAL MEDIA ===== */}
        <div className="site-footer__social">
          <a href="#" aria-label="Facebook">f</a>
          <a href="#" aria-label="Instagram">◎</a>
          <a href="#" aria-label="WhatsApp">✆</a>
        </div>

        {/* ===== GARIS BAWAH ===== */}
        <div className="site-footer__legal">
          <span>{kontak.alamat}</span>
          <span>© {new Date().getFullYear()} Danau Sano Nggoang — Seluruh hak cipta dilindungi</span>
          {/* Halaman login admin dibuka di tab/jendela baru */}
          <Link to="/login" target="_blank" rel="noopener noreferrer" className="site-footer__admin-btn">
            <span aria-hidden="true">🔒</span> Login Admin
          </Link>
        </div>
      </div>

      <style>{`
        .site-footer {
          background-size: cover;
          background-position: center;
          font-family: sans-serif;
          padding: 72px 48px 32px;
        }
        .site-footer__inner { max-width: 1200px; margin: 0 auto; }

        .site-footer__cta { text-align: center; margin-bottom: 72px; }
        .site-footer__cta h2 {
          font-family: Georgia, serif;
          font-weight: normal;
          color: #FAEEDA;
          font-size: clamp(1.8rem, 4.5vw, 2.8rem);
          line-height: 1.25;
          margin: 0 0 32px;
        }
        .site-footer__form {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 999px;
          padding: 6px 6px 6px 20px;
          margin-bottom: 20px;
        }
        .site-footer__form input {
          background: transparent;
          border: none;
          outline: none;
          color: #FAEEDA;
          font-size: 13.5px;
          width: 200px;
        }
        .site-footer__form input::placeholder { color: #C9DCC9; }
        .site-footer__form button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: #C8E06A;
          color: #0B2313;
          font-size: 16px;
          cursor: pointer;
        }
        .site-footer__cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #EAF3DE;
          border: 1px solid rgba(234,243,222,0.4);
          padding: 12px 26px;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 600;
          margin-left: 12px;
        }

        .site-footer__bottom {
          background: rgba(11,35,19,0.75);
          backdrop-filter: blur(6px);
          border-radius: 24px;
          padding: 40px;
        }

        .site-footer__icons {
          display: flex;
          gap: 36px;
          padding-bottom: 32px;
          margin-bottom: 32px;
          border-bottom: 1px solid rgba(255,255,255,0.12);
        }
        .site-footer__icon-item { display: flex; align-items: center; gap: 10px; }
        .site-footer__icon-item span { font-size: 16px; }
        .site-footer__icon-item p { color: #C9DCC9; font-size: 12.5px; margin: 0; }

        .site-footer__cols {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .site-footer__col-title {
          color: #7A9B7A;
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0 0 16px;
        }
        .site-footer__col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .site-footer__col a {
          color: #EAF3DE;
          text-decoration: none;
          font-size: 13.5px;
        }
        .site-footer__col a:hover { color: #C8E06A; }
        .site-footer__text { color: #C9DCC9; font-size: 13.5px; }
        .site-footer__underline-link {
          color: #C8E06A;
          font-size: 13px;
          text-decoration: underline;
          margin-top: 4px;
        }

        .site-footer__social {
          display: flex;
          gap: 14px;
          margin: 32px 0 24px;
        }
        .site-footer__social a {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          color: #EAF3DE;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 13px;
        }
        .site-footer__social a:hover { background: #C8E06A; color: #0B2313; }

        .site-footer__legal {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
          color: #7A9B7A;
          font-size: 11.5px;
        }
        .site-footer__admin-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 1px solid rgba(200, 224, 106, 0.6);
          border-radius: 999px;
          color: #C8E06A;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.25s ease, color 0.25s ease;
        }
        .site-footer__admin-btn:hover { background: #C8E06A; color: #0B2313; }

        @media (max-width: 800px) {
          .site-footer { padding: 56px 24px 24px; }
          .site-footer__bottom { padding: 28px 20px; }
          .site-footer__cols { grid-template-columns: 1fr; gap: 24px; }
          .site-footer__icons { flex-direction: column; gap: 14px; }
          .site-footer__form input { width: 140px; }
          .site-footer__cta-btn { margin-left: 0; margin-top: 10px; display: inline-flex; }
        }
      `}</style>
    </footer>
  );
}

export default Footer;