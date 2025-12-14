import Card from "../../component/card.jsx"
import Back from '../../assets/svg/back-button.svg'

import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Bookmark() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

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

  const formatTanggal = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const formatWaktuSimpan = (dateString) => {
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
          <span className="text-2xl font-semibold text-center">Bookmark</span>
        </div>
        <div className="text-center py-10">Loading...</div>
      </div>
    )
  }

  return (
    <div className="">
      <div className="flex gap-3 items-center mb-8">
        <img src={Back} alt="Back" 
          onClick={() => navigate('/')}
          className="h-8 w-8 cursor-pointer" />
        <span className="text-2xl font-semibold text-center">Bookmark</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Belum ada kegiatan yang disimpan
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.idKegiatan} className="space-y-2">
              <Card
                gambar="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
                judul={item.nama_kegiatan}
                instansi={item.nama_instansi}
                tanggal={formatTanggal(item.waktu_kegiatan)}
                statusTAK={item.TAK_wajib ? "TAK WAJIB" : "NON TAK"}
                views={item.views || 0}
                deadline={formatTanggal(item.waktu_kegiatan)}
                onClick={() => navigate(`/kegiatan/${item.idKegiatan}`)}
              />
              <div className="text-center text-sm text-gray-700">
                Disimpan: {formatWaktuSimpan(item.waktu_disimpan)}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

export default Bookmark
