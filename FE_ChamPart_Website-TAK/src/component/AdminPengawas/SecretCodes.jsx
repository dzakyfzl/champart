import React, { useEffect, useState } from 'react'

export default function SecretCodes() {
  const [candLoading, setCandLoading] = useState(false)
  const [candError, setCandError] = useState('')
  const [candidates, setCandidates] = useState([])
  const [selected, setSelected] = useState('')
  const [passkey, setPasskey] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadCandidates() {
      setCandLoading(true)
      try {
        const token = localStorage.getItem('access_token') || ''
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch('/api/calon/admin-instansi/get', { method: 'GET', headers })
        let data = null
        try { data = await res.json() } catch {}
        if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`)
        const arr = Array.isArray(data?.data) ? data.data : []
        const list = arr.map(it => ({ id: it.idCalonAdminInstansi || it.id || Math.random().toString(36).slice(2), email: it.email || '-', idInstansi: it.idInstansi || '', namaInstansi: it.namaInstansi || '-' }))
        if (!cancelled) {
          setCandidates(list)
          setSelected(list[0]?.id || '')
          setCandError('')
        }
      } catch (e) {
        if (!cancelled) setCandError(typeof e?.message === 'string' ? e.message : 'Gagal memuat calon admin instansi')
      } finally {
        if (!cancelled) setCandLoading(false)
      }
    }
    loadCandidates()
    return () => { cancelled = true }
  }, [])

  async function approveAdmin(isApproved) {
    try {
      const cand = candidates.find(c => c.id === selected)
      if (!cand) throw new Error('Calon admin tidak dipilih')
      if (!passkey || !passkey.trim()) throw new Error('Passkey wajib diisi')
      const token = localStorage.getItem('access_token') || ''
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      const idInstansiNum = Number(cand.idInstansi)
      if (!Number.isFinite(idInstansiNum) || idInstansiNum <= 0) throw new Error('idInstansi tidak valid')
      const res = await fetch('/api/approve/admin-instansi', { method: 'POST', headers, body: JSON.stringify({ idInstansi: idInstansiNum, email: cand.email, unique_character: passkey, isApproved }) })
      let j = null
      try { j = await res.json() } catch {}
      if (!res.ok) throw new Error(j?.message || `HTTP ${res.status}`)
    } catch (e) {
      setCandError(typeof e?.message === 'string' ? e.message : 'Gagal mengirim persetujuan admin instansi')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-3">Approve Admin Instansi</div>
        {candError && <div className="mb-3 text-sm text-red-700">{candError}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm">Calon Admin</label>
            <select className="w-full border rounded px-3 py-2" value={selected} onChange={e => setSelected(e.target.value)} disabled={candLoading}>
              {candidates.map(c => <option key={c.id} value={c.id}>{c.namaInstansi} — {c.email}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm">Email Pengaju</label>
            <input className="w-full border rounded px-3 py-2" value={(candidates.find(c => c.id === selected)?.email) || ''} readOnly />
          </div>
          <div>
            <label className="block text-sm">Passkey</label>
            <input className="w-full border rounded px-3 py-2" placeholder="Masukkan passkey" value={passkey} onChange={e => setPasskey(e.target.value)} />
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={() => approveAdmin(true)} disabled={candLoading}>Terima</button>
          <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={() => approveAdmin(false)} disabled={candLoading}>Tolak</button>
        </div>
    </div>
  )
}
