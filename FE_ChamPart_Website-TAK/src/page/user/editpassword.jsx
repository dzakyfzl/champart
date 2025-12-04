import Back from '../../assets/svg/back-button.svg' 
import { useNavigate } from "react-router-dom"
import { useState } from "react";
function EditPassword() {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const token = localStorage.getItem("access_token")
  const navigate = useNavigate()

  const handleEditPassword = async () => {
    if (newPassword !== confirmPassword){
      alert("Password baru dan konfirmasi password tidak sama")
      return
    }
    try {
      const res = await fetch("api/account/edit-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          password_lama: oldPassword,
          password_baru: newPassword
        })
      })

      const data = await res.json()
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        console.log("Token akses diperbarui");
      }

      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
        console.log("Refresh token diperbarui");
      }
      if (!res.ok) {
        alert("Gagal mengubah password: " + data.message)
        return
      }
      alert("Password berhasil diubah")
      window.location.reload();
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      console.error(err)
      alert("Gagal menghubungi server")
    }
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 h-[calc(90vh-64px)]">
      <aside className="lg:border-r lg:pr-4 lg:border-b-0 lg:pb-0 md:border-b md:pb-4 ">
        <nav className="space-y-2">
          <a href="/editprofile" className="block rounded-md px-4 py-3 hover:bg-gray-100">Pengaturan Informasi Akun</a>
          <a className="block rounded-md px-4 py-3 bg-[#F2E9DB]">Pengaturan Keamanan</a>
          <a href="/editemail" className="block rounded-md px-4 py-3 hover:bg-gray-100">Pengaturan Email</a>
        </nav>
      </aside>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <img src={Back} alt="Back" 
              onClick={()=>navigate('/')}
          className="h-8 w-8 cursor-pointer" />
          <h2 className="text-2xl md:text-3xl font-semibold">Pengaturan Keamanan</h2>
        </div>

        <div className="space-y-2 ml-10">
          <h3 className="text-lg font-semibold">Keamanan Akun</h3>
          <div className="max-w-xl space-y-5">
            <label className="block">
              <div className="text-sm font-medium mb-1">Tuliskan Password Lama</div>
              <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </label>
            <label className="block">
              <div className="text-sm font-medium mb-1">Tuliskan Password Baru</div>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </label>
            <label className="block">
              <div className="text-sm font-medium mb-1">Konfirmasi Password Baru</div>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </label>
            <button 
            type="button" 
            onClick={handleEditPassword}
            className="px-6 py-2.5 rounded-md bg-[#ACE2E1] text-gray-900 border border-gray-300 hover:bg-[#6DD5D3]">Edit</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EditPassword
