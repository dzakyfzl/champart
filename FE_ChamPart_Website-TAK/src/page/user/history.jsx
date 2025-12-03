import Card from "../../component/card.jsx"
import Back from '../../assets/svg/back-button.svg'
import { useNavigate } from 'react-router-dom'


function History() {
  const items = new Array(4).fill(0)
  const navigate = useNavigate()

  return (
    <div className="">
      <div className="flex gap-3 items-center mb-8">
        <img src={Back} alt="Back" 
          onClick={()=>navigate('/')}
          className="h-8 w-8 cursor-pointer" />
        <h1 className="text-2xl font-semibold text-center">History</h1>
      </div>
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
  )
}

export default History
