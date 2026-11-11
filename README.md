# profileTERA

Situs profil statis untuk 13 digital worker RPA di Divisi Global Trade.

- **Main page:** https://aryasyahputraperdana.github.io/profileTERA/
- **Contoh profil:** https://aryasyahputraperdana.github.io/profileTERA/TERABUL.html
- **Halaman masuk:** `index.html` (RPA Unit Registry)

Semua nilai di halaman saat ini adalah **data contoh** dan diberi label di strip atas, pelat spesifikasi, serta footer.

## Halaman

| Unit | File | URL |
| --- | --- | --- |
| Registry | `index.html` | `/profileTERA/` |
| TERABUL | `TERABUL.html` | `/profileTERA/TERABUL.html` |
| TERACE | `TERACE.html` | `/profileTERA/TERACE.html` |
| TERACOL | `TERACOL.html` | `/profileTERA/TERACOL.html` |
| TERACOM | `TERACOM.html` | `/profileTERA/TERACOM.html` |
| TERADOCS | `TERADOCS.html` | `/profileTERA/TERADOCS.html` |
| TERADOTS | `TERADOTS.html` | `/profileTERA/TERADOTS.html` |
| TERALOG | `TERALOG.html` | `/profileTERA/TERALOG.html` |
| TERAMAT-1 | `TERAMAT-1.html` | `/profileTERA/TERAMAT-1.html` |
| TERAMAT-2 | `TERAMAT-2.html` | `/profileTERA/TERAMAT-2.html` |
| TERAMENT | `TERAMENT.html` | `/profileTERA/TERAMENT.html` |
| TERAPI | `TERAPI.html` | `/profileTERA/TERAPI.html` |
| TERASWIFT | `TERASWIFT.html` | `/profileTERA/TERASWIFT.html` |
| TERAUP | `TERAUP.html` | `/profileTERA/TERAUP.html` |

Setiap profil punya indeks 13 unit di bagian bawah. Registry di `index.html` menampilkan semua unit beserta potret dan statusnya.

## Struktur repo

```
index.html                  registry
TERABUL.html                profil
TERACE.html
...                         11 file profil lainnya
assets/
  registry.css
  fonts/                    font lokal
  characters/               potret profil 864 x 1152
  characters/thumbs/        thumbnail roster 240 x 320
data/units.mjs              sumber data
build.mjs                   generator halaman statis
.nojekyll                   mematikan pemrosesan Jekyll
```

## Jalankan lokal

```bash
python3 -m http.server 4173
```

Buka `http://localhost:4173/`.

Jangan cek tipografi lewat `file://`. Chrome memblokir font lokal karena CORS. Untuk melihat font yang benar, gunakan server lokal atau GitHub Pages.

## Build ulang

Setelah mengubah data:

```bash
node build.mjs
```

Butuh Node 18 atau lebih baru. Build menulis ulang `index.html` dan 13 file profil. Aset tidak disentuh.

## Deploy GitHub Pages

Repo ini disiapkan untuk **Deploy from a branch** dari root:

1. Buka **Settings > Pages**.
2. Bagian **Build and deployment**, pilih **Deploy from a branch**.
3. Pilih branch `main`, folder `/ (root)`, lalu **Save**.
4. Tunggu proses publish selesai.

URL hasilnya:

```
https://aryasyahputraperdana.github.io/profileTERA/
https://aryasyahputraperdana.github.io/profileTERA/TERABUL.html
```

`.nojekyll` sudah ada di root, jadi GitHub Pages menyajikan file apa adanya tanpa Jekyll. Tidak ada workflow yang perlu dijalankan.

## QR code

Isi QR dengan URL profil final, bukan Automation ID. Gunakan casing persis dan sertakan `.html`:

```
https://aryasyahputraperdana.github.io/profileTERA/TERABUL.html
https://aryasyahputraperdana.github.io/profileTERA/TERASWIFT.html
```

Jangan memakai URL folder lama seperti `/terabul/`. File profil sekarang datar di root dengan nama karakter.

## Data

Sumber tunggal ada di `data/units.mjs`.

- `name` dipakai sebagai nama file HTML. `TERABUL` menjadi `TERABUL.html`. Gunakan huruf, angka, dan tanda hubung tanpa spasi.
- `slug` dipakai untuk nama file gambar dan thumbnail.
- `accent` adalah warna identitas unit. Pilih warna gelap dengan kontras minimal 4.5:1 terhadap `#F2F0E7`.
- `status` yang didukung tampilannya: `ACTIVE`, `PILOT`, `IN REVIEW`.
- `frequency.days` berurutan Senin sampai Minggu, berisi `true` untuk hari aktif.
- `kpi` adalah satu angka utama. `kpiRows` adalah dua baris pendukung.
- `jobDesc` berisi array paragraf. `inputs` dan `outputs` berisi array item.

Gambar profil ada di `assets/characters/<slug>.webp` dengan rasio 3:4. Thumbnail roster ada di `assets/characters/thumbs/<slug>.webp` berukuran 240 x 320. Ganti keduanya jika potret final berubah.

Kalau `name` diubah, hapus file HTML lama supaya tidak ada halaman yatim.

## Arah desain

Arah yang dipilih: **industrial control panel**, bukan dashboard SaaS.

- **Reading:** lembar data peralatan untuk tim operasi Global Trade, dial **ENERGY 2 / RHYTHM 3 / MOTION 1**.
- **Bentuk:** lembar kertas galvanis dengan pelat spesifikasi graphite, seperti label aset di panel kontrol. Terang, bukan dark neon, karena halaman sering dilihat di ponsel setelah scan dan dicetak untuk poster.
- **Tipografi:** Overpass untuk signage dan label, Source Serif 4 untuk paragraf job desc, Overpass Mono untuk ID, tanggal, dan kode.
- **Warna:** dua warna inti, bone dan graphite. Setiap unit punya satu aksen dari pakaian karakternya. Aksen hanya muncul di bar tipis, alas potret, unit KPI, dan baris indeks aktif.
- **Barcode:** Code 39 asli yang mengodekan Automation ID, dengan bar gelap di label terang supaya kompatibel dengan scanner. Barcode pada poster tetap harus mengodekan URL halaman, bukan Automation ID.
- **Gerak:** hanya hover dan focus, sesuai MOTION 1.
- **Tema:** light fixed, tanpa toggle, karena objeknya label cetak.

## Verifikasi

Diuji pada 11 November 2026 dengan Chromium headless.

- **70 kombinasi layout:** 14 halaman x 5 lebar (1440, 1024, 768, 390, 320). Tidak ada horizontal overflow, gambar gagal muat, atau link di bawah 44 px.
- **Subpath GitHub:** registry dan profil diuji di `/profileTERA/` pada 1440 dan 390. Semua gambar, font, CSS, dan tautan mengembalikan status 200.
- **Klik:** 26 navigasi diuji, terdiri dari 13 baris registry dan 13 tautan indeks bawah, semuanya mendarat di file yang benar.
- **Lighthouse:** Accessibility 100, Best Practices 100, SEO 100 pada registry dan profil. Performa tidak diukur.
- **Keyboard:** skip link 44 px, Enter memindahkan fokus ke `main`, Tab mencapai baris registry dengan focus ring.
- **Kontras:** teks utama 13.7:1, label sekunder 7.5:1, aksen terendah 5.48:1, status terendah 7.35:1.
- **Konsol:** tidak ada error. Tidak ada JavaScript.

## Privasi

Repo publik akan menampilkan Automation ID, user group 7 digit, PIC, dan KPI. Jika nilai itu internal, gunakan repo private atau redaksi nilainya sebelum push. Data contoh di repo ini aman untuk demo, bukan untuk data produksi.
