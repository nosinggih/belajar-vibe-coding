# Perencanaan Fitur: API Login User

Dokumen ini berisi panduan tahap demi tahap untuk mengimplementasikan fitur login user pada aplikasi backend (Bun + ElysiaJS + Drizzle + MySQL).
Dokumen ini ditujukan bagi programmer junior atau model AI yang akan mengeksekusi kode secara langsung.

## 1. Pembuatan Skema Database (Tabel Sessions)
- **File Target:** `src/db/schema.ts`
- **Instruksi:**
  Tambahkan definisi skema untuk tabel `sessions` menggunakan sintaks Drizzle ORM untuk MySQL. Strukturnya adalah sebagai berikut:
  - `id`: integer, primary key, auto increment (`serial`)
  - `token`: varchar (panjang misalnya 255), untuk menyimpan UUID sebagai token akses, tidak boleh null.
  - `userId`: integer (`int`), mereferensikan `id` pada tabel `users`, tidak boleh null.
  - `createdAt`: timestamp, set default ke waktu saat ini (`defaultNow()`).
- **Migrasi Database:**
  Setelah skema ditambahkan, jalankan perintah terminal berikut untuk menerapkan perubahan ke database:
  1. `bun run db:generate`
  2. `bun run db:push`

## 2. Pembuatan Layer Service (Business Logic)
- **Folder/File Target:** `src/services/users-service.ts`
- **Instruksi:**
  1. Buat fungsi asynchronous baru, misalnya `loginUser(payload)`, yang menerima parameter `email` dan `password`.
  2. **Pengecekan User:** Gunakan Drizzle ORM untuk mencari user berdasarkan `email` di tabel `users`.
  3. Jika user tidak ditemukan, fungsi harus langsung *throw error* atau mengembalikan pesan error: `"email atau password salah"`.
  4. **Verifikasi Password:** Jika user ditemukan, verifikasi kecocokan password yang dikirimkan dengan hash yang ada di database. Karena kita menggunakan API bawaan Bun, gunakan:
     `const isMatch = await Bun.password.verify(password, user.password);`
  5. Jika `isMatch` bernilai `false`, *throw error* atau kembalikan error yang sama: `"email atau password salah"`.
  6. **Pembuatan Token (Session):**
     Jika password cocok, buat sebuah UUID baru (bisa menggunakan `crypto.randomUUID()`).
  7. Simpan UUID tersebut beserta `user_id` ke dalam tabel `sessions` menggunakan perintah `.insert()` dari Drizzle ORM.
  8. Fungsi harus mengembalikan token UUID yang baru saja dibuat.

## 3. Pembuatan Layer Route (Controller/Endpoint)
- **Folder/File Target:** `src/routes/users-route.ts`
- **Instruksi:**
  1. Tambahkan endpoint baru dengan metode `POST` untuk login. (Misalnya `/login` pada router yang sudah memiliki prefix `/api/users`, atau sesuaikan agar path utamanya logis).
  2. **Validasi Request Body:** Gunakan validator schema Elysia (`t.Object`) untuk memastikan body request berisi parameter wajib:
     - `email`: string
     - `password`: string
  3. **Panggil Service:** Di dalam *handler*, ambil nilai `email` dan `password`, lalu teruskan ke fungsi `loginUser` yang dibuat di service layer.
  4. **Format Response:**
     - Jika service mengembalikan indikasi sukses (token berhasil dibuat), format respon **wajib** persis seperti ini:
       ```json
       {
           "data" : "token_uuid_disini"
       }
       ```
     - Jika service menangkap bahwa email tidak ada atau password salah, tangkap error tersebut, atur HTTP status (misalnya 401 Unauthorized atau 400 Bad Request), lalu kembalikan JSON **wajib** persis seperti ini:
       ```json
       {
           "error" : "email atau password salah"
       }
       ```

## 4. Konvensi Struktur Folder dan File
- **`src/routes`**: Harus murni berisi *routing* ElysiaJS (path, HTTP method, validasi request/response). Contoh nama file: `users-route.ts`.
- **`src/services`**: Harus berisi logika bisnis (query database, komparasi password, pembuatan session). Contoh nama file: `users-service.ts`.
