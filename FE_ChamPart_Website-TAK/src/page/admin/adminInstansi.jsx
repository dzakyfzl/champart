import React, { useEffect, useState } from 'react'
import Logo from '../../assets/svg/champart-logo.svg'
import Toast from '../../component/AdminInstansi/Toast.jsx'
import Modal from '../../component/AdminInstansi/Modal.jsx'
import NavButton from '../../component/AdminInstansi/NavButton.jsx'
import { IconHome, IconList, IconUsers, IconUser, IconBuilding, IconLogout } from '../../component/AdminInstansi/icons.jsx'
import Dashboard from '../../component/AdminInstansi/Dashboard.jsx'
import Activities from '../../component/AdminInstansi/Activities.jsx'
import Requests from '../../component/AdminInstansi/Requests.jsx'
import ProfileAccount from '../../component/AdminInstansi/ProfileAccount.jsx'
import ProfileInstitution from '../../component/AdminInstansi/ProfileInstitution.jsx'

function AdminInstansi() {
  const tabs = ['Dashboard', 'Kegiatan', 'Akun Tambahan', 'Profil Akun', 'Profil Instansi']
  const [tab, setTab] = useState(tabs[0])
  const [toasts, setToasts] = useState([])
  const [modal, setModal] = useState({ open: false, title: '', content: null, confirmText: 'Simpan', danger: false, onConfirm: null })
  const [activities, setActivities] = useState(() => { try { const raw = localStorage.getItem('instansi_activities'); return raw ? JSON.parse(raw) : [] } catch { return [] } })
  const [requests, setRequests] = useState(() => { try { const raw = localStorage.getItem('instansi_requests'); return raw ? JSON.parse(raw) : [] } catch { return [] } })
  const [account, setAccount] = useState(() => { try { const raw = localStorage.getItem('instansi_account'); return raw ? JSON.parse(raw) : { name: 'Admin Instansi', email: 'admin@instansi.id', phone: '', avatar: '' } } catch { return { name: 'Admin Instansi', email: 'admin@instansi.id', phone: '', avatar: '' } } })
  const [institution, setInstitution] = useState(() => { try { const raw = localStorage.getItem('instansi_profile'); return raw ? JSON.parse(raw) : { id: 'I-LOCAL', name: 'Instansi Anda', logo: '' } } catch { return { id: 'I-LOCAL', name: 'Instansi Anda', logo: '' } } })

  useEffect(() => { try { localStorage.setItem('instansi_activities', JSON.stringify(activities)) } catch {} }, [activities])
  useEffect(() => { try { localStorage.setItem('instansi_requests', JSON.stringify(requests)) } catch {} }, [requests])
  useEffect(() => { try { localStorage.setItem('instansi_account', JSON.stringify(account)) } catch {} }, [account])
  useEffect(() => { try { localStorage.setItem('instansi_profile', JSON.stringify(institution)) } catch {} }, [institution])

  useEffect(() => { /* removed server polling */ }, [institution.id])

  function pushToast(message, type = 'info') {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500)
  }

  function openModal(title, content, onConfirm, confirmText = 'Simpan', danger = false) { setModal({ open: true, title, content, onConfirm, confirmText, danger }) }
  function closeModal() { setModal({ open: false, title: '', content: null, onConfirm: null, confirmText: 'Simpan', danger: false }) }

  
  function saveAccount(updates) { setAccount(prev => ({ ...prev, ...updates })) }
  function saveInstitution(updates) { setInstitution(prev => ({ ...prev, ...updates })) }
  function handleLogout() { 
    pushToast('Logout'); 
    const token = localStorage.getItem('access_token') || ''
    setTimeout(() => { window.location.href = '/login' }, 600) }
  function deleteAccount() { openModal('Hapus Akun', <div>Anda akan menghapus akun ini.</div>, () => { setAccount({ name: '', email: '', phone: '', avatar: '' }); pushToast('Akun dihapus'); closeModal() }, 'Hapus', true) }

  async function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }


  return (
    <div className="h-screen flex">
      <Toast toasts={toasts} remove={(id)=>setToasts(prev=>prev.filter(t=>t.id!==id))} />
      <Modal open={modal.open} title={modal.title} onClose={closeModal} onConfirm={modal.onConfirm || (()=>{})} confirmText={modal.confirmText} danger={modal.danger}>{modal.content}</Modal>
      <aside className="w-16 bg-white border-r hidden md:flex flex-col items-center py-3">
        <div className="w-14 h-14 grid place-items-center">
          {institution.logo ? (
            <img src={institution.logo} alt="Logo" className="w-12 h-12" />
          ) : (
            <img src={Logo} alt="Logo" className="w-12 h-12" />
          )}
        </div>
        <div className="w-12 h-px bg-gray-200 my-3"></div>
        <nav className="flex-1 flex flex-col items-center gap-3">
          <NavButton title="Dashboard" active={tab===tabs[0]} onClick={()=>setTab(tabs[0])}><IconHome /></NavButton>
          <NavButton title="Kegiatan" active={tab===tabs[1]} onClick={()=>setTab(tabs[1])}><IconList /></NavButton>
          <NavButton title="Akun Tambahan" active={tab===tabs[2]} onClick={()=>setTab(tabs[2])}><IconUsers /></NavButton>
          <NavButton title="Profil Akun" active={tab===tabs[3]} onClick={()=>setTab(tabs[3])}><IconUser /></NavButton>
          <NavButton title="Profil Instansi" active={tab===tabs[4]} onClick={()=>setTab(tabs[4])}><IconBuilding /></NavButton>
        </nav>
        <div className="mt-auto">
          <NavButton title="Logout" active={false} onClick={handleLogout}><IconLogout /></NavButton>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="md:hidden">
              <select className="border rounded px-3 py-2" value={tab} onChange={e=>setTab(e.target.value)}>
                {tabs.map(t => (<option key={t}>{t}</option>))}
              </select>
            </div>
            <div className="hidden md:block text-sm text-gray-600">{institution.name} › {tab}</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-800 text-white grid place-items-center text-sm overflow-hidden">
                {account.avatar ? (<img src={account.avatar} alt="Avatar" className="w-full h-full object-cover" />) : 'AI'}
              </div>
            </div>
          </div>
        </header>
        <section className="p-4 overflow-y-auto flex-1">
          {tab===tabs[0] && <Dashboard activities={activities} requests={requests} />}
          {tab===tabs[1] && (
            <Activities
              activities={activities}
              setActivities={setActivities}
              pushToast={pushToast}
              openModal={openModal}
              closeModal={closeModal}
            />
          )}
          {tab===tabs[2] && (
            <Requests
              requests={requests}
              setRequests={setRequests}
              pushToast={pushToast}
              openModal={openModal}
              closeModal={closeModal}
            />
          )}
          {tab===tabs[3] && (
            <ProfileAccount
              account={account}
              onSave={saveAccount}
              onLogout={handleLogout}
              onDelete={deleteAccount}
              fileToDataUrl={fileToDataUrl}
            />
          )}
          {tab===tabs[4] && (
            <ProfileInstitution
              institution={institution}
              onSave={saveInstitution}
              fileToDataUrl={fileToDataUrl}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default AdminInstansi
