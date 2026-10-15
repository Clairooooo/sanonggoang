import { useEffect, useState } from 'react';

const baseUrl = 'http://localhost:5000';
const PAGE_SIZE = 6;

/* ===================== HOOK DATA GENERIK ===================== */
function useResource(endpoint) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = `${baseUrl}/api/${endpoint}`;

  const loadData = () => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Gagal ambil data ${endpoint}:`, err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, loading, loadData, url };
}

/* ===================== IKON KECIL ===================== */
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 01-3.4 0" />
  </svg>
);

/* ===================== TOPBAR ===================== */
function Topbar({ title, subtitle, search, onSearch, unread, onOpenPesan, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar__title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="topbar__right">
        <label className="search-box">
          <IconSearch />
          <input
            type="text"
            placeholder="Cari data..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </label>

        <button className="round-btn" onClick={onOpenPesan} title="Pesan masuk" aria-label="Pesan masuk">
          <IconBell />
          {unread > 0 && <span className="round-btn__badge">{unread > 9 ? '9+' : unread}</span>}
        </button>

        <div className="profile">
          <button className="profile__btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu admin">
            <span className="profile__avatar">A</span>
            <span className="profile__name">Admin</span>
            <span className="profile__caret">▾</span>
          </button>
          {menuOpen && (
            <div className="profile__menu">
              <button onClick={onLogout}>Keluar</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ===================== TAB & PAGINATION ===================== */
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={`tab ${active === t.key ? 'is-active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
          {typeof t.count === 'number' && <span className="tab__count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

function Pagination({ page, pageSize, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="pagination">
      <span>
        Menampilkan {from}–{to} dari {total}
      </span>
      <div className="pagination__nav">
        <button disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Sebelumnya">‹</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={n === page ? 'is-active' : ''}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
        <button disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Berikutnya">›</button>
      </div>
    </div>
  );
}

/* ===================== DASHBOARD RINGKASAN ===================== */
function DashboardHome({ counts }) {
  const cards = [
    { label: 'Daya Tarik', value: counts.dayaTarik, color: '#0F6E56' },
    { label: 'Fasilitas', value: counts.fasilitas, color: '#185FA5' },
    { label: 'Foto Galeri', value: counts.galeri, color: '#B85C1E' },
    { label: 'Pesan Masuk', value: counts.pesan, color: '#0B2313' },
  ];
  return (
    <div className="dash-grid">
      {cards.map((c) => (
        <div key={c.label} className="dash-card">
          <span className="dash-card__dot" style={{ background: c.color }} />
          <strong>{c.value}</strong>
          <span>{c.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ===================== DATA MANAGER (Daya Tarik / Fasilitas) ===================== */
const initialForm = { nama: '', deskripsi: '' };

function DataManager({ res, search }) {
  const { items, loading, loadData, url } = res;
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingGambarLama, setEditingGambarLama] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState('semua');
  const [page, setPage] = useState(1);

  const resetForm = () => {
    setForm(initialForm);
    setFile(null);
    setEditingId(null);
    setEditingGambarLama(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama.trim()) {
      alert('Nama wajib diisi');
      return;
    }
    const method = editingId ? 'PUT' : 'POST';
    const targetUrl = editingId ? `${url}/${editingId}` : url;

    const formData = new FormData();
    formData.append('nama', form.nama);
    formData.append('deskripsi', form.deskripsi);
    if (file) formData.append('gambar', file);
    if (editingId && editingGambarLama) formData.append('gambarLama', editingGambarLama);

    fetch(targetUrl, { method, body: formData })
      .then((r) => r.json())
      .then(() => {
        resetForm();
        loadData();
      })
      .catch((err) => console.error('Gagal simpan data:', err));
  };

  const handleEdit = (item) => {
    setForm({ nama: item.nama, deskripsi: item.deskripsi || '' });
    setEditingId(item.id);
    setEditingGambarLama(item.gambar || null);
    setFile(null);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    fetch(`${url}/${id}`, { method: 'DELETE' })
      .then(() => loadData())
      .catch((err) => console.error('Gagal hapus data:', err));
  };

  const bySearch = items.filter((i) => i.nama.toLowerCase().includes(search.toLowerCase()));
  const tabs = [
    { key: 'semua', label: 'Semua', count: bySearch.length },
    { key: 'foto', label: 'Dengan foto', count: bySearch.filter((i) => i.gambar).length },
    { key: 'tanpa', label: 'Tanpa foto', count: bySearch.filter((i) => !i.gambar).length },
  ];
  const filtered = bySearch.filter((i) => {
    if (tab === 'foto') return !!i.gambar;
    if (tab === 'tanpa') return !i.gambar;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <div className="toolbar">
        <Tabs tabs={tabs} active={tab} onChange={(k) => { setTab(k); setPage(1); }} />
        <button
          className="btn-primary"
          onClick={() => { resetForm(); setShowForm(true); }}
        >
          + Tambah
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel-form">
          <div className="panel-form__row">
            <input
              type="text"
              placeholder="Nama"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
            />
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <textarea
            placeholder="Deskripsi"
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          />
          {editingId && editingGambarLama && !file && (
            <img src={`${baseUrl}${editingGambarLama}`} alt="" className="panel-form__preview" />
          )}
          <div className="panel-form__actions">
            <button type="submit" className="btn-primary">{editingId ? 'Simpan perubahan' : 'Tambah'}</button>
            <button type="button" onClick={resetForm} className="btn-ghost">Batal</button>
          </div>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nama</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr className="row-empty"><td colSpan={4}>Memuat data...</td></tr>
          )}
          {!loading && filtered.length === 0 && (
            <tr className="row-empty"><td colSpan={4}>Belum ada data.</td></tr>
          )}
          {pageItems.map((item) => (
            <tr key={item.id}>
              <td>
                {item.gambar ? (
                  <img src={`${baseUrl}${item.gambar}`} alt="" className="row-thumb" />
                ) : (
                  <div className="row-thumb row-thumb--empty" />
                )}
              </td>
              <td className="cell-strong">{item.nama}</td>
              <td className="cell-muted cell-wrap">{item.deskripsi}</td>
              <td>
                <div className="row-actions">
                  <button onClick={() => handleEdit(item)} className="icon-btn" title="Edit">✎</button>
                  <button onClick={() => handleDelete(item.id)} className="icon-btn icon-btn--danger" title="Hapus">✕</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination page={currentPage} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} />
    </div>
  );
}

/* ===================== GALERI MANAGER ===================== */
function GaleriManager({ res, search }) {
  const { items, loading, loadData, url } = res;
  const [judul, setJudul] = useState('');
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Pilih gambar terlebih dahulu');
      return;
    }
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('gambar', file);

    fetch(url, { method: 'POST', body: formData })
      .then((r) => r.json())
      .then(() => {
        setJudul('');
        setFile(null);
        setShowForm(false);
        loadData();
      })
      .catch((err) => console.error('Gagal upload galeri:', err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Yakin ingin menghapus foto ini?')) return;
    fetch(`${url}/${id}`, { method: 'DELETE' })
      .then(() => loadData())
      .catch((err) => console.error('Gagal hapus foto:', err));
  };

  const filtered = items.filter((i) => (i.judul || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="toolbar">
        <Tabs tabs={[{ key: 'semua', label: 'Semua foto', count: filtered.length }]} active="semua" onChange={() => {}} />
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>+ Tambah foto</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel-form">
          <div className="panel-form__row">
            <input
              type="text"
              placeholder="Judul foto (opsional)"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <div className="panel-form__actions">
            <button type="submit" className="btn-primary">Tambah</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Batal</button>
          </div>
        </form>
      )}

      {loading && <p className="empty-note">Memuat data...</p>}
      {!loading && filtered.length === 0 && <p className="empty-note">Belum ada foto di galeri.</p>}

      <div className="gallery-grid">
        {filtered.map((item) => (
          <div key={item.id} className="gallery-card">
            <img src={`${baseUrl}${item.gambar}`} alt={item.judul || 'Galeri'} />
            <div className="gallery-card__footer">
              <span>{item.judul || '(tanpa judul)'}</span>
              <button onClick={() => handleDelete(item.id)} className="icon-btn icon-btn--danger" title="Hapus">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== PESAN MANAGER ===================== */
function PesanManager({ res, search }) {
  const { items, loading, loadData, url } = res;
  const [tab, setTab] = useState('semua');
  const [page, setPage] = useState(1);

  const handleTandaiDibaca = (id) => {
    fetch(`${url}/${id}/baca`, { method: 'PUT' })
      .then(() => loadData())
      .catch((err) => console.error('Gagal menandai pesan:', err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Yakin ingin menghapus pesan ini?')) return;
    fetch(`${url}/${id}`, { method: 'DELETE' })
      .then(() => loadData())
      .catch((err) => console.error('Gagal hapus pesan:', err));
  };

  const q = search.toLowerCase();
  const bySearch = items.filter(
    (i) =>
      (i.nama || '').toLowerCase().includes(q) ||
      (i.email || '').toLowerCase().includes(q) ||
      (i.isi_pesan || '').toLowerCase().includes(q)
  );
  const tabs = [
    { key: 'semua', label: 'Semua', count: bySearch.length },
    { key: 'baru', label: 'Baru', count: bySearch.filter((i) => !i.dibaca).length },
    { key: 'dibaca', label: 'Dibaca', count: bySearch.filter((i) => i.dibaca).length },
  ];
  const filtered = bySearch.filter((i) => {
    if (tab === 'baru') return !i.dibaca;
    if (tab === 'dibaca') return !!i.dibaca;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <div className="toolbar">
        <Tabs tabs={tabs} active={tab} onChange={(k) => { setTab(k); setPage(1); }} />
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Pengirim</th>
            <th>Pesan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading && <tr className="row-empty"><td colSpan={4}>Memuat data...</td></tr>}
          {!loading && filtered.length === 0 && (
            <tr className="row-empty"><td colSpan={4}>Belum ada pesan masuk.</td></tr>
          )}
          {pageItems.map((item) => (
            <tr key={item.id} className={!item.dibaca ? 'row-unread' : ''}>
              <td>
                <div className="cell-strong">{item.nama}</div>
                <div className="cell-muted">{item.email}{item.telepon ? ` · ${item.telepon}` : ''}</div>
              </td>
              <td className="cell-muted cell-wrap">{item.isi_pesan}</td>
              <td>
                <span className={`status-badge ${item.dibaca ? 'status-badge--done' : 'status-badge--new'}`}>
                  {item.dibaca ? 'Dibaca' : 'Baru'}
                </span>
              </td>
              <td>
                <div className="row-actions">
                  {!item.dibaca && (
                    <button onClick={() => handleTandaiDibaca(item.id)} className="icon-btn" title="Tandai dibaca">✓</button>
                  )}
                  <button onClick={() => handleDelete(item.id)} className="icon-btn icon-btn--danger" title="Hapus">✕</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination page={currentPage} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} />
    </div>
  );
}

/* ===================== SHELL: SIDEBAR + TOPBAR ===================== */
const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '▦' },
  { key: 'daya-tarik', label: 'Daya Tarik', icon: '◐' },
  { key: 'fasilitas', label: 'Fasilitas', icon: '✚' },
  { key: 'galeri', label: 'Galeri', icon: '▣' },
  { key: 'pesan', label: 'Pesan', icon: '✉' },
];

function Admin() {
  const [active, setActive] = useState('dashboard');
  const [search, setSearch] = useState('');

  const dayaTarikRes = useResource('daya-tarik');
  const fasilitasRes = useResource('fasilitas');
  const galeriRes = useResource('galeri');
  const pesanRes = useResource('pesan');

  const counts = {
    dayaTarik: dayaTarikRes.items.length,
    fasilitas: fasilitasRes.items.length,
    galeri: galeriRes.items.length,
    pesan: pesanRes.items.length,
  };
  const unread = pesanRes.items.filter((i) => !i.dibaca).length;

  const meta = {
    dashboard: { title: 'Dashboard', subtitle: 'Ringkasan data website Danau Sano Nggoang' },
    'daya-tarik': { title: 'Daya Tarik', subtitle: `${counts.dayaTarik} data ditemukan` },
    fasilitas: { title: 'Fasilitas', subtitle: `${counts.fasilitas} data ditemukan` },
    galeri: { title: 'Galeri', subtitle: `${counts.galeri} foto tersimpan` },
    pesan: { title: 'Pesan Masuk', subtitle: `${counts.pesan} pesan, ${unread} belum dibaca` },
  }[active];

  const goTo = (key) => {
    setActive(key);
    setSearch('');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = '/login';
  };

  return (
    <div className="admin-shell">
      {/* ===== SIDEBAR ===== */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">Sano Nggoang</div>
        <nav className="admin-sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`admin-sidebar__item ${active === item.key ? 'is-active' : ''}`}
              onClick={() => goTo(item.key)}
            >
              <span className="admin-sidebar__icon">{item.icon}</span>
              {item.label}
              {item.key === 'pesan' && unread > 0 && (
                <span className="admin-sidebar__pill">{unread}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* ===== KONTEN ===== */}
      <main className="admin-content">
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          search={search}
          onSearch={setSearch}
          unread={unread}
          onOpenPesan={() => goTo('pesan')}
          onLogout={handleLogout}
        />

        {active === 'dashboard' && <DashboardHome counts={counts} />}
        {active === 'daya-tarik' && <DataManager key="daya-tarik" res={dayaTarikRes} search={search} />}
        {active === 'fasilitas' && <DataManager key="fasilitas" res={fasilitasRes} search={search} />}
        {active === 'galeri' && <GaleriManager res={galeriRes} search={search} />}
        {active === 'pesan' && <PesanManager res={pesanRes} search={search} />}
      </main>

      <style>{`
        * { box-sizing: border-box; }
        .admin-shell {
          display: flex;
          min-height: 100vh;
          font-family: sans-serif;
          background: #F3F2EC;
        }

        /* ---------- SIDEBAR ---------- */
        .admin-sidebar {
          width: 230px;
          min-width: 230px;
          background: #0B2313;
          display: flex;
          flex-direction: column;
          padding: 28px 0 28px 16px;
        }
        .admin-sidebar__brand {
          color: #EAF3DE;
          font-family: Georgia, serif;
          font-size: 19px;
          font-weight: 700;
          margin-bottom: 36px;
          padding: 0 8px;
        }
        .admin-sidebar__nav { display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .admin-sidebar__item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          color: #C9DCC9;
          font-size: 14px;
          padding: 13px 16px;
          border-radius: 999px 0 0 999px;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
        }
        .admin-sidebar__item:hover { background: rgba(255,255,255,0.07); }
        /* item aktif menyatu dengan area konten, seperti referensi */
        .admin-sidebar__item.is-active {
          background: #F3F2EC;
          color: #0B2313;
          font-weight: 700;
        }
        .admin-sidebar__icon { font-size: 15px; width: 18px; text-align: center; }
        .admin-sidebar__pill {
          margin-left: auto;
          margin-right: 14px;
          background: #C8E06A;
          color: #0B2313;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
        }

        /* ---------- KONTEN & TOPBAR ---------- */
        .admin-content { flex: 1; min-width: 0; padding: 30px 40px; }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }
        .topbar__title h1 {
          color: #04342C;
          font-size: 26px;
          margin: 0 0 4px;
          font-family: Georgia, serif;
          font-weight: normal;
        }
        .topbar__title p { color: #8B8A80; font-size: 13px; margin: 0; }
        .topbar__right { display: flex; align-items: center; gap: 12px; }

        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1px solid #E4E2D6;
          border-radius: 999px;
          padding: 0 14px;
          height: 40px;
          color: #8B8A80;
        }
        .search-box input {
          border: none;
          outline: none;
          background: none;
          font-size: 13px;
          width: 160px;
          color: #04342C;
        }
        .search-box:focus-within { border-color: #0F6E56; }

        .round-btn {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #E4E2D6;
          background: #fff;
          color: #04342C;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .round-btn__badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          background: #D64545;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile { position: relative; }
        .profile__btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1px solid #E4E2D6;
          border-radius: 999px;
          padding: 4px 12px 4px 4px;
          height: 40px;
          cursor: pointer;
          color: #04342C;
          font-size: 13px;
        }
        .profile__avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #0B2313;
          color: #C8E06A;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .profile__caret { font-size: 11px; color: #8B8A80; }
        .profile__menu {
          position: absolute;
          right: 0;
          top: 48px;
          min-width: 140px;
          background: #fff;
          border: 1px solid #E4E2D6;
          border-radius: 12px;
          padding: 6px;
          box-shadow: 0 10px 30px rgba(11, 35, 19, 0.12);
          z-index: 20;
        }
        .profile__menu button {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13px;
          color: #B02A2A;
          cursor: pointer;
        }
        .profile__menu button:hover { background: #FBEDED; }

        /* ---------- TAB + TOOLBAR ---------- */
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 14px;
        }
        .tabs { display: flex; gap: 24px; }
        .tab {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 8px 0;
          font-size: 14px;
          color: #A5A498;
          cursor: pointer;
        }
        .tab:hover { color: #04342C; }
        .tab.is-active { color: #04342C; font-weight: 600; border-bottom-color: #04342C; }
        .tab__count {
          margin-left: 6px;
          font-size: 11px;
          background: #E9E7DA;
          color: #5F5E5A;
          padding: 2px 7px;
          border-radius: 999px;
        }

        .btn-primary {
          background: #0B2313;
          color: #EAF3DE;
          border: none;
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .btn-primary:hover { background: #12361F; }
        .btn-ghost {
          background: #fff;
          color: #5F5E5A;
          border: 1px solid #DEDCCF;
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 13px;
          cursor: pointer;
        }

        /* ---------- FORM PANEL ---------- */
        .panel-form {
          background: #fff;
          border: 1px solid #E4E2D6;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .panel-form__row { display: flex; gap: 12px; flex-wrap: wrap; }
        .panel-form input[type="text"] {
          flex: 1;
          min-width: 180px;
          padding: 10px 12px;
          border: 1px solid #DEDCCF;
          border-radius: 8px;
          font-size: 13.5px;
        }
        .panel-form input[type="file"] { font-size: 12.5px; }
        .panel-form textarea {
          padding: 10px 12px;
          border: 1px solid #DEDCCF;
          border-radius: 8px;
          font-size: 13.5px;
          min-height: 70px;
          resize: vertical;
        }
        .panel-form__preview { width: 100px; height: 70px; object-fit: cover; border-radius: 6px; }
        .panel-form__actions { display: flex; gap: 10px; }

        /* ---------- TABEL: setiap baris jadi kartu terpisah ---------- */
        .data-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 10px;
        }
        .data-table th {
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #8B8A80;
          padding: 4px 18px;
        }
        .data-table td {
          background: #fff;
          padding: 12px 18px;
          vertical-align: middle;
          font-size: 13.5px;
          border-top: 1px solid #E4E2D6;
          border-bottom: 1px solid #E4E2D6;
        }
        .data-table td:first-child { border-left: 1px solid #E4E2D6; border-radius: 12px 0 0 12px; }
        .data-table td:last-child { border-right: 1px solid #E4E2D6; border-radius: 0 12px 12px 0; }
        .data-table tbody tr { transition: transform 0.15s, box-shadow 0.15s; }
        .data-table tbody tr:hover { transform: translateY(-1px); }
        .data-table tbody tr:hover td { background: #FBFBF7; }
        .data-table .row-unread td { background: #F3F9E4; border-color: #DDEBB0; }
        .data-table .row-empty td {
          text-align: center;
          color: #999;
          padding: 36px 0;
        }

        .row-thumb { width: 52px; height: 38px; object-fit: cover; border-radius: 8px; display: block; }
        .row-thumb--empty { background: #EEEBDD; }

        .cell-strong { color: #04342C; font-weight: 600; }
        .cell-muted { color: #8B8A80; font-size: 12.5px; }
        .cell-wrap { max-width: 340px; }

        .row-actions { display: flex; gap: 6px; }
        .icon-btn {
          width: 30px; height: 30px;
          border-radius: 8px;
          border: 1px solid #DEDCCF;
          background: #fff;
          cursor: pointer;
          font-size: 13px;
          color: #04342C;
        }
        .icon-btn:hover { background: #F3F2EC; }
        .icon-btn--danger { color: #B02A2A; border-color: #EFC9C9; }
        .icon-btn--danger:hover { background: #FBEDED; }

        .status-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 11px;
          border-radius: 999px;
          display: inline-block;
        }
        .status-badge--new { background: #FDF0D5; color: #B5790A; }
        .status-badge--done { background: #E4F3EC; color: #0F6E56; }

        .empty-note { text-align: center; color: #999; padding: 32px 0; }

        /* ---------- PAGINATION ---------- */
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 6px;
          font-size: 12.5px;
          color: #8B8A80;
        }
        .pagination__nav { display: flex; gap: 4px; align-items: center; }
        .pagination__nav button {
          min-width: 30px;
          height: 30px;
          border: none;
          background: none;
          border-radius: 8px;
          color: #8B8A80;
          font-size: 13px;
          cursor: pointer;
        }
        .pagination__nav button:hover:not(:disabled) { background: #E9E7DA; }
        .pagination__nav button.is-active { background: #0B2313; color: #EAF3DE; font-weight: 700; }
        .pagination__nav button:disabled { opacity: 0.35; cursor: default; }

        /* ---------- DASHBOARD CARDS ---------- */
        .dash-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .dash-card {
          background: #fff;
          border: 1px solid #E4E2D6;
          border-radius: 14px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
        }
        .dash-card__dot { width: 10px; height: 10px; border-radius: 50%; position: absolute; top: 20px; right: 20px; }
        .dash-card strong { font-size: 28px; color: #04342C; font-family: Georgia, serif; }
        .dash-card span:last-child { color: #8B8A80; font-size: 12.5px; }

        /* ---------- GALERI GRID ---------- */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 14px;
        }
        .gallery-card {
          background: #fff;
          border: 1px solid #E4E2D6;
          border-radius: 14px;
          overflow: hidden;
        }
        .gallery-card img { width: 100%; height: 110px; object-fit: cover; display: block; }
        .gallery-card__footer {
          padding: 8px 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        .gallery-card__footer span {
          font-size: 12px; color: #04342C;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        /* ---------- RESPONSIF ---------- */
        @media (max-width: 900px) {
          .admin-shell { flex-direction: column; }
          .admin-sidebar { width: 100%; min-width: 0; flex-direction: row; align-items: center; padding: 12px 16px; overflow-x: auto; }
          .admin-sidebar__brand { margin: 0 16px 0 0; white-space: nowrap; }
          .admin-sidebar__nav { flex-direction: row; }
          .admin-sidebar__item { border-radius: 999px; white-space: nowrap; }
          .admin-sidebar__item.is-active { background: #C8E06A; }
          .admin-content { padding: 20px; }
          .dash-grid { grid-template-columns: repeat(2, 1fr); }
          .search-box input { width: 110px; }
          .profile__name { display: none; }
          .data-table { display: block; overflow-x: auto; }
        }
      `}</style>
    </div>
  );
}

export default Admin;