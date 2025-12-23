import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProfileAccount({ fileToDataUrl }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleting, setDeleting] = useState(false)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [jabatan, setJabatan] = useState('')
  const [instansiName, setInstansiName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [original, setOriginal] = useState(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  function dataUrlToFile(dataUrl, filename){ const arr=dataUrl.split(','); const mime=(arr[0].match(/:(.*?);/)||[])[1]||'image/jpeg'; const bstr=atob(arr[1]); let n=bstr.length; const u8=new Uint8Array(n); while(n--) u8[n]=bstr.charCodeAt(n); return new File([u8], filename, { type: mime }) }
  async function compressImage(file){ return new Promise((resolve,reject)=>{ const url = URL.createObjectURL(file); const img = new Image(); img.onload = ()=>{ const maxDim=1024; const scale = Math.min(1, maxDim/Math.max(img.width, img.height)); const w = Math.round(img.width*scale); const h = Math.round(img.height*scale); const c=document.createElement('canvas'); c.width=w; c.height=h; const ctx=c.getContext('2d'); ctx.drawImage(img,0,0,w,h); let q=0.88; let out=c.toDataURL('image/jpeg', q); const base='data:image/jpeg;base64,'; function sizeOf(d){ return Math.ceil((d.length - base.length)*3/4) } while(sizeOf(out) > 900*1024 && q > 0.5){ q-=0.08; out=c.toDataURL('image/jpeg', q) } URL.revokeObjectURL(url); resolve({ dataUrl: out, file: dataUrlToFile(out, (file.name||'avatar').replace(/\.(png|jpeg|jpg|webp)$/i,'.jpg')) }) }; img.onerror=reject; img.src=url }) }

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      setSuccess('')
      try {
        const token = localStorage.getItem('access_token') || ''
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch('/api/account/get', { method: 'GET', headers })
        let j = null
        try { j = await res.json() } catch {}
        if (!res.ok) throw new Error(j?.message || `HTTP ${res.status}`)
        const u = j || {}
        if (!cancelled) {
          setUsername(String(u.username || ''))
          setEmail(String(u.email || ''))
          setJabatan(String(u.jabatan || ''))
          setInstansiName(String(u.nama_instansi || ''))
          const idLamp = Number(u.idLampiran)
          if (Number.isFinite(idLamp) && idLamp > 0) {
            try {
              const r = await fetch(`/api/file/get/${idLamp}`, { headers })
              const b = await r.blob()
              const url = URL.createObjectURL(b)
              if (!cancelled) setAvatar(url)
            } catch {}
          }
          setOriginal({ username: String(u.username||''), email: String(u.email||''), jabatan: String(u.jabatan||''), avatar: '' })
        }
      } catch (e) {
        if (!cancelled) setError(typeof e?.message === 'string' ? e.message : 'Gagal memuat profil akun')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  async function submitEdit() {
    try {
      setSaving(true)
      setError('')
      setSuccess('')
      const token = localStorage.getItem('access_token') || ''
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      const body = { username: String(username||'').trim(), email: String(email||'').trim(), password: String(confirmPassword||''), jabatan: String(jabatan||'').trim(), idInstansi: 0, passkey: '' }
      if (!body.username || !body.email || !body.password || !body.jabatan) throw new Error('Semua field wajib diisi')
      const res = await fetch('/api/account/admin-instansi/edit', { method: 'POST', headers, body: JSON.stringify(body) })
      let j = null
      try { j = await res.json() } catch {}
      if (!res.ok) throw new Error(j?.message || `HTTP ${res.status}`)
      if (j?.access_token) localStorage.setItem('access_token', j.access_token)
      if (j?.refresh_token) localStorage.setItem('refresh_token', j.refresh_token)
      const newToken = localStorage.getItem('access_token') || token
      if (avatarFile) {
        try {
          const fd = new FormData()
          fd.append('file', avatarFile)
          const rUp = await fetch('/api/file/upload/account', { method: 'POST', headers: { Authorization: `Bearer ${newToken}` }, body: fd })
          let jUp = null; try { jUp = await rUp.json() } catch {}
          if (rUp.ok) {
            const idLamp = Number(jUp?.idLampiran)
            if (Number.isFinite(idLamp) && idLamp > 0) {
              try {
                const rAcc = await fetch('/api/account/get', { method: 'GET', headers: newToken?{ Authorization: `Bearer ${newToken}` }:{} })
                let jAcc = null; try { jAcc = await rAcc.json() } catch {}
                if (rAcc.ok) {
                  const idNew = Number(jAcc?.idLampiran)
                  if (Number.isFinite(idNew) && idNew > 0) {
                    const r = await fetch(`/api/file/get/${idNew}`, { headers: newToken?{ Authorization: `Bearer ${newToken}` }:{} })
                    const b = await r.blob()
                    const url = URL.createObjectURL(b)
                    setAvatar(url)
                  }
                } else {
                  const r = await fetch(`/api/file/get/${idLamp}`, { headers: newToken?{ Authorization: `Bearer ${newToken}` }:{} })
                  const b = await r.blob()
                  const url = URL.createObjectURL(b)
                  setAvatar(url)
                }
              } catch {}
            }
          }
        } catch {}
      }
      setSuccess('Pengeditan akun berhasil')
      setIsEditing(false)
      setShowConfirm(false)
      setConfirmPassword('')
    } catch (e) {
      setError(typeof e?.message === 'string' ? e.message : 'Gagal menyimpan perubahan akun')
    } finally {
      setSaving(false)
    }
  }

  async function submitDelete() {
    try {
      setDeleting(true)
      setError('')
      setSuccess('')
      const token = localStorage.getItem('access_token') || ''
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      const body = { password: String(deletePassword || '') }
      if (!body.password) throw new Error('Password wajib diisi')
      const res = await fetch('/api/account/delete', { method: 'POST', headers, body: JSON.stringify(body) })
      let j = null
      try { j = await res.json() } catch {}
      if (!res.ok) throw new Error(j?.message || `HTTP ${res.status}`)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      alert('Penghapusan Akun Berhasil')
      navigate('/login')
    } catch (e) {
      setError(typeof e?.message === 'string' ? e.message : 'Gagal menghapus akun')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">Profil Akun</div>
          <div className="text-xs text-gray-500">Perubahan memerlukan konfirmasi password</div>
        </div>
        {loading && <div className="text-sm text-gray-600">Memuat…</div>}
        {error && <div className="text-sm text-red-700 mb-2">{error}</div>}
        {success && <div className="text-sm text-green-700 mb-2">{success}</div>}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="gap-4">
            <div className="text-sm font-medium mb-1">Foto Profil</div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border">
                {avatar ? (<img src={avatar} alt="Avatar" className="w-full h-full object-cover" />) : (<div className="w-full h-full grid place-items-center text-xs text-gray-500">PP</div>)}
              </div>
              <div>
                <div className="text-sm text-gray-700 mb-1">Upload Foto Profil</div>
          <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded border" disabled={!isEditing || saving} onClick={()=>fileInputRef.current?.click()}>Ubah Foto</button>
                {avatarFile && (<span className="text-xs text-gray-500 truncate max-w-[160px]">{avatarFile.name}</span>)}
              </div>
              <input ref={fileInputRef} aria-label="Upload avatar" type="file" accept="image/*" className="hidden" disabled={!isEditing || saving} onChange={async (e)=>{ const file=e.target.files?.[0]; if (file) { try { const { dataUrl, file: out } = await compressImage(file); setAvatarFile(out); setAvatar(dataUrl) } catch { setAvatarFile(file); const url=await fileToDataUrl(file); setAvatar(url) } } }} />
              </div>
            </div>
          </div>
          <label className="block">
            <div className="text-sm font-medium mb-1">Username</div>
            <input className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={username} onChange={e=>setUsername(e.target.value)} disabled={!isEditing || saving} />
          </label>
          <label className="block">
            <div className="text-sm font-medium mb-1">Email</div>
            <input type="email" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={email} onChange={e=>setEmail(e.target.value)} disabled={!isEditing || saving} />
          </label>
          <label className="block">
            <div className="text-sm font-medium mb-1">Jabatan</div>
            <input className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={jabatan} onChange={e=>setJabatan(e.target.value)} disabled={!isEditing || saving} />
          </label>
          <label className="block">
            <div className="text-sm font-medium mb-1">Nama Instansi</div>
            <input className="w-full border rounded px-3 py-2 bg-gray-100" value={instansiName} disabled />
          </label>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          {!isEditing && (
            <>
              <button className="px-4 py-2 rounded border border-red-600 text-red-600" onClick={()=>{ setShowDelete(true); setShowConfirm(false) }}>Hapus Akun</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={()=>{ setIsEditing(true); setOriginal({ username, email, jabatan, avatar }) }}>Edit</button>
            </>
          )}
          {isEditing && (
            <>
              <button className="px-4 py-2 rounded bg-blue-600 text-white" disabled={saving} onClick={()=>{ setShowConfirm(true) }}>Save</button>
              <button className="px-4 py-2 rounded border" disabled={saving} onClick={()=>{ setIsEditing(false); setShowConfirm(false); setConfirmPassword(''); if (original) { setUsername(original.username); setEmail(original.email); setJabatan(original.jabatan); setAvatar(original.avatar) } }}>Batal</button>
            </>
          )}
        </div>
        {showConfirm && (
          <div className="mt-4 border rounded p-3">
            <div className="text-sm font-medium mb-1">Konfirmasi Password</div>
            <input type="password" className="w-full border rounded px-3 py-2" placeholder="Masukkan password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} disabled={saving} />
            <div className="flex gap-2 mt-3">
              <button className="px-4 py-2 rounded bg-green-600 text-white" disabled={saving || !confirmPassword} onClick={submitEdit}>{saving ? 'Menyimpan…' : 'Konfirmasi'}</button>
              <button className="px-4 py-2 rounded border" disabled={saving} onClick={()=>{ setShowConfirm(false); setConfirmPassword('') }}>Batal</button>
            </div>
          </div>
        )}
        {showDelete && (
          <div className="mt-4 border rounded p-3">
            <div className="text-sm font-medium mb-1 text-red-700">Hapus Akun</div>
            <input type="password" className="w-full border rounded px-3 py-2" placeholder="Masukkan password" value={deletePassword} onChange={e=>setDeletePassword(e.target.value)} disabled={deleting} />
            <div className="flex gap-2 mt-3">
              <button className="px-4 py-2 rounded bg-red-600 text-white" disabled={deleting || !deletePassword} onClick={submitDelete}>{deleting ? 'Menghapus…' : 'Hapus'}</button>
              <button className="px-4 py-2 rounded border" disabled={deleting} onClick={()=>{ setShowDelete(false); setDeletePassword('') }}>Batal</button>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-4">Preview</div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border">
            {avatar ? (<img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />) : (<div className="w-full h-full grid place-items-center text-xs text-gray-500">PP</div>)}
          </div>
          <div>
            <div className="font-medium text-lg">{username || 'Admin Instansi'}</div>
            <div className="text-sm text-gray-600">{email || 'admin@instansi.id'}</div>
            <div className="text-xs text-gray-500">{jabatan || ''}{jabatan && instansiName ? ' · ' : ''}{instansiName || ''}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
