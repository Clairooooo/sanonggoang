import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Beranda from './pages/Beranda';
import Profil from './pages/Profil';
import DayaTarik from './pages/DayaTarik';
import Fasilitas from './pages/Fasilitas';
import Galeri from './pages/Galeri';
import Lokasi from './pages/Lokasi';
import Kontak from './pages/Kontak';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { getToken } from './auth';

// Hanya mengecek token ada; keabsahannya diperiksa backend di setiap request
function RequireAuth({ children }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function Layout() {
  const location = useLocation();
  const isBeranda = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}

      <div style={{ paddingTop: isBeranda || isAdmin ? 0 : 72 }}>
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/daya-tarik" element={<DayaTarik />} />
          <Route path="/fasilitas" element={<Fasilitas />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/lokasi" element={<Lokasi />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <Admin />
              </RequireAuth>
            }
          />
        </Routes>
      </div>

      {/* Footer tidak tampil di Beranda (hero full-screen) dan Admin */}
      {!isAdmin && !isBeranda && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;