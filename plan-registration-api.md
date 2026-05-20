# Perencanaan Fitur: API Registrasi User

Dokumen ini berisi panduan tahap demi tahap untuk mengimplementasikan fitur registrasi user baru pada aplikasi backend (Bun + ElysiaJS + Drizzle + MySQL). 
Dokumen ini ditujukan bagi programmer junior atau model AI yang akan mengeksekusi kode secara langsung.

## 1. Persiapan Skema Database
- **File Target:** `src/db/schema.ts`
- **Instruksi:** 
  Perbarui skema tabel `users`. Jika sudah ada, modifikasi strukturnya menjadi persis seperti berikut (menggunakan sintaks Drizzle ORM untuk MySQL):
  - `id`: integer, primary key, auto increment (`serial`)
  - `name`: varchar (contoh: length 255), tidak boleh null
  - `email`: varchar (contoh: length 255), tidak boleh null, harus unik (`unique`)
  - `password`: varchar (untuk menyimpan hash bcrypt), tidak boleh null
  - `created_at`: timestamp, set default ke waktu saat ini (`defaultNow()`)
- **Migrasi:** Setelah skema diubah, wajib menjalankan terminal command:
  1. `bun run db:generate`
  2. `bun run db:push`

## 2. Pembuatan Layer Service (Business Logic)
- **Folder/File:** Buat folder `src/services` dan buat file `src/services/users-service.ts`.
- **Instruksi:**
  1. Buat sebuah fungsi asynchronous, misalnya `registerUser(payload)`.
  2. Fungsi ini harus menerima parameter `name`, `email`, dan `password`.
  3. **Langkah Pengecekan:** Lakukan query menggunakan Drizzle ORM ke tabel `users` untuk mencari apakah `email` yang dikirimkan sudah ada.
     - Jika *ada*, fungsi harus langsung mengembalikan pesan error (atau *throw error*).
  4. **Langkah Hashing:** Jika email belum terdaftar, lakukan *hash* pada password yang dikirimkan. Sangat disarankan untuk menggunakan API bawaan Bun, yaitu `await Bun.password.hash(password, { algorithm: "bcrypt" })` (atau bisa menggunakan library `bcryptjs` jika preferensi sistem).
  5. **Langkah Penyimpanan:** Simpan data `name`, `email`, dan password yang *sudah di-hash* tersebut ke tabel `users` melalui perintah `.insert()` dari Drizzle ORM.
  6. Fungsi harus mengembalikan indikator sukses jika penyimpanan berhasil, atau meneruskan string/objek error jika terjadi duplikasi.

## 3. Pembuatan Layer Route (Controller/Endpoint)
- **Folder/File:** Buat folder `src/routes` dan buat file `src/routes/users-route.ts`.
- **Instruksi:**
  1. Buat instance router Elysia baru, contoh: `export const usersRoute = new Elysia({ prefix: '/api' })`. (Boleh disesuaikan asalkan pada akhirnya *path* endpoint adalah `/api/users`).
  2. Buat endpoint `POST /users` (jika menggunakan prefix `/api`).
  3. **Validasi Request Body:** Gunakan validasi schema bawaan Elysia (`t.Object`). Pastikan body wajib (required) berisi:
     - `name`: string
     - `email`: string
     - `password`: string
  4. **Panggil Service:** Di dalam handler, ambil nilai dari body request dan kirimkan ke fungsi `registerUser` (dari service yang dibuat pada tahap 2).
  5. **Format Response:**
     - Jika service mengembalikan indikasi sukses, format respon wajib persis seperti ini:
       ```json
       {
           "data" : "ok"
       }
       ```
     - Jika service menangkap bahwa email sudah ada, tangkap error tersebut dan ubah kode HTTP *response* (contoh: status 400 Bad Request) lalu kembalikan JSON wajib persis seperti ini:
       ```json
       {
           "error" : "email sudah terdaftar"
       }
       ```

## 4. Mendaftarkan Route ke Aplikasi Utama
- **File Target:** `src/index.ts`
- **Instruksi:**
  - Lakukan import terhadap `usersRoute` dari `src/routes/users-route.ts`.
  - Pasangkan route tersebut pada aplikasi utama Elysia dengan menggunakan `.use()`.
  - Bersihkan endpoint `/users` (POST) lama jika ada, karena endpoint baru sekarang dikelola oleh layer routes di URL `/api/users`.
