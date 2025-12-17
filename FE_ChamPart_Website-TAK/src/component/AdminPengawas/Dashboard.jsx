import React from 'react'

export default function Dashboard({ activities, institutions, secretCodes, pendingCount }) {
  const menungguKegiatan = activities.filter(a => a.status === 'Menunggu').length
  const menungguInstansi = institutions.filter(i => i.status === 'Menunggu').length
  const kodeAktif = secretCodes.filter(s => s.status === 'Aktif').length
  const kodeKadaluarsa = secretCodes.filter(s => s.status === 'Kadaluarsa').length
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-600">Kegiatan menunggu</div>
          <div className="text-2xl font-semibold">{pendingCount || 0}</div>
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
          {activities.length === 0 ? (
          <div className="text-sm text-gray-600 text-center py-8">
            Tindakan terakhir akan tampil di sini.
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{a.nama}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {a.instansi} • {a.tanggal}
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    a.status === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : a.status === 'Disetujui'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
