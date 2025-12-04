import { useState, useEffect} from "react"
import Back from '../../assets/svg/back-button.svg' 
import { useNavigate } from "react-router-dom"
function EditEmail() {
  const [editing, setEditing] = useState(false)
  const [emailBaru, setEmailBaru] = useState("")
  const [emailLama, setEmailLama] = useState("")
  const [password, setPassword] = useState("")
  const token = localStorage.getItem("access_token")
  const navigate = useNavigate()
  
  useEffect(() => {
    const getData = async () => {
      const res = await fetch("/api/account/get", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setEmailLama(data.email)  
    }
    if(token) getData()
  }, [token])

  const handleEditEmail = async () => {
    try {
      const resUser = await fetch("/api/account/get", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      }) 
      const user = await resUser.json()
      if (!resUser.ok) return alert("Tidak bisa ambil data akun")
      
      const resEdit = await fetch("/api/account/pengguna/edit",{
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: user.username,
          email: emailBaru,
          password: password,     
          no_telp: user.no_telp,
          prodi: user.prodi,
          fakultas: user.fakultas,
        })
      })
      const result = await resEdit.json()
      if (emailBaru === emailLama) return alert("Email baru tidak boleh sama")
      if (!resEdit.ok) return alert("Gagal memperbarui email: " + result.message)
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        console.log("Token akses diperbarui");
      }

      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
        console.log("Refresh token diperbarui");
      }
      alert("Email berhasil diperbarui!")
      setEmailLama(emailBaru)
      window.location.reload();      
      setEditing(false)               
      setEmailBaru("")                
      setPassword("")                 
    } catch (err) {
      alert("Gagal hubungi server")
      console.error(err)
    }
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 h-[calc(80vh-64px)]">
      <aside className="lg:border-r lg:pr-4 lg:border-b-0 lg:pb-0 md:border-b md:pb-4">
        <nav className="space-y-2">
          <a href="/editprofile" className="block rounded-md px-4 py-3 hover:bg-gray-100">Pengaturan Informasi Akun</a>
          <a href="/editpassword" className="block rounded-md px-4 py-3 hover:bg-gray-100">Pengaturan Keamanan</a>
          <a className="block rounded-md px-4 py-3 bg-[#F2E9DB]">Pengaturan Email</a>
        </nav>
      </aside>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <img src={Back} alt="Back" 
              onClick={()=>navigate('/')}
          className="h-8 w-8 cursor-pointer" />
          <h2 className="text-2xl md:text-3xl font-semibold">Pengaturan Email</h2>
        </div>

        {!editing && (
          <div className="space-y-2 ml-10">
            <h3 className="text-lg font-semibold">Akun Email</h3>
            <div className="space-y-4">
              <div className="text-gray-800">{emailLama}</div>
              <button type="button" onClick={()=>setEditing(true)} className="px-6 py-2.5 bg-[#ACE2E1] rounded-md">
                Edit
              </button>
            </div>
          </div>
        )}

        {editing && (
          <div className="space-y-2 ml-10">
            <h3 className="text-lg font-semibold">Akun Email</h3>
            <div className="border rounded-xl p-8 max-w-xl">
              <div className="text-2xl font-semibold text-center mb-6">Change your email address</div>
              <div className="space-y-4">
                <label className="block">
                  <div className="text-sm font-medium mb-1">Email baru</div>
                  <input 
                    type="email"
                    value={emailBaru}
                    onChange={e => setEmailBaru(e.target.value)}
                    className="w-full rounded-md border px-3 py-2" 
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-medium mb-1">Password akun</div>
                  <input 
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full rounded-md border px-3 py-2" 
                  />
                </label>

                <button type="button" onClick={handleEditEmail} className="px-6 py-2.5 bg-[#ACE2E1] rounded-md hover:bg-[#6DD5D3]">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default EditEmail
