import React, { useEffect, useState } from 'react'
import Logo from '../../assets/svg/champart-logo.svg'

function Toast({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`rounded-lg shadow-lg px-4 py-3 text-sm ${t.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`}
          onClick={() => remove(t.id)}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}

function Modal({ open, title, children, onClose, onConfirm, confirmText = 'Konfirmasi', danger }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
          <div className="px-6 pt-6 text-lg font-semibold">{title}</div>
          <div className="px-6 py-4 text-sm">{children}</div>
          <div className="px-6 pb-6 flex justify-end gap-3">
            <button className="px-4 py-2 rounded border border-gray-300" onClick={onClose}>Batal</button>
            <button className={`px-4 py-2 rounded text-white ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`} onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Drawer({ open, title, children, onClose }) {
  return (
    <div className={`fixed inset-0 z-30 ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
      <div className={`absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="font-semibold">{title}</div>
          <button className="text-sm text-gray-600 hover:text-gray-900" onClick={onClose}>Tutup</button>
        </div>
        <div className="p-6 text-sm overflow-y-auto h-[calc(100%-64px)]">{children}</div>
      </div>
    </div>
  )
}

function Switch({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <span className="text-sm">{label}</span>
      <span className={`relative inline-flex items-center w-12 h-6 rounded-full ${checked ? 'bg-green-500' : 'bg-neutral-600'}`} onClick={() => onChange(!checked)}>
        <span className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}></span>
      </span>
    </label>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="bg-white dark:bg-neutral-700 rounded-xl shadow p-4 text-center">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}

function RatingScale({ value, onChange }) {
  const colors = ['bg-red-600','bg-red-500','bg-orange-500','bg-orange-400','bg-yellow-400','bg-yellow-300','bg-lime-400','bg-green-500','bg-green-600','bg-green-700']
  return (
    <div className="flex flex-wrap gap-2">
      {[...Array(10)].map((_, i) => {
        const n = i + 1
        const active = value === n
        return (
          <button key={n} className={`w-10 h-10 rounded-full text-sm font-semibold text-white ${colors[i]} ${active ? 'ring-4 ring-green-300' : ''}`} onClick={() => onChange(n)}>{n}</button>
        )
      })}
    </div>
  )
}

function Badge({ label }) {
  const map = {
    Menunggu: 'bg-yellow-100 text-yellow-800',
    Disetujui: 'bg-green-100 text-green-800',
    Ditolak: 'bg-red-100 text-red-800',
    Aktif: 'bg-blue-100 text-blue-800',
    Kadaluarsa: 'bg-gray-200 text-gray-700',
    Dinonaktifkan: 'bg-gray-200 text-gray-700'
  }
  const cls = map[label] || 'bg-gray-100 text-gray-800'
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>
}

/* ---------------------------
   Icons (SVG) - simple set
   --------------------------- */

function IconHome() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5l9-7 9 7" />
      <path d="M5.5 10.5v8.5h13v-8.5" />
      <path d="M10 19v-5h4v5" />
    </svg>
  )
}
function IconUser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7.5" r="3" />
      <path d="M5 20c0-4 14-4 14 0" />
    </svg>
  )
}
function IconBuilding() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <rect x="11" y="15" width="2" height="6" />
    </svg>
  )
}
function IconKey() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="12" r="3.5" />
      <path d="M11.5 12h8" />
      <path d="M17 12v3" />
      <path d="M19 12v2" />
    </svg>
  )
}
function IconPulse() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13h4l2-6 4 12 2-6h6" />
    </svg>
  )
}
function IconCog() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v3" />
      <path d="M12 17v3" />
      <path d="M4 12h3" />
      <path d="M17 12h3" />
      <path d="M6 6l2 2" />
      <path d="M16 16l2 2" />
      <path d="M18 6l-2 2" />
      <path d="M6 18l2-2" />
    </svg>
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

/* ---------------------------
   API helper
   --------------------------- */

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

/* ---------------------------
   Main component
   --------------------------- */

function AdminPengawas() {
  const defaultSettings = {
    moderation: { requireReasonOnReject: true, requireNoteOnApprove: false, allowBulkApprove: false, bulkLimit: 20, autoApproveLowPriority: false, slaDays: 7, rejectionTemplates: 'Dokumen tidak lengkap, Jadwal tidak sesuai, Informasi kurang jelas' },
    secret: { defaultExpiryDays: 7, defaultMaxUses: 1, prefix: 'CHP', maskCodes: false, autoRevokeOnInstitutionReject: true },
    notifications: { email: true, digest: 'weekly', escalateSLA: true },
    security: { sessionTimeoutMinutes: 30, twoFA: false, impersonation: false },
    display: { theme: 'light', tableDensity: 'comfortable', defaultTab: 'Dashboard' }
  }

  const tabs = ['Dashboard', 'Kegiatan', 'Instansi', 'Secret Code', 'Audit Log', 'Pengaturan']
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('champart_admin_settings')
      return raw ? JSON.parse(raw) : defaultSettings
    } catch {
      return defaultSettings
    }
  })

  const initialTab = tabs.includes(settings.display?.defaultTab) ? settings.display.defaultTab : tabs[0]
  const [tab, setTab] = useState(initialTab)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toasts, setToasts] = useState([])
  const [drawer, setDrawer] = useState({ open: false, title: '', content: null })
  const [modal, setModal] = useState({ open: false, title: '', content: null, danger: false, confirmText: 'Konfirmasi', onConfirm: null })
  const [activities, setActivities] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [secretCodes, setSecretCodes] = useState([])
  const [auditLog, setAuditLog] = useState([])
  const [dark, setDark] = useState(() => settings.display?.theme === 'dark')

  useEffect(() => {
    try { localStorage.setItem('champart_admin_settings', JSON.stringify(settings)) } catch {}
  }, [settings])

  useEffect(() => {
    let cancelled = false
    const API_BASE = window.CHAMPART_API_BASE_URL || ''

    async function loadInitial() {
      try {
        setLoading(true)
        if (API_BASE) {
          const [acts, insts] = await Promise.all([apiFetch('/kegiatan?status=Menunggu'), apiFetch('/instansi?status=Menunggu')])
          if (!cancelled) {
            setActivities(Array.isArray(acts) ? acts : [])
            setInstitutions(Array.isArray(insts) ? insts : [])
            setError('')
          }
        } else {
          if (!cancelled) {
            setActivities([
              { id: 'K-001', nama: 'Pelatihan Pemuda', instansi: 'Dinas Pemuda', tanggal: '2025-11-19', pemohon: 'Admin A', status: 'Menunggu', prioritas: 'Sedang', lokasi: 'Aula Kecamatan', deskripsi: 'Pelatihan softskill untuk pemuda' },
              { id: 'K-002', nama: 'Lomba Kebersihan', instansi: 'Kelurahan Mawar', tanggal: '2025-11-22', pemohon: 'Admin B', status: 'Menunggu', prioritas: 'Tinggi', lokasi: 'RW 02', deskripsi: 'Kegiatan lomba kebersihan lingkungan' }
            ])
            setInstitutions([
              { id: 'I-101', nama: 'SMK Negeri 1', jenis: 'Pendidikan', tanggalDaftar: '2025-11-10', status: 'Menunggu', dokumen: 'Berkas Registrasi.pdf' },
              { id: 'I-102', nama: 'Karang Taruna Melati', jenis: 'Komunitas', tanggalDaftar: '2025-11-12', status: 'Menunggu', dokumen: 'Surat Keterangan.pdf' }
            ])
          }
        }
      } catch (e) {
        if (!cancelled) setError('Gagal memuat data awal')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadInitial()

    // SSE & polling fallback only when API_BASE configured
    if (API_BASE) {
      const AUTH_TOKEN = localStorage.getItem('champart_token') || ''
      let es
      try {
        const url = `${API_BASE}/events${AUTH_TOKEN ? `?token=${encodeURIComponent(AUTH_TOKEN)}` : ''}`
        es = new EventSource(url)
        es.onmessage = (ev) => {
          try {
            const data = JSON.parse(ev.data)
            if (data.type === 'kegiatan.status_changed') {
              setActivities(prev => prev.map(a => a.id === data.id ? { ...a, status: data.status } : a))
              addAudit('Update Status Kegiatan', data.id, data.status)
            } else if (data.type === 'instansi.status_changed') {
              setInstitutions(prev => prev.map(i => i.id === data.id ? { ...i, status: data.status } : i))
              addAudit('Update Status Instansi', data.id, data.status)
            }
          } catch {}
        }
      } catch {}
      const timer = setInterval(async () => {
        try {
          const acts = await apiFetch('/kegiatan?status=Menunggu')
          const insts = await apiFetch('/instansi?status=Menunggu')
          setActivities(Array.isArray(acts) ? acts : [])
          setInstitutions(Array.isArray(insts) ? insts : [])
        } catch {}
      }, 15000)
      return () => { if (es) es.close(); clearInterval(timer); cancelled = true }
    }

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const isDark = settings.display?.theme === 'dark' || dark
    document.body.classList.toggle('theme-dark', !!isDark)
  }, [settings.display?.theme, dark])

  /* ---------------------------
     Small helpers
     --------------------------- */

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

  function addAudit(action, target, extra) {
    const time = new Date().toLocaleString('id-ID')
    setAuditLog(prev => [{ waktu: time, aksi: action, target, detail: extra || '' }, ...prev])
  }

  /* ---------------------------
     Actions for Kegiatan / Instansi
     --------------------------- */

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
          const prev = activities
          setActivities(p => p.map(a => a.id === item.id ? { ...a, status: 'Disetujui' } : a))
          try {
            const API_BASE = window.CHAMPART_API_BASE_URL || ''
            if (API_BASE) await apiFetch(`/kegiatan/${encodeURIComponent(item.id)}/approve`, { method: 'POST', body: { note } })
            addAudit('Setujui Kegiatan', item.id, note)
            pushToast('Kegiatan disetujui')
          } catch (e) {
            setActivities(prev)
            pushToast('Gagal menyetujui di server', 'error')
          }
          closeConfirm()
        }
      })
    } else {
      openConfirm({
        title: 'Setujui Kegiatan',
        content: <div>Anda akan menyetujui <b>{item.nama}</b> oleh <b>{item.instansi}</b>.</div>,
        onConfirm: async () => {
          const prev = activities
          setActivities(p => p.map(a => a.id === item.id ? { ...a, status: 'Disetujui' } : a))
          try {
            const API_BASE = window.CHAMPART_API_BASE_URL || ''
            if (API_BASE) await apiFetch(`/kegiatan/${encodeURIComponent(item.id)}/approve`, { method: 'POST' })
            addAudit('Setujui Kegiatan', item.id)
            pushToast('Kegiatan disetujui')
          } catch (e) {
            setActivities(prev)
            pushToast('Gagal menyetujui di server', 'error')
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
        <input className="w-full border rounded px-3 py-2" placeholder="Alasan penolakan" onChange={e => alasan = e.target.value} />
      </div>
    )
    openConfirm({
      title: 'Tolak Kegiatan',
      content: <Content />,
      danger: true,
      confirmText: 'Tolak',
      onConfirm: async () => {
        if (settings.moderation.requireReasonOnReject && !alasan.trim()) { pushToast('Alasan penolakan wajib', 'error'); return }
        const prev = activities
        setActivities(p => p.map(a => a.id === item.id ? { ...a, status: 'Ditolak' } : a))
        try {
          const API_BASE = window.CHAMPART_API_BASE_URL || ''
          if (API_BASE) await apiFetch(`/kegiatan/${encodeURIComponent(item.id)}/reject`, { method: 'POST', body: { reason: alasan } })
          addAudit('Tolak Kegiatan', item.id, alasan)
          pushToast('Kegiatan ditolak')
        } catch (e) {
          setActivities(prev)
          pushToast('Gagal menolak di server', 'error')
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
        try {
          const API_BASE = window.CHAMPART_API_BASE_URL || ''
          if (API_BASE) await apiFetch(`/instansi/${encodeURIComponent(item.id)}/approve`, { method: 'POST' })
          addAudit('Setujui Instansi', item.id)
          pushToast('Instansi disetujui')
        } catch (e) {
          setInstitutions(prev)
          pushToast('Gagal menyetujui instansi di server', 'error')
        }
        closeConfirm()
      }
    })
  }

  function openInstitutionDoc(item) {
    openDrawer('Dokumen Instansi', (
      <div className="space-y-3">
        <div className="text-sm">{item.dokumen}</div>
        <div className="rounded border p-4 bg-gray-50">Pratinjau dokumen tidak tersedia, gunakan unduhan dari server pada implementasi API.</div>
      </div>
    ))
  }

  function rejectInstitution(item) {
    let alasan = ''
    const Content = () => (
      <div className="space-y-3">
        <div>Masukkan alasan penolakan untuk instansi <b>{item.nama}</b>.</div>
        <input className="w-full border rounded px-3 py-2" placeholder="Alasan penolakan" onChange={e => alasan = e.target.value} />
      </div>
    )
    openConfirm({
      title: 'Tolak Instansi',
      content: <Content />,
      danger: true,
      confirmText: 'Tolak',
      onConfirm: async () => {
        if (settings.moderation.requireReasonOnReject && !alasan.trim()) { pushToast('Alasan penolakan wajib', 'error'); return }
        const prev = institutions
        setInstitutions(p => p.map(i => i.id === item.id ? { ...i, status: 'Ditolak' } : i))
        try {
          const API_BASE = window.CHAMPART_API_BASE_URL || ''
          if (API_BASE) await apiFetch(`/instansi/${encodeURIComponent(item.id)}/reject`, { method: 'POST', body: { reason: alasan } })
          if (settings.secret.autoRevokeOnInstitutionReject) {
            setSecretCodes(prevCodes => prevCodes.map(e => (e.instansiId === item.id && e.status === 'Aktif') ? { ...e, status: 'Dinonaktifkan' } : e))
          }
          addAudit('Tolak Instansi', item.id, alasan)
          pushToast('Instansi ditolak')
        } catch (e) {
          setInstitutions(prev)
          pushToast('Gagal menolak instansi di server', 'error')
        }
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
    addAudit('Generate Secret Code', instansiId, code)
    pushToast('Secret code dibuat')
    return entry
  }

  function revokeCode(entry) {
    setSecretCodes(prev => prev.map(e => e.id === entry.id ? { ...e, status: 'Dinonaktifkan' } : e))
    addAudit('Revoke Secret Code', entry.instansiId, entry.kode)
    pushToast('Secret code dinonaktifkan')
  }

  function copyCode(text) {
    if (navigator.clipboard) {
      const masked = settings.secret.maskCodes ? text.replace(/.(?=.{4})/g, '*') : text
      navigator.clipboard.writeText(text).then(() => pushToast(settings.secret.maskCodes ? `Kode tersalin (${masked})` : 'Kode disalin'))
    }
  }

  function generateSecretCode() {
    const expiryDays = Number(settings.secret?.defaultExpiryDays || 7)
    const maxUses = Number(settings.secret?.defaultMaxUses || 1)
    const prefix = settings.secret?.prefix || 'CHP'
    const code = prefix + '-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    const item = { code, status: 'Aktif', maxUses, used: 0, expiresAt: new Date(Date.now() + expiryDays*24*3600*1000).toISOString().slice(0,10) }
    setSecretCodes(prev => [item, ...prev])
    addAudit('Generate Secret Code', code)
    pushToast('Kode dibuat')
  }

  function revokeSecretCode(item) {
    openConfirm({
      title: 'Cabut Kode',
      content: <div>Cabut kode <b>{item.code}</b>?</div>,
      danger: true,
      confirmText: 'Cabut',
      onConfirm: () => {
        setSecretCodes(prev => prev.map(s => s.code === item.code ? { ...s, status: 'Dinonaktifkan' } : s))
        addAudit('Revoke Secret Code', item.code)
        closeConfirm()
      }
    })
  }

  function handleLogout() {
    pushToast('Logout')
    setTimeout(() => { window.location.href = '/login' }, 600)
  }

  function Dashboard() {
    const menungguKegiatan = activities.filter(a => a.status === 'Menunggu').length
    const menungguInstansi = institutions.filter(i => i.status === 'Menunggu').length
    const kodeAktif = secretCodes.filter(s => s.status === 'Aktif').length
    const kodeKadaluarsa = secretCodes.filter(s => s.status === 'Kadaluarsa').length
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-600">Kegiatan menunggu</div>
            <div className="text-2xl font-semibold">{menungguKegiatan}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-600">Instansi menunggu</div>
            <div className="text-2xl font-semibold">{menungguInstansi}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-600">Kode aktif</div>
            <div className="text-2xl font-semibold">{kodeAktif}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-600">Kode kadaluarsa</div>
            <div className="text-2xl font-semibold">{kodeKadaluarsa}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-2">Aktivitas terbaru</div>
          <div className="text-sm text-gray-600">Tindakan terakhir akan tampil di sini.</div>
        </div>
      </div>
    )
  }

  function SkeletonRow() {
    return (
      <tr>
        <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
        <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
        <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
        <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
        <td className="px-4 py-3"><div className="h-8 bg-gray-200 rounded animate-pulse"></div></td>
      </tr>
    )
  }

  function Activities() {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow">
          <div className="p-4 flex items-center justify-between">
            <div className="font-semibold">Daftar Kegiatan</div>
            <div className="flex gap-2">
              <input className="border rounded px-3 py-2 text-sm" placeholder="Cari nama kegiatan" />
              <select className="border rounded px-3 py-2 text-sm">
                <option>Status</option>
                <option>Menunggu</option>
                <option>Disetujui</option>
                <option>Ditolak</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Nama</th>
                  <th className="px-4 py-2 text-left">Instansi</th>
                  <th className="px-4 py-2 text-left">Tanggal</th>
                  <th className="px-4 py-2 text-left">Pemohon</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Prioritas</th>
                  <th className="px-4 py-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading && [1,2,3].map(i => <SkeletonRow key={i} />)}
                {!loading && activities.length === 0 && (
                  <tr><td className="px-4 py-8 text-center text-gray-600" colSpan="7">Belum ada kegiatan</td></tr>
                )}
                {!loading && activities.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.nama}</td>
                    <td className="px-4 py-3">{item.instansi}</td>
                    <td className="px-4 py-3">{item.tanggal}</td>
                    <td className="px-4 py-3">{item.pemohon}</td>
                    <td className="px-4 py-3"><Badge label={item.status} /></td>
                    <td className="px-4 py-3">{item.prioritas}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-1 rounded border" onClick={() => openActivityDetail(item)}>Lihat Detail</button>
                        <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => approveActivity(item)} disabled={item.status !== 'Menunggu'}>Setujui</button>
                        <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => rejectActivity(item)} disabled={item.status !== 'Menunggu'}>Tolak</button>
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

  function Institutions() {
    return (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow">
            <div className="p-4 flex items-center justify-between">
              <div className="font-semibold">Daftar Instansi</div>
              <div className="flex gap-2">
                <input className="border rounded px-3 py-2 text-sm" placeholder="Cari nama instansi" />
                <select className="border rounded px-3 py-2 text-sm"><option>Status</option><option>Menunggu</option><option>Disetujui</option><option>Ditolak</option></select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Nama</th>
                    <th className="px-4 py-2 text-left">Jenis</th>
                    <th className="px-4 py-2 text-left">Tanggal Daftar</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Dokumen</th>
                    <th className="px-4 py-2 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading && [1,2,3].map(i => <SkeletonRow key={i} />)}
                  {!loading && institutions.length === 0 && (<tr><td className="px-4 py-8 text-center text-gray-600" colSpan="6">Belum ada instansi</td></tr>)}
                  {!loading && institutions.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{item.nama}</td>
                      <td className="px-4 py-3">{item.jenis}</td>
                      <td className="px-4 py-3">{item.tanggalDaftar}</td>
                      <td className="px-4 py-3"><Badge label={item.status} /></td>
                      <td className="px-4 py-3">
                        <button className="px-3 py-1 rounded border" onClick={() => openInstitutionDoc(item)}>Lihat</button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => approveInstitution(item)} disabled={item.status !== 'Menunggu'}>Setujui</button>
                          <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => rejectInstitution(item)} disabled={item.status !== 'Menunggu'}>Tolak</button>
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

  function SecretCodes() {
    const [form, setForm] = useState({ instansiId: institutions[0]?.id || '', instansiName: institutions[0]?.nama || '', expiryDays: settings.secret.defaultExpiryDays, maxUses: settings.secret.defaultMaxUses, note: '' })

    useEffect(() => {
      const i = institutions.find(x => x.id === form.instansiId)
      if (i) setForm(f => ({ ...f, instansiName: i.nama }))
    }, [form.instansiId, institutions])

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4 lg:col-span-1">
          <div className="font-semibold mb-3">Generate Secret Code</div>
          <div className="space-y-3">
            <label className="block text-sm">Instansi</label>
            <select className="w-full border rounded px-3 py-2" value={form.instansiId} onChange={e => setForm({ ...form, instansiId: e.target.value })}>
              {institutions.map(i => <option key={i.id} value={i.id}>{i.nama}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Masa berlaku (hari)</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={form.expiryDays} onChange={e => setForm({ ...form, expiryDays: parseInt(e.target.value || '0') })} />
              </div>
              <div>
                <label className="block text-sm">Maks penggunaan</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: parseInt(e.target.value || '0') })} />
              </div>
            </div>
            <label className="block text-sm">Catatan</label>
            <textarea className="w-full border rounded px-3 py-2" rows="3" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}></textarea>
            <button className="w-full px-4 py-2 rounded bg-blue-600 text-white" onClick={() => generateCode({ instansiId: form.instansiId, instansiName: form.instansiName, expiryDays: form.expiryDays, maxUses: form.maxUses, note: form.note })}>Generate</button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold mb-2">Riwayat Secret Code</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Kode</th>
                    <th className="px-4 py-2 text-left">Instansi</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Maks</th>
                    <th className="px-4 py-2 text-left">Terpakai</th>
                    <th className="px-4 py-2 text-left">Kadaluarsa</th>
                    <th className="px-4 py-2 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {secretCodes.length === 0 && (<tr><td className="px-4 py-8 text-center text-gray-600" colSpan="7">Belum ada kode</td></tr>)}
                  {secretCodes.map(item => (
                    <tr key={item.id || item.code || item.kode} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{settings.secret?.maskCodes ? (item.kode || item.code || '').replace(/.(?=.{4})/g,'*') : (item.kode || item.code || '')}</td>
                      <td className="px-4 py-3">{item.instansiName || item.instansiId || '-'}</td>
                      <td className="px-4 py-3"><Badge label={item.status} /></td>
                      <td className="px-4 py-3">{item.maksimal ?? item.maxUses ?? '-'}</td>
                      <td className="px-4 py-3">{item.penggunaan ?? item.used ?? 0}</td>
                      <td className="px-4 py-3">{item.kadaluarsa ?? item.expiresAt ?? '-'}</td>
                      <td className="px-4 py-3"><button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => (item.code ? revokeSecretCode(item) : revokeCode(item))} disabled={(item.status || item.status === undefined) && item.status !== 'Aktif'}>Cabut</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function Audit() {
    return (
      <div className="space-y-4">
        <div className="font-semibold text-lg">Audit Log</div>
        <div className="bg-white rounded-xl shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Waktu</th>
                  <th className="px-4 py-2 text-left">Aksi</th>
                  <th className="px-4 py-2 text-left">Target</th>
                  <th className="px-4 py-2 text-left">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {auditLog.length === 0 && (<tr><td className="px-4 py-8 text-center text-gray-600" colSpan="4">Tidak ada catatan</td></tr>)}
                {auditLog.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{row.waktu}</td>
                    <td className="px-4 py-3">{row.aksi}</td>
                    <td className="px-4 py-3">{row.target}</td>
                    <td className="px-4 py-3">{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  function Settings() {
    const [local, setLocal] = useState(settings)

    function save() {
      setSettings(local)
      pushToast('Pengaturan disimpan')
    }

    function onReset() {
      setLocal(defaultSettings)
      pushToast('Pengaturan dikembalikan ke default')
    }

    return (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold mb-3">Moderasi</div>
            <div className="space-y-3">
              <Switch checked={local.moderation.requireReasonOnReject} onChange={v => setLocal(prev => ({ ...prev, moderation: { ...prev.moderation, requireReasonOnReject: v } }))} label="Wajib alasan saat tolak" />
              <Switch checked={local.moderation.requireNoteOnApprove} onChange={v => setLocal(prev => ({ ...prev, moderation: { ...prev.moderation, requireNoteOnApprove: v } }))} label="Minta catatan saat setujui" />
              <div>
                <label className="block text-sm">Template penolakan (pisah koma)</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={local.moderation.rejectionTemplates} onChange={e => setLocal(prev => ({ ...prev, moderation: { ...prev.moderation, rejectionTemplates: e.target.value } }))} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold mb-3">Secret Code</div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <input className="border rounded px-3 py-2" value={local.secret.defaultExpiryDays} onChange={e => setLocal(prev => ({ ...prev, secret: { ...prev.secret, defaultExpiryDays: Number(e.target.value) } }))} placeholder="Hari kadaluarsa" />
                <input className="border rounded px-3 py-2" value={local.secret.defaultMaxUses} onChange={e => setLocal(prev => ({ ...prev, secret: { ...prev.secret, defaultMaxUses: Number(e.target.value) } }))} placeholder="Maks pemakaian" />
                <input className="border rounded px-3 py-2" value={local.secret.prefix} onChange={e => setLocal(prev => ({ ...prev, secret: { ...prev.secret, prefix: e.target.value } }))} placeholder="Prefix" />
              </div>
              <Switch checked={local.secret.maskCodes} onChange={v => setLocal(prev => ({ ...prev, secret: { ...prev.secret, maskCodes: v } }))} label="Sembunyikan kode" />
              <Switch checked={local.secret.autoRevokeOnInstitutionReject} onChange={v => setLocal(prev => ({ ...prev, secret: { ...prev.secret, autoRevokeOnInstitutionReject: v } }))} label="Cabut otomatis saat instansi ditolak" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold mb-3">Notifikasi</div>
            <div className="space-y-3">
              <Switch checked={local.notifications.email} onChange={v => setLocal(prev => ({ ...prev, notifications: { ...prev.notifications, email: v } }))} label="Email" />
              <div className="flex items-center gap-3">
                <span className="text-sm">Digest</span>
                <select className="border rounded px-3 py-2" value={local.notifications.digest} onChange={e => setLocal(prev => ({ ...prev, notifications: { ...prev.notifications, digest: e.target.value } }))}>
                  <option value="daily">daily</option>
                  <option value="weekly">weekly</option>
                  <option value="monthly">monthly</option>
                </select>
              </div>
              <Switch checked={local.notifications.escalateSLA} onChange={v => setLocal(prev => ({ ...prev, notifications: { ...prev.notifications, escalateSLA: v } }))} label="Eskalasi SLA" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold mb-3">Tampilan & Preferensi</div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm">Tema</span>
                <select className="border rounded px-3 py-2 w-32" value={local.display.theme} onChange={e => setLocal(prev => ({ ...prev, display: { ...prev.display, theme: e.target.value } }))}>
                  <option value="light">light</option>
                  <option value="dark">dark</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm">Kepadatan tabel</span>
                <select className="border rounded px-3 py-2 w-40" value={local.display.tableDensity} onChange={e => setLocal(prev => ({ ...prev, display: { ...prev.display, tableDensity: e.target.value } }))}>
                  <option value="comfortable">comfortable</option>
                  <option value="compact">compact</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm">Tab default</span>
                <select className="border rounded px-3 py-2 w-40" value={local.display.defaultTab} onChange={e => setLocal(prev => ({ ...prev, display: { ...prev.display, defaultTab: e.target.value } }))}>
                  {tabs.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={save}>Simpan</button>
              <button className="px-4 py-2 rounded border" onClick={onReset}>Kembalikan Default</button>
            </div>
          </div>
        </div>
      </div>
    )
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
          <NavButton title="Kegiatan" active={tab===tabs[1]} onClick={()=>setTab(tabs[1])}><IconHome /></NavButton>
          <NavButton title="Instansi" active={tab===tabs[2]} onClick={()=>setTab(tabs[2])}><IconBuilding /></NavButton>
          <NavButton title="Secret Code" active={tab===tabs[3]} onClick={()=>setTab(tabs[3])}><IconKey /></NavButton>
          <NavButton title="Audit Log" active={tab===tabs[4]} onClick={()=>setTab(tabs[4])}><IconPulse /></NavButton>
          <NavButton title="Pengaturan" active={tab===tabs[5]} onClick={()=>setTab(tabs[5])}><IconCog /></NavButton>
        </nav>
        <div className="mt-auto">
          <NavButton title="Logout" active={false} onClick={handleLogout}><IconUser /></NavButton>
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
          {tab===tabs[0] && <Dashboard />}
          {tab===tabs[1] && <Activities />}
          {tab===tabs[2] && <Institutions />}
          {tab===tabs[3] && <SecretCodes />}
          {tab===tabs[4] && <Audit />}
          {tab===tabs[5] && <Settings />}
        </section>
      </main>
    </div>
  )
}

export default AdminPengawas
