import './index.css'
import Header from './component/header.jsx'
import Footer from './component/footer.jsx'
import Home from './page/user/home.jsx'
import Bookmark from './page/user/bookmark.jsx' 
import History from './page/user/history.jsx'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import React, { useState, useEffect } from "react"
import TampilanSearch from './page/user/tampilansearch.jsx'
import TampilanKegiatan from './page/user/tampilankegiatan.jsx'
import Profile from './page/user/editprofile.jsx'
import EditPassword from './page/user/editpassword.jsx'
import EditEmail from './page/user/editemail.jsx'
import Login from './page/user/login.jsx'
import Registrasi from './page/user/registrasi.jsx'
import RegisterAdmin from './page/admin/registerAdmin.jsx'
import AdminInstansi from './page/admin/adminInstansi.jsx'
import AdminPengawas from './page/admin/adminPengawas.jsx'
import RegisterInstansi from './page/admin/registerInstansi.jsx'



const Protected = ({ children, loading, allowedRoles, role }) => {
  const token = localStorage.getItem("access_token");

  if (loading) {
    return (
      <div className="min-h-screen w-full grid place-items-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <div className="text-gray-700 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && allowedRoles.length) {
    if (!role || !allowedRoles.includes(role)) {
      const home = role === "AdminPengawas" ? "/admin/pengawas" : role === "AdminInstansi" ? "/admin/instansi" : "/";
      return <Navigate to={home} replace />;
    }
  }

  return children;
};

function App() {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(localStorage.getItem("user_role") || null);

  const publicPaths = ["/login", "/register", "/admin/register", "/instansi/register"];
  const adminPaths = ["/admin/instansi", "/admin/pengawas"];
  const isPublic = publicPaths.includes(location.pathname);
  const isAdmin = adminPaths.includes(location.pathname);

  useEffect(() => {
    const checkToken = async () => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!accessToken || !refreshToken) {
        setToken(null);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        let currentAccess = accessToken;
        const validateRes = await fetch("/token/access/validate", {
          headers: { Authorization: `Bearer ${currentAccess}` }
        });

        if (!validateRes.ok) {
          const refreshRes = await fetch("/token/access/get", {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem("access_token", data.access_token);
            currentAccess = data.access_token;
            setToken(data.access_token);
          } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            setToken(null);
            setRole(null);
            setLoading(false);
            return;
          }
        }

        let r = null;
        try {
          const payload = JSON.parse(atob((currentAccess.split(".")[1]) || ""));
          r = payload.role || (Array.isArray(payload.roles) ? payload.roles[0] : null) || payload.authority || (Array.isArray(payload.authorities) ? payload.authorities[0] : null);
        } catch {}
        if (!r) {
          try {
            const resUser = await fetch("/api/account/get", {
              headers: { Authorization: `Bearer ${currentAccess}` }
            });
            if (resUser.ok) {
              const u = await resUser.json();
              r = u.role || (Array.isArray(u.roles) ? u.roles[0] : null) || null;
            }
          } catch {}
        }
        if (!r) r = localStorage.getItem("user_role") || null;
        if (r) localStorage.setItem("user_role", r);
        setRole(r || null);
      } catch (err) {
        console.error("Error koneksi server:", err);
        setToken(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [location.pathname]); 

  if ((!isPublic && !isAdmin) && !token && !loading) {
    return <Navigate to="/login" replace />;
  }

  const hideChrome = isPublic || isAdmin;
  const isCentered = !["/editprofile", "/editpassword", "/editemail"].includes(location.pathname);

  const mainClass = hideChrome ? "" :
    `${isCentered ? "max-w-7xl mx-auto pt-28 pb-14 px-14" : ""} pt-24 pb-5 px-14 flex-grow`;

  return (
    <>
      {!hideChrome && <Header />}
      <div className="flex flex-col min-h-screen">
        <main className={mainClass}>
          <Routes>

            <Route path="/" element={<Protected loading={loading} allowedRoles={["Pengguna"]} role={role}><Home /></Protected>} />
            <Route path="/bookmark" element={<Protected loading={loading} allowedRoles={["Pengguna"]} role={role}><Bookmark /></Protected>} />
            <Route path="/history" element={<Protected loading={loading} allowedRoles={["Pengguna"]} role={role}><History /></Protected>} />
            <Route path="/search" element={<Protected loading={loading} allowedRoles={["Pengguna"]} role={role}><TampilanSearch /></Protected>} />
            <Route path="/kegiatan" element={<Protected loading={loading} allowedRoles={["Pengguna"]} role={role}><TampilanKegiatan /></Protected>} />
            <Route path="/editprofile" element={<Protected loading={loading} allowedRoles={["Pengguna"]} role={role}><Profile /></Protected>} />
            <Route path="/editpassword" element={<Protected loading={loading} allowedRoles={["Pengguna"]} role={role}><EditPassword /></Protected>} />
            <Route path="/editemail" element={<Protected loading={loading} allowedRoles={["Pengguna"]} role={role}><EditEmail /></Protected>} />
            <Route path="/admin/instansi" element={<Protected loading={loading} allowedRoles={["AdminInstansi"]} role={role}><AdminInstansi /></Protected>} />
            <Route path="/admin/pengawas" element={<Protected loading={loading} allowedRoles={["AdminPengawas"]} role={role}><AdminPengawas /></Protected>} />

            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Registrasi />} />
            <Route path="/admin/register" element={<RegisterAdmin />} />
            <Route path="/instansi/register" element={<RegisterInstansi />} />

          </Routes>
        </main>

        {!hideChrome && <Footer />}
      </div>
    </>
  );
}

export default App;
