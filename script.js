/* ============ NAVIGASI ANTAR HALAMAN ============ */
function showPage(pageName) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(function(p) {
    p.classList.remove('active');
  });

  const target = document.getElementById('page-' + pageName);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update active state pada sidebar menu
  const menuLinks = document.querySelectorAll('.sidebar .nav-link');
  menuLinks.forEach(function(a) {
    a.classList.remove('active');
    if (a.dataset.page === pageName) {
      a.classList.add('active');
    }
  });

  if (pageName === 'favorit') {
    renderFavorit();
  }
}

/* ============ FITUR PEMUTAR MUSIK LATAR KAFE ============ */
let isMusicPlaying = false;

function toggleMusic() {
  const music = document.getElementById('bgMusic');
  const icon = document.getElementById('musicIcon');
  const text = document.getElementById('musicText');
  const btn = document.getElementById('musicToggle');

  if (!music) return;

  if (isMusicPlaying) {
    music.pause();
    isMusicPlaying = false;
    icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
    text.textContent = "Musik Kafe";
    btn.classList.remove('playing');
  } else {
    // Memastikan audio dimuat ulang jika macet
    music.load();
    music.play().then(() => {
      isMusicPlaying = true;
      icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
      text.textContent = "Sedang Diputar";
      btn.classList.add('playing');
    }).catch(error => {
      console.error("Audio gagal diputar:", error);
      alert("Gagal memutar musik. Pastikan perangkat terhubung ke internet!");
    });
  }
}

/* ============ DATA KOPI ENSIKLOPEDIA & COMPARE ============ */
const dataKopiList = [
  { id: 'gayo', nama: 'Kopi Gayo', asal: 'indonesia', region: 'Aceh, Indonesia', jenis: 'Arabica', rasa: 'Cokelat, Rempah, Fruity', body: 'Sedang', acidity: 'Tinggi', desc: 'Aroma kuat, keasaman bersih, rasa manis caramel dan rempah.' },
  { id: 'toraja', nama: 'Kopi Toraja', asal: 'indonesia', region: 'Sulawesi, Indonesia', jenis: 'Arabica', rasa: 'Earthy, Dark Chocolate', body: 'Tebal (Full)', acidity: 'Rendah', desc: 'Karakter tanah (earthy) unik dengan aftertaste cokelat hitam manis.' },
  { id: 'kintamani', nama: 'Kopi Kintamani', asal: 'indonesia', region: 'Bali, Indonesia', jenis: 'Arabica', rasa: 'Citrus, Segar, Floral', body: 'Ringan-Sedang', acidity: 'Tinggi', desc: 'Ditanam di dekat kebun jeruk, memberikan nuansa citrus alami segar.' },
  { id: 'mandailing', nama: 'Kopi Mandailing', asal: 'indonesia', region: 'Sumut, Indonesia', jenis: 'Arabica', rasa: 'Herbal, Rempah, Cokelat', body: 'Full Body', acidity: 'Rendah', desc: 'Salah satu kopi terpopuler dunia dengan body tebal dan acidity rendah.' },
  { id: 'yirgacheffe', nama: 'Ethiopia Yirgacheffe', asal: 'dunia', region: 'Ethiopia', jenis: 'Arabica', rasa: 'Floral, Jasmine, Lemon', body: 'Ringan', acidity: 'Sangat Tinggi', desc: 'Sangat aromatik, berkarakter teh dengan sentuhan bunga melati dan lemon.' },
  { id: 'geisha', nama: 'Panama Geisha', asal: 'dunia', region: 'Panama', jenis: 'Arabica Geisha', rasa: 'Bergamot, Peach, Jasmine', body: 'Sutra (Silky)', acidity: 'Tinggi Kompleks', desc: 'Varietas langka dan mewah, terkenal dengan keharuman bunga yang intens.' },
  { id: 'java_robusta', nama: 'Robusta Dampit', asal: 'indonesia', region: 'Jawa Timur, Indonesia', jenis: 'Robusta', rasa: 'Bold, Pahit Manis, Kacang', body: 'Tebal Sangat', acidity: 'Sangat Rendah', desc: 'Biji Robusta pilihan dengan crema tebal, sangat cocok untuk espresso & kopi susu.' }
];

/* ============ ENSIKLOPEDIA & FAVORIT ============ */
let favoritKopi = JSON.parse(localStorage.getItem('coffee_favs')) || [];

function filterEnsiklopedia(kategori, btn) {
  if (btn) {
    document.querySelectorAll('.filter-bar .chip').forEach(c => {
      c.style.background = '#1c120a';
      c.style.color = '#d4a359';
      c.classList.remove('active');
    });
    btn.style.background = '#d4a359';
    btn.style.color = '#150d08';
    btn.classList.add('active');
  }
  renderEnsiklopedia(kategori);
}

function renderEnsiklopedia(kategori = 'all') {
  const container = document.getElementById('ensiklopediaGrid');
  if (!container) return;

  const filtered = kategori === 'all' ? dataKopiList : dataKopiList.filter(k => k.asal === kategori);

  container.innerHTML = filtered.map(item => {
    const isFav = favoritKopi.includes(item.id);
    return `
      <div class="kopi-card">
        <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorit('${item.id}')">${isFav ? '★' : '☆'}</button>
        <h3>${item.nama}</h3>
        <span class="region">${item.region}</span>
        <p>${item.desc}</p>
        <div class="kopi-meta">
          <span>Spesies: ${item.jenis}</span> • 
          <span>Rasa: ${item.rasa}</span>
        </div>
      </div>
    `;
  }).join('');
}

function toggleFavorit(id) {
  if (favoritKopi.includes(id)) {
    favoritKopi = favoritKopi.filter(favId => favId !== id);
  } else {
    favoritKopi.push(id);
  }
  localStorage.setItem('coffee_favs', JSON.stringify(favoritKopi));
  renderEnsiklopedia();
  renderFavorit();
}

function renderFavorit() {
  const grid = document.getElementById('favoritGrid');
  const empty = document.getElementById('favoritEmpty');
  if (!grid || !empty) return;

  const favItems = dataKopiList.filter(k => favoritKopi.includes(k.id));

  if (favItems.length === 0) {
    grid.style.display = 'none';
    empty.style.display = 'block';
  } else {
    grid.style.display = 'grid';
    empty.style.display = 'none';

    grid.innerHTML = favItems.map(item => `
      <div class="kopi-card">
        <button class="fav-btn active" onclick="toggleFavorit('${item.id}')">★</button>
        <h3>${item.nama}</h3>
        <span class="region">${item.region}</span>
        <p>${item.desc}</p>
        <div class="kopi-meta">
          <span>Spesies: ${item.jenis}</span> • 
          <span>Rasa: ${item.rasa}</span>
        </div>
      </div>
    `).join('');
  }
}

/* ============ PANDUAN PENYEDUHAN ============ */
const dataPanduan = {
  v60: {
    nama: 'V60 Pour Over', rasio: '1:15 (15g kopi / 225ml air)', gilingan: 'Medium-Fine', waktu: '2.5 - 3 Menit', suhu: '90 - 93°C',
    langkah: [
      'Bilas kertas filter dengan air panas untuk menghilangkan bau kertas.',
      'Masukkan 15g kopi gilingan medium-fine ke dalam filter.',
      'Tuangkan 40ml air panas untuk blooming, diamkan selama 30 detik.',
      'Tuang sisanya secara perlahan memutar hingga mencapai 225ml.',
      'Tunggu hingga seluruh air turun dan sajikan.'
    ],
    tips: 'Gunakan air yang bersuhu sekitar 92°C agar ekstraksi rasa manis alami kopi keluar maksimal.'
  },
  frenchpress: {
    nama: 'French Press', rasio: '1:16 (20g kopi / 320ml air)', gilingan: 'Coarse (Kasar)', waktu: '4 Menit', suhu: '92 - 95°C',
    langkah: [
      'Masukkan 20g kopi giling kasar ke dalam wadah French Press.',
      'Tuang 320ml air panas sekaligus.',
      'Aduk perlahan 3-4 kali, lalu pasang penutup tanpa menekan plunger.',
      'Diamkan selama 4 menit.',
      'Tekan plunger ke bawah secara perlahan hingga dasar, lalu tuang kopi.'
    ],
    tips: 'Gunakan gilingan kasar agar ampas kopi tidak lolos melewati filter kawat.'
  },
  aeropress: {
    nama: 'AeroPress', rasio: '1:12 (15g kopi / 180ml air)', gilingan: 'Medium-Fine', waktu: '1.5 - 2 Menit', suhu: '85 - 88°C',
    langkah: [
      'Gunakan metode inverted (terbalik). Masukkan 15g kopi.',
      'Tuang 180ml air panas suhu 85°C.',
      'Aduk selama 10 detik, lalu diamkan selama 1 menit.',
      'Pasang filter, balikkan ke atas cangkir, lalu tekan pelan selama 30 detik.'
    ],
    tips: 'AeroPress sangat fleksibel dan aman dari rasa pahit karena suhu penyeduhan lebih rendah.'
  },
  coldbrew: {
    nama: 'Cold Brew', rasio: '1:8 (50g kopi / 400ml air dingin)', gilingan: 'Coarse (Kasar)', waktu: '12 - 18 Jam', suhu: 'Air Dingin / Ruang',
    langkah: [
      'Campurkan 50g kopi giling kasar dengan 400ml air dingin dalam wadah kedap udara.',
      'Aduk rata hingga seluruh ampas basah.',
      'Tutup wadah dan simpan dalam kulkas selama 12 - 18 jam.',
      'Saring menggunakan kain/filter kertas, sajikan dengan es batu.'
    ],
    tips: 'Hasil cold brew sangat rendah asam dan dapat disimpan di kulkas hingga 2 minggu.'
  },
  tubruk: {
    nama: 'Kopi Tubruk', rasio: '1:15 (10g kopi / 150ml air)', gilingan: 'Fine (Halus)', waktu: '3 - 4 Menit', suhu: '95 - 98°C',
    langkah: [
      'Masukkan 10g bubuk kopi halus ke dalam cangkir.',
      'Tuangkan air mendidih sekitar 150ml.',
      'Aduk mendatar hingga kopi larut, lalu diamkan 3 menit hingga ampas mengendap.',
      'Kopi siap dinikmati tanpa perlu disaring.'
    ],
    tips: 'Tunggu ampas benar-benar mengendap di dasar cangkir sebelum diminum.'
  },
  mokapot: {
    nama: 'Moka Pot', rasio: 'Sesuai kapasitas basket', gilingan: 'Fine to Medium', waktu: '5 - 7 Menit', suhu: 'Api Kompor Sedang',
    langkah: [
      'Isi tangki bawah dengan air panas hingga batas katup pengaman.',
      'Isi keranjang filter dengan bubuk kopi tanpa dipadatkan.',
      'Pasang bagian atas dengan kencang, letakkan di atas kompor api kecil-sedang.',
      'Saat kopi mulai keluar ke ruang atas, matikan api sebelum berbusa berlebihan.'
    ],
    tips: 'Gunakan kain basah dingin untuk mendinginkan bagian bawah Moka Pot setelah selesai agar kopi tidak gosong.'
  }
};

function showPanduan(type, btn) {
  if (btn) {
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.style.background = '#1c120a';
      b.style.color = '#d4a359';
      b.classList.remove('active');
    });
    btn.style.background = '#d4a359';
    btn.style.color = '#150d08';
    btn.classList.add('active');
  }

  const p = dataPanduan[type];
  const container = document.getElementById('panduanContent');
  if (!container || !p) return;

  container.innerHTML = `
    <div class="panduan-header" style="display:flex; gap:15px; align-items:center; background:#1c120a; padding:20px; border-radius:14px; margin-bottom:20px; border:1px solid rgba(212,163,89,0.15);">
      <div>
        <h3 style="color:#fff; margin-bottom:4px;">${p.nama}</h3>
        <p style="color:#b5a596; font-size:13.5px;">Cara praktis menyeduh kopi ${p.nama} di rumah.</p>
      </div>
    </div>

    <div class="panduan-info" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-bottom:20px;">
      <div style="background:#1c120a; padding:12px; border-radius:10px; text-align:center; border:1px solid rgba(212,163,89,0.1);"><div style="font-size:11px; color:#a39385;">Rasio</div><div style="font-weight:bold; color:#d4a359; font-size:13.5px;">${p.rasio}</div></div>
      <div style="background:#1c120a; padding:12px; border-radius:10px; text-align:center; border:1px solid rgba(212,163,89,0.1);"><div style="font-size:11px; color:#a39385;">Gilingan</div><div style="font-weight:bold; color:#d4a359; font-size:13.5px;">${p.gilingan}</div></div>
      <div style="background:#1c120a; padding:12px; border-radius:10px; text-align:center; border:1px solid rgba(212,163,89,0.1);"><div style="font-size:11px; color:#a39385;">Waktu</div><div style="font-weight:bold; color:#d4a359; font-size:13.5px;">${p.waktu}</div></div>
      <div style="background:#1c120a; padding:12px; border-radius:10px; text-align:center; border:1px solid rgba(212,163,89,0.1);"><div style="font-size:11px; color:#a39385;">Suhu Air</div><div style="font-weight:bold; color:#d4a359; font-size:13.5px;">${p.suhu}</div></div>
    </div>

    <h4 style="color:#fff; margin-bottom:10px;">Langkah Penyeduhan:</h4>
    <ol style="margin-left:20px; margin-bottom:20px; color:#b5a596; line-height:1.6;">
      ${p.langkah.map(step => `<li style="margin-bottom:6px;">${step}</li>`).join('')}
    </ol>

    <div style="background:#1c120a; border-left:4px solid #d4a359; padding:15px; border-radius:8px; color:#d4a359; font-size:13.5px;">
      <strong>Tips Barista:</strong> ${p.tips}
    </div>
  `;
}

/* ============ FEATURE: BANDINGKAN KOPI ============ */
function initComparison() {
  const selA = document.getElementById('compareA');
  const selB = document.getElementById('compareB');
  if (!selA || !selB) return;

  const optionsHTML = '<option value="">-- Pilih Kopi --</option>' +
    dataKopiList.map(k => `<option value="${k.id}">${k.nama}</option>`).join('');

  selA.innerHTML = optionsHTML;
  selB.innerHTML = optionsHTML;
}

function updateComparison() {
  const idA = document.getElementById('compareA').value;
  const idB = document.getElementById('compareB').value;
  const res = document.getElementById('compareResult');
  if (!res) return;

  if (!idA || !idB) {
    res.innerHTML = '<p style="text-align:center; color:#b5a596; padding:20px;">Silakan pilih 2 jenis kopi di atas untuk melihat perbandingannya.</p>';
    return;
  }

  const kA = dataKopiList.find(k => k.id === idA);
  const kB = dataKopiList.find(k => k.id === idB);

  res.innerHTML = `
    <div style="background:#1c120a; padding:20px; border-radius:16px; border:1px solid rgba(212,163,89,0.15);">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; padding:10px 0; border-bottom:1px dashed rgba(212,163,89,0.15);">
        <div style="background:#150d08; padding:12px; border-radius:10px; text-align:center;"><h4 style="color:#fff;">${kA.nama}</h4></div>
        <div style="background:#150d08; padding:12px; border-radius:10px; text-align:center;"><h4 style="color:#fff;">${kB.nama}</h4></div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; padding:12px 0; border-bottom:1px dashed rgba(212,163,89,0.15);">
        <div><strong style="color:#d4a359; font-size:12px;">Region:</strong><p style="color:#b5a596; font-size:13.5px;">${kA.region}</p></div>
        <div><strong style="color:#d4a359; font-size:12px;">Region:</strong><p style="color:#b5a596; font-size:13.5px;">${kB.region}</p></div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; padding:12px 0; border-bottom:1px dashed rgba(212,163,89,0.15);">
        <div><strong style="color:#d4a359; font-size:12px;">Spesies:</strong><p style="color:#b5a596; font-size:13.5px;">${kA.jenis}</p></div>
        <div><strong style="color:#d4a359; font-size:12px;">Spesies:</strong><p style="color:#b5a596; font-size:13.5px;">${kB.jenis}</p></div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; padding:12px 0; border-bottom:1px dashed rgba(212,163,89,0.15);">
        <div><strong style="color:#d4a359; font-size:12px;">Profil Rasa:</strong><p style="color:#b5a596; font-size:13.5px;">${kA.rasa}</p></div>
        <div><strong style="color:#d4a359; font-size:12px;">Profil Rasa:</strong><p style="color:#b5a596; font-size:13.5px;">${kB.rasa}</p></div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; padding:12px 0;">
        <div><strong style="color:#d4a359; font-size:12px;">Body:</strong><p style="color:#b5a596; font-size:13.5px;">${kA.body}</p></div>
        <div><strong style="color:#d4a359; font-size:12px;">Body:</strong><p style="color:#b5a596; font-size:13.5px;">${kB.body}</p></div>
      </div>
    </div>
  `;
}

/* ============ FEATURE: PETA KOPI ============ */
const dataPeta = [
  { negara: 'Indonesia', code: 'ID', prod: '#4 Produsen Dunia', varietas: 'Gayo, Toraja, Mandailing, Kintamani', ket: 'Terkenal dengan karakter earthy, herbal, dan rasa cokelat tebal.' },
  { negara: 'Ethiopia', code: 'ET', prod: 'Tempat Asal Kopi', varietas: 'Yirgacheffe, Sidamo, Harrar', ket: 'Kopi aromatik dengan rasa floral dan keasaman fruity segar.' },
  { negara: 'Brasil', code: 'BR', prod: '#1 Produsen Dunia', varietas: 'Bourbon, Catuai, Mundo Novo', ket: 'Menghasilkan kopi bertubuh sedang dengan rasa kacang dan cokelat.' },
  { negara: 'Kolombia', code: 'CO', prod: '#3 Produsen Dunia', varietas: 'Castillo, Caturra, Colombia', ket: 'Rasa seimbang, keasaman karamel dan sentuhan buah yang kaya.' },
  { negara: 'Vietnam', code: 'VN', prod: '#2 Produsen Dunia', varietas: 'Robusta', ket: 'Produsen Robusta terbesar dunia, menjadi bahan utama Cà Phê Sữa Đá.' },
  { negara: 'Italia', code: 'IT', prod: 'Pusat Budaya Espresso', varietas: 'Espresso Blends', ket: 'Pelopor tradisi Espresso, Cappuccino, dan teknik roasting gelap.' }
];

function renderPeta() {
  const grid = document.getElementById('petaGrid');
  if (!grid) return;

  grid.innerHTML = dataPeta.map(p => `
    <div style="background:#1c120a; padding:20px; border-radius:16px; border:1px solid rgba(212,163,89,0.1);">
      <div style="font-size:18px; font-weight:bold; color:#d4a359; margin-bottom:8px;">${p.code}</div>
      <h3 style="color:#fff; margin-bottom:4px;">${p.negara}</h3>
      <p style="color:#d4a359; font-size:13px; font-weight:bold; margin-bottom:6px;">${p.prod}</p>
      <p style="font-size:13px; color:#b5a596; margin-bottom:12px;">${p.ket}</p>
      <div style="border-top:1px dashed rgba(212,163,89,0.15); padding-top:8px; font-size:12px; color:#a39385;"><strong>Varietas:</strong> ${p.varietas}</div>
    </div>
  `).join('');
}

/* ============ COFFEE FINDER ============ */
function findCoffee() {
  const taste = document.getElementById('taste').value;
  const suhu = document.getElementById('suhu').value;
  const waktu = document.getElementById('waktu').value;
  const hasil = document.getElementById('hasil');

  if (!taste || !suhu || !waktu) {
    hasil.style.display = 'block';
    hasil.innerHTML = "<h3 style='color:#e74c3c;'>Lengkapi dulu semua pilihan ya!</h3>";
    return;
  }

  let rekomendasi = "";
  let deskripsi = "";
  let gambar = "";

  if (taste === "manis") {
    if (suhu === "dingin") {
      rekomendasi = "Iced Caramel Macchiato";
      deskripsi = "Manis, creamy, dan dingin — cocok untuk siang hari yang panas.";
      gambar = "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600";
    } else {
      rekomendasi = "Caffè Mocha";
      deskripsi = "Kombinasi espresso, cokelat, dan susu yang manis dan menghangatkan.";
      gambar = "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600";
    }
  } else if (taste === "kuat") {
    if (waktu === "pagi") {
      rekomendasi = "Espresso Doppio";
      deskripsi = "Dua shot espresso murni untuk memulai pagi dengan semangat!";
      gambar = "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600";
    } else {
      rekomendasi = "Americano";
      deskripsi = "Espresso dengan air panas — kuat tapi tetap smooth.";
      gambar = "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=600";
    }
  } else if (taste === "creamy") {
    if (suhu === "dingin") {
      rekomendasi = "Iced Latte";
      deskripsi = "Espresso dengan susu dingin dan es — lembut dan menyegarkan.";
      gambar = "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600";
    } else {
      rekomendasi = "Cappuccino";
      deskripsi = "Espresso dengan foam susu tebal — creamy dan seimbang.";
      gambar = "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600";
    }
  } else if (taste === "asam") {
    if (waktu === "pagi") {
      rekomendasi = "Kopi Gayo Pour Over";
      deskripsi = "Kopi single origin Aceh dengan keasaman cerah dan aroma buah.";
      gambar = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600";
    } else {
      rekomendasi = "Ethiopia Yirgacheffe";
      deskripsi = "Kopi dengan karakter fruity dan floral yang khas.";
      gambar = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600";
    }
  }

  hasil.style.display = 'block';
  hasil.innerHTML = `
    <img src="${gambar}" alt="${rekomendasi}" style="width:100%; max-height:220px; object-fit:cover; border-radius:12px; margin-bottom:15px;">
    <h3 style="color:#d4a359; margin-bottom:6px;">Rekomendasi untukmu: ${rekomendasi}</h3>
    <p style="color:#b5a596; font-size:13.5px;">${deskripsi}</p>
    <p style="margin-top:12px; font-size:12px; color:#a39385;">Berdasarkan pilihan: <strong>${taste}</strong> • <strong>${suhu}</strong> • <strong>${waktu}</strong></p>
  `;
}

/* ============ FORM KONTAK → KIRIM KE WHATSAPP ============ */
function kirimPesan(event) {
  event.preventDefault();

  const nama = document.getElementById('nama').value.trim();
  const telepon = document.getElementById('telepon').value.trim();
  const pesan = document.getElementById('pesan').value.trim();
  const status = document.getElementById('formStatus');

  const NOMOR_WA = "6289635952948";

  if (!nama || !telepon || !pesan) {
    status.style.color = "#e74c3c";
    status.textContent = "Mohon isi semua field!";
    return false;
  }

  const telRegex = /^[0-9+\-\s]{10,}$/;
  if (!telRegex.test(telepon)) {
    status.style.color = "#e74c3c";
    status.textContent = "Format nomor telepon tidak valid! (min 10 digit)";
    return false;
  }

  const pesanWA =
    "Halo COFFEE STORY %0A%0A" +
    "*Nama:* " + encodeURIComponent(nama) + "%0A" +
    "*No. Telepon:* " + encodeURIComponent(telepon) + "%0A%0A" +
    "*Pesan:*%0A" + encodeURIComponent(pesan);

  const urlWA = "https://wa.me/" + NOMOR_WA + "?text=" + pesanWA;
  window.open(urlWA, "_blank");

  status.style.color = "#2ecc71";
  status.textContent = "Membuka WhatsApp... Klik Send untuk mengirim pesan!";

  document.getElementById('contactForm').reset();
  setTimeout(function() { status.textContent = ""; }, 5000);
  return false;
}

/* ============ CHATBOT AI BARISTA ============ */
const coffeeKnowledge = [
  {
    keywords: ['sejarah kopi', 'asal kopi', 'asal usul kopi', 'penemuan kopi', 'kopi pertama', 'sejarah'],
    answer: "<strong>Sejarah Kopi:</strong><br>Kopi pertama kali ditemukan di <strong>Ethiopia</strong> pada abad ke-9 oleh penggembala kambing bernama <em>Kaldi</em>[cite: 1]. Dari Ethiopia, kopi menyebar ke Arab (Yaman) pada abad ke-15[cite: 1], lalu ke Eropa pada abad ke-17[cite: 1], dan akhirnya ke Indonesia pada tahun <strong>1696</strong> melalui VOC[cite: 1].<br><br><a href='javascript:void(0)' onclick='showPage(\"sejarah\")' style='color:#d4a359;font-weight:600;'>Buka halaman Sejarah →</a>"
  },
  {
    keywords: ['arabica', 'kopi arabika', 'arabika'],
    answer: "<strong>Kopi Arabica:</strong><br>• Rasa lembut & aroma kompleks[cite: 1]<br>• Keasaman lebih tinggi[cite: 1]<br>• Tumbuh di dataran tinggi (1000-2000 mdpl)[cite: 1]<br>• Menyumbang 60% produksi kopi dunia[cite: 1].<br><br><a href='javascript:void(0)' onclick='showPage(\"jenis\")' style='color:#d4a359;font-weight:600;'>Buka halaman Jenis →</a>"
  },
  {
    keywords: ['robusta', 'kopi robusta'],
    answer: "<strong>Kopi Robusta:</strong><br>• Rasa kuat, pahit, dan bold[cite: 1]<br>• Kafein tinggi (~2.2%)[cite: 1]<br>• Tumbuh di dataran rendah[cite: 1]<br>• Sangat cocok untuk espresso dan campuran kopi susu[cite: 1]."
  },
  {
    keywords: ['resep v60', 'cara v60', 'v60'],
    answer: "<strong>Resep V60:</strong><br>1. Siapkan 15g kopi (gilingan medium-fine).<br>2. Gunakan 225ml air bersuhu 90-93°C.<br>3. Lakukan blooming dengan 40ml air selama 30 detik.<br>4. Tuang perlahan melingkar hingga mencapai 225ml."
  },
  {
    keywords: ['resep es kopi susu', 'buat es kopi susu', 'kopi susu gula aren'],
    answer: "<strong>Resep Es Kopi Susu Gula Aren:</strong><br>1. Seduh 30ml espresso atau tubruk pekat.<br>2. Siapkan 150ml susu cair segar.<br>3. Larutkan 20ml gula aren cair dengan sedikit air hangat.<br>4. Masukkan es batu, tuang gula aren, susu, lalu tumpahkan kopi di atasnya!"
  },
  {
    keywords: ['rekomendasi kopi pagi', 'kopi pagi'],
    answer: "<strong>Rekomendasi Pagi Hari:</strong><br>Untuk pagi hari, paling pas menikmati <strong>Kopi Gayo</strong>[cite: 1] atau secangkir <strong>Cappuccino</strong> hangat untuk membangkitkan energi dan fokusmu!"
  },
  {
    keywords: ['tips simpan kopi', 'simpan kopi', 'agar kopi awet'],
    answer: "<strong>Tips Menyimpan Biji Kopi:</strong><br>1. Simpan dalam wadah kedap udara (airtight container).<br>2. Letakkan di tempat yang sejuk dan gelap (hindari sinar matahari langsung).<br>3. Jangan disimpan di dalam kulkas karena kelembapan bisa merusak cita rasa biji kopi."
  },
  {
    keywords: ['alat seduh murah', 'alat pembuat kopi pemula', 'alat kopi pemula'],
    answer: "<strong>Alat Seduh Kopi Pemula:</strong><br>1. <strong>French Press</strong> — sangat praktis tinggal tekan[cite: 1].<br>2. <strong>V60 Dripper</strong> — ekonomis dan menghasilkan rasa yang bersih.<br>3. <strong>Moka Pot</strong> — alternatif espresso rumahan yang terjangkau."
  }
];

const fallbackResponses = [
  "Pertanyaan yang menarik! Coba tanyakan seputar <strong>sejarah kopi, jenis biji, resep V60, tips menyimpan kopi, atau rekomendasi minuman</strong> ya!",
  "Wah, saya masih belajar tentang hal itu. Coba pilih tombol cepat di atas atau tanyakan mengenai panduan seduh kopi!"
];

let chatbotOpen = false;

function toggleChatbot() {
  const container = document.getElementById('chatbotContainer');
  if (!container) return;
  chatbotOpen = !chatbotOpen;
  container.classList.toggle('open', chatbotOpen);
  if (chatbotOpen) {
    setTimeout(function() {
      const inp = document.getElementById('chatInput');
      if (inp) inp.focus();
    }, 300);
  }
}

function sendChat() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  input.value = '';

  showTypingIndicator();
}

function quickAsk(question) {
  addMessage(question, 'user');
  showTypingIndicator(question);
}

function showTypingIndicator(customQuery = null) {
  const messages = document.getElementById('chatbotMessages');
  if (!messages) return;

  const typingMsg = document.createElement('div');
  typingMsg.className = 'chat-message bot typing-indicator-box';
  typingMsg.innerHTML = '<div class="chat-bubble" style="color:#b5a596; font-style:italic;">Barista sedang meracik jawaban...</div>';
  messages.appendChild(typingMsg);
  messages.scrollTop = messages.scrollHeight;

  setTimeout(function() {
    messages.removeChild(typingMsg);
    const userMsgs = document.querySelectorAll('.chat-message.user');
    const lastUserText = customQuery || (userMsgs.length > 0 ? userMsgs[userMsgs.length - 1].innerText : "");
    
    const reply = getAIResponse(lastUserText);
    addMessage(reply, 'bot');
  }, 800);
}

function addMessage(text, sender) {
  const messages = document.getElementById('chatbotMessages');
  if (!messages) return;
  const msg = document.createElement('div');
  msg.className = 'chat-message ' + sender;
  msg.style.display = 'flex';
  msg.style.justifyContent = sender === 'user' ? 'flex-end' : 'flex-start';
  msg.innerHTML = '<div class="chat-bubble">' + text + '</div>';
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function getAIResponse(userText) {
  const lower = userText.toLowerCase();
  for (let item of coffeeKnowledge) {
    for (let kw of item.keywords) {
      if (lower.includes(kw)) {
        return item.answer;
      }
    }
  }
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

/* ============ INIT WEBSITE ============ */
window.addEventListener('DOMContentLoaded', function() {
  showPage('home');
  renderEnsiklopedia();
  showPanduan('v60');
  initComparison();
  renderPeta();
  renderFavorit();
});