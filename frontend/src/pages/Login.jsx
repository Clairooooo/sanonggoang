import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../auth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Username dan password diperiksa oleh backend, bukan di browser
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || 'Login gagal.');
        setToken(data.token);
        navigate('/admin');
      })
      .catch((err) => {
        setError(err.message === 'Failed to fetch' ? 'Tidak bisa terhubung ke server.' : err.message);
        setLoading(false);
      });
  };

  return (
    <div className="login-page" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="login-card">
        <p className="eyebrow">Area Terbatas</p>
        <h1>Login Admin</h1>
        <p className="login-desc">
          Masuk untuk mengelola data Daya Tarik, Fasilitas, Galeri, dan pesan masuk.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Username
            <input
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>
      </div>

      <style>{`
        .login-page {
          min-height: 80vh;
          background: #0B2313;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }
        .login-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 48px;
          max-width: 400px;
          width: 100%;
        }
        .eyebrow {
          font-family: sans-serif;
          color: #0F6E56;
          font-size: 11.5px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0 0 14px;
        }
        .login-card h1 {
          font-weight: normal;
          color: #04342C;
          font-size: 26px;
          margin: 0 0 12px;
        }
        .login-desc {
          font-family: sans-serif;
          color: #5F5E5A;
          font-size: 13.5px;
          line-height: 1.6;
          margin: 0 0 28px;
        }

        .login-form { display: flex; flex-direction: column; gap: 18px; }
        .login-form label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-family: sans-serif;
          font-size: 12.5px;
          color: #04342C;
          font-weight: 600;
        }
        .login-form input {
          font-family: sans-serif;
          font-size: 13.5px;
          padding: 12px 14px;
          border: 1px solid #D8D6CA;
          border-radius: 8px;
          outline: none;
        }
        .login-form input:focus { border-color: #0F6E56; }

        .login-error {
          font-family: sans-serif;
          color: #B02A2A;
          font-size: 12.5px;
          margin: -6px 0 0;
        }

        .login-btn {
          font-family: sans-serif;
          background: #0B2313;
          color: #EAF3DE;
          border: none;
          font-size: 14px;
          font-weight: 600;
          padding: 13px 20px;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 6px;
          transition: transform 0.2s ease;
        }
        .login-btn:hover { transform: translateY(-2px); }
      `}</style>
    </div>
  );
}

export default Login;