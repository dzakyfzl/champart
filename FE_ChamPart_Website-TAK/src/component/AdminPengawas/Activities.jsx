import React from 'react'
import Badge from './Badge.jsx'
import SkeletonRow from './SkeletonRow.jsx'

export default function Activities({ loading, activities, onViewDetail, onApprove, onReject }) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-4 font-semibold">Daftar Kegiatan</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Nama</th>
              <th className="px-4 py-2 text-left">Instansi</th>
              <th className="px-4 py-2 text-left">Tanggal</th>
              <th className="px-4 py-2 text-left">Pemohon</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && [1,2,3].map(i => <SkeletonRow key={i} />)}
            {!loading && activities.length === 0 && (
              <tr><td className="px-4 py-8 text-center text-gray-600" colSpan="6">Belum ada kegiatan</td></tr>
            )}
            {!loading && activities.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.nama}</td>
                <td className="px-4 py-3">{item.instansi}</td>
                <td className="px-4 py-3">{item.tanggal}</td>
                <td className="px-4 py-3">{item.pemohon}</td>
                <td className="px-4 py-3"><Badge label={item.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1 rounded border" onClick={() => onViewDetail(item)}>Detail</button>
                    <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => onApprove(item)} disabled={item.status !== 'Pending'}>Setujui</button>
                    <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => onReject(item)} disabled={item.status !== 'Pending'}>Tolak</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
