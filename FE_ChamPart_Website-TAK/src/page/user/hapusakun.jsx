import { useState, useEffect} from "react"
import Back from '../../assets/svg/back-button.svg' 
import { useNavigate } from "react-router-dom"
function HapusAkun() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [deleting, setDeleting] = useState(false)
  const token = localStorage.getItem("access_token")
  const navigate = useNavigate()
  
  useEffect(() => {
    const getData = async () => {
      const res = await fetch("/api/account/get", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setEmail(data.email)  
    }
    if(token) getData()
  }, [token])

  const handleHapusAkun = async () => {
    try {
      if (!password || !password.trim()) return alert("Password wajib diisi")
      setDeleting(true)
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      })
      const data = await res.json()
      if (!res.ok) return alert("Gagal menghapus akun: " + (data.message || ""))
      alert("Penghapusan Akun Berhasil")
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      navigate("/login")
    } catch (err) {
      alert("Gagal hubungi server")
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 h-[calc(80vh-64px)]">
      <aside className="lg:border-r lg:pr-4 lg:border-b-0 lg:pb-0 md:border-b md:pb-4">
        <nav className="space-y-2">
          <a href="/editprofile" className="block rounded-md px-4 py-3 hover:bg-gray-100">Pengaturan Informasi Akun</a>
          <a href="/editpassword" className="block rounded-md px-4 py-3 hover:bg-gray-100">Pengaturan Keamanan</a>
          <a className="block rounded-md px-4 py-3 bg-[#F2E9DB]">Hapus Akun</a>
        </nav>
      </aside>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <img src={Back} alt="Back" 
              onClick={()=>navigate('/')}
          className="h-8 w-8 cursor-pointer" />
          <h2 className="text-2xl md:text-3xl font-semibold">Hapus Akun</h2>
        </div>

        <div className="space-y-2 ml-10">
          <h3 className="text-lg font-semibold">Konfirmasi</h3>
          <div className="border rounded-xl p-8 max-w-xl">
            <div className="text-2xl font-semibold text-center mb-6">Hapus Akun Secara Permanen</div>
            <div className="text-sm text-gray-700 mb-4 text-center">Akun akan dihapus dan Anda akan keluar. Tindakan ini tidak dapat dibatalkan.</div>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">Email: <span className="font-medium text-gray-800">{email || '-'}</span></div>
              <label className="block">
                <div className="text-sm font-medium mb-1">Password akun</div>
                <input 
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-md border px-3 py-2" 
                />
              </label>
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={handleHapusAkun} 
                  disabled={deleting || !password.trim()}
                  className={`px-6 py-2.5 rounded-md ${deleting || !password.trim() ? 'bg-red-400 text-white cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
                >
                  {deleting ? 'Menghapus...' : 'Hapus Akun'}
                </button>
                <button 
                  type="button" 
                  onClick={()=>navigate('/')}
                  className="px-6 py-2.5 rounded-md border"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HapusAkun
