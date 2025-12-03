import React, { useEffect, useState } from 'react'
import Logo from '../../assets/svg/champart-logo.svg'

function Badge({ label }) {
  const map = { Draft: 'bg-gray-100 text-gray-800', Menunggu: 'bg-yellow-100 text-yellow-800', Disetujui: 'bg-green-100 text-green-800', Ditolak: 'bg-red-100 text-red-800' }
  const cls = map[label] || 'bg-gray-100 text-gray-800'
  return (<span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>)
}

function Toast({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map(t => (
        <div key={t.id} className={`rounded-lg shadow-lg px-4 py-3 text-sm ${t.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`} onClick={() => remove(t.id)}>{t.message}</div>
      ))}
    </div>
  )
}

function Modal({ open, title, children, onClose, onConfirm, confirmText = 'Simpan', danger }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl">
          <div className="px-6 pt-6 text-lg font-semibold">{title}</div>
          <div className="px-6 py-4 text-sm">{children}</div>
          <div className="px-6 pb-6 flex justify-end gap-3">
            <button className="px-4 py-2 rounded border" onClick={onClose}>Batal</button>
            <button className={`px-4 py-2 rounded text-white ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`} onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

async function apiFetch(path, { method = 'GET', headers = {}, body } = {}) {
  const API_BASE = window.CHAMPART_API_BASE_URL || ''
  const AUTH_TOKEN = localStorage.getItem('champart_token') || ''
  if (!API_BASE) throw new Error('API_BASE tidak dikonfigurasi')
  const h = { 'Content-Type': 'application/json', ...headers }
  if (AUTH_TOKEN) h['Authorization'] = `Bearer ${AUTH_TOKEN}`
  const res = await fetch(`${API_BASE}${path}`, { method, headers: h, body: body ? JSON.stringify(body) : undefined })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

function AdminInstansi() {
  const tabs = ['Dashboard', 'Kegiatan', 'Akun Tambahan', 'Profil Akun', 'Profil Instansi']
  const [tab, setTab] = useState(tabs[0])
  const [toasts, setToasts] = useState([])
  const [modal, setModal] = useState({ open: false, title: '', content: null, confirmText: 'Simpan', danger: false, onConfirm: null })
  const [activities, setActivities] = useState(() => { try { const raw = localStorage.getItem('instansi_activities'); return raw ? JSON.parse(raw) : [] } catch { return [] } })
  const [requests, setRequests] = useState(() => { try { const raw = localStorage.getItem('instansi_requests'); return raw ? JSON.parse(raw) : [] } catch { return [] } })
  const [account, setAccount] = useState(() => { try { const raw = localStorage.getItem('instansi_account'); return raw ? JSON.parse(raw) : { name: 'Admin Instansi', email: 'admin@instansi.id', phone: '', avatar: '' } } catch { return { name: 'Admin Instansi', email: 'admin@instansi.id', phone: '', avatar: '' } } })
  const [institution, setInstitution] = useState(() => { try { const raw = localStorage.getItem('instansi_profile'); return raw ? JSON.parse(raw) : { id: 'I-LOCAL', name: 'Instansi Anda', logo: '' } } catch { return { id: 'I-LOCAL', name: 'Instansi Anda', logo: '' } } })
  const [dark, setDark] = useState(() => typeof document !== 'undefined' && document.body.classList.contains('theme-dark'))

  useEffect(() => { try { localStorage.setItem('instansi_activities', JSON.stringify(activities)) } catch {} }, [activities])
  useEffect(() => { try { localStorage.setItem('instansi_requests', JSON.stringify(requests)) } catch {} }, [requests])
  useEffect(() => { try { localStorage.setItem('instansi_account', JSON.stringify(account)) } catch {} }, [account])
  useEffect(() => { try { localStorage.setItem('instansi_profile', JSON.stringify(institution)) } catch {} }, [institution])
  useEffect(() => { document.body.classList.toggle('theme-dark', !!dark) }, [dark])

  useEffect(() => {
    const API_BASE = window.CHAMPART_API_BASE_URL || ''
    const AUTH_TOKEN = localStorage.getItem('champart_token') || ''
    let cancel = false
    async function loadInitial() {
      try {
        if (API_BASE) {
          const list = await apiFetch(`/kegiatan?instansi_id=${encodeURIComponent(institution.id)}`)
          if (!cancel) setActivities(Array.isArray(list) ? list : [])
        }
      } catch {}
    }
    loadInitial()
    if (API_BASE) {
      let es
      try {
        const url = `${API_BASE}/events${AUTH_TOKEN ? `?token=${encodeURIComponent(AUTH_TOKEN)}` : ''}`
        es = new EventSource(url)
        es.onmessage = (ev) => {
          try {
            const data = JSON.parse(ev.data)
            if (data.type === 'kegiatan.status_changed') {
              setActivities(prev => prev.map(a => a.id === data.id ? { ...a, status: data.status } : a))
              pushToast(`Status kegiatan diperbarui: ${data.status}`)
            }
          } catch {}
        }
      } catch {}
      const timer = setInterval(async () => {
        try { const list = await apiFetch(`/kegiatan?instansi_id=${encodeURIComponent(institution.id)}`); setActivities(Array.isArray(list) ? list : []) } catch {}
      }, 15000)
      return () => { cancel = true; if (es) es.close(); clearInterval(timer) }
    }
    return () => { cancel = true }
  }, [institution.id])

  function pushToast(message, type = 'info') {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500)
  }

  function openModal(title, content, onConfirm, confirmText = 'Simpan', danger = false) { setModal({ open: true, title, content, onConfirm, confirmText, danger }) }
  function closeModal() { setModal({ open: false, title: '', content: null, onConfirm: null, confirmText: 'Simpan', danger: false }) }

  function addActivity() {
    let data = { name: '', date: '', location: '', description: '', status: 'Draft' }
    const Form = () => (
      <div className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Nama kegiatan" onChange={e => data.name = e.target.value} />
        <input type="date" className="w-full border rounded px-3 py-2" onChange={e => data.date = e.target.value} />
        <input className="w-full border rounded px-3 py-2" placeholder="Lokasi" onChange={e => data.location = e.target.value} />
        <textarea className="w-full border rounded px-3 py-2" rows="3" placeholder="Deskripsi" onChange={e => data.description = e.target.value}></textarea>
      </div>
    )
    openModal('Tambah Kegiatan', <Form />, () => { const id = 'AK-' + (Date.now()); setActivities(prev => [{ id, ...data }, ...prev]); pushToast('Kegiatan ditambahkan'); closeModal() })
  }

  function editActivity(item) {
    let data = { ...item }
    const Form = () => (
      <div className="space-y-3">
        <input className="w-full border rounded px-3 py-2" defaultValue={item.name} onChange={e => data.name = e.target.value} />
        <input type="date" className="w-full border rounded px-3 py-2" defaultValue={item.date} onChange={e => data.date = e.target.value} />
        <input className="w-full border rounded px-3 py-2" defaultValue={item.location} onChange={e => data.location = e.target.value} />
        <textarea className="w-full border rounded px-3 py-2" rows="3" defaultValue={item.description} onChange={e => data.description = e.target.value}></textarea>
        <select className="w-full border rounded px-3 py-2" defaultValue={item.status} onChange={e => data.status = e.target.value}><option>Draft</option><option>Menunggu</option></select>
      </div>
    )
    openModal('Edit Kegiatan', <Form />, () => { setActivities(prev => prev.map(a => a.id === item.id ? data : a)); pushToast('Kegiatan diperbarui'); closeModal() })
  }

  function deleteActivity(item) {
    const Confirm = () => (<div>Hapus kegiatan <b>{item.name}</b>?</div>)
    openModal('Hapus Kegiatan', <Confirm />, () => { setActivities(prev => prev.filter(a => a.id !== item.id)); pushToast('Kegiatan dihapus'); closeModal() }, 'Hapus', true)
  }

  async function submitActivity(item) {
    const prev = activities
    setActivities(p => p.map(a => a.id === item.id ? { ...a, status: 'Menunggu' } : a))
    try { await apiFetch(`/kegiatan/${encodeURIComponent(item.id)}/submit`, { method: 'POST', body: { instansi_id: institution.id } }); pushToast('Kegiatan diajukan') } catch (e) { setActivities(prev); pushToast('Gagal mengajukan kegiatan ke server', 'error') }
  }

  function addRequest() {
    let data = { name: '', email: '', role: 'Staff Instansi' }
    const Form = () => (
      <div className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Nama" onChange={e => data.name = e.target.value} />
        <input type="email" className="w-full border rounded px-3 py-2" placeholder="Email" onChange={e => data.email = e.target.value} />
        <select className="w-full border rounded px-3 py-2" defaultValue={data.role} onChange={e => data.role = e.target.value}><option>Staff Instansi</option><option>Admin Instansi</option></select>
      </div>
    )
    openModal('Ajukan Akun Tambahan', <Form />, () => { const id = 'RQ-' + (Date.now()); setRequests(prev => [{ id, ...data, status: 'Submitted' }, ...prev]); pushToast('Pengajuan akun dikirim'); closeModal() })
  }

  function deleteRequest(item) {
    const Confirm = () => (<div>Batalkan pengajuan akun <b>{item.email}</b>?</div>)
    openModal('Batalkan Pengajuan', <Confirm />, () => { setRequests(prev => prev.filter(r => r.id !== item.id)); pushToast('Pengajuan dibatalkan'); closeModal() }, 'Batalkan', true)
  }

  function saveAccount(updates) { setAccount(prev => ({ ...prev, ...updates })) }
  function saveInstitution(updates) { setInstitution(prev => ({ ...prev, ...updates })) }
  function handleLogout() { pushToast('Logout'); setTimeout(() => { window.location.href = '/login' }, 600) }
  function deleteAccount() { openModal('Hapus Akun', <div>Anda akan menghapus akun ini.</div>, () => { setAccount({ name: '', email: '', phone: '', avatar: '' }); pushToast('Akun dihapus'); closeModal() }, 'Hapus', true) }

  async function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  function IconHome() { return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5l9-7 9 7" /><path d="M5.5 10.5v8.5h13v-8.5" /><path d="M10 19v-5h4v5" /></svg>) }
  function IconList() { return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><circle cx="3" cy="6" r="1" /><circle cx="3" cy="12" r="1" /><circle cx="3" cy="18" r="1" /></svg>) }
  function IconUsers() { return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>) }
  function IconUser() { return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7.5" r="3" /><path d="M5 20c0-4 14-4 14 0" /></svg>) }
  function IconBuilding() { return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="14" height="18" rx="1" /><rect x="11" y="15" width="2" height="6" /></svg>) }
  function IconLogout() { return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>) }

  function Dashboard() {
    const totalDraft = activities.filter(a => a.status === 'Draft').length
    const totalPending = activities.filter(a => a.status === 'Menunggu').length
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4"><div className="text-sm text-gray-600">Draft</div><div className="text-2xl font-semibold">{totalDraft}</div></div>
          <div className="bg-white rounded-xl shadow p-4"><div className="text-sm text-gray-600">Menunggu Persetujuan</div><div className="text-2xl font-semibold">{totalPending}</div></div>
          <div className="bg-white rounded-xl shadow p-4"><div className="text-sm text-gray-600">Pengajuan Akun</div><div className="text-2xl font-semibold">{requests.length}</div></div>
        </div>
      </div>
    )
  }

  function Activities() {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-lg">Kegiatan Instansi</div>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={addActivity}>Tambah Kegiatan</button>
        </div>
        <div className="bg-white rounded-xl shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Nama</th>
                  <th className="px-4 py-2 text-left">Tanggal</th>
                  <th className="px-4 py-2 text-left">Lokasi</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activities.length === 0 && (<tr><td className="px-4 py-8 text-center text-gray-600" colSpan="5">Belum ada kegiatan</td></tr>)}
                {activities.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.date || '-'}</td>
                    <td className="px-4 py-3">{item.location || '-'}</td>
                    <td className="px-4 py-3"><Badge label={item.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-1 rounded border" onClick={() => editActivity(item)}>Edit</button>
                        <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => submitActivity(item)} disabled={item.status !== 'Draft'}>Ajukan</button>
                        <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => deleteActivity(item)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  function Requests() {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-lg">Pengajuan Akun Tambahan</div>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={addRequest}>Ajukan Akun</button>
        </div>
        <div className="bg-white rounded-xl shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Nama</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Peran</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {requests.length === 0 && (<tr><td className="px-4 py-8 text-center text-gray-600" colSpan="5">Belum ada pengajuan</td></tr>)}
                {requests.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.email}</td>
                    <td className="px-4 py-3">{item.role}</td>
                    <td className="px-4 py-3"><Badge label={'Menunggu'} /></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-1 rounded border" onClick={() => deleteRequest(item)}>Batalkan</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  function ProfileAccount() {
    const [name, setName] = useState(account.name)
    const [email, setEmail] = useState(account.email)
    const [phone, setPhone] = useState(account.phone)
    const [avatar, setAvatar] = useState(account.avatar)
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-3">Profil Akun</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm font-medium mb-1">Nama</div>
              <input id="akun-nama" className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
            </label>
            <label className="block">
              <div className="text-sm font-medium mb-1">Email</div>
              <input id="akun-email" type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
            </label>
            <label className="block md:col-span-2">
              <div className="text-sm font-medium mb-1">Nomor Telepon</div>
              <input id="akun-phone" className="w-full border rounded px-3 py-2" value={phone} onChange={e=>setPhone(e.target.value)} />
            </label>
          </div>
          <div className="flex items-center gap-4 mt-4">
            {avatar ? (<img src={avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border" />) : (<div className="w-12 h-12 rounded-full bg-gray-200" />)}
            <input aria-label="Upload avatar" type="file" accept="image/*" onChange={async (e)=>{ const file=e.target.files?.[0]; if (file) { const url=await fileToDataUrl(file); setAvatar(url) } }} />
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={()=>saveAccount({ name, email, phone, avatar })}>Simpan</button>
            <button className="px-4 py-2 rounded border" onClick={handleLogout}>Logout</button>
            <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={deleteAccount}>Hapus Akun</button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-3">Preview</div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              {avatar ? (<img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />) : (<div className="w-full h-full grid place-items-center text-xs text-gray-500">PP</div>)}
            </div>
            <div>
              <div className="font-medium">{name || 'Admin Instansi'}</div>
              <div className="text-sm text-gray-600">{email || 'admin@instansi.id'}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function ProfileInstitution() {
    const [id, setId] = useState(institution.id)
    const [name, setName] = useState(institution.name)
    const [logo, setLogo] = useState(institution.logo)
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-3">Profil Instansi</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm font-medium mb-1">ID Instansi</div>
              <input id="instansi-id" className="w-full border rounded px-3 py-2" value={id} onChange={e=>setId(e.target.value)} />
            </label>
            <label className="block">
              <div className="text-sm font-medium mb-1">Nama Instansi</div>
              <input id="instansi-nama" className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
            </label>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-16 h-16 rounded bg-gray-200 overflow-hidden">
              {logo ? (<img src={logo} alt="Logo" className="w-full h-full object-cover" />) : (<div className="w-full h-full grid place-items-center text-xs text-gray-500">Logo</div>)}
            </div>
            <input aria-label="Upload logo" type="file" accept="image/*" onChange={async (e)=>{ const file=e.target.files?.[0]; if (file) { const url=await fileToDataUrl(file); setLogo(url) } }} />
          </div>
          <button className="mt-4 px-4 py-2 rounded bg-blue-600 text-white" onClick={()=>saveInstitution({ id, name, logo })}>Simpan</button>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-3">Preview</div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden">
              {logo ? (<img src={logo} alt="Logo Preview" className="w-full h-full object-cover" />) : (<div className="w-full h-full grid place-items-center text-xs text-gray-500">Logo</div>)}
            </div>
            <div className="font-medium">{name || 'Instansi Anda'}</div>
          </div>
        </div>
      </div>
    )
  }

  function NavButton({ title, active, onClick, children }) {
    return (
      <button
        className={`w-12 h-12 grid place-items-center rounded-full ${active ? 'bg-gray-200' : 'hover:bg-gray-100'} transition`}
        title={title}
        onClick={onClick}
      >
        <div className={`${active ? 'text-gray-900' : 'text-gray-600'}`}>{children}</div>
      </button>
    )
  }

  return (
    <div className="h-screen flex">
      <Toast toasts={toasts} remove={(id)=>setToasts(prev=>prev.filter(t=>t.id!==id))} />
      <Modal open={modal.open} title={modal.title} onClose={closeModal} onConfirm={modal.onConfirm || (()=>{})} confirmText={modal.confirmText} danger={modal.danger}>{modal.content}</Modal>
      <aside className="w-16 bg-white border-r hidden md:flex flex-col items-center py-3">
        <div className="w-14 h-14 grid place-items-center">
          {institution.logo ? (
            <img src={institution.logo} alt="Logo" className="w-12 h-12" />
          ) : (
            <img src={Logo} alt="Logo" className="w-12 h-12" />
          )}
        </div>
        <div className="w-12 h-px bg-gray-200 my-3"></div>
        <nav className="flex-1 flex flex-col items-center gap-3">
          <NavButton title="Dashboard" active={tab===tabs[0]} onClick={()=>setTab(tabs[0])}><IconHome /></NavButton>
          <NavButton title="Kegiatan" active={tab===tabs[1]} onClick={()=>setTab(tabs[1])}><IconList /></NavButton>
          <NavButton title="Akun Tambahan" active={tab===tabs[2]} onClick={()=>setTab(tabs[2])}><IconUsers /></NavButton>
          <NavButton title="Profil Akun" active={tab===tabs[3]} onClick={()=>setTab(tabs[3])}><IconUser /></NavButton>
          <NavButton title="Profil Instansi" active={tab===tabs[4]} onClick={()=>setTab(tabs[4])}><IconBuilding /></NavButton>
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
            <div className="hidden md:block text-sm text-gray-600">{institution.name} › {tab}</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-800 text-white grid place-items-center text-sm overflow-hidden">
                {account.avatar ? (<img src={account.avatar} alt="Avatar" className="w-full h-full object-cover" />) : 'AI'}
              </div>
            </div>
          </div>
        </header>
        <section className="p-4 overflow-y-auto flex-1">
          {tab===tabs[0] && <Dashboard />}
          {tab===tabs[1] && <Activities />}
          {tab===tabs[2] && <Requests />}
          {tab===tabs[3] && <ProfileAccount />}
          {tab===tabs[4] && <ProfileInstitution />}
        </section>
      </main>
    </div>
  )
}

export default AdminInstansi
