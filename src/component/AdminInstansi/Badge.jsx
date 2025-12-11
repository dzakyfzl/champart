import React from 'react'

export default function Badge({ label }) {
  const map = { Draft: 'bg-gray-100 text-gray-800', Menunggu: 'bg-yellow-100 text-yellow-800', Disetujui: 'bg-green-100 text-green-800', Ditolak: 'bg-red-100 text-red-800' }
  const cls = map[label] || 'bg-gray-100 text-gray-800'
  return (<span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>)
}
