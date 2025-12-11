import React from 'react'

export default function Drawer({ open, title, children, onClose }) {
  return (
    <div className={`fixed inset-0 z-30 ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
      <div className={`absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="font-semibold">{title}</div>
          <button className="text-sm text-gray-600 hover:text-gray-900" onClick={onClose}>Tutup</button>
        </div>
        <div className="p-6 text-sm overflow-y-auto h-[calc(100%-64px)]">{children}</div>
      </div>
    </div>
  )
}
