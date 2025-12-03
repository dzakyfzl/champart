# Referensi UI/UX Admin Pengawas Control Panel

## Arsitektur Teknis (Selaras Repo Saat Ini)
- React UMD + Tailwind via CDN pada satu halaman `admin.html`
- Navigasi tab/section berbasis state React (tanpa router eksternal)
- Komponen utilitas: tabel, modal, drawer, toast, badge, skeleton (Tailwind)

## Informasi Arsitektur & Navigasi
- Sidebar kiri: `Dashboard`, `Kegiatan`, `Instansi`, `Secret Code`, `Audit Log`, `Pengaturan`
- Topbar: pencarian, notifikasi, profil (avatar) + menu keluar
- Breadcrumbs: `Admin > [Section] > [Detail]`
- Responsif: sidebar collapse di mobile, aksi utama tetap terlihat

## Halaman & Fitur Utama
- Dashboard
  - Kartu ringkas: `Kegiatan menunggu`, `Instansi menunggu`, `Kode aktif`, `Kode kadaluarsa`
  - Grafik mini tren persetujuan mingguan, daftar cepat 5 item terbaru
- Kegiatan (persetujuan)
  - Tabel daftar permintaan dengan kolom: `Nama Kegiatan`, `Instansi`, `Tanggal`, `Pemohon`, `Status`, `Prioritas`, `Aksi`
  - Filter: status, tanggal, instansi, prioritas; pencarian teks
  - Aksi baris: `Lihat Detail`, `Setujui`, `Tolak`
  - Bulk actions: centang banyak, `Setujui`, `Tolak`
  - Detail drawer: deskripsi, lokasi, jadwal, lampiran, catatan pemohon
  - Modal konfirmasi: alasan penolakan (wajib), catatan persetujuan (opsional)
- Instansi (persetujuan)
  - Tabel dengan kolom: `Nama Instansi`, `Jenis`, `Tanggal Daftar`, `Status`, `Dokumen`, `Aksi`
  - Preview dokumen (image/PDF) di drawer
  - Aksi: `Setujui`, `Tolak` dengan modal konfirmasi
- Secret Code
  - Form: pilih `Instansi`, opsi `masa berlaku`, `jumlah penggunaan`, `catatan`
  - Tombol `Generate` menampilkan hasil di kartu dengan `Copy`, `Unduh`, `Revoke`
  - Tabel riwayat: `Instansi`, `Kode`, `Dibuat`, `Kadaluarsa`, `Penggunaan`, `Status`, `Aksi`
- Audit Log
  - Daftar tindakan: waktu, pengguna (Admin Pengawas), aksi, target, hasil
  - Filter berdasarkan rentang tanggal dan tipe aksi

## Alur Pengguna (Flow)
- Menyetujui Kegiatan
  - Buka `Kegiatan` → pilih baris → `Lihat Detail` → `Setujui/Tolak` → modal konfirmasi → toast sukses → status/badge berubah
- Menyetujui Instansi
  - Buka `Instansi` → cek dokumen → `Setujui/Tolak` → modal konfirmasi → toast sukses → status/badge berubah
- Generate Secret Code
  - Buka `Secret Code` → pilih instansi + parameter → `Generate` → tampilkan kode → `Copy`/`Revoke` → tercatat di riwayat

## Komponen & Pola Desain
- Tabel: header sticky, kolom dapat diurutkan, zebra rows, checkbox seleksi
- Badge status: `Menunggu`, `Disetujui`, `Ditolak`, `Aktif`, `Kadaluarsa` (warna konsisten)
- Tombol: primer (isi), sekunder (outline), bahaya (merah) untuk `Tolak`
- Modal: konfirmasi, form singkat; tombol `Batal`/`Konfirmasi`
- Drawer: pratinjau detail tanpa pindah halaman
- Toast: feedback non-intrusif, sudut kanan atas
- Skeleton: loading daftar dan detail

## State, Empty, Error
- Loading: skeleton cards/tabel
- Empty: ilustrasi + CTA `Refresh`/`Ubah filter`
- Error: panel dengan pesan manusiawi, tombol `Coba lagi`, detail teknis tersembunyi

## Aksesibilitas & Kebolehgunaan
- Fokus ring yang jelas (Tailwind `focus:ring-2`), tab-order logis
- ARIA pada modal/drawer, label form yang eksplisit
- Kunci keyboard: `Enter` untuk konfirmasi, `Esc` untuk batal
- Microcopy bahasa Indonesia: jelas, ringkas, berorientasi aksi

## Keamanan & Audit
- Aksi sensitif selalu butuh konfirmasi; tampilkan ringkas konsekuensi
- Jangan tampilkan/rekam secret code di log; hanya hash/metadata
- Audit log untuk setiap `Setujui/Tolak/Generate/Revoke`

## Visual & Layout
- Grid 12 kolom; konten utama max-width nyaman (mis. `max-w-screen-2xl`)
- Kontras warna memadai; gunakan palet netral + aksen biru/hijau/merah
- Ikon konsisten (mis. Heroicons via CDN)

## Data & Kolom (Rujukan)
- Kegiatan: `id`, `nama`, `instansi`, `pemohon`, `tanggal`, `lokasi`, `status`, `prioritas`
- Instansi: `id`, `nama`, `jenis`, `tanggal_daftar`, `status`, `dokumen`
- Secret Code: `id`, `instansi_id`, `kode`, `dibuat`, `kadaluarsa`, `penggunaan`, `status`

## Deliverables (Tahap Implementasi Setelah Disetujui)
- Satu halaman `admin.html` dengan 5 section/tabs
- Komponen utilitas (tabel, modal, drawer, toast, badge, skeleton) berbasis Tailwind
- Mock data & state lokal untuk verifikasi UI
- Hook integrasi API terpisah (nanti), dengan loading/error/empty yang konsisten

Silakan konfirmasi jika referensi ini sesuai. Setelah disetujui, saya akan menurunkan ke prototipe halaman `admin.html` sesuai stack repo (React UMD + Tailwind CDN) dan menyiapkan komponen inti yang dapat langsung diuji.