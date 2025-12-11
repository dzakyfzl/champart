import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RegisterInstansi() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    namaInstansi: '',
    alamat: '',
    emailPengaju: '',
    jenisInstansi: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    if (!formData.jenisInstansi) {
      alert("Pilih Jenis Instansi Terlebih dahulu!")
      return
    }
    const payload = {
        nama: formData.namaInstansi,
        alamat: formData.alamat,
        email_pengaju: formData.emailPengaju,
        jenis: formData.jenisInstansi
    }
    try {
        const res = await fetch("/api/instansi/register", {  
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (!res.ok) {
            alert(data.message)
            setLoading(false)
            return
        }
        alert("Registrasi Instansi Berhasil!")
    } catch (error) {
        console.error("Error register instansi:", error)
        alert("Gagal terhubung ke server")
    } finally {
        setLoading(false)
    }
    setLoading(true)
    navigate("/admin/register", { replace: true })
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
            <h1 className="text-3xl font-bold text-gray-900">Register Instansi</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="namaInstansi"
                placeholder="Nama Instansi"
                value={formData.namaInstansi}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            <div>
              <input
                type="text"
                name="alamat"
                placeholder="Alamat"
                value={formData.alamat}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            <div>
              <input
                type="email"
                name="emailPengaju"
                placeholder="Email Pengaju"
                value={formData.emailPengaju}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            <div>
              <select
                name="jenisInstansi"
                value={formData.jenisInstansi}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="">Pilih Jenis Instansi</option>
                <option value="DPM">DPM</option>
                <option value="BEM">BEM</option>
                <option value="UKM">UKM</option>
                <option value="HIMA">HIMA</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterInstansi
