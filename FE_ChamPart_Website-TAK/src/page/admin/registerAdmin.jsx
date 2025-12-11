import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function RegisterAdmin() {
  const [role, setRole] = useState('Admin Instansi')
  const [listInstansi, setListInstansi] = useState([])
  const [formData, setFormData] = useState({ username:'', email:'', password:'', jabatan:'', idInstansi:'', passkey:'' })
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    async function loadInstansi() {
      try {
        const token = localStorage.getItem('access_token') || ''
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await fetch('/api/instansi/get-all', { method: 'GET', headers })
        let j = null
        try { j = await res.json() } catch {}
        const arr = Array.isArray(j?.data) ? j.data : []
        const list = arr.map(it => ({ id: it.idInstansi, nama: it.nama }))
        if (!cancelled) setListInstansi(list)
      } catch (err) {
        console.log(err)
      }
    }
    loadInstansi()
    return () => { cancelled = true }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!formData.username || !formData.email || !formData.password || !formData.jabatan) {
        throw new Error('Semua field wajib diisi')
      }
      if (!formData.passkey || !formData.passkey.trim()) {
        throw new Error('Passkey wajib diisi')
      }
      let body = null
      if (role === 'Admin Pengawas') {
        body = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          jabatan: formData.jabatan,
          passkey: formData.passkey
        }
      } else {
        const idNum = Number(formData.idInstansi)
        if (!Number.isFinite(idNum) || idNum <= 0) throw new Error('Pilih instansi terlebih dahulu')
        body = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          jabatan: formData.jabatan,
          idInstansi: idNum,
          passkey: formData.passkey
        }
      }
      const url = role === 'Admin Pengawas' ? '/api/account/admin-pengawas/register' : '/api/account/admin-instansi/register'
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      let j = null
      try { j = await res.json() } catch {}
      if (!res.ok) throw new Error(j?.message || `HTTP ${res.status}`)
      alert(j?.message || 'Berhasil mendaftar')
      navigate('/login')
    } catch (err) {
      console.log(err)
      alert(typeof err?.message === 'string' ? err.message : 'Gagal mendaftar')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 opacity-40 blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-blue-700 mb-2">Champart</p>
            <h1 className="text-3xl font-bold text-gray-900">Register Admin</h1>
          </div>
          <div className="flex gap-2 mb-4">
            <button className={`px-3 py-2 rounded-xl border ${role==='Admin Instansi' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800'}`} onClick={()=>setRole('Admin Instansi')}>Admin Instansi</button>
            <button className={`px-3 py-2 rounded-xl border ${role==='Admin Pengawas' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800'}`} onClick={()=>setRole('Admin Pengawas')}>Admin Pengawas</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-500 text-gray-900" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-500 text-gray-900" />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-500 text-gray-900" />
            <input type="text" name="jabatan" placeholder="Jabatan" value={formData.jabatan} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-500 text-gray-900" />
            {role==='Admin Instansi' && (
              <select name="idInstansi" value={formData.idInstansi} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900">
                <option value="">Pilih Instansi</option>
                {listInstansi.map(it => (
                  <option key={it.id} value={it.id}>{it.nama}</option>
                ))}
              </select>
            )}
            <input type="text" name="passkey" placeholder="Passkey" value={formData.passkey} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-500 text-gray-900" />
            <button type="submit" className="w-full mt-2 px-4 py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors duration-200">Continue</button>
             <div className="mt-4 text-center">
              {role === 'Admin Instansi' && (
              <><p className="text-gray-600">
                Want to register your Instance?{' '}
                <a href="/instansi/register" className="text-blue-900 font-semibold hover:underline">
                  Register Instance
                </a>
              </p></>
            )}
             </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterAdmin
