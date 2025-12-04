import Back from '../../assets/svg/back-button.svg' 
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'
function Profile() {
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [showPassModal, setShowPassModal] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleFile = (file) => {
    if (!file) return
    if (!(file.type || '').startsWith('image/')) { setError('File harus gambar'); return }
    if (file.size > 2 * 1024 * 1024) { setError('Maksimal ukuran 2MB'); return }
    const reader = new FileReader()
    reader.onload = () => { setAvatar(reader.result); setError('') }
    reader.readAsDataURL(file)
  }
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [no_telp, setNo_telp] = useState('')
  const [fakultas, setFakultas] = useState('')
  const [prodi, setProdi] = useState('')
  const token = localStorage.getItem('access_token')

   // Minat & Bakat
  const [minatList, setMinatList] = useState([])
  const [bakatList, setBakatList] = useState([])

  const [selectedMinat, setSelectedMinat] = useState(["", "", ""])
  const [selectedBakat, setSelectedBakat] = useState(["", "", ""])

  const [minatPengguna, setMinatPengguna] = useState([])
  const [bakatPengguna, setBakatPengguna] = useState([])

  const [minatInput, setMinatInput] = useState("")
  const [bakatInput, setBakatInput] = useState("")
  
  const updateMinat = (index, value) => {
    const updated = [...selectedMinat]
    updated[index] = value
    setSelectedMinat(updated)
  }

  // 🔄 UPDATE BAKAT
  const updateBakat = (index, value) => {
    const updated = [...selectedBakat]
    updated[index] = value
    setSelectedBakat(updated)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/account/get",{
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
        const result = await res.json()
        if (!res.ok) return alert("Gagal mengambil data profil: " + result.message)
        setUsername(result.username)
        setEmail(result.email)
        setNo_telp(result.no_telp)
        setFakultas(result.fakultas)
        setProdi(result.prodi)

        // MINAT PENGGUNA
        const resMinat = await fetch("/api/minat/pengguna", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        const dataMinat = await resMinat.json()
        if (resMinat.ok) {
          setMinatList(dataMinat.minat)
          setSelectedMinat(dataMinat.minat.map(m => m.idMinat))
        }

        // BAKAT PENGGUNA
        const resBakat = await fetch("/api/bakat/pengguna", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        const dataBakat = await resBakat.json()
        if (resBakat.ok) {
          setBakatList(dataBakat.bakat)
          setSelectedBakat(dataBakat.bakat.map(b => b.idBakat))
        }

        // SEMUA LIST MINAT
        const resAllMinat = await fetch("/api/minat", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        const allMinat = await resAllMinat.json()
        setMinatPengguna(allMinat.data)

        // SEMUA LIST BAKAT
        const resAllBakat = await fetch("/api/bakat", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        const allBakat = await resAllBakat.json()
        setBakatPengguna(allBakat.data)

      } catch (error) {
        alert("Gagal mengambil data profil: " + error.message)
      }
    }
    fetchData()
  }, [token])

  const handleEditPengguna = async () => {
  try {
    const res = await fetch("/api/account/pengguna/edit", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password: confirmPassword, 
        no_telp,
        prodi,
        fakultas,
      })
    })
    const data = await res.json()
    if (!res.ok) {
      return alert("Gagal Update Profil: " + data.message)
    }
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      console.log("Token akses diperbarui");
    }

    if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
      console.log("Refresh token diperbarui");
    }
      alert("Profil berhasil diperbarui")
      window.location.reload();
      setShowPassModal(false)
      setIsEditing(false)
      setConfirmPassword("")
    } catch (err) {
      alert("Gagal memperbarui profil: " + err.message)
    }
  }

  const handleTambahMinat = async () => {
    if (!minatInput) return alert("Isi ID minat terlebih dahulu")

    try {
      const res = await fetch("/api/minat/pengguna", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ minat_id: [parseInt(minatInput)] })
      })

      const data = await res.json()
      if (!res.ok) return alert("Gagal menambah minat: " + data.message)

      const re = await fetch("/api/minat/pengguna", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      const fresh = await re.json()

      setMinatList(fresh.minat)
      setSelectedMinat(fresh.minat.map(m => m.idMinat))

      setMinatInput("")

    } catch (err) {
      alert(err.message)
    }
  }

  const handleTambahBakat = async () => {
    if (!bakatInput) return alert("Isi ID bakat terlebih dahulu")

    try {
      const res = await fetch("/api/bakat/pengguna", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ bakat_id: [parseInt(bakatInput)] })
      })

      const data = await res.json()
      if (!res.ok) return alert("Gagal menambah bakat: " + data.message)

      const re = await fetch("/api/bakat/pengguna", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      const fresh = await re.json()

      setBakatList(fresh.bakat)
      setSelectedBakat(fresh.bakat.map(b => b.idBakat))

      setBakatInput("")
      } catch (err) {
      alert(err.message)
    }
  }


  const majorData = {
    'Fakultas Teknik Elektro (FTE)': ['Teknik Telekomunikasi','Teknik Elektro','Teknik Biomedis','Teknik Komputer','Teknik Fisika','Teknik Sistem Energi'],
    'Fakultas Rekayasa Industri (FRI)': ['Teknik Industri','Sistem Informasi','Teknik Logistik','Manajemen Rekayasa Industri'],
    'Fakultas Informatika (FIF)': ['Informatika','Sains Data','Teknologi Informasi','Rekayasa Perangkat Lunak'],
    'Fakultas Ekonomi dan Bisnis (FEB)': ['Akuntansi','Manajemen Bisnis Telekomunikasi dan Informatika','Leisure Management','Administrasi Bisnis','Digital Business'],
    'Fakultas Komunikasi dan Ilmu Komunikasi (FKS)': ['Ilmu Komunikasi','Digital Public Relation','Digital Content Broadcasting','Psikologi'],
    'Fakultas Industri Kreatif (FIK)': ['Visual Arts','Desain Komunikasi Visual','Desain Produk & Inovasi','Kriya','Desain Interior','Film dan Animasi']
  }

  const fakultasList = Object.keys(majorData)
  const prodiList = fakultas ? majorData[fakultas] : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 ">
     <aside className="lg:border-r lg:pr-4 lg:border-b-0 lg:pb-0 md:border-b md:pb-4">
        <nav className="space-y-2">
          <a className="block rounded-md px-4 py-3 bg-[#F2E9DB]">Pengaturan Informasi Akun</a>
          <a href="/editpassword" className="block rounded-md px-4 py-3 hover:bg-gray-100">Pengaturan Keamanan</a>
          <a href="/editemail" className="block rounded-md px-4 py-3 hover:bg-gray-100">Pengaturan Email</a>
        </nav>
      </aside>

      <section className="space-y-4">
         <div className="flex gap-3 items-center">
              <img src={Back} alt="Back" 
                  onClick={()=>navigate('/')}
                  className="h-8 w-8 cursor-pointer" />
              <h1 className="text-2xl font-semibold text-center">Pengaturan Informasi Akun</h1>
          </div>

        <div className="space-y-2 ml-10">
          <h3 className="text-lg font-semibold">Informasi Akun</h3>
          <div className="flex justify-center md:justify-start py-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-[#F2E9DB] overflow-hidden flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-32 h-32 object-cover" />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-gray-700 fill-current"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v3h16v-3c0-2.761-3.582-5-8-5z"/></svg>
                )}
              </div>
              <div className="text-center text-xs text-gray-600 mt-2">Add a profile image<br/>drag and drop or choose a file to upload</div>
            </div>
          </div>
          <div className="w-full">
              <div
                onDragOver={(e)=>{e.preventDefault(); setDragOver(true)}}
                onDragLeave={()=>setDragOver(false)}
                onDrop={(e)=>{e.preventDefault(); setDragOver(false); const f=e.dataTransfer.files?.[0]; if (f) handleFile(f)}}
                className={`border-2 rounded-md px-4 py-6 text-center ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'}`}
              >
                <div className="text-sm font-medium mb-2">Upload Gambar</div>
                <div className="text-xs text-gray-600 mb-3">PNG, JPG, maksimal 2MB</div>
                <div className="flex items-center justify-center gap-3">
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={(e)=>{const f=e.target.files?.[0]; if (f) handleFile(f)}}
                    className="hidden"
                  />
                  <label htmlFor="avatar-input" className="px-4 py-2 rounded-md bg-[#ACE2E1] text-gray-900 border border-gray-300 cursor-pointer hover:bg-[#6DD5D3]">Pilih File</label>
                  {avatar && (
                    <button type="button" onClick={()=>setAvatar('')} className="px-4 py-2 rounded-md border">Hapus</button>
                  )}
                </div>
                {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
            <div className="space-y-4 pr-4">
              <label className="block">
                <div className="text-sm font-medium mb-1">Nama</div>
                <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
              </label>
              <label className="block">
                <div className="text-sm font-medium mb-1">Email</div>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
              </label>
              <label className="block">
                <div className="text-sm font-medium mb-1">Nomor Telepon</div>
                <input type="tel" value={no_telp} onChange={(e)=>setNo_telp(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
              </label>
              <label className="block">
                <div className="text-sm font-medium mb-1">Fakultas</div>
                {isEditing ? (
                  <select value={fakultas} 
                          onChange={(e)=>{setFakultas(e.target.value); setProdi("")}}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 cursor-pointer">
                    <option value="">Pilih Fakultas…</option>
                    {fakultasList.map(f=><option key={f} value={f}>{f}</option>)}
                  </select>
                ) : (
                  <input type="text" value={fakultas} disabled className="w-full rounded-md border px-3 py-2 bg-gray-200" />
                )}
              </label>
              <label className="block">
                <div className="text-sm font-medium mb-1">Prodi</div>

                {isEditing ? (
                  <select value={prodi} disabled={!fakultas}
                          onChange={(e)=>setProdi(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 cursor-pointer disabled:opacity-50">
                    <option value="">Pilih Prodi…</option>
                    {prodiList.map(p=><option key={p} value={p}>{p}</option>)}
                  </select>
                ) : (
                  <input type="text" value={prodi} disabled className="w-full rounded-md border px-3 py-2 bg-gray-200" />
                )}
              </label>
            </div>

            <div className="space-y-6">
  {/* MINAT */}
  <div className="space-y-3">
    <div className="text-sm font-semibold">Minat Pengguna</div>

    {selectedMinat.map((val, index) => (
      <label key={index} className="block">
        <select
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          value={val}
          onChange={(e) => updateMinat(index, e.target.value)}
        >
          <option value="">Pilih…</option>

          {minatPengguna.map((m) => (
            <option key={m.idMinat} value={m.idMinat}>
              {m.nama}
            </option>
          ))}
        </select>
      </label>
    ))}
  </div>

  {/* BAKAT */}
  <div className="space-y-3">
    <div className="text-sm font-semibold">Bakat Pengguna</div>

    {selectedBakat.map((val, index) => (
      <label key={index} className="block">
        <select
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          value={val}
          onChange={(e) => updateBakat(index, e.target.value)}
        >
          <option value="">Pilih…</option>

          {bakatPengguna.map((b) => (
            <option key={b.idBakat} value={b.idBakat}>
              {b.nama}
            </option>
          ))}
        </select>
      </label>
    ))}
  </div>
</div>
          </div>
        </div>
        <div className="ml-10 pt-5">
          <button
            type="button"
            onClick={()=>{
              if(isEditing) setShowPassModal(true)   
              else setIsEditing(true)
            }}
            className="px-6 py-2.5 rounded-md bg-teal-200 text-gray-900 border border-gray-300 hover:bg-teal-300"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </section>
      {showPassModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-80">
              <h2 className="font-semibold text-lg mb-3">Konfirmasi Password</h2>
              <input 
                type="password"
                placeholder="Masukkan password akun"
                className="border w-full rounded-md px-3 py-2 mb-4"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button onClick={()=>setShowPassModal(false)} className="px-4 py-2 border rounded-md">Cancel</button>
                <button onClick={handleEditPengguna} className="px-4 py-2 bg-teal-300 rounded-md hover:bg-teal-400">Confirm</button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
export default Profile
