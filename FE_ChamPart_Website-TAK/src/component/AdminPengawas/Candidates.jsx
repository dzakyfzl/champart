import React, { useEffect, useState } from 'react'
import SkeletonRow from './SkeletonRow.jsx'

export default function Candidates() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [candidates, setCandidates] = useState([])
  const [decisions, setDecisions] = useState({})
  const [passkeys, setPasskeys] = useState({})

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const token = localStorage.getItem('access_token') || ''
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch('/api/calon/admin-instansi/get', { method: 'GET', headers })
        let data = null
        try { data = await res.json() } catch {}
        if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`)
        const arr = Array.isArray(data?.data) ? data.data : []
        const list = arr.map(it => ({
          id: it.idCalonAdminInstansi || it.id || '-',
          email: it.email || '-',
          idInstansi: it.idInstansi || '',
          namaInstansi: it.namaInstansi || '-',
        }))
        if (!cancelled) setCandidates(list)
        if (!cancelled) setError('')
      } catch (e) {
        if (!cancelled) setError(typeof e?.message === 'string' ? e.message : 'Gagal memuat data calon admin instansi')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  async function submitDecision(item, isApproved) {
    try {
      setError('')
      const token = localStorage.getItem('access_token') || ''
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      const idInstansiNum = Number(item.idInstansi)
      if (!Number.isFinite(idInstansiNum) || idInstansiNum <= 0) throw new Error('idInstansi tidak valid')
      const passkey = (passkeys[item.id] || '').trim()
      if (isApproved && !passkey) throw new Error('Passkey wajib diisi untuk approve admin instansi')
      const body = { idInstansi: idInstansiNum, email: item.email, unique_character: passkey, isApproved }
      const res = await fetch('/api/approve/admin-instansi', { method: 'POST', headers, body: JSON.stringify(body) })
      let j = null
      try { j = await res.json() } catch {}
      if (!res.ok) throw new Error(j?.message || `HTTP ${res.status}`)
      setDecisions(prev => ({ ...prev, [item.id]: isApproved ? 'accepted' : 'rejected' }))
    } catch (e) {
      setError(typeof e?.message === 'string' ? e.message : 'Gagal mengirim keputusan admin instansi')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-4 font-semibold">Daftar Calon Admin Instansi</div>
      {error && <div className="px-4 pb-2 text-sm text-red-700">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Nama Instansi</th>
               <th className="px-4 py-2 text-left">Passkey</th>
              <th className="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && [1,2,3].map(i => <SkeletonRow key={i} />)}
            {!loading && candidates.length === 0 && (<tr><td className="px-4 py-8 text-center text-gray-600" colSpan="4">Belum ada calon admin</td></tr>)}
            {!loading && candidates.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">{item.namaInstansi}</td>
                <td className="px-4 py-3">
                   <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Passkey admin"
                    value={passkeys[item.id] || ''}
                    onChange={e => setPasskeys(prev => ({ ...prev, [item.id]: e.target.value }))}
                  />
                </td>
                <td className="px-4 py-3">
                  {decisions[item.id]
                    ? (<span className={`px-2 py-1 rounded text-xs font-semibold ${decisions[item.id]==='accepted'?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{decisions[item.id]==='accepted'?'Diterima':'Ditolak'}</span>)
                    : (
                      <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => submitDecision(item, true)}>Terima</button>
                        <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => submitDecision(item, false)}>Tolak</button>
                      </div>
                    )
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
