import Eyes from '../../assets/svg/eyes.svg'
import Back from '../../assets/svg/back-button.svg' 
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom"


function TampilanKegiatan(){
  const navigate = useNavigate()
  const { id } = useParams()

  const [kegiatan, setKegiatan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState("")

  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('access_token')
        const headers = { 'Authorization': `Bearer ${token}` }
        const res = await fetch(`/api/kegiatan/${id}?skip_views=true`, { headers })
        const data = await res.json()
        if (res.ok) {
          setKegiatan(data)
        }
        const key = `viewed_kegiatan_${id}`
        const last = Number(sessionStorage.getItem(key) || '0')
        const now = Date.now()
        if (now - last > 5000) {
          sessionStorage.setItem(key, String(now))
          try {
            const inc = await fetch(`/api/kegiatan/${id}`, { headers })
            if (inc.ok) {
              setKegiatan(prev => prev ? { ...prev, views: (prev.views || 0) + 1 } : prev)
            }
          } catch {}
        }
      } catch (error) {
        console.error('Error fetching kegiatan:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchKegiatan()
  }, [id])

  useEffect(() => {
    const idLamp = Number(kegiatan?.lampiran?.idLampiran)
    if (!Number.isFinite(idLamp) || idLamp <= 0) { setImageUrl(""); return }
    const token = localStorage.getItem('access_token') || ''
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    let canceled = false
    ;(async () => {
      try {
        const rFile = await fetch(`/api/file/get/${idLamp}`, { headers })
        const blob = await rFile.blob()
        const url = URL.createObjectURL(blob)
        if (!canceled) setImageUrl(url)
      } catch {
        if (!canceled) setImageUrl("")
      }
    })()
    return () => { canceled = true }
  }, [kegiatan?.lampiran?.idLampiran])

   useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const res = await fetch('/api/simpan/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (res.ok) {
          const bookmarkList = data.kegiatan || []
          const bookmarked = bookmarkList.some(item => item.idKegiatan === parseInt(id))
          setIsBookmarked(bookmarked)
        }
      } catch (error) {
        console.error('Error checking bookmark:', error)
      }
    }
    checkBookmarkStatus()
  }, [id])

  const handleBookmark = async () => {
    try {
      setBookmarkLoading(true)
      const token = localStorage.getItem('access_token')
      const res = await fetch('/api/simpan/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idKegiatan: parseInt(id)
        })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setIsBookmarked(true)
        alert('Kegiatan berhasil disimpan!')
      } else {
        alert(data.message || 'Gagal menyimpan kegiatan')
      }
    } catch (error) {
      console.error('Error bookmark:', error)
      alert('Gagal terhubung ke server')
    } finally {
      setBookmarkLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  if (!kegiatan) {
    return <div className="text-center py-10">Kegiatan tidak ditemukan</div>
  }

  const chips = [
    ...(kegiatan.minat?.map(m => m.nama_minat) || []),
    ...(kegiatan.bakat?.map(b => b.nama_bakat) || [])
  ]

  const formatTanggal = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const gambarUrl = imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"


  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <img src={Back} alt="Back" 
            onClick={()=>navigate('/')}
        className="h-8 w-8 cursor-pointer" />
        <h2 className="text-2xl md:text-3xl font-semibold">Kegiatan</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 ml-10">
        <div>
          <div className="rounded-xl border border-gray-300 overflow-hidden bg-white shadow-sm">
            <img 
              src={gambarUrl} 
              alt="Poster" 
              className="w-full h-[420px] object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
              }}
            />
          </div>
          <button 
            type="button" 
            onClick={handleBookmark}
            disabled={bookmarkLoading || isBookmarked}
            className={`mt-4 w-full rounded-md border border-gray-300 py-2.5 transition-colors
              ${isBookmarked 
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                : 'bg-[#ACE2E1] text-gray-800 hover:bg-teal-200'
              }
              ${bookmarkLoading ? 'opacity-50 cursor-wait' : ''}
            `}
          >
            {bookmarkLoading ? 'Menyimpan...' : isBookmarked ? 'Sudah Disimpan' : 'Bookmark Kegiatan'}
          </button>
        </div>

        <div className="space-y-3">
          <div className="text-xl md:text-2xl font-semibold">{kegiatan.nama}</div>
          <div className="text-sm text-gray-500">{kegiatan.jenis}</div>
          <div className="flex gap-6">
            <div className="text-sm text-gray-700">
              {formatTanggal(kegiatan.waktu)}
            </div>
            <div className="text-sm text-gray-700">
              {kegiatan.nama_instansi}
            </div>
          </div>
          <div className="font-bold text-sm">
            {kegiatan.TAK_wajib ? "TAK WAJIB" : "NON TAK"} 
          </div>
           <div className="font-semibold text-sm">
            Nominal: 
            {kegiatan.nominal_TAK > 0 && ` ${kegiatan.nominal_TAK} Poin`}
          </div>
          <div className="space-y-2 text-sm">
            <p>{kegiatan.deskripsi}</p>
          </div>

          <div className="pt-2">
            <div className="flex flex-wrap gap-2">
              {chips.map((t, i) => (
                <span key={i} className="px-3 py-1 text-xs rounded-full bg-[#008DDA] text-white">{t}</span>
              ))}
            </div>
            <div className="flex items-start justify-between pt-2">
              <div className="text-xs text-gray-500 pt-2">
                Diumumkan pada {formatTanggal(kegiatan.waktuDiupload)}
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#008DDA] text-white text-xs">
                <img src={Eyes} alt="Views" className="w-4 h-4" />
                <span>{kegiatan.views || 0}</span>
              </div>
            </div>  
          </div>
        </div>
      </div>
    </div>
  )
}

export default TampilanKegiatan
