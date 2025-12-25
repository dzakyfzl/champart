import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/svg/champart-logo.svg'
import Profile from '../../assets/svg/profile.svg'
import Toast from '../../component/AdminPengawas/Toast.jsx'
import NavButton from '../../component/AdminPengawas/NavButton.jsx'
import { IconHome, IconUser, IconUserPlus, IconBuilding, IconKey, IconLogout, IconActivity } from '../../component/AdminPengawas/icons.jsx'
import Dashboard from '../../component/AdminPengawas/Dashboard.jsx'
import Activities from '../../component/AdminPengawas/Activities.jsx'
import Institutions from '../../component/AdminPengawas/Institutions.jsx'
import Candidates from '../../component/AdminPengawas/Candidates.jsx'
import SecretCodes from '../../component/AdminPengawas/SecretCodes.jsx'
import ProfileAccount from '../../component/AdminPengawas/ProfileAccount.jsx'


function AdminPengawas() {
  const defaultSettings = {
    moderation: { requireReasonOnReject: true, requireNoteOnApprove: false },
    secret: { defaultExpiryDays: 7, defaultMaxUses: 1, prefix: 'CHP', maskCodes: false, autoRevokeOnInstitutionReject: true },
    display: { defaultTab: 'Dashboard' }
  }

  const tabs = ['Dashboard', 'Kegiatan', 'Instansi', 'Calon Admin', 'Secret Code', 'Profil Akun']
  const [settings] = useState(defaultSettings)
  const [tab, setTab] = useState(defaultSettings.display.defaultTab)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toasts, setToasts] = useState([])
  const [activities, setActivities] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [secretCodes, setSecretCodes] = useState([])
  const [pendingCount, setPendingCount] = useState(0)
  const [avatarUrl, setAvatarUrl] = useState('')
  const avatarObjRef = React.useRef(null)

  const [adminCandidates, setAdminCandidates] = useState([])
  const [loadingAdmin, setLoadingAdmin] = useState(false)

  const fetchWithRefresh = async (url, options = {}) => {
    let token = localStorage.getItem('access_token') || ''
    let headers = { ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    let res = await fetch(url, { ...options, headers })
    let json = null
    try { json = await res.json() } catch {}
    if (res.status === 401 && (json?.detail === 'Could not validate credentials')) {
      const refresh = localStorage.getItem('refresh_token') || ''
      if (refresh) {
        try {
          const r2 = await fetch('/token/access/get', { headers: { Authorization: `Bearer ${refresh}` } })
          let j2 = null
          try { j2 = await r2.json() } catch {}
          if (r2.ok && j2?.access_token) {
            localStorage.setItem('access_token', j2.access_token)
            token = j2.access_token
            headers = { ...(options.headers || {}), Authorization: `Bearer ${token}` }
            res = await fetch(url, { ...options, headers })
            try { json = await res.json() } catch {}
          }
        } catch {}
      }
    }
    return { res, json }
  }

useEffect(() => {
  const fetchAdminCandidates = async () => {
    try {
      setLoadingAdmin(true)
      const { res, json } = await fetchWithRefresh('/api/calon/admin-instansi/get')
      if (res.ok && json?.data) {
        const mapped = json.data.map(item => ({
          id: item.idCalonAdminInstansi,
          email: item.email,
          instansiId: item.idInstansi,
          instansiNama: item.namaInstansi,
          status: 'Menunggu',
          tanggalPengajuan: new Date().toLocaleDateString('id-ID')
        }))
        setAdminCandidates(mapped)
      } else {
        console.error(json?.message || 'Gagal mengambil calon admin instansi')
      }
    } catch (err) {
      console.error('Error fetching calon admin instansi:', err)
    } finally {
      setLoadingAdmin(false)
    }
  }
  fetchAdminCandidates()
}, [])
 
 useEffect(() => {
   const token = localStorage.getItem('access_token') || ''
   if (!token) return
   let canceled = false
   ;(async () => {
     try {
       const r = await fetch('/api/account/get', { headers: { Authorization: `Bearer ${token}` } })
       const j = await r.json()
       if (!r.ok) return
       const idLamp = Number(j?.idLampiran)
       if (Number.isFinite(idLamp) && idLamp > 0) {
         const rf = await fetch(`/api/file/get/${idLamp}`, { headers: { Authorization: `Bearer ${token}` } })
         if (!rf.ok) return
         const blob = await rf.blob()
         const url = URL.createObjectURL(blob)
         if (avatarObjRef.current) URL.revokeObjectURL(avatarObjRef.current)
         avatarObjRef.current = url
         if (!canceled) setAvatarUrl(url)
       } else {
         if (!canceled) setAvatarUrl('')
       }
     } catch {}
   })()
   return () => { canceled = true }
 }, [])
 
  useEffect(() => { 
    const fetchPendingActivities = async () => {
      try {
        setLoading(true)
        const { res, json } = await fetchWithRefresh('/api/kegiatan/pending')
        console.log('Pending activities:', json)
        
        if (res.ok) {
          const mappedActivities = (Array.isArray(json) ? json : []).map(k => ({
          id: k.idKegiatan,
          nama: k.nama,
          jenis: k.jenis,
          instansi: k.nama_instansi,
          tanggal: new Date(k.waktu).toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          }),
          waktu: new Date(k.waktu).toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          lokasi: k.lokasi || '-',
          status: 'Pending',
          deskripsi: k.deskripsi || '-',
          TAK_wajib: k.TAK_wajib,
          views: k.views,
          minat: k.minat,
          bakat: k.bakat,
          waktuDiupload: new Date(k.waktuDiupload).toLocaleDateString('id-ID')
        }))
        
        setActivities(mappedActivities)
        setPendingCount(mappedActivities.length)
        } else {
          setError(json?.message || 'Gagal mengambil data kegiatan pending')
        }
      } catch (err) {
        console.error('Error fetching pending activities:', err)
        setError('Terjadi kesalahan saat mengambil data')
      } finally {
        setLoading(false)
      }
    }
    fetchPendingActivities()
   }, [])


useEffect(() => {
  const fetchPendingInstitutions = async () => {
    try {
      const { res, json } = await fetchWithRefresh('/api/calon/instansi/get')
      console.log('Calon Instansi:', json)
      
      if (res.ok && json?.data) {
        const mappedInstitutions = json.data.map(inst => ({
          id: inst.idCalonInstansi,
          nama: inst.nama,
          jenis: inst.jenis,
          alamat: inst.alamat,
          email: inst.email,
          status: 'Menunggu',  
          tanggalPengajuan: new Date(inst.createdAt || Date.now()).toLocaleDateString('id-ID')
        }))
        
        setInstitutions(mappedInstitutions)
      } else {
        console.error('Error fetching institutions:', json?.message)
      }
    } catch (err) {
      console.error('Error fetching institutions:', err)
    }
  }
  
  fetchPendingInstitutions()
}, [])

  function pushToast(message, type = 'info') {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500)
  }

  useEffect(() => {
    const count = activities.filter(a => a.status === 'Pending' || a.status === 'Menunggu').length
    setPendingCount(count)
  }, [activities])


  

  function approveInstitution(item) {
    openConfirm({
      title: 'Setujui Instansi',
      content: <div>Anda akan menyetujui instansi <b>{item.nama}</b>.</div>,
      onConfirm: async () => {
        const prev = institutions
        setInstitutions(p => p.map(i => i.id === item.id ? { ...i, status: 'Disetujui' } : i))
        pushToast('Instansi disetujui')
        closeConfirm()
      }
    })
  }

  function randomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let s = ''
    for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)]
    return `CHP-${s}`
  }

  function generateCode({ instansiId, instansiName, expiryDays, maxUses, note } = {}) {
    const base = settings.secret.prefix || 'CHP'
    const code = randomCode().replace(/^[A-Z]+-/, base + '-')
    const now = new Date()
    const exp = new Date(now.getTime() + (expiryDays || settings.secret.defaultExpiryDays || 7) * 24 * 60 * 60 * 1000)
    const entry = { id: Math.random().toString(36).slice(2), instansiId, instansiName, kode: code, dibuat: now.toLocaleDateString('id-ID'), kadaluarsa: exp.toLocaleDateString('id-ID'), penggunaan: 0, maksimal: maxUses || settings.secret.defaultMaxUses || 1, status: 'Aktif', catatan: note || '' }
    setSecretCodes(prev => [entry, ...prev])
    pushToast('Secret code dibuat')
    return entry
  }

  function revokeCode(entry) {
    setSecretCodes(prev => prev.map(e => e.id === entry.id ? { ...e, status: 'Dinonaktifkan' } : e))
    pushToast('Secret code dinonaktifkan')
  }

  
    const navigate = useNavigate()

    const handleLogout = async () => {
    pushToast('Logout') 
      try {
        const accessToken = localStorage.getItem("access_token")

        await fetch("/api/account/logout", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        })
      } catch (err) {
        console.error("Logout error:", err)
      }
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      setTimeout(() => {
        navigate("/login")
      }, 600)
    }
  
  return (
    <div className="h-screen flex">
      <Toast toasts={toasts} remove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      <aside className="w-16 bg-white border-r hidden md:flex flex-col items-center py-3">
        <div className="w-14 h-14 grid place-items-center">
          <img src={Logo} alt="Logo" className="w-12 h-12" />
        </div>
        <div className="w-12 h-px bg-gray-200 my-3"></div>
        <nav className="flex-1 flex flex-col items-center gap-3">
          <NavButton title="Dashboard" active={tab===tabs[0]} onClick={()=>setTab(tabs[0])}><IconHome /></NavButton>
          <NavButton title="Kegiatan" active={tab===tabs[1]} onClick={()=>setTab(tabs[1])}>
            <IconActivity />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </NavButton>
          <NavButton title="Instansi" active={tab===tabs[2]} onClick={()=>setTab(tabs[2])}><IconBuilding /></NavButton>
          <NavButton title="Calon Admin" active={tab===tabs[3]} onClick={()=>setTab(tabs[3])}><IconUserPlus /></NavButton>
          <NavButton title="Secret Code" active={tab===tabs[4]} onClick={()=>setTab(tabs[4])}><IconKey /></NavButton>
          <NavButton title="Profil Akun" active={tab===tabs[5]} onClick={()=>setTab(tabs[5])}><IconUser /></NavButton>
        </nav>
        <div className="mt-auto">
          <NavButton title="Logout" active={false} onClick={handleLogout}><IconLogout /></NavButton>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="md:hidden">
              <select className="border rounded px-3 py-2" value={tab} onChange={e=>setTab(e.target.value)}>
                {tabs.map(t => (<option key={t}>{t}</option>))}
              </select>
            </div>
            <div className="hidden md:block text-sm text-gray-600">Admin{tab}</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full text-white grid place-items-center text-sm overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={()=>setAvatarUrl('')} />
                ) : (
                  <img src={Profile} alt="Avatar" className="w-5 h-5" />
                )}
              </div>
            </div>
          </div>
        </header>
        <section className="p-4 overflow-y-auto flex-1">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
          {tab===tabs[0] && <Dashboard />}
          {tab===tabs[1] && <Activities loading={loading} activities={activities} onActivitiesChange={setActivities} settings={settings} pushToast={pushToast} />}
          {tab===tabs[2] && <Institutions />}
          {tab===tabs[3] && (<Candidates loading={loadingAdmin} candidates={adminCandidates} />)}
          {tab===tabs[4] && <SecretCodes institutions={institutions} secretCodes={secretCodes} settings={settings} onGenerate={generateCode} onRevoke={revokeCode} />}
          {tab===tabs[5] && <ProfileAccount />}
          
        </section>
      </main>
    </div>
  )
}

export default AdminPengawas
