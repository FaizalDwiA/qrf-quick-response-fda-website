# QRForge Pro - Advanced QR Code Generator & Scanner

**QRForge Pro** adalah aplikasi web modern, tangguh, dan berkinerja tinggi untuk membuat (*generate*) dan memindai (*scan*) QR Code secara interaktif. Aplikasi ini berjalan **100% di sisi klien saja (Client-Side)**, sepenuhnya luring (*offline-first*), tanpa bergantung pada server luar untuk kalkulasi gambar ataupun dekripsi sandi jaringan.

Dibuat dengan memadukan keindahan antarmuka bergaya **Glassmorphism**, akurasi rendering vektor tinggi, dan kegunaan fitur ramah pakai seperti penguraian otomatis kartu kontak vCard dan konfigurasi sandi Wi-Fi sekali-ketuk.

---

## 🎨 FITUR UTAMA

1. **Advanced QR Code Generator**:
   - **Tipe Data Kompleks**: Mendukung tautan Teks/URL biasa, Jaringan WiFi terenkripsi (WPA/WEP/Tanpa Sandi), dan pembuatan kartu nama digital vCard (Nama, Telepon, Email, Perusahaan, Web).
   - **Gaya Desain Kustom**: Ubah bentuk pola titik QR (*rounded, circles, classy, square*), bingkai luar sudut (*outer corner*), dan mata bagian dalam sudut (*inner eye*).
   - **Skema Warna Keren**: Mendukung pengaplikasian warna solid murni ataupun warna bergradasi (*gradient*) linier/radial berarah khusus.
   - **Branding Logo Tengah**: Sisipkan gambar atau logo lambang perusahaan (PNG/JPG) Anda sendiri secara otomatis tepat di tengah QR code dengan peningkatan level koreksi galat (*error correction*).
   - **Ekspor Berkualitas**: Unduh hasil akhir dalam resolusi tinggi berformat **PNG** maupun format vektor murni **SVG** yang siap dicetak.

2. **Advanced QR Code Scanner**:
   - **Live Camera Reader**: Akses lensa kamera depan maupun belakang secara cepat, pilih sumber lensa periferal, dan pindai kode langsung dengan fitur penarget jendela senter (*laser viewfinder*).
   - **Image File Reader**: Tarik-dan-lepas (*drag & drop*) atau pilih file hasil jepretan foto dari galeri untuk dibedah kodenya secara mudah.
   - **Dekoder Pintar (Parser)**:
     - Deteksi otomatis link tautan web aktif yang bisa diklik.
     - Deteksi **WiFi Network**: Memisahkan nama SSID, enkripsi pengamat, dan kata sandi jaringan yang tersembunyi dengan tombol salin sandi instan.
     - Deteksi **vCard Kontak**: Menampilkan data profil dalam bentuk lencana laci karyawan visual menarik dengan detail nama, instansi, telepon, surel, dan situs web.
     - Penelusuran cepat isi teks biasa ke Google langsung lewat satu tombol.

---

## 🛠️ STACK TEKNOLOGI

Aplikasi ini menggunakan teknologi front-end modern:
- **Runtime & Bundler**: [Vite 6+](https://vite.dev/) dengan kecepatan modul HMR instan.
- **Styling Utility**: [Tailwind CSS v4](https://tailwindcss.com/) dengan skema glassmorphic modern.
- **Icons**: [Lucide Icons](https://lucide.dev/) (dimuat dinamis via CDN guna efisiensi ukuran berkas bungkusan).
- **QR Core Styling**: [qr-code-styling](https://www.npmjs.com/package/qr-code-styling) untuk pembuatan gambar berdesain tinggi di atas kanvas SVG/HTML5.
- **QR Scanning Parser**: [html5-qrcode](https://www.npmjs.com/package/html5-qrcode) untuk deteksi tangkapan gambar matriks secara real-time dan luring.

---

## 📁 STRUKTUR FOLDER PROYEK

Sesuai tuntutan arsitektur pengembangan profesional:
```bash
├── web-src/              # Seluruh berkas mentah pengembangan utama (Source Code)
│   ├── css/
│   │   └── style.css     # CSS Utama (Integrasi Tailwind v4 + Animasi Laser Scanner)
│   ├── js/
│   │   ├── main.js       # Orkes utama toggling tab halaman dan inisiasi modul
│   │   ├── generator.js  # Generator logika, skema gradasi warna, dan pengunggah logo
│   │   └── scanner.js    # Penanganan feed kamera, disinfeksi string penangkap, dan decoding
│   └── index.html        # Kerangka HTML5 berlokalisasi bahasa Indonesia dengan glassmorphism
├── dist/                 # Folder hasil kompilasi produksi final (Auto-generated)
├── package.json          # Koordinat dependensi npm dan skrip otomasi kompilasi
├── vite.config.ts        # Setelan bundler Vite (mendefinisikan web-src/ sebagai root utama)
├── .gitignore            # Daftar berkas harian yang tidak masuk penyimpanan Git
└── README.md             # Panduan pengoperasian teknis (Berkas ini)
```

---

## 🚀 PETUNJUK MEMULAI (DEVELOPMENT & BUILD)

Pastikan komputer Anda sudah memasang [Node.js](https://nodejs.org/) (versi LTS terbaru direkomendasikan).

### 1. Instalasi Dependensi
Jalankan perintah berikut di terminal root proyek untuk mengunduh modul-modul pustaka penunjang:
```bash
npm install
```

### 2. Menjalankan Server Pengembangan (Lokal)
Jalankan skrip pengembangan untuk menyalakan web lokal interaktif dengan dukungan modul reload instan:
```bash
npm run dev
```
Setelah berjalan, buka penjelajah web Anda dan arahkan alamat ke:
`http://localhost:3000`

### 3. Melakukan Build Produksi
Skrip build yang dikonfigurasikan akan mengemas seluruh kode sumber mentah di dalam `web-src/` menjadi berkas produksi terkompresi di folder `/dist` dan secara otomatis menduplikasikan berkas-berkas tersebut ke **Root Folder** agar siap dideploy di host web statis tanpa subdirektori tambahan:
```bash
npm run build
```

---

## ☁️ DEPLOY KE GITHUB PAGES

GitHub Pages mencari berkas `index.html` dan `assets/` langsung di root cabang Anda (atau dalam folder `/docs`). Karena proyek ini dikonfigurasikan agar proses `npm run build` menduplikasi hasil akhir kompilasi produksi langsung ke root folder:

### Cara Cepat Deploy lewat Git:

1. **Inisialisasi Repositori Git**:
   ```bash
   git init
   git add .
   git commit -m "feat: inisiasi awal Advanced QR Generator & Scanner"
   ```
2. **Koneksikan ke Repositori GitHub**:
   ```bash
   git remote add origin https://github.com/USERNAME/REPO-NAME.git
   ```
3. **Kirim Perubahan (Push)**:
   ```bash
   git branch -M main
   git push -u origin main
   ```
4. **Aktifkan di Setelan GitHub**:
   - Buka repositori Anda di situs **GitHub.com**.
   - Buka menu **Settings** -> bagian **Pages** (di kolom navigasi kiri).
   - Di bagian **Build and deployment**, atur *Source* ke **Deploy from a branch**.
   - Pada kolom *Branch*, pilih **`main`** (atau cabang utama Anda) dan pilih folder **`/ (root)`**.
   - Klik **Save**.
   - Tunggu sekitar 1-2 menit, situs Anda akan live di alamat:  
     `https://USERNAME.github.io/REPO-NAME/`

---

## 🔒 LISENSI
Didistribusikan di bawah Lisensi Apache-2.0. Silakan manfaatkan, adaptasi, dan kembangkan lebih lanjut!
