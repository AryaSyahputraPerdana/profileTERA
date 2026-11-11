# Global Trade Digital Worker Registry / RPA

13 halaman profil untuk 13 karakter RPA di Divisi Global Trade, plus satu halaman registry di `/rpa/`. Setiap karakter punya satu URL statis sendiri, dengan bahasa visual yang sama supaya terbaca sebagai satu seri saat dipindai dari poster.

## Status data

**Semua nilai di halaman adalah data contoh.** Ini ditandai di tiga tempat pada setiap halaman: strip paling atas, header pelat spesifikasi, dan footer. Jangan pakai angka atau tanggal di halaman ini untuk keputusan operasional sebelum diganti dengan data resmi.

PIC diisi dengan kode meja kerja, bukan nama orang, supaya tidak ada identitas fiktif yang terlihat seperti data produksi. Ganti dengan nama PIC sebenarnya saat data final masuk.

## Halaman

| Unit | Profil | Automation ID |
| --- | --- | --- |
| Registry | `/rpa/` | 13 unit |
| 01 | `/rpa/TERABUL.html` | GT-RPA-001 |
| 02 | `/rpa/TERACE.html` | GT-RPA-002 |
| 03 | `/rpa/TERACOL.html` | GT-RPA-003 |
| 04 | `/rpa/TERACOM.html` | GT-RPA-004 |
| 05 | `/rpa/TERADOCS.html` | GT-RPA-005 |
| 06 | `/rpa/TERADOTS.html` | GT-RPA-006 |
| 07 | `/rpa/TERALOG.html` | GT-RPA-007 |
| 08 | `/rpa/TERAMAT-1.html` | GT-RPA-008 |
| 09 | `/rpa/TERAMAT-2.html` | GT-RPA-009 |
| 10 | `/rpa/TERAMENT.html` | GT-RPA-010 |
| 11 | `/rpa/TERAPI.html` | GT-RPA-011 |
| 12 | `/rpa/TERASWIFT.html` | GT-RPA-012 |
| 13 | `/rpa/TERAUP.html` | GT-RPA-013 |

Setiap halaman profil punya indeks 13 unit di bagian bawah, jadi pengunjung bisa berpindah profil tanpa kembali ke poster. Registry di `/rpa/` adalah halaman masuk yang menampilkan semua unit beserta potret dan statusnya.

## Menjalankan

Tidak ada dependency dan tidak ada JavaScript di halaman.

```bash
cd "Web Digital Worker"
python3 -m http.server 4173
```

Buka `http://localhost:4173/rpa/TERABUL.html`. Struktur halaman juga bisa dibuka lewat `file://`, tetapi Chrome memblokir font lokal karena CORS, jadi tipografi final hanya muncul saat disajikan lewat HTTP, termasuk GitHub Pages.

Build ulang setelah mengubah data:

```bash
node rpa/build.mjs
```

Butuh Node 18 atau lebih baru. Build menulis ulang 13 profil dan 1 halaman registry; aset tidak disentuh.

## GitHub Pages

Semua halaman statis, tanpa server dan tanpa dependency runtime. Semua path relatif. Nama file profil memakai huruf besar sesuai nama karakter, misalnya `TERABUL.html`, jadi GitHub Pages yang case-sensitive harus diakses dengan casing yang sama. `.nojekyll` sudah ada di root dan di `rpa/`, jadi GitHub Pages tidak memproses file lewat Jekyll.

**Rekomendasi: Opsi B, publish hanya folder `rpa`.**

Workflow sudah tersedia di `.github/workflows/deploy-pages.yml`. Dengan opsi ini:

- **Main page:** `https://<username>.github.io/<repo>/` (isi `rpa/index.html`, halaman RPA Unit Registry)
- **Profil:** `https://<username>.github.io/<repo>/TERABUL.html`
- **Aset:** `https://<username>.github.io/<repo>/assets/...`

Langkah deploy:

1. Push repo ke GitHub.
2. Settings > Pages > Build and deployment > Source: **GitHub Actions**.
3. Push ke branch `main`, workflow berjalan otomatis.
4. Setelah deploy, main page ada di root repo.

Workflow meng-upload folder `rpa` sebagai artifact, jadi folder `Karakter RPA`, `Karakter AI`, `Karakter Power Automate`, dan file sumber lain tidak ikut dipublikasikan. Ini opsi yang paling rapi untuk QR karena URL profil lebih pendek.

**Opsi A, publish seluruh repo dari root branch:**

1. Push repo ke GitHub.
2. Settings > Pages > Build and deployment > Deploy from a branch.
3. Pilih branch `main` dan folder `/ (root)`.

- **Main page:** `https://<username>.github.io/<repo>/rpa/`
- **Profil:** `https://<username>.github.io/<repo>/rpa/TERABUL.html`
- Root `https://<username>.github.io/<repo>/` akan 404 karena tidak ada `index.html` di root repo.

Pilih salah satu. Jangan aktifkan workflow dan branch deploy bersamaan, karena GitHub Pages hanya memakai satu source.

**Ringkasan URL:**

| Halaman | Opsi B (recommended) | Opsi A |
| --- | --- | --- |
| Main page | `.../<repo>/` | `.../<repo>/rpa/` |
| TERABUL | `.../<repo>/TERABUL.html` | `.../<repo>/rpa/TERABUL.html` |
| TERASWIFT | `.../<repo>/TERASWIFT.html` | `.../<repo>/rpa/TERASWIFT.html` |

**Untuk barcode poster:** arahkan setiap barcode ke URL profil final, bukan ke Automation ID. Dengan Opsi B, contoh isi barcode:

```
https://username.github.io/web-digital-worker/TERABUL.html
```

Kalau memakai Opsi A, tambahkan `/rpa/` sebelum nama file:

```
https://username.github.io/web-digital-worker/rpa/TERABUL.html
```

Registry tidak perlu `.html` karena GitHub Pages memakai `index.html` di folder itu. Profil memakai nama file eksplisit, jadi URL QR harus menyertakan `.html` dan casing yang sama.

**Catatan privasi:** repo publik akan menampilkan Automation ID, user group 7 digit, PIC, dan KPI. Jika nilai itu internal, gunakan repo private atau redaksi nilainya sebelum push. Data contoh di repo ini aman untuk demo, tetapi bukan untuk data produksi.

## Mengganti data

Sumber tunggal ada di `rpa/data/units.mjs`.

- `slug` dipakai untuk nama file gambar dan thumbnail, bukan lagi nama folder halaman.
- `name` dipakai untuk nama file HTML, misalnya `TERABUL` menjadi `rpa/TERABUL.html`. Semua tautan mengikuti field ini. Gunakan huruf, angka, dan tanda hubung, tanpa spasi.
- Kalau `name` diubah, hapus file HTML lama supaya tidak ada halaman yatim.
- `accent` adalah warna identitas unit. Pilih warna gelap dengan kontras minimal 4.5:1 terhadap `#F2F0E7`; aksen dipakai untuk teks kecil di beberapa tempat.
- `status` yang didukung tampilannya: `ACTIVE`, `PILOT`, `IN REVIEW`.
- `frequency.days` berurutan Senin sampai Minggu, berisi `true` untuk hari aktif.
- `kpi` adalah satu angka utama. `kpiRows` adalah dua baris pendukung.
- `jobDesc` berisi array paragraf. `inputs` dan `outputs` berisi array item.

Gambar karakter ada di `rpa/assets/characters/<slug>.webp`, rasio 3:4. Ukuran asli 864 x 1152. Ganti dengan potret final di nama file yang sama, lalu build ulang. Thumbnail roster ada di `rpa/assets/characters/thumbs/<slug>.webp` dengan ukuran 240 x 320; ganti keduanya agar halaman indeks tetap ringan.

Font ada di `rpa/assets/fonts` dan di-host sendiri, jadi tidak ada request ke Google Fonts saat halaman dibuka.

## Arah desain

Arah yang dipilih: **industrial control panel**, bukan dashboard SaaS.

- **Reading:** lembar data peralatan untuk tim operasi Global Trade, dial **ENERGY 2 / RHYTHM 3 / MOTION 1**.
- **Bentuk:** lembar kertas galvanis dengan pelat spesifikasi graphite, seperti label aset di panel kontrol. Terang, bukan dark neon, karena halaman ini akan sering dilihat di ponsel setelah scan dan dicetak untuk poster.
- **Tipografi:** Overpass untuk signage dan label (bentuknya turunan huruf rambu jalan), Source Serif 4 untuk paragraf job desc supaya enak dibaca, Overpass Mono untuk ID, tanggal, dan kode.
- **Warna:** dua warna inti, bone dan graphite. Setiap unit punya satu aksen yang diambil dari pakaian karakternya. Aksen hanya muncul di bar tipis, alas potret, unit KPI, dan baris indeks aktif. Tujuannya memberi kode unit tanpa memecah seri menjadi 13 brand berbeda.
- **Barcode:** Code 39 asli yang mengodekan Automation ID, dengan bar gelap di label terang supaya kompatibel dengan scanner. Barcode pada poster tetap harus mengodekan URL halaman, bukan Automation ID.
- **Gerak:** hanya hover dan focus. Tidak ada scroll reveal, parallax, atau loop, sesuai MOTION 1.
- **Tema:** light fixed, tanpa toggle. Alasannya objeknya adalah label cetak, bukan aplikasi yang butuh mode gelap. Tidak ada permintaan theme toggle.
- **Isi:** tidak ada testimonial, FAQ, pricing, atau CTA karena halaman ini adalah profil unit internal. Setiap bagian punya tugas: identitas, spesifikasi, pekerjaan, KPI, frekuensi, navigasi unit.

## Verifikasi

Diuji pada 11 November 2026 dengan Chromium headless.

- **70 kombinasi layout:** 14 halaman x 5 lebar (1440, 1024, 768, 390, 320). Tidak ada horizontal overflow, tidak ada gambar gagal muat, tidak ada link di bawah 44 px.
- **Subpath GitHub:** 6 uji tambahan, yaitu registry, `TERABUL.html`, dan `TERASWIFT.html` pada 1440 dan 390. Semua gambar, font, stylesheet, dan tautan mengembalikan status 200. Klik baris registry mendarat di `/repo/rpa/TERABUL.html`.
- **Lighthouse** pada `/rpa/` dan `/rpa/TERABUL.html`: Accessibility 100, Best Practices 100, SEO 100. Performa tidak diukur, jadi tidak dilaporkan.
- **Kontras:** teks utama 13.7:1, label sekunder 7.5:1, aksen terendah 5.48:1, status terendah 7.35:1. Semua di atas WCAG AA.
- **Keyboard:** Tab pertama membuka skip link 44 x 44 px dengan outline terlihat; Enter memindahkan fokus ke `main`; Tab berikutnya mencapai baris registry dengan focus ring. Tidak ada `outline: none`.
- **Klik:** 13 baris registry membuka 13 file profil yang benar; 13 tautan indeks di bawah profil juga membuka file yang benar; tautan "Indeks unit" membuka registry `/rpa/`; brand dan "Kembali ke atas" kembali ke `#top`.
- **Konsol:** tidak ada error. Tidak ada JavaScript sama sekali.
- **Font:** ketiga family termuat dari file lokal saat halaman disajikan lewat HTTP dan subpath GitHub.
- **Link:** 17 tautan per halaman profil dan 17 tautan di registry, semuanya punya tujuan nyata. Tidak ada tautan mati.
- **Aset roster:** thumbnail 240 x 320 khusus halaman indeks, total sekitar 224 KB untuk 13 unit. Profil tetap memakai potret 864 x 1152.

## Catatan poster

Saat barcode poster dibuat, arahkan ke URL final masing-masing profil, misalnya:

```
https://domain-anda/rpa/TERABUL.html
```

Jangan memakai Automation ID sebagai isi barcode poster, karena ID itu tidak membuka halaman. Automation ID di dalam halaman hanya untuk identifikasi aset.
