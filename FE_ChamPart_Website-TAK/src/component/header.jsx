import { useState, useRef, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Logo from '../assets/svg/champart-logo.svg'
import Bookmark from '../assets/svg/bookmark.svg'
import History from '../assets/svg/history.svg'
import Profile from '../assets/svg/profile.svg'
import Drop from '../assets/svg/button-dropdown.svg'
import Search from '../assets/svg/search.svg'

function Header(){
  const [query, setQuery] = useState('')
  const [openSuggest, setOpenSuggest] = useState(false)
  const [openUser, setOpenUser] = useState(false)
  const [recent, setRecent] = useState([])
  const searchRef = useRef(null)
  const userRef = useRef(null)
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token")
  const [username, setUsername] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState('')
  const lastAvatarRef = useRef(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/account/get", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        const data = await res.json()
        console.log("User Data:", data)
        setUsername(data.username)
        const idLamp = Number(data.idLampiran)
        if (Number.isFinite(idLamp) && idLamp > 0) {
          try {
            const r = await fetch(`/api/file/get/${idLamp}`, { headers: { "Authorization": `Bearer ${token}` } })
            if (r.ok) {
              const b = await r.blob()
              const url = URL.createObjectURL(b)
              if (lastAvatarRef.current) URL.revokeObjectURL(lastAvatarRef.current)
              lastAvatarRef.current = url
              setAvatarUrl(url)
            }
          } catch {}
        } else {
          setAvatarUrl('')
        }
      } catch (err) {
        console.error("Gagal ambil user:", err)
      }
    }

    if (token) getUser()
  }, [token])

  const handleSubmitSearch = (e) => {
    if (e.key === "Enter") {   
      e.preventDefault();
      navigate(`/search/`)
      const trimmed = query.trim();
      if (!trimmed) return;
        navigate(`/search?q=${encodeURIComponent(trimmed)}`)

      setRecent(prev => {
        const updated = prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
        return [trimmed, ...updated]; 
      });

      setOpenSuggest(false);
      setQuery('');  
    }
  };

  const handleRecentClick = (searchTerm) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
    setOpenSuggest(false)
    setQuery('')
  }

    const triggerSearch = () => {
      setOpenUser(false)
      setOpenSuggest(true)
      if (searchRef.current) {
        searchRef.current.focus()
      }
    }
  
  useEffect(() => {
    const onDocClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setOpenSuggest(false)
      if (userRef.current && !userRef.current.contains(e.target)) setOpenUser(false)
    }
    document.addEventListener('click', onDocClick)
    const onFocusSearch = () => triggerSearch()
    window.addEventListener('focus-search', onFocusSearch)
    return () => {
      document.removeEventListener('click', onDocClick)
      window.removeEventListener('focus-search', onFocusSearch)
    }
  }, [])

  const handleLogout = async () => {
  try {
    const accessToken = localStorage.getItem("access_token")

    const res = await fetch("api/account/logout", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
    const data = await res.json()
    console.log(data.message)

    } catch (err) {
      console.error("Logout error:", err)
    }
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")

    navigate("/login") 
    setOpenUser(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
        <img src={Logo} alt="Champart Logo" 
          onClick={()=>window.location.href='/'}
          className="h-8 cursor-pointer" />
        <div className="flex-1">
          <div className="relative">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              onFocus={()=>setOpenSuggest(true)}
              onKeyDown={handleSubmitSearch}
              placeholder="Search events"
              className="w-full h-12 rounded-full border-2 border-gray-300 pl-10 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pl-1">
              <img src={Search} alt="Search" className="h-5 w-5 cursor-pointer" onClick={triggerSearch} />
            </div>
            {openSuggest && (
              <div className="absolute left-0 top-full mt-2 w-full rounded-lg border bg-white shadow-lg">
                <div className="flex items-center justify-between px-4 pt-3 pb-2 text-sm text-gray-600 font-medium">
                  <span>Recent Search</span>
                  <button type="button" onClick={()=>setRecent([])} className="text-blue-600 hover:underline">Clear</button>
                </div>
                <ul className="px-2 pb-3">
                  {recent.map((s)=> (
                    <li key={s} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer" onMouseDown={()=>handleRecentClick(s)}>
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-500 fill-current"><path d="M12 8v5l4 2-1 1-5-3V8z"/><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>
                      <span>{s}</span>
                    </li>
                  ))}
                  {recent.length===0 && <li className="px-4 py-2 text-gray-500 text-sm">No recent searches</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <div
          onClick={()=>navigate('/bookmark')}
          className="flex flex-col items-center text-gray-700 cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={Bookmark} alt="Bookmark" className="h-5 w-5" />
            </div>
            <span className="text-sm mt-1">Bookmark Kegiatan</span>
          </div>
          <div
          onClick={()=>navigate('/history')}
          className="flex flex-col items-center text-gray-700 cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={History} alt="History Kegiatan" className="h-5 w-5" />
            </div>
            <span className="text-sm mt-1">History Kegiatan</span>
          </div>
          <div className="relative" ref={userRef}>
            <button type="button" onClick={()=>setOpenUser(v=>!v)} className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img src={Profile} alt="Profile" className="h-6 w-6 mx-auto my-[3px]" />
                )}
              </div>
              <span>{username}</span>
              <img src={Drop} alt="Dropdown" className="h-4 w-4 text-gray-700 fill-current" />
            </button>
            {openUser && (
              <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white shadow-lg">
                <ul className="py-1 text-sm text-gray-700" onClick={() => setOpenSuggest(false)}>
                  <li 
                  onClick={triggerSearch}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Cari Kegiatan</li>
                  <hr className="my-1 border-gray-200"/>
                  <li 
                  onClick={()=>{navigate('/bookmark'); setOpenUser(false)}}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Bookmark Kegiatan</li>
                  <li 
                  onClick={()=>{navigate('/history'); setOpenUser(false)}}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer">History Kegiatan</li>
                  <hr className="my-1 border-gray-200"/>
                  <li 
                  onClick={()=>{navigate('/editprofile'); setOpenUser(false)}}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Pengaturan Akun</li>
                  <li 
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Log out</li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
export default Header;
