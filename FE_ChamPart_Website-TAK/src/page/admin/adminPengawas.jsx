import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/svg/champart-logo.svg'
import Toast from '../../component/AdminPengawas/Toast.jsx'
import Modal from '../../component/AdminPengawas/Modal.jsx'
import Drawer from '../../component/AdminPengawas/Drawer.jsx'
import Badge from '../../component/AdminPengawas/Badge.jsx'
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
  const [drawer, setDrawer] = useState({ open: false, title: '', content: null })
  const [modal, setModal] = useState({ open: false, title: '', content: null, danger: false, confirmText: 'Konfirmasi', onConfirm: null })
  const [activities, setActivities] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [secretCodes, setSecretCodes] = useState([])
  const [pendingCount, setPendingCount] = useState(0)
 
  useEffect(() => { 
    const fetchPendingActivities = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('access_token')
        
        const res = await fetch('/api/kegiatan/pending', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        const data = await res.json()
        console.log('Pending activities:', data)
        
        if (res.ok) {
          const mappedActivities = data.map(k => ({
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
          pemohon: k.nama_instansi, // Atau ambil dari data admin instansi
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
          setError(data.message || 'Gagal mengambil data kegiatan pending')
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
      const token = localStorage.getItem('access_token')
      
      const res = await fetch('/api/calon/instansi/get', {  
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const result = await res.json()
      console.log('Calon Instansi:', result)
      
      if (res.ok&& result.data) {
        const mappedInstitutions = result.data.map(inst => ({
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
        console.error('Error fetching institutions:', data.message)
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

  function openDrawer(title, content) {
    setDrawer({ open: true, title, content })
  }
  function closeDrawer() {
    setDrawer({ open: false, title: '', content: null })
  }

  function openConfirm({ title, content, danger, confirmText, onConfirm }) {
    setModal({ open: true, title, content, danger: !!danger, confirmText: confirmText || 'Konfirmasi', onConfirm })
  }
  function closeConfirm() {
    setModal({ open: false, title: '', content: null, danger: false, confirmText: 'Konfirmasi', onConfirm: null })
  }


  async function approveActivity(item) {
  if (settings.moderation.requireNoteOnApprove) {
    let note = ''
    const Content = () => (
      <div className="space-y-3">
        <div>Masukkan catatan persetujuan untuk <b>{item.nama}</b>.</div>
        <input className="w-full border rounded px-3 py-2" placeholder="Catatan persetujuan" onChange={e => note = e.target.value} />
      </div>
    )
    openConfirm({
      title: 'Setujui Kegiatan',
      content: <Content />,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('access_token')
          const res = await fetch(`/api/approve/kegiatan/${item.id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'approved' })
          })
          
          if (res.ok) {
            setActivities(p => p.filter(a => a.id !== item.id))
            setPendingCount(prev => prev - 1)
            pushToast('Kegiatan disetujui', 'success')
          } else {
            const data = await res.json()
            pushToast(data.message || 'Gagal menyetujui kegiatan', 'error')
          }
        } catch (err) {
          console.error('Error approving activity:', err)
          pushToast('Terjadi kesalahan', 'error')
        }
        closeConfirm()
      }
    })
  } else {
    openConfirm({
      title: 'Setujui Kegiatan',
      content: <div>Anda akan menyetujui <b>{item.nama}</b> oleh <b>{item.instansi}</b>.</div>,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('access_token')
          const res = await fetch(`/api/approve/kegiatan/${item.id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'approved' })
          })
          
          if (res.ok) {
            setActivities(p => p.filter(a => a.id !== item.id))
            setPendingCount(prev => prev - 1)
            pushToast('Kegiatan disetujui', 'success')
          } else {
            const data = await res.json()
            pushToast(data.message || 'Gagal menyetujui kegiatan', 'error')
          }
        } catch (err) {
          console.error('Error approving activity:', err)
          pushToast('Terjadi kesalahan', 'error')
        }
        closeConfirm()
      }
    })
  }
}

function rejectActivity(item) {
  let alasan = ''
  const Content = () => (
    <div className="space-y-3">
      <div>Masukkan alasan penolakan untuk <b>{item.nama}</b>.</div>
      <textarea 
        className="w-full border rounded px-3 py-2" 
        placeholder="Alasan penolakan" 
        rows="3"
        onChange={e => alasan = e.target.value} 
      />
    </div>
  )
  openConfirm({
    title: 'Tolak Kegiatan',
    content: <Content />,
    danger: true,
    confirmText: 'Tolak',
    onConfirm: async () => {
      if (settings.moderation.requireReasonOnReject && !alasan.trim()) { 
        pushToast('Alasan penolakan wajib', 'error')
        return 
      }
      
      try {
        const token = localStorage.getItem('access_token')
        const res = await fetch(`/api/approve/kegiatan/${item.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            status: 'rejected',
            alasan: alasan 
          })
        })
        
        if (res.ok) {
          setActivities(p => p.filter(a => a.id !== item.id))
          setPendingCount(prev => prev - 1)
          pushToast('Kegiatan ditolak', 'success')
        } else {
          const data = await res.json()
          pushToast(data.message || 'Gagal menolak kegiatan', 'error')
        }
      } catch (err) {
        console.error('Error rejecting activity:', err)
        pushToast('Terjadi kesalahan', 'error')
      }
      closeConfirm()
    }
  })
}


  function openActivityDetail(item) {
    openDrawer('Detail Kegiatan', (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-gray-600">Nama</div>
            <div className="font-medium">{item.nama}</div>
          </div>
          <div>
            <div className="text-gray-600">Instansi</div>
            <div className="font-medium">{item.instansi}</div>
          </div>
          <div>
            <div className="text-gray-600">Tanggal</div>
            <div className="font-medium">{item.tanggal}</div>
          </div>
          <div>
            <div className="text-gray-600">Pemohon</div>
            <div className="font-medium">{item.pemohon}</div>
          </div>
          <div>
            <div className="text-gray-600">Lokasi</div>
            <div className="font-medium">{item.lokasi}</div>
          </div>
          <div>
            <div className="text-gray-600">Status</div>
            <div className="font-medium"><Badge label={item.status} /></div>
          </div>
        </div>
        <div>
          <div className="text-gray-600">Deskripsi</div>
          <div>{item.deskripsi}</div>
        </div>
      </div>
    ))
  }

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
      <Modal open={modal.open} title={modal.title} onClose={closeConfirm} onConfirm={modal.onConfirm || (() => {})} confirmText={modal.confirmText} danger={modal.danger}>{modal.content}</Modal>
      <Drawer open={drawer.open} title={drawer.title} onClose={closeDrawer}>{drawer.content}</Drawer>

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
            <div className="hidden md:block text-sm text-gray-600">Admin › {tab}</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-800 text-white grid place-items-center text-sm">AP</div>
            </div>
          </div>
        </header>
        <section className="p-4 overflow-y-auto flex-1">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
          {tab===tabs[0] && <Dashboard activities={activities} institutions={institutions} secretCodes={secretCodes} pendingCount={pendingCount} />}
          {tab===tabs[1] && <Activities loading={loading} activities={activities} onViewDetail={openActivityDetail} onApprove={approveActivity} onReject={rejectActivity} />}
          {tab===tabs[2] && <Institutions />}
          {tab===tabs[3] && <Candidates />}
          {tab===tabs[4] && <SecretCodes institutions={institutions} secretCodes={secretCodes} settings={settings} onGenerate={generateCode} onRevoke={revokeCode} />}
          {tab===tabs[5] && <ProfileAccount />}
          
        </section>
      </main>
    </div>
  )
}

export default AdminPengawas
