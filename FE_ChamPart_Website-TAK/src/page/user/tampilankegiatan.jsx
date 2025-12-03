import Eyes from '../../assets/svg/eyes.svg'
import Back from '../../assets/svg/back-button.svg' 
import { useNavigate } from "react-router-dom"
function TampilanKegiatan(){
  const navigate = useNavigate()
  const image = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
  const chips = [
    'Riset & Karya Ilmiah',
    'Kreativitas & Menghasilkan Ide',
    'Analisis & Logika'
  ]
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
            <img src={image} alt="Poster" className="w-full h-[420px] object-cover" />
          </div>
          <button type="button" className="mt-4 w-full rounded-md border border-gray-300 bg-[#ACE2E1] text-gray-800 py-2.5 hover:bg-teal-200">Bookmark Kegiatan</button>
          
        </div>

        <div className="space-y-3">
          <div className="text-xl md:text-2xl font-semibold">Artificial Intelligence Competition "Implementasi AI dalam Kehidupan Sehari - Hari"</div>
          <div className="text-sm text-gray-700">Sabtu, 31 Oktober 2021 · Universitas Mercu Buana Yogyakarta</div>
          <div className="font-semibold text-sm">TAK WAJIB</div>
          <div className="text-sm">Nominal: 4</div>
          <div className="space-y-2 text-sm">
            <p className="">Universitas Mercu Buana Yogyakarta mengadakan Artificial Intelligence Competition (AIC) dengan tema “Implementasi AI dalam Kehidupan Sehari-hari.” Kompetisi ini bertujuan mendorong siswa SMA/SMK serta mahasiswa S1 untuk berinovasi dalam penerapan teknologi kecerdasan buatan pada berbagai aspek kehidupan modern.</p>
            <p className="">Peserta dapat memilih berbagai topik kompetisi seperti Internet of Things (IoT), Business Intelligence, Decision Support System, Machine Learning, serta Data Mining pada berbagai bidang termasuk pertanian, ekonomi, psikologi, pendidikan, UMKM, kesehatan, teknologi informasi, dan pemerintahan. Selain itu, peserta diwajibkan membuat prototipe yang dapat berupa penerapan teknologi IoT, aplikasi web, desktop, atau aplikasi mobile (Android/iOS).</p>
            <p className="">Acara ini akan berlangsung secara virtual melalui Zoom dan YouTube pada 9 November 2021, sehingga memungkinkan peserta dari seluruh Indonesia untuk ikut berpartisipasi secara mudah dan fleksibel.</p>
            <p className="">Tersedia hadiah menarik untuk tiga juara utama, dengan total jutaan rupiah. Pendaftaran dibuka untuk tim beranggotakan 2–3 orang dengan biaya Rp125.000 per tim, dan proses pendaftaran dilakukan melalui website resmi AIC.</p>
            <p className="">Event ini menjadi kesempatan besar bagi generasi muda untuk mengasah kemampuan teknologi, berkreasi, dan menunjukkan kontribusi mereka dalam penerapan kecerdasan buatan di dunia nyata.</p>
          </div>

          
            <div className="pt-2">
              <div className="flex flex-wrap gap-2">
                {chips.map((t)=> (
                  <span key={t} className="px-3 py-1 text-xs rounded-full bg-[#008DDA] text-white">{t}</span>
                ))}
              </div>
            <div className="flex items-start justify-between pt-2">
              <div className="text-xs text-gray-500 pt-2">Diumumkan pada 19/10/2021</div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#008DDA] text-white text-xs">
                <img src={Eyes} alt="Views" className="w-4 h-4" />
                <span>100</span>
              </div>
            </div>  
          </div>
        </div>
      </div>
    </div>
  )
}

export default TampilanKegiatan
