import React from 'react'

export default function SkeletonRow() {
  return (
    <tr>
      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
      <td className="px-4 py-3"><div className="h-8 bg-gray-200 rounded animate-pulse"></div></td>
    </tr>
  )
}
