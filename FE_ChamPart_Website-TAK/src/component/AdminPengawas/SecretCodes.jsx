import React, { useState } from 'react'

export default function SecretCodes() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [email, setEmail] = useState('')
  const [passkey, setPasskey] = useState('')

  async function ajukanPengawas() {
    try {
      setError('')
      setSuccess('')
      const e = String(email || '').trim()
      const p = String(passkey || '').trim()
      if (!e) throw new Error('Email wajib diisi')
      if (!p) throw new Error('Passkey wajib diisi')
      const token = localStorage.getItem('access_token') || ''
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      setLoading(true)
      // Coba kirim dengan isApproved:true, fallback tanpa isApproved jika ditolak validasi
      const body1 = { email: e, unique_character: p, isApproved: true }
      let res = await fetch('/api/approve/admin-pengawas', { method: 'POST', headers, body: JSON.stringify(body1) })
      let j = null
      try { j = await res.json() } catch {}
      if (!res.ok) {
        const body2 = { email: e, unique_character: p }
        res = await fetch('/api/approve/admin-pengawas', { method: 'POST', headers, body: JSON.stringify(body2) })
        try { j = await res.json() } catch {}
        if (!res.ok) throw new Error(j?.message || `HTTP ${res.status}`)
      }
      setSuccess(j?.message || 'Berhasil mengajukan passkey admin pengawas')
      setPasskey('')
      setEmail('')
    } catch (e) {
      setError(typeof e?.message === 'string' ? e.message : 'Gagal mengirim persetujuan admin pengawas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="font-semibold mb-3">Approve Admin Pengawas</div>
      {error && <div className="mb-3 text-sm text-red-700">{error}</div>}
      {success && <div className="mb-3 text-sm text-green-700">{success}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm">Email Pengaju</label>
          <input className="w-full border rounded px-3 py-2" placeholder="Masukkan email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Passkey</label>
          <input className="w-full border rounded px-3 py-2" placeholder="Masukkan passkey" value={passkey} onChange={e => setPasskey(e.target.value)} />
        </div>
      </div>
      <div className="mt-3">
        <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={ajukanPengawas} disabled={loading}>Ajukan</button>
      </div>
    </div>
  )
}
