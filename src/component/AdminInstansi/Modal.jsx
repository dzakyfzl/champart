import React from 'react'

export default function Modal({ open, title, children, onClose, onConfirm, confirmText = 'Simpan', danger }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl">
          <div className="px-6 pt-6 text-lg font-semibold">{title}</div>
          <div className="px-6 py-4 text-sm">{children}</div>
          <div className="px-6 pb-6 flex justify-end gap-3">
            <button className="px-4 py-2 rounded border" onClick={onClose}>Batal</button>
            <button className={`px-4 py-2 rounded text-white ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`} onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
