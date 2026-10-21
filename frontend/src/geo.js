// Fungsi bantu geolokasi: jarak antar koordinat, format jarak, dan tautan rute.

// Perkiraan pusat kawasan Danau Sano Nggoang (Gunung Waesano), dipakai sebagai
// tampilan awal peta sebelum ada titik lokasi atau posisi pengguna.
export const PUSAT_KAWASAN = { lat: -8.72, lng: 120.02 };

// Jarak garis lurus antara dua koordinat di permukaan bumi (rumus Haversine), dalam kilometer
export function jarakKm(a, b) {
  const R = 6371; // jari-jari bumi (km)
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatJarak(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toLocaleString('id-ID', { maximumFractionDigits: km < 10 ? 1 : 0 })} km`;
}

// Tautan rute Google Maps ke sebuah titik; dari posisi pengguna jika diketahui
export function tautanRute(tujuan, asal) {
  const params = new URLSearchParams({ api: '1', destination: `${tujuan.lat},${tujuan.lng}` });
  if (asal) params.set('origin', `${asal.lat},${asal.lng}`);
  return `https://www.google.com/maps/dir/?${params}`;
}

// Ubah baris tabel lokasi (latitude/longitude bertipe DECIMAL, dikirim sebagai teks) menjadi angka
export function keTitik(baris) {
  return { ...baris, lat: Number(baris.latitude), lng: Number(baris.longitude) };
}
