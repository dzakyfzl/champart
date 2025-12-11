import React from 'react'

export default function NavButton({ title, active, onClick, children }) {
  return (
    <button
      className={`w-12 h-12 grid place-items-center rounded-full ${active ? 'bg-gray-200' : 'hover:bg-gray-100'} transition`}
      title={title}
      onClick={onClick}
    >
      <div className={`${active ? 'text-gray-900' : 'text-gray-600'}`}>{children}</div>
    </button>
  )
}
