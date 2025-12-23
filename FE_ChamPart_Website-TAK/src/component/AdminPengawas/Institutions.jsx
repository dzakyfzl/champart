import React, { useEffect, useState } from 'react'
import SkeletonRow from './SkeletonRow.jsx'

export default function Institutions() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [institutions, setInstitutions] = useState([])
  const [decisions, setDecisions] = useState({})
  const [passkeys, setPasskeys] = useState({})

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const token = localStorage.getItem('access_token') || ''
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        async function getJson(url) {
          const res = await fetch(url, { method: 'GET', headers })
          let j = null
          try { j = await res.json() } catch {}
          if (!res.ok) throw new Error(j?.message || `HTTP ${res.status}`)
          return j
        }
        const errors = []
        let list = []
        try {
          const baru = await getJson('/api/calon/instansi/baru/get')
          const arrBaru = Array.isArray(baru?.data) ? baru.data : []
          list = list.concat(arrBaru.map(it => ({
            id: it.idCalonInstansi || it.id ,
            kind: 'baru',
            nama: it.nama ?? '-',
            alamat: it.alamat ?? '-',
            jenis: it.jenis ?? '-',
            email: it.email ?? '-'
          })))
        } catch (e) { errors.push(e.message) }

        try {
          const edit = await getJson('/api/calon/instansi/edit/get')
          const arrEdit = Array.isArray(edit?.data) ? edit.data : []
          list = list.concat(arrEdit.map(it => ({
            id: it.idCalonInstansi || it.id ,
            kind: 'edit',
            nama: it.nama ?? '-',
            alamat: it.alamat ?? '-',
            jenis: it.jenis ?? '-',
            email: it.email ??  '-'
          })))
        } catch (e) { errors.push(e.message) }

        if (!cancelled) {
          setInstitutions(list)
          setError(list.length === 0 && errors.length ? errors.join(' | ') : '')
        }

        
      } catch (e) {
        if (!cancelled) setError(typeof e?.message === 'string' ? e.message : 'Gagal memuat data instansi')
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

      if (isApproved) {
        const urlApprove = item.kind === 'edit' ? '/api/approve/instansi/edit' : '/api/approve/instansi/baru'
        const rInst = await fetch(urlApprove, { method: 'POST', headers, body: JSON.stringify({ idCalonInstansi: item.id, isApproved: true }) })
        let jInst = null; try { jInst = await rInst.json() } catch {}
        if (!rInst.ok) throw new Error(jInst?.message || `HTTP ${rInst.status}`)
        if (item.kind !== 'edit') {
          const passkey = (passkeys[item.id] || '').trim()
          if (!passkey) throw new Error('Passkey wajib diisi untuk approve admin instansi')
          const idInstansiNum = Number(jInst?.idInstansi)
          if (!Number.isFinite(idInstansiNum) || idInstansiNum <= 0) throw new Error('idInstansi tidak valid')
          const rAdm = await fetch('/api/approve/admin-instansi', { method: 'POST', headers, body: JSON.stringify({ idInstansi: idInstansiNum, email: item.email, unique_character: passkey, isApproved: true }) })
          let jAdm = null; try { jAdm = await rAdm.json() } catch {}
          if (!rAdm.ok) throw new Error(jAdm?.message || `HTTP ${rAdm.status}`)
        }
      } else {
        const urlReject = item.kind === 'edit' ? '/api/approve/instansi/edit' : '/api/approve/instansi/baru'
        const rRej = await fetch(urlReject, { method: 'POST', headers, body: JSON.stringify({ idCalonInstansi: item.id, isApproved: false }) })
        let jRej = null; try { jRej = await rRej.json() } catch {}
        if (!rRej.ok) throw new Error(jRej?.message || `HTTP ${rRej.status}`)
      }

      setDecisions(prev => ({ ...prev, [item.id]: isApproved ? 'accepted' : 'rejected' }))
    } catch (e) {
      setError(typeof e?.message === 'string' ? e.message : 'Gagal mengirim keputusan')
    }
  }
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-4 font-semibold">Daftar Calon Instansi</div>
      {error && <div className="px-4 pb-2 text-sm text-red-700">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Nama Instansi</th>
              <th className="px-4 py-2 text-left">Alamat</th>
              <th className="px-4 py-2 text-left">Jenis Instansi</th>
              <th className="px-4 py-2 text-left">Email Pengaju</th>
              <th className="px-4 py-2 text-left">Passkey</th>
              <th className="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && [1,2,3].map(i => <SkeletonRow key={i} />)}
            {!loading && institutions.length === 0 && (<tr><td className="px-4 py-8 text-center text-gray-600" colSpan="6">Belum ada instansi</td></tr>)}
            {!loading && institutions.map((item, idx) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.nama}</td>
                <td className="px-4 py-3">{item.alamat}</td>
                <td className="px-4 py-3">{item.jenis}</td>
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">
                  <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Passkey admin"
                    value={passkeys[item.id] || ''}
                    onChange={e => setPasskeys(prev => ({ ...prev, [item.id]: e.target.value }))}
                    disabled={item.kind === 'edit'}
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
