import React from 'react'

export default function Toast({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map(t => (
        <button
          key={t.id}
          className={`rounded-lg shadow px-4 py-2 text-sm ${t.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`}
          onClick={() => remove(t.id)}
        >
          {t.message}
        </button>
      ))}
    </div>
  )
}
