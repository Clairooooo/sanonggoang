import { useEffect, useState } from 'react';

function Kontak() {
  const [kontak, setKontak] = useState(null);
  const [form, setForm] = useState({ nama: '', email: '', telepon: '', pesan: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/kontak')
      .then((res) => res.json())
      .then((data) => setKontak(Array.isArray(data) ? data[0] : data))
      .catch((err) => console.error('Gagal ambil data kontak:', err));
  }, []);

  const email = kontak?.email || 'info@sanonggoang.id';
  const alamat = kontak?.alamat || 'Kecamatan Sano Nggoang, Kabupaten Manggarai Barat, NTT';
  const telepon = kontak?.telepon || '+62 812-0000-0000';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.email.trim() || !form.pesan.trim()) {
      alert('Mohon lengkapi nama, email, dan pesan.');
      return;
    }

    fetch('http://localhost:5000/api/pesan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: form.nama,
        email: form.email,
        telepon: form.telepon,
        isi_pesan: form.pesan,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setSent(true);
        setForm({ nama: '', email: '', telepon: '', pesan: '' });
      })
      .catch((err) => {
        console.error('Gagal mengirim pesan:', err);
        alert('Gagal mengirim pesan. Coba lagi nanti.');
      });
  };

  return (
    <div className="kontak-page" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="kontak-wrap">
        <div className="kontak-left">
          <p className="eyebrow">Hubungi Kami</p>
          <h1>
            Rencanakan kunjunganmu
            <br />
            ke Sano Nggoang
          </h1>
          <p className="kontak-left__desc">
            Ada pertanyaan seputar akses, penginapan, atau jadwal Festival Caci?
            Tim kami siap membantu merencanakan perjalananmu ke Danau Sano Nggoang.
          </p>

          <div className="kontak-info">
            <div className="kontak-info__item">
              <span className="kontak-info__icon">✉</span>
              <span>{email}</span>
            </div>
            <div className="kontak-info__item">
              <span className="kontak-info__icon">📍</span>
              <span>{alamat}</span>
            </div>
            <div className="kontak-info__item">
              <span className="kontak-info__icon">☎</span>
              <span>{telepon}</span>
            </div>
          </div>
        </div>

        <div className="kontak-card">
          {sent ? (
            <div className="kontak-sent">
              <h3>Pesan terkirim</h3>
              <p>
                Terima kasih sudah menghubungi kami. Tim akan segera merespons
                lewat email atau nomor yang kamu berikan.
              </p>
              <button type="button" onClick={() => setSent(false)} className="btn-dark">
                Kirim Pesan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="kontak-form">
              <label>
                Nama Lengkap
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                />
              </label>

              <label>
                Alamat Email
                <input
                  type="email"
                  placeholder="Masukkan alamat email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>

              <label>
                Nomor Telepon
                <input
                  type="tel"
                  placeholder="Masukkan nomor telepon"
                  value={form.telepon}
                  onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                />
              </label>

              <label>
                Pesan
                <textarea
                  placeholder="Tulis pesan kamu di sini"
                  value={form.pesan}
                  onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                />
              </label>

              <button type="submit" className="btn-dark">
                Kirim Pesan <span>→</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .kontak-page {
          background: #FBFAF6;
          min-height: 80vh;
          padding: 72px 24px 96px;
        }
        .eyebrow {
          font-family: sans-serif;
          color: #0F6E56;
          font-size: 11.5px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0 0 16px;
        }

        .kontak-wrap {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 48px;
          align-items: start;
        }

        .kontak-left { padding-top: 24px; }
        .kontak-left h1 {
          font-weight: normal;
          color: #04342C;
          font-size: clamp(1.9rem, 4vw, 2.6rem);
          line-height: 1.2;
          margin: 0 0 20px;
        }
        .kontak-left__desc {
          font-family: sans-serif;
          color: #5F5E5A;
          font-size: 14px;
          line-height: 1.75;
          max-width: 400px;
          margin: 0 0 40px;
        }

        .kontak-info { display: flex; flex-direction: column; gap: 18px; }
        .kontak-info__item {
          display: flex;
          align-items: center;
          gap: 14px;
          font-family: sans-serif;
          color: #04342C;
          font-size: 13.5px;
          font-weight: 600;
        }
        .kontak-info__icon {
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 10px;
          background: #EFEDE2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
        }

        .kontak-card {
          background: #F1EFE4;
          border-radius: 20px;
          padding: 40px;
        }

        .kontak-form { display: flex; flex-direction: column; gap: 20px; }
        .kontak-form label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-family: sans-serif;
          font-size: 12.5px;
          color: #04342C;
          font-weight: 600;
        }
        .kontak-form input,
        .kontak-form textarea {
          font-family: sans-serif;
          font-size: 13.5px;
          padding: 13px 16px;
          border: none;
          border-radius: 10px;
          background: #ffffff;
          outline: none;
        }
        .kontak-form textarea { min-height: 110px; resize: vertical; }

        .btn-dark {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: sans-serif;
          background: #0B2313;
          color: #EAF3DE;
          border: none;
          font-size: 13.5px;
          font-weight: 600;
          padding: 14px 28px;
          border-radius: 10px;
          cursor: pointer;
          align-self: flex-start;
          margin-top: 6px;
          transition: transform 0.2s ease;
        }
        .btn-dark:hover { transform: translateY(-2px); }

        .kontak-sent { text-align: center; padding: 32px 8px; }
        .kontak-sent h3 {
          font-family: Georgia, serif;
          color: #04342C;
          font-size: 22px;
          margin: 0 0 14px;
        }
        .kontak-sent p {
          font-family: sans-serif;
          color: #5F5E5A;
          font-size: 13.5px;
          line-height: 1.7;
          margin: 0 0 24px;
        }
        .kontak-sent .btn-dark { margin: 0 auto; }

        @media (max-width: 800px) {
          .kontak-wrap { grid-template-columns: 1fr; }
          .kontak-card { padding: 28px; }
        }
      `}</style>
    </div>
  );
}

export default Kontak;