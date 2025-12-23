import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login({ setToken }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/account/login", {  
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: name,      
          password: password,
          role: role      
        })
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.message)
        setLoading(false)
        return
      }

      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("refresh_token", data.refresh_token)
      localStorage.setItem("user_role", data.role || role)
      setToken(data.access_token)
      console.log("Login Success", data)
      if (role === "AdminPengawas") {
        navigate("/admin/pengawas", { replace: true })
      } else if (role === "AdminInstansi") {
        navigate("/admin/instansi", { replace: true })
      } else if (role === "Pengguna") {
        navigate("/", { replace: true })
      }
    } catch (error) {
      console.error("Error login:", error)
      alert("Gagal terhubung ke server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-600"></div>
        <div className="absolute top-10 left-20 w-96 h-96 bg-yellow-300 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-pink-400 rounded-full opacity-25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-orange-400 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-10 right-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      <div className="absolute top-4 right-4 z-20">
        <a href="/admin/register" className="px-4 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-colors">
          Register Admin
        </a>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <p className="text-blue-600 font-semibold text-sm mb-4">Champart</p>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Welcome!<br />
              What's your<br />
              name?
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            <div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-800 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="">Select Role</option>
                <option value="AdminInstansi">Admin Instansi</option>
                <option value="AdminPengawas">Admin Pengawas</option>
                <option value="Pengguna">Pengguna</option>
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
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-900 font-semibold hover:underline">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
