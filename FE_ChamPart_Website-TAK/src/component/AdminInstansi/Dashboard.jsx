import React from 'react'

export default function Dashboard({ activities, requests }) {
  const totalDraft = activities.filter(a => a.status === 'Draft').length
  const totalPending = activities.filter(a => a.status === 'Menunggu').length
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4"><div className="text-sm text-gray-600">Draft</div><div className="text-2xl font-semibold">{totalDraft}</div></div>
        <div className="bg-white rounded-xl shadow p-4"><div className="text-sm text-gray-600">Menunggu Persetujuan</div><div className="text-2xl font-semibold">{totalPending}</div></div>
        <div className="bg-white rounded-xl shadow p-4"><div className="text-sm text-gray-600">Pengajuan Akun</div><div className="text-2xl font-semibold">{requests.length}</div></div>
      </div>
    </div>
  )
}
