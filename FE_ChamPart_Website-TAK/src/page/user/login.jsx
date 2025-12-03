import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      console.log('Login attempt:', { email, password })
      setLoading(false)
      navigate('/')
    }, 1000)
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

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <p className="text-blue-600 font-semibold text-sm mb-4">Champart</p>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Welcome!<br />
              What's your<br />
              email?
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

export default Login
