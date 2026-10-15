const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== AUTENTIKASI ADMIN =====
// Username, password, dan kunci rahasia token disimpan di .env (tidak ikut ke GitHub)
const { ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_TOKEN_SECRET } = process.env;
if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !ADMIN_TOKEN_SECRET) {
  console.error('ADMIN_USERNAME, ADMIN_PASSWORD, dan ADMIN_TOKEN_SECRET wajib diisi di .env');
  process.exit(1);
}
const TOKEN_UMUR_MS = 8 * 60 * 60 * 1000; // token berlaku 8 jam

// Bandingkan dua teks tanpa membocorkan informasi lewat lama waktu pengecekan
function samaAman(a, b) {
  const hashA = crypto.createHash('sha256').update(String(a)).digest();
  const hashB = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function tandaTangan(data) {
  return crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(data).digest('base64url');
}

function buatToken(username) {
  const payload = Buffer.from(JSON.stringify({ u: username, exp: Date.now() + TOKEN_UMUR_MS })).toString('base64url');
  return `${payload}.${tandaTangan(payload)}`;
}

function cekToken(token) {
  const [payload, signature] = String(token).split('.');
  if (!payload || !signature || !samaAman(signature, tandaTangan(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

// Middleware: hanya admin dengan token valid yang boleh lewat
function wajibAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!cekToken(token)) {
    return res.status(401).json({ error: 'Silakan login sebagai admin' });
  }
  next();
}

// Batasi percobaan login: maksimal 5 kali gagal per 15 menit per alamat IP
const percobaanLogin = new Map();
const BATAS_GAGAL = 5;
const JEDA_MS = 15 * 60 * 1000;

app.post('/api/login', (req, res) => {
  const ip = req.ip;
  const catatan = percobaanLogin.get(ip);
  if (catatan && catatan.gagal >= BATAS_GAGAL && Date.now() - catatan.waktu < JEDA_MS) {
    return res.status(429).json({ error: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' });
  }

  const { username, password } = req.body || {};
  const usernameBenar = samaAman(username || '', ADMIN_USERNAME);
  const passwordBenar = samaAman(password || '', ADMIN_PASSWORD);
  if (!usernameBenar || !passwordBenar) {
    const gagal = catatan && Date.now() - catatan.waktu < JEDA_MS ? catatan.gagal + 1 : 1;
    percobaanLogin.set(ip, { gagal, waktu: Date.now() });
    return res.status(401).json({ error: 'Username atau password salah.' });
  }

  percobaanLogin.delete(ip);
  res.json({ token: buatToken(ADMIN_USERNAME) });
});

// Dipakai frontend untuk memastikan token masih berlaku
app.get('/api/me', wajibAdmin, (req, res) => {
  res.json({ ok: true });
});

// Folder uploads bisa diakses lewat URL http://localhost:5000/uploads/nama-file.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Konfigurasi penyimpanan file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Gagal konek database:', err.message);
    return;
  }
  console.log('Berhasil konek ke database MySQL');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server backend jalan dengan baik' });
});

// GET semua data profil
app.get('/api/profil', (req, res) => {
  db.query('SELECT * FROM profil', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET semua data daya tarik wisata
app.get('/api/daya-tarik', (req, res) => {
  db.query('SELECT * FROM daya_tarik', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET semua data fasilitas
app.get('/api/fasilitas', (req, res) => {
  db.query('SELECT * FROM fasilitas', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET semua data galeri
app.get('/api/galeri', (req, res) => {
  db.query('SELECT * FROM galeri ORDER BY uploaded_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET data kontak
app.get('/api/kontak', (req, res) => {
  db.query('SELECT * FROM kontak', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET semua pesan (terbaru dulu)
app.get('/api/pesan', wajibAdmin, (req, res) => {
  db.query('SELECT * FROM pesan ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST kirim pesan baru (dari form Kontak)
app.post('/api/pesan', (req, res) => {
  const { nama, email, telepon, isi_pesan } = req.body;
  if (!nama || !email || !isi_pesan) {
    return res.status(400).json({ error: 'Nama, email, dan pesan wajib diisi' });
  }
  db.query(
    'INSERT INTO pesan (nama, email, telepon, isi_pesan) VALUES (?, ?, ?, ?)',
    [nama, email, telepon || null, isi_pesan],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, nama, email, telepon, isi_pesan });
    }
  );
});

// PUT tandai pesan sudah dibaca
app.put('/api/pesan/:id/baca', wajibAdmin, (req, res) => {
  db.query('UPDATE pesan SET dibaca = 1 WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Ditandai sudah dibaca' });
  });
});

// DELETE pesan
app.delete('/api/pesan/:id', wajibAdmin, (req, res) => {
  db.query('DELETE FROM pesan WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Berhasil dihapus' });
  });
});

// ===== DAYA TARIK: Tambah, Ubah, Hapus (dengan upload gambar) =====
app.post('/api/daya-tarik', wajibAdmin, upload.single('gambar'), (req, res) => {
  const { nama, deskripsi } = req.body;
  const gambar = req.file ? `/uploads/${req.file.filename}` : null;
  if (!nama) return res.status(400).json({ error: 'Nama wajib diisi' });
  db.query(
    'INSERT INTO daya_tarik (nama, deskripsi, gambar) VALUES (?, ?, ?)',
    [nama, deskripsi || null, gambar],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, nama, deskripsi, gambar });
    }
  );
});

app.put('/api/daya-tarik/:id', wajibAdmin, upload.single('gambar'), (req, res) => {
  const { nama, deskripsi } = req.body;
  const gambarBaru = req.file ? `/uploads/${req.file.filename}` : req.body.gambarLama || null;
  db.query(
    'UPDATE daya_tarik SET nama = ?, deskripsi = ?, gambar = ? WHERE id = ?',
    [nama, deskripsi || null, gambarBaru, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Berhasil diperbarui' });
    }
  );
});

app.delete('/api/daya-tarik/:id', wajibAdmin, (req, res) => {
  db.query('DELETE FROM daya_tarik WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Berhasil dihapus' });
  });
});

// ===== FASILITAS: Tambah, Ubah, Hapus (dengan upload gambar) =====
app.post('/api/fasilitas', wajibAdmin, upload.single('gambar'), (req, res) => {
  const { nama, deskripsi } = req.body;
  const gambar = req.file ? `/uploads/${req.file.filename}` : null;
  if (!nama) return res.status(400).json({ error: 'Nama wajib diisi' });
  db.query(
    'INSERT INTO fasilitas (nama, deskripsi, gambar) VALUES (?, ?, ?)',
    [nama, deskripsi || null, gambar],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, nama, deskripsi, gambar });
    }
  );
});

app.put('/api/fasilitas/:id', wajibAdmin, upload.single('gambar'), (req, res) => {
  const { nama, deskripsi } = req.body;
  const gambarBaru = req.file ? `/uploads/${req.file.filename}` : req.body.gambarLama || null;
  db.query(
    'UPDATE fasilitas SET nama = ?, deskripsi = ?, gambar = ? WHERE id = ?',
    [nama, deskripsi || null, gambarBaru, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Berhasil diperbarui' });
    }
  );
});

app.delete('/api/fasilitas/:id', wajibAdmin, (req, res) => {
  db.query('DELETE FROM fasilitas WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Berhasil dihapus' });
  });
});

// ===== GALERI: Tambah, Ubah, Hapus (dengan upload gambar) =====
app.post('/api/galeri', wajibAdmin, upload.single('gambar'), (req, res) => {
  const { judul } = req.body;
  const gambar = req.file ? `/uploads/${req.file.filename}` : null;
  if (!gambar) return res.status(400).json({ error: 'Gambar wajib diisi' });
  db.query(
    'INSERT INTO galeri (judul, gambar) VALUES (?, ?)',
    [judul || null, gambar],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, judul, gambar });
    }
  );
});

app.put('/api/galeri/:id', wajibAdmin, (req, res) => {
  const { judul } = req.body;
  db.query(
    'UPDATE galeri SET judul = ? WHERE id = ?',
    [judul || null, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Berhasil diperbarui' });
    }
  );
});

app.delete('/api/galeri/:id', wajibAdmin, (req, res) => {
  db.query('DELETE FROM galeri WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Berhasil dihapus' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});