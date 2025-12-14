import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Homepage from '../../assets/image/homepage.png'
import Bootcamp from '../../assets/svg/bootcamp.svg'
import Seminar from '../../assets/svg/seminar.svg'
import Webinar from '../../assets/svg/webinar.svg'
import Lomba from '../../assets/svg/lomba.svg'
import Dropdown from '../../component/dropdown.jsx'
import Button from '../../component/button.jsx'
import Card from '../../component/card.jsx'


function Home(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const categoryRef = useRef(null)
  const navigate = useNavigate()
  const [categoryActive, setCategoryActive] = useState(null)
  const [filterActive, setFilterActive] = useState(null)

  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('access_token') 
        const res = await fetch('/api/kegiatan/fyp', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()
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
  }, [])

  const handleClick = (value) => {
    setCategoryActive(prev => prev === value ? null : value)
  }

  const minatKegiatan = [
    "Kewirausahaan (Entrepreneurship)",
    "Teknologi & Pemrograman",
    "Desain Grafis & UI/UX",
    "Pemasaran Digital & Media Sosial",
    "Fotografi & Videografi",
    "Penulisan Kreatif & Konten",
    "Riset & Karya Ilmiah",
    "Kesehatan Mental & Psikologi",
    "Kegiatan Sosial & Relawan (Volunteering)",
    "Lingkungan Hidup & Kepecintaalaman",
    "Musik & Seni Pertunjukan",
    "Investasi & Literasi Keuangan",
    "Olahraga (Umum)",
    "E-sports & Game Development",
    "Debat & Model United Nations (MUN)",
    "Pengembangan Diri (Soft Skills)",
    "Bahasa & Budaya Asing",
    "Organisasi & Kepemimpinan",
    "Seni Rupa & Kerajinan",
    "Kuliner & Tata Boga"
  ];

  const bakatKegiatan = [
    "Berbicara di Depan Umum (Public Speaking)",
    "Analisis & Logika",
    "Kepemimpinan (Leadership)",
    "Kreativitas & Menghasilkan Ide",
    "Kecerdasan Visual & Estetika",
    "Empati & Keterampilan Interpersonal",
    "Menulis Persuasif",
    "Berpikir Kritis & Memecahkan Masalah",
    "Adaptasi & Cepat Belajar",
    "Manajemen Waktu & Organisasi",
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
  ];
  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <div className="space-y-6 mr-10">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">Temukan berbagai kegiatan bermanfaat untuk keterampilan dan wawasanmu!</h1>
          <p className="text-gray-600 text-justify">Mulai dari seminar inspiratif, webinar interaktif, bootcamp intensif, hingga berbagai kompetisi menarik—semuanya tersedia untuk membantumu berkembang lebih cepat. Jelajahi event yang sesuai minatmu dan mulai belajar hari ini.</p>
          <div className="flex gap-4">
            <button
              onClick={()=>{
                if (categoryRef.current) {
                  const y = categoryRef.current.getBoundingClientRect().top + window.scrollY - 120
                  window.scrollTo({ top: y, behavior: 'smooth' })
                }
              }}
              className="px-6 py-2.5 rounded-lg bg-[#008DDA] text-white shadow-sm hover:bg-[#0487CF] border border-gray-100"
            >
              Lihat
            </button>
            <button onClick={()=>window.dispatchEvent(new Event('focus-search'))} 
            className="px-6 py-2.5 rounded-lg border border-gray-100 bg-[#ACE2E1] text-white hover:bg-[#6DD5D3]">
              Cari
            </button>
          </div>
        </div>
        <div className="w-full">
          <img className="w-full h-72 md:h-80 object-cover rounded-lg" src={Homepage} alt="Hero"/>
        </div>
      </section>

      <section ref={categoryRef} className="grid grid-cols-4 gap-4 text-center">
        <Button 
          icon={Seminar} 
          label="Seminar" 
          value="Seminar" 
          active={categoryActive}
          onClick={handleClick}
        />
        <Button 
          icon={Webinar} 
          label="Webinar" 
          value="Webinar" 
          active={categoryActive}
          onClick={handleClick}
        />
        <Button 
          icon={Bootcamp} 
          label="Bootcamp" 
          value="Bootcamp" 
          active={categoryActive}
          onClick={handleClick}
        />
        <Button 
          icon={Lomba} 
          label="Lomba" 
          value="Lomba" 
          active={categoryActive}
          onClick={handleClick}
        />
      </section>

     <section className="flex items-center justify-center border-y py-3">
        <div className="flex items-center gap-16 font-semibold">
          <Dropdown items={minatKegiatan}>
            Minat Kegiatan
          </Dropdown>
          <Dropdown items={bakatKegiatan}>
            Bakat Kegiatan
          </Dropdown>
        </div>
      </section>

      <section className="flex gap-3 overflow-x-auto">
        {["All","Most Popular","New Arrival"].map(t => (
          <button
            key={t}
            onClick={()=>setFilterActive(prev => prev === t ? null : t)}
            className={`group relative px-4 py-2 whitespace-nowrap transition-colors
              ${filterActive===t 
                ? 'text-[#008DDA] border-b-2 border-[#008DDA]'
                : 'hover:text-gray-300 hover:border-b-2 hover:border-gray-200'}`}
          >
            {t}
          </button>
        ))}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : items.length > 0 ? (
          items.map((kegiatan, i) => (
            <Card 
              key={kegiatan.idKegiatan || i}
              gambar={kegiatan.gambar || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"}
              judul={kegiatan.nama}
              instansi={kegiatan.instansi || "Unknown"}
              tanggal={kegiatan.waktu}
              statusTAK={kegiatan.TAK ? "TAK WAJIB" : "NON TAK"}
              views={kegiatan.views || 0}
              deadline={kegiatan.deadline}
              onClick={()=>navigate(`/kegiatan/${kegiatan.idKegiatan}`)}
            />
          ))
        ) : (
          <p>Tidak ada kegiatan</p>
        )}
      </section>
    </div>
  )
}
export default Home
