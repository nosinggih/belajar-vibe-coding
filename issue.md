# Project Setup: ElysiaJS + Drizzle + MySQL

## Tujuan
Membuat inisialisasi proyek backend baru menggunakan ekosistem Bun dengan framework ElysiaJS dan Drizzle ORM yang terhubung ke database MySQL.

## Kebutuhan (Tech Stack)
- **Runtime & Package Manager:** Bun
- **Web Framework:** ElysiaJS
- **ORM:** Drizzle ORM
- **Database:** MySQL

## Langkah-langkah Implementasi (High-Level)

1. **Inisialisasi Proyek Bun:**
   - Lakukan inisialisasi proyek baru menggunakan Bun di dalam direktori ini.
   - Pastikan file konfigurasi dasar seperti `package.json` dan `tsconfig.json` sudah terbuat secara otomatis.

2. **Instalasi Dependensi:**
   - Install ElysiaJS beserta plugin yang dibutuhkan.
   - Install Drizzle ORM dan driver MySQL yang direkomendasikan.
   - Install Drizzle Kit (sebagai dev dependency) untuk keperluan migrasi database.

3. **Konfigurasi Database:**
   - Setup file konfigurasi koneksi database (menggunakan environment variables di `.env` untuk kredensial MySQL).
   - Buat file `drizzle.config.ts` untuk mengatur jalur skema dan output migrasi.
   - Buat satu contoh skema tabel sederhana untuk memastikan integrasi berjalan lancar.

4. **Implementasi Server Elysia:**
   - Buat file entry point utama (misal `src/index.ts`).
   - Inisialisasi aplikasi server ElysiaJS.
   - Inject atau hubungkan instance database Drizzle ke dalam aplikasi.
   - Buat endpoint dasar (contoh: `GET /`) yang mencoba mengambil data dari database menggunakan Drizzle, untuk memvalidasi bahwa seluruh tumpukan teknologi telah terhubung.

5. **Pengaturan Skrip Runner:**
   - Tambahkan perintah di `package.json` untuk kemudahan:
     - Menjalankan server dalam mode *development* (watch mode).
     - Melakukan generate skema migrasi Drizzle.
     - Mengeksekusi/push skema migrasi ke database MySQL.
