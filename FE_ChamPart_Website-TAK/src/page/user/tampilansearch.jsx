import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Card from "../../component/card.jsx" 
import Seminar from '../../assets/svg/seminar.svg'
import Webinar from '../../assets/svg/webinar.svg'
import Bootcamp from '../../assets/svg/bootcamp.svg'
import Lomba from '../../assets/svg/lomba.svg'

function TampilanSearch(){
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const categories = [
    { label: 'Seminar', icon: Seminar },
    { label: 'Webinar', icon: Webinar },
    { label: 'Bootcamp', icon: Bootcamp },
    { label: 'Lomba', icon: Lomba },
  ]
  const bakat = [
    'Berbicara di Depan Umum (Public Speaking)',
    'Analisis & Logika',
    'Kepemimpinan (Leadership)',
    'Kreativitas & Menghasilkan Ide',
    'Kecerdasan Visual & Estetika',
    'Empati & Keterampilan Interpersonal',
    'Menulis Persuasif',
    'Berpikir Kritis & Memecahkan Masalah',
    'Adaptasi & Cepat Belajar',
    'Manajemen Waktu & Organisasi',
    "Kemampuan Musikal (Vokal/Alat Musik)",
    "Kemampuan Atletik & Kinestetik",
    "Negosiasi & Diplomasi",
    "Keterampilan Mengajar & Menjelaskan",
    "Kejelian Terhadap Detail (Attention to Detail)",
    "Penguasaan Bahasa Asing",
    "Seni Peran (Akting)",
    "Keterampilan Teknikal/Mekanik",
    "Strategi & Perencanaan",
    "Keberanian & Pengambilan Risiko"
  ]
  const minat = [
    'Kewirausahaan (Entrepreneurship)',
    'Teknologi & Pemrograman',
    'Desain Grafis & UI/UX',
    'Pemasaran Digital & Media Sosial',
    'Fotografi & Videografi',
    'Penulisan Kreatif & Konten',
    'Riset & Karya Ilmiah',
    'Kesehatan Mental & Psikologi',
    'Kegiatan Sosial & Relawan (Volunteering)',
    'Lingkungan Hidup & Kepecintaalaman',
    'Musik & Seni Pertunjukan',
    'Investasi & Literasi Keuangan',
    'Olahraga (Umum)',
    'E-sports & Game Development',
    'Debat & Model United Nations (MUN)',
    'Pengembangan Diri (Soft Skills)',
    'Bahasa & Budaya Asing',
    'Organisasi & Kepemimpinan',
    'Seni Rupa & Kerajinan',
    'Kuliner & Tata Boga',
  ]
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [activeCategory, setActiveCategory] = useState()
  const [selectedBakat, setSelectedBakat] = useState(new Set())
  const [selectedMinat, setSelectedMinat] = useState(new Set())
  const [filterActive, setFilterActive] = useState('All')

  const toggleSelect = (setObj, value) => {
    const next = new Set(setObj)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    return next
  }

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '')
  }, [searchParams])

  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('access_token')

        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (activeCategory) params.append('jenis', activeCategory)
        
        if (filterActive === 'Most Popular') {
          params.append('sort', 'popular')
        } else if (filterActive === 'New Arrival') {
          params.append('sort', 'latest')
        }

        selectedMinat.forEach(m => {
          const minatIndex = minat.indexOf(m) + 1
          if (minatIndex > 0) params.append('minat_ids', minatIndex)
        })
        selectedBakat.forEach(b => {
          const bakatIndex = bakat.indexOf(b) + 1
          if (bakatIndex > 0) params.append('bakat_ids', bakatIndex)
        })
        
        const url = `/api/kegiatan/filter?${params.toString()}`
        console.log('Fetching:', url)
        
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()
        console.log('Search results:', data)
        if (res.ok) {
          setItems(data.data || data)
        }
      } catch (error) {
        console.error('Error fetching kegiatan:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchKegiatan()
  }, [searchQuery, activeCategory, selectedBakat, selectedMinat, filterActive])

  const formatTanggal = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }



  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">{searchQuery ? `Hasil pencarian: "${searchQuery}"` : 'Filter'}</h1>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16 pb-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Kategori</h2>
          <div className="space-y-3">
            {categories.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => setActiveCategory(prev => prev === c.label ? null : c.label)}
                className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3 bg-white shadow-sm transition-all ${activeCategory===c.label ? 'border-blue-500' : 'border-gray-300'}`}
              >
                <div className="w-10 h-10 rounded-md flex items-center justify-center">
                  <img src={c.icon} alt={c.label} className="w-10 h-10" />
                </div>
                <span className="font-medium">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Bakat Kegiatan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
            {bakat.map((b) => {
              const active = selectedBakat.has(b)
              return (
                <button
                  key={b}
                  type="button"
                  onClick={()=>setSelectedBakat(prev=>toggleSelect(prev,b))}
                  className={`text-left text-xs flex items-center gap-3 px-3 rounded-md transition-colors ${active ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  aria-pressed={active}
                >
                  <span className={`inline-block w-3 h-3 rounded-full ${active ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                  <span className={`flex-1 ${active ? 'text-gray-900' : 'text-gray-800 '}`}>{b}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Minat Kegiatan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
            {minat.map((m) => {
              const active = selectedMinat.has(m)
              return (
                <button
                  key={m}
                  type="button"
                  onClick={()=>setSelectedMinat(prev=>toggleSelect(prev,m))}
                  className={`text-left text-xs flex items-center gap-3 px-3 rounded-md transition-colors ${active ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  aria-pressed={active}
                >
                  <span className={`inline-block w-3 h-3 rounded-full ${active ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                  <span className={`flex-1 ${active ? 'text-gray-900 ' : 'text-gray-800 '}`}>{m}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <section className="flex gap-3 overflow-x-auto pt-6">
        {["All","Most Popular","New Arrival"].map(t => (
          <button 
            key={t}
            onClick={() => setFilterActive(t)}
            className={`px-4 py-2 rounded-lg border shadow-sm whitespace-nowrap ${filterActive===t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            {t}
          </button>
        ))}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          <p>Loading...</p>
        ) : items.length > 0 ? (
          items.map((kegiatan) => (
            <Card
              key={kegiatan.idKegiatan}
              gambar="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
              judul={kegiatan.nama}
              instansi={kegiatan.nama_instansi}
              tanggal={formatTanggal(kegiatan.waktu)}
              statusTAK={kegiatan.TAK_wajib ? "TAK WAJIB" : "NON TAK"}
              views={kegiatan.views || 0}
              deadline={formatTanggal(kegiatan.waktu)}
              onClick={()=>navigate(`/kegiatan/${kegiatan.idKegiatan}`)}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">Tidak ada kegiatan yang sesuai filter</p>
        )}
      </section>
    </div>
  );
}
export default TampilanSearch
