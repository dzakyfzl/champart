import React from 'react'

export default function NavButton({ title, active, onClick, children }) {
  return (
     <button
      onClick={onClick}
      className={`relative w-12 h-12 rounded-lg grid place-items-center transition-colors ${
        active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
      }`}
      title={title}
    >
      {children}
    </button>
  )
}
