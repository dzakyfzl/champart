import React, { useMemo, useState, useEffect } from 'react'
import Badge from './Badge.jsx'

export default function Activities({ activities, setActivities, pushToast, openModal, closeModal }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [submittingId, setSubmittingId] = useState(null)
  const [kegiatan, setKegiatan] = useState(['Seminar', 'Webinar', 'Bootcamp', 'Lomba'])
  let setAddSaving = null
  let setEditSaving = null
  let setDeleting = null

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return activities.filter(a => {
      const okName = q ? (String(a.name || '').toLowerCase().includes(q) || String(a.description || '').toLowerCase().includes(q)) : true
      const okStatus = statusFilter === 'Semua' ? true : String(a.status || '').toLowerCase() === statusFilter.toLowerCase()
      return okName && okStatus
    })
  }, [activities, query, statusFilter])
  async function apiFetch(url, { method = 'GET', headers = {}, body, isForm = false } = {}) {
    const token = localStorage.getItem('access_token') || ''
    const hdrs = { ...(isForm ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers }
    const res = await fetch(`/api${url}`, { method, headers: hdrs, body: isForm ? body : (body ? JSON.stringify(body) : undefined) })
    let j = null
    try { j = await res.json() } catch {}
    if (!res.ok) throw new Error(j?.message || `HTTP ${res.status}`)
    return j
  }

  async function uploadLampiran(file) {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/file/upload/kegiatan', { method: 'POST', body: fd, headers: { Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` } })
    let j = null
    try { j = await res.json() } catch {}
    if (!res.ok) throw new Error(j?.message || `HTTP ${res.status}`)
    const idLampiran = j?.idLampiran
    if (!idLampiran) throw new Error('idLampiran tidak dikembalikan')
    return Number(idLampiran)
  }

  function dataUrlToFile(dataUrl, filename){ const arr=dataUrl.split(','); const mime=(arr[0].match(/:(.*?);/)||[])[1]||'image/jpeg'; const bstr=atob(arr[1]); let n=bstr.length; const u8=new Uint8Array(n); while(n--) u8[n]=bstr.charCodeAt(n); return new File([u8], filename, { type: mime }) }
  async function compressImage(file){ return new Promise((resolve,reject)=>{ const url = URL.createObjectURL(file); const img = new Image(); img.onload = ()=>{ const maxDim=1280; const scale = Math.min(1, maxDim/Math.max(img.width, img.height)); const w = Math.round(img.width*scale); const h = Math.round(img.height*scale); const c=document.createElement('canvas'); c.width=w; c.height=h; const ctx=c.getContext('2d'); ctx.drawImage(img,0,0,w,h); let q=0.85; let out=c.toDataURL('image/jpeg', q); const base='data:image/jpeg;base64,'; function sizeOf(d){ return Math.ceil((d.length - base.length)*3/4) } while(sizeOf(out) > 900*1024 && q > 0.5){ q-=0.1; out=c.toDataURL('image/jpeg', q) } URL.revokeObjectURL(url); resolve({ dataUrl: out, file: dataUrlToFile(out, (file.name||'lampiran').replace(/\.(png|jpeg|jpg)$/i,'.jpg')) }) }; img.onerror=reject; img.src=url }) }

  function formatWIB(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    const parts = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d)
    const map = {}
    for (const p of parts) map[p.type] = p.value
    return `${map.day}/${map.month}/${map.year} in ${map.hour}.${map.minute} WIB`
  }

  async function getInstansiInfo() {
    const j = await apiFetch('/account/admin-instansi/get-instansi', { method: 'GET' })
    return j?.data || {}
  }

  function addActivity() {
    let data = { name: '', waktu: '', location: '', description: '', nominal: 0, takWajib: false, file: null, status: 'Draft', minatIds: [], bakatIds: [] }
    const Form = () => {
      const [preview, setPreview] = useState('')
      const [saving, setSaving] = useState(false)
      const [minatOptions, setMinatOptions] = useState([])
      const [bakatOptions, setBakatOptions] = useState([])
      const [selectedMinat, setSelectedMinat] = useState(['','',''])
      const [selectedBakat, setSelectedBakat] = useState(['','',''])
      const [instansi, setInstansi] = useState('')
      setAddSaving = setSaving
      useEffect(()=>{(async()=>{ try { const m = await apiFetch('/minat/all', { method: 'GET' }); setMinatOptions(Array.isArray(m?.data)?m.data:[]); const b = await apiFetch('/bakat/all', { method: 'GET' }); setBakatOptions(Array.isArray(b?.data)?b.data:[]) } catch {} })()},[])
      useEffect(()=>{(async()=>{ try { const info = await getInstansiInfo(); const nama = info?.nama || ''; setInstansi(nama); data.location = nama } catch {} })()},[])
      function updateMinat(i, v){ setSelectedMinat(prev=>{ const next=[...prev]; next[i]=v; data.minatIds = Array.from(new Set(next.filter(Boolean).map(x=>Number(x)))); return next }) }
      function updateBakat(i, v){ setSelectedBakat(prev=>{ const next=[...prev]; next[i]=v; data.bakatIds = Array.from(new Set(next.filter(Boolean).map(x=>Number(x)))); return next }) }
      return (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm font-medium mb-1">Nama kegiatan</div>
              <input className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="Contoh: Seminar Nasional" onChange={e => data.name = e.target.value} />
            </label>
            <label className="block">
              <div className="text-sm font-medium mb-1">Waktu kegiatan</div>
              <input type="datetime-local" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" onChange={e => data.waktu = e.target.value} />
            </label>
          </div>
          <label className="block">
            <div className="text-sm font-medium mb-1">Jenis kegiatan</div>
            <select className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" onChange={e => data.jenis = e.target.value}>
              <option value="">Pilih…</option>
              {kegiatan.map(k => (<option key={k} value={k}>{k}</option>))}
            </select>
          </label>
          <label className="block">
            <div className="text-sm font-medium mb-1">Instansi</div>
            <input className="w-full border rounded px-3 py-2 bg-gray-100" value={instansi} disabled />
          </label>
          <label className="block">
            <div className="text-sm font-medium mb-1">Deskripsi</div>
            <textarea className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" rows="4" placeholder="Ringkasan kegiatan, narasumber, agenda, dsb." onChange={e => data.description = e.target.value}></textarea>
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="text-sm font-medium mb-1">Minat Kegiatan</div>
              {selectedMinat.map((val, idx)=> (
                <label key={idx} className="block">
                  <select className="w-full border rounded px-3 py-2" value={val} onChange={e=>updateMinat(idx, e.target.value)}>
                    <option value="">Pilih…</option>
                    {minatOptions.map(m => (<option key={m.idMinat} value={m.idMinat}>{m.nama}</option>))}
                  </select>
                </label>
              ))}
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium mb-1">Bakat Kegiatan</div>
              {selectedBakat.map((val, idx)=> (
                <label key={idx} className="block">
                  <select className="w-full border rounded px-3 py-2" value={val} onChange={e=>updateBakat(idx, e.target.value)}>
                    <option value="">Pilih…</option>
                    {bakatOptions.map(b => (<option key={b.idBakat} value={b.idBakat}>{b.nama}</option>))}
                  </select>
                </label>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm font-medium mb-1">Nominal TAK</div>
              <input className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="number" min="0" placeholder="0" onChange={e => data.nominal = Number(e.target.value) || 0} />
            </label>
            <label className="flex items-center gap-2 text-sm mt-7">
              <input type="checkbox" className="rounded" onChange={e => data.takWajib = e.target.checked} />
              <span>TAK wajib</span>
            </label>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Lampiran</div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded bg-gray-100 overflow-hidden border">
                {preview ? (<img src={preview} alt="Preview" className="w-full h-full object-cover" />) : (<div className="w-full h-full grid place-items-center text-xs text-gray-500">Preview</div>)}
              </div>
              <input aria-label="Lampiran kegiatan" type="file" accept="image/*" onChange={async e => { const f = e.target.files?.[0]; if (!f) { data.file = null; setPreview(''); return } const typeOk = String(f.type||'').startsWith('image/'); if (!typeOk) { pushToast('File harus gambar', 'error'); data.file = null; return } try { const { dataUrl, file: comp } = await compressImage(f); if (comp.size > 900 * 1024) { pushToast('Maksimal ukuran 1MB', 'error'); data.file = null; return } data.file = comp; setPreview(dataUrl) } catch { pushToast('Gagal memproses gambar', 'error'); data.file = null } }} />
            </div>
          </div>
          {saving && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 animate-spin"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
              <span>Menyimpan...</span>
            </div>
          )}
        </div>
      )
    }
    openModal('Tambah Kegiatan', <Form />, async () => {
      setAddSaving?.(true)
      const nama = (data.name || '').trim()
      const jenis = (data.jenis || '').trim()
      const deskripsi = (data.description || '').trim()
      if (!nama || !jenis || !deskripsi || !data.waktu) { pushToast('Nama, jenis, deskripsi, dan waktu wajib diisi', 'error'); return }
      const isoWaktu = (() => { try { const v = data.waktu; if (!v) return ''; let t = v.includes('T') ? v : `${v}T00:00:00`; const parts = t.split('T'); const time = parts[1] || ''; if (/^\d{2}:\d{2}$/.test(time)) t = `${parts[0]}T${time}:00`; return t } catch { return '' } })()
      if (!isoWaktu) { pushToast('Format waktu salah', 'error'); return }
      try {
        let idLampiranNum = null
        let deferLampiran = false
        if (data.file) {
          const info = await getInstansiInfo()
          const fallback = Number(info?.idLampiran)
          if (Number.isFinite(fallback) && fallback > 0) {
            idLampiranNum = fallback
            deferLampiran = true
          } else {
            idLampiranNum = await uploadLampiran(data.file)
          }
        } else {
          const info = await getInstansiInfo()
          if (Number(info?.idLampiran)) idLampiranNum = Number(info.idLampiran)
        }
        if (!Number.isFinite(idLampiranNum)) { pushToast('Lampiran wajib diisi', 'error'); return }
        const infoInstansi = await getInstansiInfo()
        await apiFetch('/kegiatan/upload', { method: 'POST', body: { nama, jenis, deskripsi, waktu: isoWaktu, nominal_TAK: Number(data.nominal) || 0, TAK_wajib: !!data.takWajib, idInstansi: Number(infoInstansi?.idInstansi)||0, idLampiran: idLampiranNum, minat_id: Array.isArray(data.minatIds)?data.minatIds:[], bakat_id: Array.isArray(data.bakatIds)?data.bakatIds:[] } })
        const id = 'AK-' + (Date.now())
        setActivities(prev => [{ id, serverId: null, name: nama, jenis, date: isoWaktu.slice(0, 10), waktu: isoWaktu, location: data.location, description: deskripsi, status: 'Menunggu' }, ...prev])
        try {
          const info = await getInstansiInfo()
          const instansiNama = info?.nama || ''
          const list = await apiFetch('/kegiatan/all', { method: 'GET' })
          const match = Array.isArray(list) ? list.find(k => (k.nama || '') === nama && String(k.waktu || '').startsWith(isoWaktu.slice(0, 10)) && (k.nama_instansi || '') === instansiNama) : null
          if (match && Number.isFinite(Number(match.idKegiatan))) {
            const sid = Number(match.idKegiatan)
            setActivities(prev => prev.map(a => a.id === id ? { ...a, serverId: sid } : a))
            if (deferLampiran && data.file) {
              try {
                const newId = await uploadLampiran(data.file)
                const body = { nama, deskripsi, waktu: isoWaktu, nominal_TAK: Number(data.nominal)||0, TAK_wajib: !!data.takWajib, idLampiran: newId }
                if (jenis) body.jenis = jenis
                await apiFetch(`/kegiatan/edit/${encodeURIComponent(sid)}`, { method: 'POST', body })
              } catch {}
            }
          }
        } catch {}
        pushToast('Kegiatan diupload (status: Menunggu)')
        closeModal()
      } catch (e) {
        pushToast(typeof e?.message === 'string' ? e.message : 'Gagal mengupload kegiatan', 'error')
      } finally {
        setAddSaving?.(false)
      }
    })
  }

  function editActivity(item) {
    let data = { ...item, nominal: item.nominal || 0, takWajib: !!item.takWajib, waktu: item.waktu || (item.date ? `${item.date}T00:00:00` : ''), file: null, minatIds: Array.isArray(item.minatIds)?item.minatIds:[], bakatIds: Array.isArray(item.bakatIds)?item.bakatIds:[] }
    const Form = () => {
      const [preview, setPreview] = useState('')
      const [saving, setSaving] = useState(false)
      const [instansi, setInstansi] = useState('')
      const [minatOptions, setMinatOptions] = useState([])
      const [bakatOptions, setBakatOptions] = useState([])
      const [selectedMinat, setSelectedMinat] = useState(()=>{ const arr=Array.isArray(data.minatIds)?data.minatIds.slice(0,3):[]; return [String(arr[0]||''), String(arr[1]||''), String(arr[2]||'')] })
      const [selectedBakat, setSelectedBakat] = useState(()=>{ const arr=Array.isArray(data.bakatIds)?data.bakatIds.slice(0,3):[]; return [String(arr[0]||''), String(arr[1]||''), String(arr[2]||'')] })
      setEditSaving = setSaving
      useEffect(() => { (async () => { try { const info = await getInstansiInfo(); const nama = info?.nama || ''; setInstansi(nama); data.location = nama } catch {} })() }, [])
      useEffect(()=>{(async()=>{ try { const m = await apiFetch('/minat/all', { method: 'GET' }); setMinatOptions(Array.isArray(m?.data)?m.data:[]); const b = await apiFetch('/bakat/all', { method: 'GET' }); setBakatOptions(Array.isArray(b?.data)?b.data:[]) } catch {} })()},[])
      function updateMinat(i, v){ setSelectedMinat(prev=>{ const next=[...prev]; next[i]=v; data.minatIds = Array.from(new Set(next.filter(Boolean).map(x=>Number(x)))); return next }) }
      function updateBakat(i, v){ setSelectedBakat(prev=>{ const next=[...prev]; next[i]=v; data.bakatIds = Array.from(new Set(next.filter(Boolean).map(x=>Number(x)))); return next }) }
      return (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm font-medium mb-1">Nama kegiatan</div>
              <input className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue={item.name} onChange={e => data.name = e.target.value} />
            </label>
            <label className="block">
              <div className="text-sm font-medium mb-1">Waktu kegiatan</div>
              <input type="datetime-local" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue={item.date ? `${item.date}T00:00:00` : ''} onChange={e => data.waktu = e.target.value} />
            </label>
          </div>
          <label className="block">
            <div className="text-sm font-medium mb-1">Jenis kegiatan</div>
            <input className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue={item.jenis || ''} onChange={e => data.jenis = e.target.value} />
          </label>
          <label className="block">
            <div className="text-sm font-medium mb-1">Instansi</div>
            <input className="w-full border rounded px-3 py-2 bg-gray-100" value={instansi} disabled />
          </label>
          <label className="block">
            <div className="text-sm font-medium mb-1">Deskripsi</div>
            <textarea className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="4" defaultValue={item.description} onChange={e => data.description = e.target.value}></textarea>
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="text-sm font-medium mb-1">Minat Kegiatan</div>
              {selectedMinat.map((val, idx)=> (
                <label key={idx} className="block">
                  <select className="w-full border rounded px-3 py-2" value={val} onChange={e=>updateMinat(idx, e.target.value)}>
                    <option value="">Pilih…</option>
                    {minatOptions.map(m => (<option key={m.idMinat} value={m.idMinat}>{m.nama}</option>))}
                  </select>
                </label>
              ))}
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium mb-1">Bakat Kegiatan</div>
              {selectedBakat.map((val, idx)=> (
                <label key={idx} className="block">
                  <select className="w-full border rounded px-3 py-2" value={val} onChange={e=>updateBakat(idx, e.target.value)}>
                    <option value="">Pilih…</option>
                    {bakatOptions.map(b => (<option key={b.idBakat} value={b.idBakat}>{b.nama}</option>))}
                  </select>
                </label>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm font-medium mb-1">Nominal TAK</div>
              <input className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" type="number" min="0" defaultValue={item.nominal || 0} onChange={e => data.nominal = Number(e.target.value) || 0} />
            </label>
            <label className="flex items-center gap-2 text-sm mt-7">
              <input type="checkbox" className="rounded" defaultChecked={!!item.takWajib} onChange={e => data.takWajib = e.target.checked} />
              <span>TAK wajib</span>
            </label>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Lampiran</div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded bg-gray-100 overflow-hidden border">
                {preview ? (<img src={preview} alt="Preview" className="w-full h-full object-cover" />) : (<div className="w-full h-full grid place-items-center text-xs text-gray-500">Preview</div>)}
              </div>
              <input aria-label="Lampiran kegiatan" type="file" accept="image/*" onChange={async e => { const f = e.target.files?.[0]; if (!f) { data.file = null; setPreview(''); return } const typeOk = String(f.type||'').startsWith('image/'); if (!typeOk) { pushToast('File harus gambar', 'error'); data.file = null; return } try { const { dataUrl, file: comp } = await compressImage(f); if (comp.size > 900 * 1024) { pushToast('Maksimal ukuran 1MB', 'error'); data.file = null; return } data.file = comp; setPreview(dataUrl) } catch { pushToast('Gagal memproses gambar', 'error'); data.file = null } }} />
            </div>
          </div>
          {saving && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 animate-spin"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
              <span>Menyimpan...</span>
            </div>
          )}
        </div>
      )
    }
    openModal('Edit Kegiatan', <Form />, async () => {
      setEditSaving?.(true)
      setActivities(prev => prev.map(a => a.id === item.id ? { ...a, name: data.name, jenis: data.jenis || a.jenis, date: (data.waktu || '').slice(0,10), waktu: data.waktu || a.waktu, location: data.location, description: data.description } : a))
      try {
        if (Number.isFinite(item.serverId)) {
          let idLampiranNum = null
          if (data.file) idLampiranNum = await uploadLampiran(data.file)
          const isoWaktu = (() => { const v = data.waktu; if (!v) return ''; let t = v.includes('T') ? v : `${v}T00:00:00`; const parts = t.split('T'); const time = parts[1] || ''; if (/^\d{2}:\d{2}$/.test(time)) t = `${parts[0]}T${time}:00`; return t })()
          if (!isoWaktu) throw new Error('Format waktu salah')
          const body = { nama: (data.name||'').trim(), deskripsi: (data.description||'').trim(), waktu: isoWaktu, nominal_TAK: Number(data.nominal)||0, TAK_wajib: !!data.takWajib, idLampiran: idLampiranNum ?? item.idLampiran ?? 0 }
          if ((data.jenis||'').trim()) body.jenis = (data.jenis||'').trim()
          if (Array.isArray(data.minatIds)) body.minat_id = data.minatIds
          if (Array.isArray(data.bakatIds)) body.bakat_id = data.bakatIds
          await apiFetch(`/kegiatan/edit/${encodeURIComponent(item.serverId)}`, { method: 'POST', body })
          setActivities(prev => prev.map(a => a.id === item.id ? { ...a, date: isoWaktu.slice(0,10), waktu: isoWaktu } : a))
        }
        pushToast('Kegiatan diperbarui')
        closeModal()
      } catch (e) {
        pushToast(typeof e?.message === 'string' ? e.message : 'Gagal mengedit kegiatan', 'error')
      } finally {
        setEditSaving?.(false)
      }
    })
  }

  function deleteActivity(item) {
    const Confirm = () => {
      const [del, setDel] = useState(false)
      setDeleting = setDel
      return (
        <div className="flex items-center gap-2">
          <span>Hapus kegiatan <b>{item.name}</b>?</span>
          {del && (
            <span className="flex items-center gap-2 text-sm text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 animate-spin"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
              <span>Menghapus...</span>
            </span>
          )}
        </div>
      )
    }
    openModal('Hapus Kegiatan', <Confirm />, async () => {
      setDeleting?.(true)
      const prev = activities
      setActivities(p => p.filter(a => a.id !== item.id))
      try {
        if (Number.isFinite(item.serverId)) await apiFetch(`/kegiatan/${encodeURIComponent(item.serverId)}/delete`, { method: 'POST' })
        pushToast('Kegiatan dihapus')
      } catch (e) {
        setActivities(prev)
        pushToast(typeof e?.message === 'string' ? e.message : 'Gagal menghapus kegiatan', 'error')
      } finally {
        setDeleting?.(false)
        closeModal()
      }
    }, 'Hapus', true)
  }

  async function submitActivity(item) {
    const prev = activities
    setSubmittingId(item.id)
    setActivities(p => p.map(a => a.id === item.id ? { ...a, status: 'Menunggu' } : a))
    try { pushToast('Kegiatan diajukan') } catch (e) { setActivities(prev); pushToast('Gagal mengajukan kegiatan', 'error') } finally { setSubmittingId(null) }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="font-semibold text-lg">Kegiatan Instansi</div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                className="w-64 border rounded pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Cari nama atau deskripsi"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
            </div>
            <div className="flex items-center gap-1">
              {['Semua','Draft','Menunggu','Disetujui','Ditolak'].map(s => (
                <button
                  key={s}
                  className={`px-3 py-1 rounded-full text-xs ${statusFilter===s?'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}
                  onClick={() => setStatusFilter(s)}
                >{s}</button>
              ))}
            </div>
            <button className="ml-auto px-4 py-2 rounded bg-blue-600 text-white" onClick={addActivity}>Tambah Kegiatan</button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-left">Instansi</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {visible.length === 0 && (<tr><td className="px-4 py-8 text-center text-gray-600" colSpan="5">Belum ada kegiatan</td></tr>)}
              {visible.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.waktu ? formatWIB(item.waktu) : (item.date ? formatWIB(`${item.date}T00:00:00`) : '-')}</td>
                  <td className="px-4 py-3">{item.location || '-'}</td>
                  <td className="px-4 py-3"><Badge label={item.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1 rounded border hover:bg-gray-50" onClick={() => editActivity(item)}>Edit</button>
                      <button className={`px-3 py-1 rounded text-white ${item.status==='Draft'?'bg-green-600 hover:bg-green-700':'bg-gray-300'} ${submittingId===item.id?'opacity-80 cursor-not-allowed':''}`} onClick={() => submitActivity(item)} disabled={item.status !== 'Draft' || submittingId===item.id}>
                        {submittingId===item.id ? (
                          <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 animate-spin"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
                            <span>Memproses</span>
                          </span>
                        ) : (
                          'Ajukan'
                        )}
                      </button>
                      <button className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700" onClick={() => deleteActivity(item)}>Hapus</button>
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
