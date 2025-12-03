import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Registrasi() {
  const majorData = {
    'Fakultas Teknik Elektro (FTE)': ['Teknik Telekomunikasi','Teknik Elektro','Teknik Biomedis','Teknik Komputer','Teknik Fisika','Teknik Sistem Energi'],
    'Fakultas Rekayasa Industri (FRI)': ['Teknik Industri','Sistem Informasi','Teknik Logistik','Manajemen Rekayasa Industri'],
    'Fakultas Informatika (FIF)': ['Informatika','Sains Data','Teknologi Informasi','Rekayasa Perangkat Lunak'],
    'Fakultas Ekonomi dan Bisnis (FEB)': ['Akuntansi','Manajemen Bisnis Telekomunikasi dan Informatika','Leisure Management','Administrasi Bisnis','Digital Business'],
    'Fakultas Komunikasi dan Ilmu Komunikasi (FKS)': ['Ilmu Komunikasi','Digital Public Relation','Digital Content Broadcasting','Psikologi'],
    'Fakultas Industri Kreatif (FIK)': ['Visual Arts','Desain Komunikasi Visual','Desain Produk & Inovasi','Kriya','Desain Interior','Film dan Animasi']
  }

  const [formData, setFormData] = useState({ nama:'', email:'', nomorHP:'', password:'', fakultas:'', programStudi:'' })
  const [programOptions, setProgramOptions] = useState([])
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'fakultas') {
      const programs = majorData[value] || []
      setProgramOptions(programs)
      setFormData(prev => ({ ...prev, programStudi: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Registrasi:', formData)
    navigate('/login')
  }

  const faculties = Object.keys(majorData)

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 opacity-40 blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse"></div>
      </div>
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold text-blue-700 mb-2">Champart</p>
            <h1 className="text-4xl font-bold text-gray-900">Welcome!</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="nama" placeholder="Nama" value={formData.nama} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-500 text-gray-900" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-500 text-gray-900" />
            <input type="tel" name="nomorHP" placeholder="Nomor HP" value={formData.nomorHP} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-500 text-gray-900" />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-500 text-gray-900" />
            <select name="fakultas" value={formData.fakultas} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900 appearance-none cursor-pointer pr-10">
              <option value="">Fakultas</option>
              {faculties.map(f => (<option key={f} value={f}>{f}</option>))}
            </select>
            <select name="programStudi" value={formData.programStudi} onChange={handleInputChange} disabled={!formData.fakultas} className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900 appearance-none cursor-pointer pr-10 disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="">Program Studi</option>
              {programOptions.map(p => (<option key={p} value={p}>{p}</option>))}
            </select>
            <button 
            type="submit" 
            className="w-full mt-6 px-4 py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors duration-200">Continue</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Registrasi
