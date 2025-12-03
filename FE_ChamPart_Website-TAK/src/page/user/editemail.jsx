import { useState } from "react"
import Back from '../../assets/svg/back-button.svg' 
import { useNavigate } from "react-router-dom"
function EditEmail() {
  const [editing, setEditing] = useState(false)
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
      <aside className="border-r pr-4 h-full">
        <nav className="space-y-2">
          <a href="/editprofile" className="block rounded-md px-4 py-3 hover:bg-gray-100">Pengaturan Informasi Akun</a>
          <a href="/editpassword" className="block rounded-md px-4 py-3 hover:bg-gray-100">Pengaturan Keamanan</a>
          <a className="block rounded-md px-4 py-3 bg-[#F2E9DB]">Pengaturan Email</a>
        </nav>
      </aside>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <img src={Back} alt="Back" 
              onClick={()=>navigate('/')}
          className="h-8 w-8 cursor-pointer" />
          <h2 className="text-2xl md:text-3xl font-semibold">Pengaturan Email</h2>
        </div>

        {!editing && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Akun Email</h3>
            <div className="space-y-4">
              <div className="text-gray-800">mdtafarizza29@gmail.com</div>
              <button type="button" onClick={()=>setEditing(true)} className="px-6 py-2.5 rounded-md bg-[#ACE2E1] text-gray-900 border border-gray-300 hover:bg-[#6DD5D3]">Edit</button>
            </div>
          </div>
        )}

        {editing && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Akun Email</h3>
            <div className="border rounded-xl p-8 max-w-xl">
              <div className="text-2xl font-semibold text-center mb-6">Change your email address</div>
              <div className="space-y-4">
                <label className="block">
                  <div className="text-sm font-medium mb-1">Email address</div>
                  <input type="email" className="w-full rounded-md border border-gray-300 px-3 py-2" />
                </label>
                <label className="block">
                  <div className="text-sm font-medium mb-1">Password</div>
                  <input type="password" className="w-full rounded-md border border-gray-300 px-3 py-2" />
                </label>
                <button type="button" onClick={()=>setEditing(false)} className="px-6 py-2.5 rounded-md bg-[#ACE2E1] text-gray-900 border border-gray-300 hover:bg-[#6DD5D3]">Save</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default EditEmail
