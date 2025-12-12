import React, { useEffect, useState } from 'react'

export default function ProfileInstitution() {
  const [nama, setNama] = useState('')
  const [jenis, setJenis] = useState('')
  const [alamat, setAlamat] = useState('')
  const [emailPengaju, setEmailPengaju] = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const [logoFile, setLogoFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function apiFetch(url, { method = 'GET', headers = {}, body, isForm = false } = {}) {
    const token = localStorage.getItem('access_token') || ''
    const hdrs = { ...(isForm ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers }
    const res = await fetch(`/api${url}`, { method, headers: hdrs, body: isForm ? body : (body ? JSON.stringify(body) : undefined) })
    let j = null
    try { j = await res.json() } catch {}
    if (!res.ok) throw new Error(j?.message || `HTTP ${res.status}`)
    return j
  }

  function dataUrlToFile(dataUrl, filename){ const arr=dataUrl.split(','); const mime=(arr[0].match(/:(.*?);/)||[])[1]||'image/jpeg'; const bstr=atob(arr[1]); let n=bstr.length; const u8=new Uint8Array(n); while(n--) u8[n]=bstr.charCodeAt(n); return new File([u8], filename, { type: mime }) }
  async function compressImage(file){ return new Promise((resolve,reject)=>{ const url = URL.createObjectURL(file); const img = new Image(); img.onload = ()=>{ const maxDim=1280; const scale = Math.min(1, maxDim/Math.max(img.width, img.height)); const w = Math.round(img.width*scale); const h = Math.round(img.height*scale); const c=document.createElement('canvas'); c.width=w; c.height=h; const ctx=c.getContext('2d'); ctx.drawImage(img,0,0,w,h); let q=0.85; let out=c.toDataURL('image/jpeg', q); const base='data:image/jpeg;base64,'; function sizeOf(d){ return Math.ceil((d.length - base.length)*3/4) } while(sizeOf(out) > 900*1024 && q > 0.5){ q-=0.1; out=c.toDataURL('image/jpeg', q) } URL.revokeObjectURL(url); resolve({ dataUrl: out, file: dataUrlToFile(out, (file.name||'logo').replace(/\.(png|jpeg|jpg)$/i,'.jpg')) }) }; img.onerror=reject; img.src=url }) }

  async function loadInstansi(){
    setLoading(true); setError('')
    try {
      const info = await apiFetch('/account/admin-instansi/get-instansi', { method: 'GET' })
      const data = info?.data || {}
      setNama(String(data.nama||''))
      setJenis(String(data.jenis||''))
      setAlamat(String(data.alamat||''))
      const idLampiran = Number(data.idLampiran)
      if (Number.isFinite(idLampiran) && idLampiran>0){
        const token = localStorage.getItem('access_token') || ''
        try {
          const r = await fetch(`/api/file/get/${idLampiran}`, { headers: token?{ Authorization: `Bearer ${token}` }:{} })
          const blob = await r.blob()
          const url = URL.createObjectURL(blob)
          setLogoPreview(url)
        } catch {}
      }
    } catch (e) {
      setError(typeof e?.message === 'string' ? e.message : 'Gagal memuat instansi')
    } finally { setLoading(false) }
  }

  async function uploadLogo(){
    if (!logoFile) return
    const fd = new FormData()
    fd.append('file', logoFile)
    await apiFetch('/file/upload/instansi', { method: 'POST', isForm: true, body: fd })
  }

  async function submitEdit(){
    try {
      setSaving(true); setError('')
      await apiFetch('/instansi/edit', { method: 'POST', body: { nama: (nama||'').trim(), jenis: (jenis||'').trim(), alamat: (alamat||'').trim(), email_pengaju: (emailPengaju||'').trim() } })
      if (logoFile) {
        await uploadLogo()
      }
    } catch (e) {
      setError(typeof e?.message === 'string' ? e.message : 'Gagal menyimpan perubahan instansi')
    } finally { setSaving(false) }
  }

  useEffect(()=>{ loadInstansi() }, [])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-3">Profil Instansi</div>
        {error && (<div className="mb-2 text-sm text-red-700">{error}</div>)}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded bg-gray-200 overflow-hidden border">
              {logoPreview ? (<img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />) : (<div className="w-full h-full grid place-items-center text-xs text-gray-500">Logo</div>)}
            </div>
            <input aria-label="Logo instansi" type="file" accept="image/*" onChange={async e=>{ const f=e.target.files?.[0]; if (!f){ setLogoFile(null); return } try { const { dataUrl, file } = await compressImage(f); if (file.size > 900*1024){ setError('Maksimal ukuran 1MB'); setLogoFile(null); return } setLogoFile(file); setLogoPreview(dataUrl) } catch { setError('Gagal memproses gambar'); setLogoFile(null) } }} />
          </div>
          <label className="block">
            <div className="text-sm font-medium mb-1">Nama Instansi</div>
            <input className="w-full border rounded px-3 py-2" value={nama} onChange={e=>setNama(e.target.value)} />
          </label>
          <label className="block">
            <div className="text-sm font-medium mb-1">Jenis</div>
            <select className="w-full border rounded px-3 py-2" value={jenis} onChange={e=>setJenis(e.target.value)}>
                <option value="">Pilih Jenis Instansi</option>
                <option value="DPM">DPM</option>
                <option value="BEM">BEM</option>
                <option value="UKM">UKM</option>
                <option value="HIMA">HIMA</option>
            </select>
          </label>
          <label className="block">
            <div className="text-sm font-medium mb-1">Alamat</div>
            <input className="w-full border rounded px-3 py-2" value={alamat} onChange={e=>setAlamat(e.target.value)} />
          </label>
          <label className="block">
            <div className="text-sm font-medium mb-1">Email Pengaju</div>
            <input type="email" className="w-full border rounded px-3 py-2" placeholder="email@instansi.id" value={emailPengaju} onChange={e=>setEmailPengaju(e.target.value)} />
          </label>
          <div className="flex items-center gap-2">
            <button className={`px-4 py-2 rounded text-white ${saving?'bg-blue-400':'bg-blue-600'}`} disabled={saving} onClick={submitEdit}>{saving?'Menyimpan…':'Ajukan Edit Instansi'}</button>
            <button className="px-4 py-2 rounded border" disabled={loading} onClick={loadInstansi}>Muat Ulang</button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-3">Preview</div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden border">
            {logoPreview ? (<img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />) : (<div className="w-full h-full grid place-items-center text-xs text-gray-500">Logo</div>)}
          </div>
          <div className="font-medium">{nama || 'Instansi Anda'}</div>
        </div>
        <div className="text-sm text-gray-600 mt-2">{jenis || '-'}</div>
        <div className="text-sm text-gray-600">{alamat || '-'}</div>
      </div>
    </div>
  )
}
