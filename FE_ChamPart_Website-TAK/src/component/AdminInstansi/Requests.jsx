import React from 'react'
import Badge from './Badge.jsx'

export default function Requests({ requests, setRequests, pushToast, openModal, closeModal }) {
  function addRequest() {
    let data = { email: '' }
    const Form = () => (
      <div className="space-y-3">
        <input type="email" className="w-full border rounded px-3 py-2" placeholder="Email calon admin instansi" onChange={e => data.email = e.target.value} />
      </div>
    )
    openModal('Ajukan Akun Admin Instansi', <Form />, async () => {
      const email = (data.email || '').trim()
      if (!email) { pushToast('Email wajib diisi', 'error'); return }
      try {
        const token = localStorage.getItem('access_token') || ''
        const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        const res = await fetch('/api/account/admin-instansi/create-new', { method: 'POST', headers, body: JSON.stringify({ email }) })
        let j = null
        try { j = await res.json() } catch {}
        if (!res.ok) throw new Error(j?.message || `HTTP ${res.status}`)
        const id = 'RQ-' + Date.now()
        setRequests(prev => [{ id, email, status: 'Submitted' }, ...prev])
        pushToast(j?.message || 'Pengajuan akun dikirim')
        try {
          const r2 = await fetch('/api/calon/admin-instansi/get', { method: 'GET', headers })
          await r2.text()
        } catch {}
        closeModal()
      } catch (e) {
        pushToast(typeof e?.message === 'string' ? e.message : 'Gagal mengajukan akun', 'error')
      }
    })
  }
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
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.length === 0 && (<tr><td className="px-4 py-8 text-center text-gray-600" colSpan="2">Belum ada pengajuan</td></tr>)}
              {requests.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3"><Badge label={'Menunggu'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
