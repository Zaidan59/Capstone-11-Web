# Frontend Documentation (Capstone 11 Web)

Dokumentasi ini untuk project frontend `Capstone-11-Web`.

Tanggal update: 2026-05-15

## 1. Gambaran Umum

Frontend dibangun menggunakan:
- React + Vite
- React Router
- Axios
- Tailwind CSS

Status saat ini:
- Build frontend sukses.
- Struktur routing dan service API sudah siap dipakai.
- Beberapa fitur masih bergantung pada endpoint backend yang belum lengkap.

## 2. Menjalankan Project

## Prasyarat
- Node.js 18+ (disarankan)
- npm

## Instalasi
```bash
npm install
```

## Menjalankan mode development
```bash
npm run dev
```

## Build production
```bash
npm run build
```

## Preview build
```bash
npm run preview
```

## 3. Environment Variable

File `.env`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_AUTH_MODE=api
```

Keterangan:
- `VITE_API_URL`: base URL API backend.
- `VITE_AUTH_MODE`: mode autentikasi FE.
  - `api`: mode yang aktif saat ini (login ke endpoint backend `/auth/login`).
  - `mock`: disiapkan untuk mode demo/lokal, namun belum aktif di kode saat ini.

## 4. Struktur Folder Penting

- `src/routes`:
  Definisi route aplikasi, termasuk protected route.
- `src/pages`:
  Halaman utama (Auth, Dashboard, Notification, Profil, Artikel, Maps).
- `src/services`:
  Layer komunikasi API (axios + endpoint service).
- `src/context`:
  Auth context (user + token storage).
- `src/hooks`:
  Custom hook untuk kebutuhan halaman.
- `src/utils`:
  Mapper dan helper utilitas tampilan/data.

## 5. Alur Auth di Frontend

1. Login memanggil `POST /auth/login`.
2. Token disimpan di localStorage key: `simba_token`.
3. Data user disimpan di localStorage key: `simba_user`.
4. Axios interceptor otomatis menambahkan header:
   - `Authorization: Bearer <token>`
5. Route terlindungi menggunakan `ProtectedRoute`.

## 6. Daftar Service API (FE)

## `authService.js`
- `login(data)` -> `POST /auth/login`
- `register(data)` -> `POST /auth/register`
- `logout()` -> `POST /auth/logout`

## `sppgService.js`
- `getAllSPPG()` -> `GET /sppg`
- `getSPPGById(id)` -> `GET /sppg/:id`

## `sekolahService.js`
- `getAllSekolah()` -> `GET /sekolah`
- `getSekolahById(id)` -> `GET /sekolah/:id`
- `getSekolahSppg(id)` -> `GET /sekolah/:id/sppg`
- `getSekolahMenuHarian(id)` -> `GET /sekolah/:id/menu-harian`
- `getSekolahDokumentasi(id)` -> `GET /sekolah/:id/dokumentasi`
- `getSekolahNutrisi(id)` -> `GET /sekolah/:id/nutrisi`
- `getSekolahCatatan(id)` -> `GET /sekolah/:id/catatan`
- `createSekolahDokumentasi(id, payload)` -> `POST /sekolah/:id/dokumentasi`
- `createSekolahCatatan(id, payload)` -> `POST /sekolah/:id/catatan`

## `artikelService.js`
- `getAllArtikel()` -> `GET /artikel`
- `getArtikelById(id)` -> `GET /artikel/:id`

## `notificationService.js`
- `getNotificationsBySppgId(sppgId)` -> `GET /notifikasi?sppgId=...`
- `getNotificationsBySchoolId(schoolId)` -> `GET /notifikasi?schoolId=...`

## `mediaService.js`
- `uploadImage(file, extraFields)` -> `POST /media/upload-image` (multipart/form-data)

## 7. Status Integrasi dari Sisi FE

## Endpoint FE yang umumnya sudah siap dipakai
- `/auth/login`
- `/sppg`
- `/sppg/:id`
- `/sekolah`
- `/sekolah/:id`
- `/artikel`
- `/artikel/:id`
- `/notifikasi`
- `/media/upload-image`

## Endpoint yang dipanggil FE tetapi bisa belum tersedia di backend
- `/auth/register`
- `/auth/logout`
- `/sekolah/:id/sppg`
- `/sekolah/:id/menu-harian`
- `/sekolah/:id/dokumentasi`
- `/sekolah/:id/nutrisi`
- `/sekolah/:id/catatan`

Jika endpoint di atas belum ada di backend, beberapa halaman akan fallback ke default/localStorage.

## 8. Catatan Pengembangan

1. Encoding
- Jika muncul karakter aneh (misalnya simbol panah/emoji rusak), cek encoding file ke UTF-8.

2. Konsistensi role
- FE banyak menggunakan role `sppg` dan `sekolah`.
- Pastikan backend mengembalikan role yang konsisten atau lakukan mapping.

3. Error handling
- FE sudah menangani fallback data di beberapa halaman dashboard/profil.
- Tetap disarankan backend mengirim response error konsisten dengan field `message`.

## 9. Checklist Sebelum Push FE

1. Pastikan `.env` tidak berisi secret sensitif production.
2. Pastikan `node_modules` dan `dist` tidak di-commit.
3. Jalankan:
```bash
npm run build
```
4. Smoke test minimal:
- Login
- Halaman dashboard
- Halaman notifikasi
- Halaman profil
- Upload dokumentasi (jika endpoint tersedia)

