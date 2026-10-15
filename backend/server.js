const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

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
app.get('/api/pesan', (req, res) => {
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
app.put('/api/pesan/:id/baca', (req, res) => {
  db.query('UPDATE pesan SET dibaca = 1 WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Ditandai sudah dibaca' });
  });
});

// DELETE pesan
app.delete('/api/pesan/:id', (req, res) => {
  db.query('DELETE FROM pesan WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Berhasil dihapus' });
  });
});

// ===== DAYA TARIK: Tambah, Ubah, Hapus (dengan upload gambar) =====
app.post('/api/daya-tarik', upload.single('gambar'), (req, res) => {
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

app.put('/api/daya-tarik/:id', upload.single('gambar'), (req, res) => {
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

app.delete('/api/daya-tarik/:id', (req, res) => {
  db.query('DELETE FROM daya_tarik WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Berhasil dihapus' });
  });
});

// ===== FASILITAS: Tambah, Ubah, Hapus (dengan upload gambar) =====
app.post('/api/fasilitas', upload.single('gambar'), (req, res) => {
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

app.put('/api/fasilitas/:id', upload.single('gambar'), (req, res) => {
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

app.delete('/api/fasilitas/:id', (req, res) => {
  db.query('DELETE FROM fasilitas WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Berhasil dihapus' });
  });
});

// ===== GALERI: Tambah, Ubah, Hapus (dengan upload gambar) =====
app.post('/api/galeri', upload.single('gambar'), (req, res) => {
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

app.put('/api/galeri/:id', (req, res) => {
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

app.delete('/api/galeri/:id', (req, res) => {
  db.query('DELETE FROM galeri WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Berhasil dihapus' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});