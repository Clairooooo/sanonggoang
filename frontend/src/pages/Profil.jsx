import { useEffect, useState } from 'react';
import danauImg from '../assets/hero.jpg';
import caciImg from '../assets/vestifalcaci.jpg';

function Profil() {
  const [profil, setProfil] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/profil')
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => setProfil(Array.isArray(data) ? data[0] : data))
      .catch((err) => console.error('Gagal ambil data profil:', err));
  }, []);

  const judul = profil?.judul || 'Danau Sano Nggoang';
  const isi =
    profil?.isi ||
    'Danau vulkanik terbesar di Nusa Tenggara Timur, dikelilingi perbukitan hijau dan sumber air panas alami.';

  return (
    <article className="pa" style={{ fontFamily: 'Georgia, serif' }}>
      {/* ===== HEADER ===== */}
      <header className="pa-head">
        
        <p className="pa-head__label">Profil Kawasan</p>
        <h1>{judul}</h1>
        <p className="pa-head__meta">Manggarai Barat · Nusa Tenggara Timur</p>
        <span className="pa-head__line" />
      </header>

      {/* ===== PEMBUKA ===== */}
      <div className="pa-text">
        <p>{isi}</p>
        <p>
          Berada di Manggarai Barat, kawasan ini memadukan lanskap vulkanik, perbukitan hijau, dan
          kehidupan masyarakat yang masih lekat dengan tradisi. Penjelasan berikut dibagi menjadi
          tiga sisi: geografis, geologis, dan sosial-budaya, agar lebih mudah dipahami.
        </p>
      </div>

      {/* ===== BAGIAN 01: GEOGRAFIS ===== */}
      <section className="pa-chapter">
        <div className="pa-chapter__head">
          <span className="pa-chapter__num">01</span>
          <p className="pa-chapter__label">Geografis</p>
          <h2>Lokasi &amp; Dimensi Danau</h2>
        </div>
        <div className="pa-text">
          <p>
            Danau Sano Nggoang terletak di Kecamatan Sano Nggoang, Kabupaten Manggarai Barat, pada
            ketinggian sekitar 757 meter di atas permukaan laut. Luas permukaannya mencapai sekitar
            512 hektar, dengan diameter kurang lebih 2,5 kilometer, menjadikannya salah satu badan
            air terbesar di kawasan ini.
          </p>
          <p>
            Danau dikelilingi oleh tiga desa, yakni Wae Sano, Sano Nggoang, dan Pulau Nuncung, yang
            posisinya melingkar mengikuti kontur perbukitan di sekitar kawasan.
          </p>
        </div>
      </section>

      {/* ===== FOTO LEBAR ===== */}
      <figure className="pa-wide">
        <div className="pa-wide__img" style={{ backgroundImage: `url(${danauImg})` }} />
      </figure>

      {/* ===== BAGIAN 02: GEOLOGIS ===== */}
      <section className="pa-chapter">
        <div className="pa-chapter__head">
          <span className="pa-chapter__num">02</span>
          <p className="pa-chapter__label">Geologis</p>
          <h2>Danau Kawah Vulkanik</h2>
        </div>
        <div className="pa-text">
          <p>
            Danau ini terbentuk dari kaldera bekas erupsi Gunung Waesano, dengan batuan vulkanik tua
            di sekitarnya. Kedalamannya mencapai sekitar 90 meter di titik terdalam, menjadikan Sano
            Nggoang salah satu danau kawah terdalam di dunia.
          </p>
          <p>
            Air danau memiliki tingkat keasaman yang tinggi (pH di bawah 3) disertai aroma belerang
            yang khas, sehingga tidak digunakan warga sekitar untuk mandi atau minum. Di sisi timur
            danau terdapat kolam pemandian air panas alami, hasil langsung dari aktivitas vulkanik
            yang masih berlangsung di bawah permukaan.
          </p>
        </div>
      </section>

      {/* ===== KUTIPAN ===== */}
      <blockquote className="pa-quote">
        <p>
          “Danau ini bukan sekadar pemandangan, ini rumah bagi budaya Manggarai dan alam yang masih
          terjaga hingga hari ini.”
        </p>
        Masyarakat Sano Nggoang
      </blockquote>

      {/* ===== BAGIAN 03: SOSIAL-BUDAYA ===== */}
      <section className="pa-chapter">
        <div className="pa-chapter__head">
          <span className="pa-chapter__num">03</span>
          <p className="pa-chapter__label">Sosial-Budaya</p>
          <h2>Masyarakat &amp; Tradisi Sekitar</h2>
        </div>
        <div className="pa-text">
          <p>
            Tiga desa di sekitar danau, Wae Sano, Sano Nggoang, dan Pulau Nuncung, masih menjaga
            erat kehidupan adat Manggarai dalam keseharian mereka, mulai dari rumah adat, bahasa
            daerah, hingga upacara-upacara penting.
          </p>
          <p>
            Salah satu tradisi yang paling dikenal adalah Caci, tarian perang tradisional yang
            dimainkan dua pria dengan cambuk kulit kerbau dan perisai kayu, sebagai wujud syukur,
            keberanian, dan penghormatan kepada leluhur. Menjaga kawasan ini berarti menjaga
            keduanya sekaligus: alamnya dan budayanya.
          </p>
        </div>
      </section>

      {/* ===== GRID FOTO ===== */}
      <div className="pa-grid">
        <div className="pa-grid__a" style={{ backgroundImage: `url(${danauImg})` }} />
        <div className="pa-grid__b" style={{ backgroundImage: `url(${caciImg})` }} />
        <div
          className="pa-grid__c"
          style={{ background: 'linear-gradient(160deg, #1B3A0F 0%, #3B6D11 55%, #A8D96A 100%)' }}
        />
      </div>

      <div className="pa-text pa-text--last">
        <p>
          Dari tepian danau hingga panggung adat, setiap sudut Sano Nggoang punya cerita. Kami
          mengajakmu datang, berjalan pelan, dan merasakannya sendiri.
        </p>
        <p>
          Lihat daya tarik, fasilitas, dan lokasi lengkapnya pada menu di atas, atau hubungi kami
          untuk membantu merencanakan kunjunganmu.
        </p>
      </div>

      <style>{`
        .pa { background: #fff; color: #04342C; padding: 140px 24px 96px; }

        /* HEADER */
        .pa-head {
          position: relative; text-align: center;
          max-width: 760px; margin: 0 auto 56px;
        }
        .pa-head__ghost {
          position: absolute; left: 50%; top: -70px; transform: translateX(-50%);
          font-size: clamp(7rem, 22vw, 15rem); line-height: 1;
          color: #EEF3EE; z-index: 0; pointer-events: none; user-select: none;
        }
        .pa-head > *:not(.pa-head__ghost) { position: relative; z-index: 1; }
        .pa-head__label {
          font-family: sans-serif; font-size: 11px; letter-spacing: 1.5px;
          text-transform: uppercase; color: #0F6E56; margin: 0 0 14px;
        }
        .pa-head h1 {
          font-weight: normal; margin: 0 0 18px;
          font-size: clamp(2.2rem, 5.5vw, 3.6rem); line-height: 1.1; color: #04342C;
        }
        .pa-head__meta { font-family: sans-serif; font-size: 12.5px; color: #777; margin: 0 0 22px; }
        .pa-head__line { display: block; width: 36px; height: 2px; background: #C8A24C; margin: 0 auto; }

        /* TEKS */
        .pa-text { max-width: 600px; margin: 0 auto 40px; font-family: sans-serif; }
        .pa-text p { font-size: 13.5px; line-height: 1.85; color: #5F5E5A; margin: 0 0 22px; }
        .pa-text--last { margin-top: 48px; }

        /* BAGIAN (CHAPTER) */
        .pa-chapter { max-width: 600px; margin: 64px auto 0; }
        .pa-chapter__head { margin-bottom: 24px; }
        .pa-chapter__num {
          display: inline-block;
          font-family: sans-serif;
          font-size: 12px;
          color: #C8A24C;
          border: 1px solid #C8A24C;
          border-radius: 999px;
          padding: 3px 10px;
          margin-bottom: 12px;
        }
        .pa-chapter__label {
          font-family: sans-serif;
          font-size: 10.5px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #0F6E56;
          margin: 0 0 6px;
        }
        .pa-chapter__head h2 {
          font-weight: normal;
          font-size: 22px;
          color: #04342C;
          margin: 0;
        }
        .pa-chapter .pa-text { margin: 0; max-width: none; }

        /* FOTO */
        .pa-wide { max-width: 900px; margin: 56px auto; }
        .pa-wide__img {
          width: 100%; height: clamp(240px, 42vw, 440px);
          background-size: cover; background-position: center;
        }

        /* KUTIPAN */
        .pa-quote { max-width: 600px; margin: 56px auto; text-align: center; }
        .pa-quote p {
          font-style: italic; font-size: clamp(1.3rem, 2.6vw, 1.75rem);
          line-height: 1.4; color: #04342C; margin: 0 0 16px;
        }
        .pa-quote cite { font-family: sans-serif; font-style: normal; font-size: 12px; color: #777; }

        /* GRID FOTO */
        .pa-grid {
          max-width: 900px; margin: 56px auto;
          display: grid; grid-template-columns: 1.15fr 1fr; grid-template-rows: 1fr 1fr;
          gap: 6px; height: clamp(280px, 48vw, 480px);
        }
        .pa-grid > div { background-size: cover; background-position: center; }
        .pa-grid__a { grid-row: 1 / span 2; }

        @media (max-width: 700px) {
          .pa { padding: 120px 20px 64px; }
          .pa-grid { grid-template-columns: 1fr; grid-template-rows: 240px 160px 160px; height: auto; }
          .pa-grid__a { grid-row: auto; }
        }
      `}</style>
    </article>
  );
}

export default Profil;