import Card from "../../component/card.jsx"
import Back from '../../assets/svg/back-button.svg'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'


function History() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('access_token')
        const res = await fetch('/api/simpan/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()
        console.log('History data:', data)
        if (res.ok) {
          setItems(data.kegiatan || [])
        }
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const formatTanggal = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="">
        <div className="flex gap-3 items-center mb-8">
          <img src={Back} alt="Back" 
            onClick={() => navigate('/')}
            className="h-8 w-8 cursor-pointer" />
          <h1 className="text-2xl font-semibold text-center">History</h1>
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
        <h1 className="text-2xl font-semibold text-center">History</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Belum ada history kegiatan
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <Card
              key={item.idKegiatan}
              gambar="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
              judul={item.nama_kegiatan}
              instansi={item.nama_instansi}
              tanggal={formatTanggal(item.waktu_kegiatan)}
              statusTAK={item.TAK_wajib ? "TAK WAJIB" : "NON TAK"}
              views={item.views || 0}
              deadline={formatTanggal(item.waktu_kegiatan)}
              onClick={() => navigate(`/kegiatan/${item.idKegiatan}`)}
            />
          ))}
        </section>
      )}
    </div>
  )
}

export default History
