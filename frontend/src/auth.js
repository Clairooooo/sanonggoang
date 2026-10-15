// Penyimpanan token login admin. Token dibuat dan diperiksa oleh backend.
const TOKEN_KEY = 'adminToken';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = '/login';
}

// fetch yang otomatis mengirim token admin.
// Kalau token sudah tidak berlaku (401), admin diarahkan kembali ke halaman login.
export function authFetch(url, options = {}) {
  const headers = { ...(options.headers || {}), Authorization: `Bearer ${getToken()}` };
  return fetch(url, { ...options, headers }).then((res) => {
    if (res.status === 401) {
      logout();
      throw new Error('Sesi login habis');
    }
    return res;
  });
}
