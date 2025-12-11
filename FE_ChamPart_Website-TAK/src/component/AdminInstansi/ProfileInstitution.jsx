import React, { useState } from 'react'

export default function ProfileInstitution({ institution, onSave, fileToDataUrl }) {
  const [id, setId] = useState(institution.id)
  const [name, setName] = useState(institution.name)
  const [logo, setLogo] = useState(institution.logo)
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-3">Profil Instansi</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <div className="text-sm font-medium mb-1">ID Instansi</div>
            <input id="instansi-id" className="w-full border rounded px-3 py-2" value={id} onChange={e=>setId(e.target.value)} />
          </label>
          <label className="block">
            <div className="text-sm font-medium mb-1">Nama Instansi</div>
            <input id="instansi-nama" className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
          </label>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="w-16 h-16 rounded bg-gray-200 overflow-hidden">
            {logo ? (<img src={logo} alt="Logo" className="w-full h-full object-cover" />) : (<div className="w-full h-full grid place-items-center text-xs text-gray-500">Logo</div>)}
          </div>
          <input aria-label="Upload logo" type="file" accept="image/*" onChange={async (e)=>{ const file=e.target.files?.[0]; if (file) { const url=await fileToDataUrl(file); setLogo(url) } }} />
        </div>
        <button className="mt-4 px-4 py-2 rounded bg-blue-600 text-white" onClick={()=>onSave({ id, name, logo })}>Simpan</button>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-3">Preview</div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden">
            {logo ? (<img src={logo} alt="Logo Preview" className="w-full h-full object-cover" />) : (<div className="w-full h-full grid place-items-center text-xs text-gray-500">Logo</div>)}
          </div>
          <div className="font-medium">{name || 'Instansi Anda'}</div>
        </div>
      </div>
    </div>
  )
}
