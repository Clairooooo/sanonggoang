import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/profil', label: 'Profil' },
  { to: '/daya-tarik', label: 'Daya Tarik' },
  { to: '/fasilitas', label: 'Fasilitas' },
  { to: '/galeri', label: 'Galeri' },
  { to: '/lokasi', label: 'Lokasi' },
];

const ctaLink = { to: '/kontak', label: 'Kontak' };

function Navbar() {
  const location = useLocation();
  const isBeranda = location.pathname === '/';
  const [visible, setVisible] = useState(!isBeranda);

  useEffect(() => {
    if (!isBeranda) {
      setVisible(true);
      return;
    }
    setVisible(false);
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.7);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isBeranda]);

  return (
    <div
      className="site-navbar-wrap"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        padding: '18px 20px 0',
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(-130%)',
        transition: 'transform 0.4s ease',
      }}
    >
      <nav className="site-navbar">
        <Link to="/" className="site-navbar__brand">
          <span className="site-navbar__logo">S</span>
          <span className="site-navbar__brand-name">Sano Nggoang</span>
        </Link>

        <div className="site-navbar__links">
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`site-navbar__link${active ? ' site-navbar__link--active' : ''}`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <Link to={ctaLink.to} className="site-navbar__cta">
          {ctaLink.label}
        </Link>
      </nav>

      <style>{`
        .site-navbar {
          width: 100%;
          max-width: 1080px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: #0B2313;
          border: 1px solid rgba(234, 243, 222, 0.08);
          border-radius: 999px;
          padding: 10px 12px 10px 16px;
          font-family: sans-serif;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
        }

        .site-navbar__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .site-navbar__logo {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #3B6D11, #0F6E56 60%, #5DCAA5);
          color: #EAF3DE;
          font-weight: 700;
          font-size: 15px;
          font-family: Georgia, serif;
        }
        .site-navbar__brand-name {
          color: #EAF3DE;
          font-weight: 700;
          font-size: 15px;
          white-space: nowrap;
        }

        .site-navbar__links {
          display: flex;
          align-items: center;
          gap: 2px;
          flex-wrap: nowrap;
        }
        .site-navbar__link {
          color: rgba(234, 243, 222, 0.7);
          text-decoration: none;
          font-size: 14px;
          padding: 9px 14px;
          border-radius: 999px;
          white-space: nowrap;
          transition: background 0.25s ease, color 0.25s ease;
        }
        .site-navbar__link:hover {
          color: #EAF3DE;
          background: rgba(255, 255, 255, 0.06);
        }
        .site-navbar__link--active {
          color: #C8E06A;
          font-weight: 600;
        }

        .site-navbar__cta {
          background: #C8E06A;
          color: #0B2313;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          padding: 10px 22px;
          border-radius: 999px;
          white-space: nowrap;
          flex-shrink: 0;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .site-navbar__cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 900px) {
          .site-navbar__links { display: none; }
          .site-navbar { padding: 10px 12px; }
        }
      `}</style>
    </div>
  );
}

export default Navbar;