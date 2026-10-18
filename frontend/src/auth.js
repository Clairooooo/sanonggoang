// Penyimpanan token login admin. Token dibuat dan diperiksa oleh backend.
const TOKEN_KEY = 'adminToken';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// alasan dikirim ke halaman login agar bisa ditampilkan pesan yang sesuai:
// 'keluar' = admin menekan tombol Keluar, 'sesi' = token habis atau tidak berlaku
export function logout(alasan = 'keluar') {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = alasan === 'sesi' ? '/login?sesi=habis' : '/login?keluar=1';
}

// fetch yang otomatis mengirim token admin.
// Kalau token sudah tidak berlaku (401), admin diarahkan kembali ke halaman login.
export function authFetch(url, options = {}) {
  const headers = { ...(options.headers || {}), Authorization: `Bearer ${getToken()}` };
  return fetch(url, { ...options, headers }).then((res) => {
    if (res.status === 401) {
      logout('sesi');
      throw new Error('Sesi login habis');
    }
    return res;
  });
}
