import Card from "../../component/card.jsx"
import Back from '../../assets/svg/back-button.svg'

import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Bookmark() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageMap, setImageMap] = useState({})

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('access_token')
        const res = await fetch('/api/simpan/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()
        console.log('Bookmark data:', data)
        if (res.ok) {
          setItems(data.kegiatan || [])
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookmarks()
  }, [])

  useEffect(() => {
    const loadImages = async () => {
      const token2 = localStorage.getItem('access_token') || ''
      const headers = token2 ? { Authorization: `Bearer ${token2}` } : {}
      const needed = Array.isArray(items) ? items.filter(it => !(it?.idKegiatan in imageMap)) : []
      for (const it of needed) {
        const id = Number(it?.idKegiatan)
        if (!Number.isFinite(id) || id <= 0) continue
        try {
          const rDetail = await fetch(`/api/kegiatan/${id}?skip_views=true`, { headers })
          let jDetail = null; try { jDetail = await rDetail.json() } catch {}
          if (!rDetail.ok) continue
          const idLamp = Number(jDetail?.lampiran?.idLampiran)
          if (Number.isFinite(idLamp) && idLamp > 0) {
            const rFile = await fetch(`/api/file/get/${idLamp}`, { headers })
            const blob = await rFile.blob()
            const url = URL.createObjectURL(blob)
            setImageMap(prev => ({ ...prev, [id]: url }))
          }
        } catch {}
      }
    }
    if (items.length > 0) loadImages()
  }, [items])

  useEffect(() => {
    const key = localStorage.getItem('cron_key')
    if (!key) return
    let aborted = false
    const run = async () => {
      try {
        const res = await fetch('/api/notification/trigger', {
          method: 'GET',
          headers: { 'X-Cron-Key': key }
        })
        const data = await res.json().catch(() => null)
        if (!aborted) {
          console.log('Trigger notifikasi:', res.ok ? 'OK' : 'Gagal', data)
        }
      } catch (e) {
        if (!aborted) console.error('Kesalahan memicu notifikasi:', e)
      }
    }
    run()
    return () => { aborted = true }
  }, [])

  const formatTanggal = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const formatWaktuDeadline = (dateString) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString('id-ID')} at ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
  }

  if (loading) {
    return (
      <div className="">
        <div className="flex gap-3 items-center mb-8">
          <img src={Back} alt="Back" 
            onClick={() => navigate('/')}
            className="h-8 w-8 cursor-pointer" />
          <span className="text-2xl font-semibold">Bookmark</span>
        </div>
        <div className="py-10">Loading...</div>
      </div>
    )
  }

  return (
    <div className="">
      <div className="flex gap-3 items-center mb-8">
        <img src={Back} alt="Back" 
          onClick={() => navigate('/')}
          className="h-8 w-8 cursor-pointer" />
        <span className="text-2xl font-semibold">Bookmark</span>
      </div>

      {items.length === 0 ? (
        <div className="py-6 text-gray-500">
          Belum ada kegiatan yang disimpan
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.idKegiatan} className="space-y-2">
              <Card
                gambar={imageMap[item.idKegiatan] || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"}
                judul={item.nama_kegiatan}
                instansi={item.nama_instansi}
                tanggal={formatTanggal(item.waktu_kegiatan)}
                statusTAK={item.TAK_wajib ? "TAK WAJIB" : "NON TAK"}
                views={item.views || 0}
                deadline={formatTanggal(item.waktu_kegiatan)}
                onClick={() => navigate(`/kegiatan/${item.idKegiatan}`)}
              />
              <div className="text-center text-sm text-gray-700">
                Deadline: {formatWaktuDeadline(item.waktu_kegiatan)}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

export default Bookmark
