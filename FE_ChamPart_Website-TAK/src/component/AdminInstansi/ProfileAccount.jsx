import React, { useState } from 'react'

export default function ProfileAccount({ account, onSave, onLogout, onDelete, fileToDataUrl }) {
  const [name, setName] = useState(account.name)
  const [email, setEmail] = useState(account.email)
  const [phone, setPhone] = useState(account.phone)
  const [avatar, setAvatar] = useState(account.avatar)
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-3">Profil Akun</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <div className="text-sm font-medium mb-1">Nama</div>
            <input id="akun-nama" className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
          </label>
          <label className="block">
            <div className="text-sm font-medium mb-1">Email</div>
            <input id="akun-email" type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
          </label>
          <label className="block md:col-span-2">
            <div className="text-sm font-medium mb-1">Nomor Telepon</div>
            <input id="akun-phone" className="w-full border rounded px-3 py-2" value={phone} onChange={e=>setPhone(e.target.value)} />
          </label>
        </div>
        <div className="flex items-center gap-4 mt-4">
          {avatar ? (<img src={avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border" />) : (<div className="w-12 h-12 rounded-full bg-gray-200" />)}
          <input aria-label="Upload avatar" type="file" accept="image/*" onChange={async (e)=>{ const file=e.target.files?.[0]; if (file) { const url=await fileToDataUrl(file); setAvatar(url) } }} />
        </div>
        <div className="flex gap-2 mt-4">
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={()=>onSave({ name, email, phone, avatar })}>Simpan</button>
          <button className="px-4 py-2 rounded border" onClick={onLogout}>Logout</button>
          <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={onDelete}>Hapus Akun</button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-3">Preview</div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
            {avatar ? (<img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />) : (<div className="w-full h-full grid place-items-center text-xs text-gray-500">PP</div>)}
          </div>
          <div>
            <div className="font-medium">{name || 'Admin Instansi'}</div>
            <div className="text-sm text-gray-600">{email || 'admin@instansi.id'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
