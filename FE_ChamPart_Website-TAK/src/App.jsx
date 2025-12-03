import './index.css'
import Header from './component/header.jsx'
import Footer from './component/footer.jsx'
import Home from './page/user/home.jsx'
import Bookmark from './page/user/bookmark.jsx' 
import History from './page/user/history.jsx'
import { Routes, Route, useLocation } from 'react-router-dom'
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

function App() {
  const location = useLocation()
  const hideChromePaths = ['/login', '/register', '/admin/register', '/admin/instansi', '/admin/pengawas']
  const hideChrome = hideChromePaths.includes(location.pathname)
  const isCentered = location.pathname !== '/editprofile' && location.pathname !== '/editpassword' && location.pathname !== '/editemail'
  const mainClass = hideChrome ? '' : `${isCentered ? 'max-w-7xl mx-auto my-auto pt-28 pb-14 px-14' : ''} pt-24 pb-5 px-14 flex-grow`

  return (
    <>
      {!hideChrome && <Header />}
      <div className="flex flex-col min-h-screen">
        <main className={mainClass}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/history" element={<History />} />
          <Route path="/search" element={<TampilanSearch />} />
          <Route path="/kegiatan" element={<TampilanKegiatan />} />
          <Route path="/editprofile" element={<Profile />} />
          <Route path="/editpassword" element={<EditPassword />} />
          <Route path="/editemail" element={<EditEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registrasi />} />
          <Route path="/admin/register" element={<RegisterAdmin />} />
          <Route path="/admin/instansi" element={<AdminInstansi />} />
          <Route path="/admin/pengawas" element={<AdminPengawas />} />
        </Routes>
        </main>
      {!hideChrome && <Footer />}
      </div>
    </>
  )
}

export default App
