import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PUSAT_KAWASAN, formatJarak, tautanRute } from '../geo';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Peta OpenStreetMap (Leaflet) berisi titik objek wisata dan posisi pengguna.
// - titik:   [{ id, nama, deskripsi, lat, lng, jarak? }]
// - posisi:  { lat, lng } posisi pengguna, atau null
// - pilihan: { lat, lng } titik yang sedang dipilih di form admin, atau null
// - onPilih: dipanggil dengan (lat, lng) saat peta diklik (mode admin)
function PetaLokasi({ titik = [], posisi = null, pilihan = null, onPilih, tinggi = 420 }) {
  const wadah = useRef(null);
  const peta = useRef(null);
  const lapisan = useRef(null);
  const klikRef = useRef(onPilih);
  const batasTerakhir = useRef('');

  useEffect(() => {
    klikRef.current = onPilih;
  }, [onPilih]);

  // Buat peta sekali saat komponen tampil
  useEffect(() => {
    const map = L.map(wadah.current, { scrollWheelZoom: false }).setView([PUSAT_KAWASAN.lat, PUSAT_KAWASAN.lng], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    map.on('click', (e) => klikRef.current && klikRef.current(+e.latlng.lat.toFixed(7), +e.latlng.lng.toFixed(7)));
    lapisan.current = L.layerGroup().addTo(map);
    peta.current = map;
    return () => map.remove();
  }, []);

  // Gambar ulang penanda setiap kali data berubah
  useEffect(() => {
    const map = peta.current;
    const grup = lapisan.current;
    if (!map || !grup) return;
    grup.clearLayers();
    const batas = [];

    titik.forEach((t) => {
      if (Number.isNaN(t.lat) || Number.isNaN(t.lng)) return;
      const jarak = typeof t.jarak === 'number' ? `<br><b>${formatJarak(t.jarak)}</b> dari posisi Anda` : '';
      const isi = `<strong>${esc(t.nama)}</strong>${t.deskripsi ? `<br>${esc(t.deskripsi)}` : ''}${jarak}<br><a href="${tautanRute(t, posisi)}" target="_blank" rel="noopener noreferrer">Lihat rute</a>`;
      L.circleMarker([t.lat, t.lng], { radius: 9, color: '#0B2313', weight: 2, fillColor: '#0F6E56', fillOpacity: 0.9 })
        .bindPopup(isi)
        .bindTooltip(esc(t.nama))
        .addTo(grup);
      batas.push([t.lat, t.lng]);
    });

    if (posisi) {
      L.circle([posisi.lat, posisi.lng], { radius: posisi.akurasi || 0, color: '#185FA5', weight: 1, fillOpacity: 0.08 }).addTo(grup);
      L.circleMarker([posisi.lat, posisi.lng], { radius: 8, color: '#FFFFFF', weight: 3, fillColor: '#185FA5', fillOpacity: 1 })
        .bindTooltip('Posisi Anda', { permanent: true, direction: 'top', offset: [0, -8] })
        .addTo(grup);
      batas.push([posisi.lat, posisi.lng]);
    }

    if (pilihan) {
      L.circleMarker([pilihan.lat, pilihan.lng], { radius: 10, color: '#A32D2D', weight: 3, fillColor: '#F09595', fillOpacity: 0.9 })
        .bindTooltip('Titik yang dipilih', { permanent: true, direction: 'top', offset: [0, -10] })
        .addTo(grup);
    }

    // Atur ulang tampilan hanya jika titik atau posisi pengguna berubah,
    // agar peta tidak melompat setiap kali admin mengklik untuk memilih titik
    const kunci = JSON.stringify(batas);
    if (kunci !== batasTerakhir.current) {
      batasTerakhir.current = kunci;
      if (batas.length === 1) map.setView(batas[0], 14);
      else if (batas.length > 1) map.fitBounds(batas, { padding: [40, 40], maxZoom: 15 });
    }
  }, [titik, posisi, pilihan]);

  return <div ref={wadah} style={{ height: tinggi, width: '100%' }} role="application" aria-label="Peta lokasi objek wisata" />;
}

export default PetaLokasi;
