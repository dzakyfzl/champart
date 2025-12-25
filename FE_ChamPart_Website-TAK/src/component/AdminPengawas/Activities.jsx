import React, { useState } from 'react'
import Badge from './Badge.jsx'
import SkeletonRow from './SkeletonRow.jsx'
import Modal from './Modal.jsx'
import Drawer from './Drawer.jsx'

export default function Activities({ loading, activities, onActivitiesChange, settings, pushToast }) {
  const [modal, setModal] = useState({ open: false, title: '', content: null, danger: false, confirmText: 'Konfirmasi', onConfirm: null })
  const [drawer, setDrawer] = useState({ open: false, title: '', content: null })

  const fetchWithRefresh = async (url, options = {}) => {
    let token = localStorage.getItem('access_token') || ''
    let headers = { ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    let res = await fetch(url, { ...options, headers })
    let json = null
    try { json = await res.json() } catch {}
    if (res.status === 401 && (json?.detail === 'Could not validate credentials')) {
      const refresh = localStorage.getItem('refresh_token') || ''
      if (refresh) {
        try {
          const r2 = await fetch('/token/access/get', { headers: { Authorization: `Bearer ${refresh}` } })
          let j2 = null
          try { j2 = await r2.json() } catch {}
          if (r2.ok && j2?.access_token) {
            localStorage.setItem('access_token', j2.access_token)
            token = j2.access_token
            headers = { ...(options.headers || {}), Authorization: `Bearer ${token}` }
            res = await fetch(url, { ...options, headers })
            try { json = await res.json() } catch {}
          }
        } catch {}
      }
    }
    return { res, json }
  }

  const formatTanggal = (dateString) => {
    try {
      const d = new Date(dateString)
      const tgl = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      return `${tgl} ${jam}`
    } catch { return '' }
  }

  function openConfirm({ title, content, danger, confirmText, onConfirm }) {
    setModal({ open: true, title, content, danger: !!danger, confirmText: confirmText || 'Konfirmasi', onConfirm })
  }
  function closeConfirm() {
    setModal({ open: false, title: '', content: null, danger: false, confirmText: 'Konfirmasi', onConfirm: null })
  }
  function openDrawer(title, content) {
    setDrawer({ open: true, title, content })
  }
  function closeDrawer() {
    setDrawer({ open: false, title: '', content: null })
  }

  async function approveItem(item) {
    if (settings?.moderation?.requireNoteOnApprove) {
      let note = ''
      const Content = () => (
        <div className="space-y-3">
          <div>Masukkan catatan persetujuan untuk <b>{item.nama}</b>.</div>
          <input className="w-full border rounded px-3 py-2" placeholder="Catatan persetujuan" onChange={e => { note = e.target.value }} />
        </div>
      )
      openConfirm({
        title: 'Setujui Kegiatan',
        content: <Content />,
        onConfirm: async () => {
          try {
            const token = localStorage.getItem('access_token')
            const res = await fetch(`/api/approve/kegiatan/${item.id}`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'approved' })
            })
            if (res.ok) {
              const next = activities.filter(a => a.id !== item.id)
              onActivitiesChange?.(next)
              pushToast?.('Kegiatan disetujui', 'success')
            } else {
              const data = await res.json()
              pushToast?.(data.message || 'Gagal menyetujui kegiatan', 'error')
            }
          } catch (err) {
            pushToast?.('Terjadi kesalahan', 'error')
          }
          closeConfirm()
        }
      })
    } else {
      openConfirm({
        title: 'Setujui Kegiatan',
        content: <div>Anda akan menyetujui <b>{item.nama}</b> oleh <b>{item.instansi}</b>.</div>,
        onConfirm: async () => {
          try {
            const token = localStorage.getItem('access_token')
            const res = await fetch(`/api/approve/kegiatan/${item.id}`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'approved' })
            })
            if (res.ok) {
              const next = activities.filter(a => a.id !== item.id)
              onActivitiesChange?.(next)
              pushToast?.('Kegiatan disetujui', 'success')
            } else {
              const data = await res.json()
              pushToast?.(data.message || 'Gagal menyetujui kegiatan', 'error')
            }
          } catch (err) {
            pushToast?.('Terjadi kesalahan', 'error')
          }
          closeConfirm()
        }
      })
    }
  }

  function rejectItem(item) {
    let alasan = ''
    const Content = () => (
      <div className="space-y-3">
        <div>Masukkan alasan penolakan untuk <b>{item.nama}</b>.</div>
        <textarea className="w-full border rounded px-3 py-2" placeholder="Alasan penolakan" rows="3" onChange={e => { alasan = e.target.value }} />
      </div>
    )
    openConfirm({
      title: 'Tolak Kegiatan',
      content: <Content />,
      danger: true,
      confirmText: 'Tolak',
      onConfirm: async () => {
        if (settings?.moderation?.requireReasonOnReject && !alasan.trim()) { 
          pushToast?.('Alasan penolakan wajib', 'error')
          return 
        }
        try {
          const token = localStorage.getItem('access_token')
          const res = await fetch(`/api/approve/kegiatan/${item.id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'rejected', alasan })
          })
          if (res.ok) {
            const next = activities.filter(a => a.id !== item.id)
            onActivitiesChange?.(next)
            pushToast?.('Kegiatan ditolak', 'success')
          } else {
            const data = await res.json()
            pushToast?.(data.message || 'Gagal menolak kegiatan', 'error')
          }
        } catch (err) {
          pushToast?.('Terjadi kesalahan', 'error')
        }
        closeConfirm()
      }
    })
  }

  function openDetail(item) {
    openDrawer('Detail Kegiatan', (<div className="p-4 text-sm">Loading...</div>))
    ;(async () => {
      try {
        const { res, json } = await fetchWithRefresh(`/api/kegiatan/${item.id}?skip_views=true`)
        if (!res.ok) {
          const msg = json?.message || json?.detail || 'Gagal memuat detail'
          setDrawer(d => ({ ...d, content: (<div className="p-4 text-red-700">{msg}</div>) }))
          return
        }
        const d = json
        const statusMap = { Pending: 'Pending', Approved: 'Approved', Denied: 'Denied', pending: 'Pending', approved: 'Approved', denied: 'Denied' }
        const statusLabel = statusMap[String(d?.status_kegiatan || item.status || '').trim()] || item.status || 'Pending'
        const chips = [
          ...(Array.isArray(d?.minat) ? d.minat.map(m => m.nama_minat) : []),
          ...(Array.isArray(d?.bakat) ? d.bakat.map(b => b.nama_bakat) : []),
        ].filter(Boolean)
       
        let imageUrl = ''
        try {
          const idLamp = Number(d?.lampiran?.idLampiran)
          if (Number.isFinite(idLamp) && idLamp > 0) {
            const token = localStorage.getItem('access_token') || ''
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            const rFile = await fetch(`/api/file/get/${idLamp}`, { headers })
            if (rFile.ok) {
              const blob = await rFile.blob()
              imageUrl = URL.createObjectURL(blob)
            }
          }
        } catch {}
        setDrawer(drw => ({
          ...drw,
          content: (
            <div className="space-y-4">
              {imageUrl && (
                <div className="w-full grid place-items-center">
                  <img
                    src={imageUrl}
                    alt="Lampiran"
                    className="max-h-[70vh] max-w-full h-auto object-contain rounded bg-gray-100 cursor-zoom-in"
                    onClick={() => window.open(imageUrl, '_blank')}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-gray-600">Nama</div>
                  <div className="font-medium">{d.nama}</div>
                </div>
                <div>
                  <div className="text-gray-600">Instansi</div>
                  <div className="font-medium">{d.nama_instansi}</div>
                </div>
                <div>
                  <div className="text-gray-600">Tanggal</div>
                  <div className="font-medium">{formatTanggal(d.waktu)}</div>
                </div>
                <div>
                  <div className="text-gray-600">Status</div>
                  <div className="font-medium"><Badge label={statusLabel} /></div>
                </div>
                <div>
                  <div className="text-gray-600">Nominal TAK</div>
                  <div className="font-medium">{Number(d.nominal_TAK) > 0 ? `${d.nominal_TAK} Poin` : '-'}</div>
                </div>
                <div>
                  <div className="text-gray-600">TAK Wajib</div>
                  <div className="font-medium">{d.TAK_wajib ? 'Ya' : 'Tidak'}</div>
                </div>
              </div>
              <div>
                <div className="text-gray-600">Deskripsi</div>
                <div>{d.deskripsi || '-'}</div>
              </div>
              {chips.length > 0 && (
                <div>
                  <div className="text-gray-600">Minat & Bakat</div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {chips.map((t, i) => (<span key={i} className="px-3 py-1 text-xs rounded-full bg-blue-600 text-white">{t}</span>))}
                  </div>
                </div>
              )}
            </div>
          )
        }))
      } catch {
        setDrawer(d => ({ ...d, content: (<div className="p-4 text-red-700">Gagal memuat detail</div>) }))
      }
    })()
  }

  return (
    <div className="bg-white rounded-xl shadow">
      <Modal open={modal.open} title={modal.title} onClose={closeConfirm} onConfirm={modal.onConfirm || (() => {})} confirmText={modal.confirmText} danger={modal.danger}>{modal.content}</Modal>
      <Drawer open={drawer.open} title={drawer.title} onClose={closeDrawer}>{drawer.content}</Drawer>
      <div className="p-4 font-semibold">Daftar Kegiatan</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Nama</th>
              <th className="px-4 py-2 text-left">Instansi</th>
              <th className="px-4 py-2 text-left">Tanggal</th>
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
                <td className="px-4 py-3"><Badge label={item.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1 rounded border" onClick={() => openDetail(item)}>Detail</button>
                    <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => approveItem(item)} disabled={item.status !== 'Pending'}>Setujui</button>
                    <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => rejectItem(item)} disabled={item.status !== 'Pending'}>Tolak</button>
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
