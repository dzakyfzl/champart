import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Card from "../../component/card.jsx" 
import Seminar from '../../assets/svg/seminar.svg'
import Webinar from '../../assets/svg/webinar.svg'
import Bootcamp from '../../assets/svg/bootcamp.svg'
import Lomba from '../../assets/svg/lomba.svg'

function TampilanSearch(){
  const items = new Array(8).fill(0)
  const navigate = useNavigate()
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
  const [activeCategory, setActiveCategory] = useState()
  const [selectedBakat, setSelectedBakat] = useState(new Set())
  const [selectedMinat, setSelectedMinat] = useState(new Set())

  const toggleSelect = (setObj, value) => {
    const next = new Set(setObj)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    return next
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Filter</h1>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16 pb-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Kategori</h2>
          <div className="space-y-3">
            {categories.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => setActiveCategory(c.label)}
                className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3 bg-white shadow-sm transition-all ${activeCategory===c.label ? 'border-blue-500' : 'border-gray-300'}`}
              >
                <div className="w-10 h-10 rounded-md  flex items-center justify-center">
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
                  className={`text-left text-xs flex items-center gap-3 px-3  rounded-md transition-colors ${active ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
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
          <button key={t} className={`px-4 py-2 rounded-lg border shadow-sm whitespace-nowrap ${t==='All' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{t}</button>
        ))}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((_, i) => (
          <Card
            key={i}
            gambar="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
            judul="Artificial Intelligence Competition “Implementasi AI dalam Kehidupan Sehari - Hari”"
            instansi="Universitas Negeri Yogyakarta"
            tanggal="Sabtu, 31 Oktober 2021"
            statusTAK="TAK WAJIB"
            views={100}
            deadline="19/10/2021"
            onClick={()=>navigate('/kegiatan')}
          />
        ))}
      </section>
    </div>
  );
}
export default TampilanSearch
