import Card from "../../component/card.jsx"
import Back from '../../assets/svg/back-button.svg'
import { useNavigate } from 'react-router-dom'

function Bookmark() {
  const items = new Array(4).fill(0)
  const navigate = useNavigate()
  const deadlines = [
    '19/10/2021 in 18.00 WIB',
    '19/10/2021 in 23.59 WIB',
    '19/10/2021 in 00.00 WIB',
    '19/10/2021 in 00.00 WIB'
  ]

  return (
    <div className="">
      <div className="flex gap-3 items-center mb-8">
             <img src={Back} alt="Back" 
               onClick={()=>navigate('/')}
               className="h-8 w-8 cursor-pointer" />
             <span className="text-2xl font-semibold text-center">Bookmark</span>
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((_, i) => (
          <div key={i} className="space-y-2">
            <Card
              gambar="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
              judul="Artificial Intelligence Competition “Implementasi AI dalam Kehidupan Sehari - Hari”"
              instansi="Universitas Negeri Yogyakarta"
              tanggal="Sabtu, 31 Oktober 2021"
              statusTAK="TAK WAJIB"
              views={100}
              deadline="19/10/2021"
              onClick={()=>navigate('/kegiatan')}
            />
            <div className="text-center text-sm text-gray-700">{deadlines[i % deadlines.length]}</div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Bookmark
