import React from 'react'

export default function Dashboard({ activities, institutions, secretCodes }) {
  const menungguKegiatan = activities.filter(a => a.status === 'Menunggu').length
  const menungguInstansi = institutions.filter(i => i.status === 'Menunggu').length
  const kodeAktif = secretCodes.filter(s => s.status === 'Aktif').length
  const kodeKadaluarsa = secretCodes.filter(s => s.status === 'Kadaluarsa').length
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-600">Kegiatan menunggu</div>
          <div className="text-2xl font-semibold">{menungguKegiatan}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-600">Instansi menunggu</div>
          <div className="text-2xl font-semibold">{menungguInstansi}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-600">Kode aktif</div>
          <div className="text-2xl font-semibold">{kodeAktif}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-600">Kode kadaluarsa</div>
          <div className="text-2xl font-semibold">{kodeKadaluarsa}</div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-2">Aktivitas terbaru</div>
        <div className="text-sm text-gray-600">Tindakan terakhir akan tampil di sini.</div>
      </div>
    </div>
  )
}
