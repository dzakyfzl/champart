import React, { useState } from 'react'

function RegisterAdmin() {
  const [role, setRole] = useState('Admin Instansi')
  const [formData, setFormData] = useState({ username:'', email:'', password:'', jabatan:'', instansi:'' })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.username || !formData.email || !formData.password || !formData.jabatan) { alert('Lengkapi semua field wajib'); return }
    if (role === 'Admin Instansi' && !formData.instansi) { alert('Field Instansi wajib untuk Admin Instansi'); return }
    console.log('Register Admin', { role, ...formData })
    alert(`Registrasi ${role} berhasil!\nUsername: ${formData.username}\nEmail: ${formData.email}\nJabatan: ${formData.jabatan}${role === 'Admin Instansi' ? `\nInstansi: ${formData.instansi}` : ''}`)
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
              <input type="text" name="instansi" placeholder="Instansi" value={formData.instansi} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-500 text-gray-900" />
            )}
            <button type="submit" className="w-full mt-2 px-4 py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors duration-200">Continue</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterAdmin
