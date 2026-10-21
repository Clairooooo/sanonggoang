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
// Akun admin disimpan di tabel `admin`, password dalam bentuk hash (scrypt), bukan teks asli.
// ADMIN_USERNAME dan ADMIN_PASSWORD di .env hanya dipakai untuk membuat akun admin pertama
// saat tabel admin masih kosong. Setelah itu, username/password diganti lewat menu Pengaturan.
const { ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_TOKEN_SECRET } = process.env;
if (!ADMIN_TOKEN_SECRET) {
  console.error('ADMIN_TOKEN_SECRET wajib diisi di .env');
  process.exit(1);
}
const TOKEN_UMUR_MS = 8 * 60 * 60 * 1000; // token berlaku 8 jam
const PASSWORD_MIN = 8;

// Bandingkan dua teks tanpa membocorkan informasi lewat lama waktu pengecekan
function samaAman(a, b) {
  const hashA = crypto.createHash('sha256').update(String(a)).digest();
  const hashB = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

// Format hash yang disimpan: scrypt$<salt>$<hash>
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

function cocokPassword(password, tersimpan) {
  const [jenis, salt, hash] = String(tersimpan).split('$');
  if (jenis !== 'scrypt' || !salt || !hash) return false;
  const hitung = crypto.scryptSync(String(password), salt, 64);
  const asli = Buffer.from(hash, 'hex');
  return asli.length === hitung.length && crypto.timingSafeEqual(asli, hitung);
}

// Dipakai saat username tidak ditemukan, agar lama pengecekan tetap sama
const HASH_PALSU = hashPassword(crypto.randomBytes(16).toString('hex'));

// Sidik jari password ikut disimpan di token, sehingga semua token lama
// otomatis tidak berlaku lagi setelah password diganti
function sidikPassword(hashTersimpan) {
  return crypto.createHash('sha256').update(hashTersimpan).digest('base64url').slice(0, 16);
}

function tandaTangan(data) {
  return crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(data).digest('base64url');
}

function buatToken(admin) {
  const isi = { id: admin.id, v: sidikPassword(admin.password), exp: Date.now() + TOKEN_UMUR_MS };
  const payload = Buffer.from(JSON.stringify(isi)).toString('base64url');
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
  const data = cekToken(token);
  if (!data) {
    return res.status(401).json({ error: 'Silakan login sebagai admin' });
  }
  db.query('SELECT id, username, password, created_at FROM admin WHERE id = ?', [data.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Gagal memeriksa akun admin' });
    const admin = rows[0];
    if (!admin || data.v !== sidikPassword(admin.password)) {
      return res.status(401).json({ error: 'Sesi berakhir, silakan login ulang' });
    }
    req.admin = admin;
    next();
  });
}

// Membuat akun admin pertama dari .env jika tabel admin masih kosong
function siapkanAkunAdmin() {
  db.query('SELECT COUNT(*) AS jumlah FROM admin', (err, rows) => {
    if (err) return console.error('Gagal memeriksa tabel admin:', err.message);
    if (rows[0].jumlah > 0) return;
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      console.error('Tabel admin kosong. Isi ADMIN_USERNAME dan ADMIN_PASSWORD di .env, lalu jalankan ulang server.');
      return;
    }
    db.query(
      'INSERT INTO admin (username, password) VALUES (?, ?)',
      [ADMIN_USERNAME, hashPassword(ADMIN_PASSWORD)],
      (err2) => {
        if (err2) return console.error('Gagal membuat akun admin pertama:', err2.message);
        console.log(`Akun admin pertama "${ADMIN_USERNAME}" dibuat dari .env`);
      }
    );
  });
}

// Batasi percobaan login: maksimal 5 kali gagal per 15 menit per alamat IP
const percobaanLogin = new Map();
const BATAS_GAGAL = 5;
const JEDA_MS = 15 * 60 * 1000;

function sedangDikunci(ip) {
  const catatan = percobaanLogin.get(ip);
  return catatan && catatan.gagal >= BATAS_GAGAL && Date.now() - catatan.waktu < JEDA_MS;
}

function catatGagal(ip) {
  const catatan = percobaanLogin.get(ip);
  const gagal = catatan && Date.now() - catatan.waktu < JEDA_MS ? catatan.gagal + 1 : 1;
  percobaanLogin.set(ip, { gagal, waktu: Date.now() });
}

app.post('/api/login', (req, res) => {
  const ip = req.ip;
  if (sedangDikunci(ip)) {
    return res.status(429).json({ error: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' });
  }

  const { username, password } = req.body || {};
  db.query('SELECT id, username, password FROM admin WHERE username = ?', [String(username || '')], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Gagal memeriksa akun admin' });
    const admin = rows[0];
    const passwordBenar = cocokPassword(password || '', admin ? admin.password : HASH_PALSU);
    if (!admin || !passwordBenar) {
      catatGagal(ip);
      return res.status(401).json({ error: 'Username atau password salah.' });
    }
    percobaanLogin.delete(ip);
    res.json({ token: buatToken(admin) });
  });
});

// Dipakai frontend untuk memastikan token masih berlaku
app.get('/api/me', wajibAdmin, (req, res) => {
  res.json({ ok: true });
});

// ===== PENGATURAN AKUN ADMIN =====
app.get('/api/admin/akun', wajibAdmin, (req, res) => {
  res.json({ username: req.admin.username, created_at: req.admin.created_at });
});

// Ubah username dan/atau password. Wajib menyertakan password saat ini.
app.put('/api/admin/akun', wajibAdmin, (req, res) => {
  const ip = req.ip;
  if (sedangDikunci(ip)) {
    return res.status(429).json({ error: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' });
  }

  const { passwordLama, usernameBaru, passwordBaru } = req.body || {};
  if (!cocokPassword(passwordLama || '', req.admin.password)) {
    catatGagal(ip);
    return res.status(400).json({ error: 'Password saat ini salah.' });
  }

  const username = usernameBaru === undefined ? req.admin.username : String(usernameBaru).trim();
  if (!/^[A-Za-z0-9_.-]{3,50}$/.test(username)) {
    return res.status(400).json({ error: 'Username 3–50 karakter, hanya huruf, angka, titik, garis bawah, atau tanda minus.' });
  }
  if (passwordBaru !== undefined && (String(passwordBaru).length < PASSWORD_MIN || String(passwordBaru).length > 100)) {
    return res.status(400).json({ error: `Password baru minimal ${PASSWORD_MIN} karakter.` });
  }

  const hashBaru = passwordBaru === undefined ? req.admin.password : hashPassword(passwordBaru);
  db.query('UPDATE admin SET username = ?, password = ? WHERE id = ?', [username, hashBaru, req.admin.id], (err) => {
    if (err && err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Username sudah dipakai.' });
    if (err) return res.status(500).json({ error: 'Gagal menyimpan pengaturan akun' });
    percobaanLogin.delete(ip);
    // Token baru untuk sesi ini; token lama di perangkat lain tidak berlaku jika password diganti
    res.json({ username, token: buatToken({ id: req.admin.id, password: hashBaru }) });
  });
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
  siapkanAkunAdmin();
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

// ===== LOKASI: titik koordinat objek wisata untuk peta (geolokasi) =====
// Memeriksa input lokasi; mengembalikan pesan kesalahan atau null jika valid
function periksaLokasi(body) {
  const { nama, latitude, longitude } = body || {};
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (!nama || !String(nama).trim()) return 'Nama lokasi wajib diisi';
  if (latitude === '' || latitude === undefined || Number.isNaN(lat) || lat < -90 || lat > 90) {
    return 'Latitude harus berupa angka antara -90 dan 90';
  }
  if (longitude === '' || longitude === undefined || Number.isNaN(lng) || lng < -180 || lng > 180) {
    return 'Longitude harus berupa angka antara -180 dan 180';
  }
  return null;
}

app.get('/api/lokasi', (req, res) => {
  db.query('SELECT id, nama, latitude, longitude, deskripsi FROM lokasi ORDER BY nama', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/lokasi', wajibAdmin, (req, res) => {
  const salah = periksaLokasi(req.body);
  if (salah) return res.status(400).json({ error: salah });
  const { nama, latitude, longitude, deskripsi } = req.body;
  db.query(
    'INSERT INTO lokasi (nama, latitude, longitude, deskripsi) VALUES (?, ?, ?, ?)',
    [String(nama).trim(), Number(latitude), Number(longitude), deskripsi || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId });
    }
  );
});

app.put('/api/lokasi/:id', wajibAdmin, (req, res) => {
  const salah = periksaLokasi(req.body);
  if (salah) return res.status(400).json({ error: salah });
  const { nama, latitude, longitude, deskripsi } = req.body;
  db.query(
    'UPDATE lokasi SET nama = ?, latitude = ?, longitude = ?, deskripsi = ? WHERE id = ?',
    [String(nama).trim(), Number(latitude), Number(longitude), deskripsi || null, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Berhasil diperbarui' });
    }
  );
});

app.delete('/api/lokasi/:id', wajibAdmin, (req, res) => {
  db.query('DELETE FROM lokasi WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Berhasil dihapus' });
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