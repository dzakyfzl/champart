import React, { useEffect, useState } from 'react'
import Badge from './Badge.jsx'
import SkeletonRow from './SkeletonRow.jsx'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activities, setActivities] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [adminCandidates, setAdminCandidates] = useState([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const getJson = async (url) => {
          let token = localStorage.getItem('access_token') || ''
          let headers = token ? { Authorization: `Bearer ${token}` } : {}
          let res = await fetch(url, { method: 'GET', headers })
          let j = null
          try { j = await res.json() } catch {}
          if (res.status === 401 && (j?.detail === 'Could not validate credentials')) {
            const refresh = localStorage.getItem('refresh_token') || ''
            if (refresh) {
              try {
                const r2 = await fetch('/token/access/get', { headers: { Authorization: `Bearer ${refresh}` } })
                let j2 = null
                try { j2 = await r2.json() } catch {}
                if (r2.ok && j2?.access_token) {
                  localStorage.setItem('access_token', j2.access_token)
                  token = j2.access_token
                  headers = { Authorization: `Bearer ${token}` }
                  res = await fetch(url, { method: 'GET', headers })
                  try { j = await res.json() } catch {}
                }
              } catch {}
            }
          }
          if (!res.ok) throw new Error(j?.message || j?.detail || `HTTP ${res.status}`)
          return j
        }

        const [acts, instAll, cand] = await Promise.all([
          getJson('/api/kegiatan/pending').catch(e => { throw new Error(e.message) }),
          getJson('/api/calon/instansi/get').catch(e => { throw new Error(e.message) }),
          getJson('/api/calon/admin-instansi/get').catch(e => { throw new Error(e.message) })
        ])

        const mapActivities = (arr) => {
          return (Array.isArray(arr) ? arr : []).map(k => ({
            id: k.idKegiatan,
            nama: k.nama,
            instansi: k.nama_instansi,
            tanggal: new Date(k.waktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            pemohon: k.nama_instansi,
            status: 'Pending'
          }))
        }
        const mapInstitutions = (obj) => {
          const arr = Array.isArray(obj?.data) ? obj.data : []
          return arr.map(it => ({
            id: it.idCalonInstansi,
            nama: it.nama,
            jenis: it.jenis,
            alamat: it.alamat,
            jenis_calon: it.jenis_calon || '-'
          }))
        }
        const mapCandidates = (obj) => {
          const arr = Array.isArray(obj?.data) ? obj.data : []
          return arr.map(it => ({
            id: it.idCalonAdminInstansi,
            email: it.email,
            namaInstansi: it.namaInstansi
          }))
        }

        if (!cancelled) {
          setActivities(mapActivities(acts))
          setInstitutions(mapInstitutions(instAll))
          setAdminCandidates(mapCandidates(cand))
        }
      } catch (e) {
        if (!cancelled) setError(typeof e?.message === 'string' ? e.message : 'Gagal memuat data dashboard')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const menungguKegiatan = activities.length
  const menungguInstansi = institutions.length
  const menungguAdmin = adminCandidates.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-600">Kegiatan menunggu</div>
          <div className="text-2xl font-semibold">{menungguKegiatan}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-600">Instansi menunggu</div>
          <div className="text-2xl font-semibold">{menungguInstansi}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-600">Calon Admin Instansi menunggu</div>
          <div className="text-2xl font-semibold">{menungguAdmin}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-2">Kegiatan Menunggu</div>
        {error && <div className="text-sm text-red-700 mb-2">{error}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">Instansi</th>
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-left">Pemohon</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading && [1,2,3].map(i => <SkeletonRow key={i} />)}
              {!loading && activities.length === 0 && (<tr><td className="px-4 py-8 text-center text-gray-600" colSpan="5">Tidak ada kegiatan menunggu</td></tr>)}
              {!loading && activities.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.nama}</td>
                  <td className="px-4 py-3">{item.instansi}</td>
                  <td className="px-4 py-3">{item.tanggal}</td>
                  <td className="px-4 py-3">{item.pemohon}</td>
                  <td className="px-4 py-3"><Badge label="Menunggu" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-2">Instansi Menunggu</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">Jenis</th>
                <th className="px-4 py-2 text-left">Alamat</th>
                <th className="px-4 py-2 text-left">Jenis Calon</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading && [1,2,3].map(i => <SkeletonRow key={i} />)}
              {!loading && institutions.length === 0 && (<tr><td className="px-4 py-8 text-center text-gray-600" colSpan="4">Tidak ada instansi menunggu</td></tr>)}
              {!loading && institutions.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.nama}</td>
                  <td className="px-4 py-3">{item.jenis}</td>
                  <td className="px-4 py-3">{item.alamat}</td>
                  <td className="px-4 py-3">{item.jenis_calon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-2">Calon Admin Instansi Menunggu</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Nama Instansi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading && [1,2,3].map(i => <SkeletonRow key={i} />)}
              {!loading && adminCandidates.length === 0 && (<tr><td className="px-4 py-8 text-center text-gray-600" colSpan="2">Tidak ada calon admin</td></tr>)}
              {!loading && adminCandidates.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.namaInstansi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
