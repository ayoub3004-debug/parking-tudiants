const API = 'api';
let map, markers = {}, parkings = [], activeParking = null, selectedStar = 0;

// ── Init map ──
function initMap() {
  map = L.map('map', { zoomControl: false }).setView([47.87, 1.91], 13);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19
  }).addTo(map);

  map.on('click', (e) => {
    if (document.getElementById('modal-ajout').classList.contains('open')) {
      document.getElementById('add-lat').value = e.latlng.lat.toFixed(6);
      document.getElementById('add-lng').value = e.latlng.lng.toFixed(6);
    }
  });
}

// ── Custom marker ──
function getMarkerIcon(statut) {
  const colors = { disponible: '#4caf50', occupe: '#f44336', ferme: '#ff9800', null: '#c8f04a' };
  const color = colors[statut] || colors[null];
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
}

// ── Load parkings ──
async function loadParkings(filters = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${API}/parkings.php?${params}`);
  parkings = await res.json();
  renderList(parkings);
  renderMarkers(parkings);
}

// ── Render list ──
function renderList(data) {
  const list = document.getElementById('parking-list');
  if (!data.length) {
    list.innerHTML = '<div class="empty">Aucun parking trouvé</div>';
    return;
  }
  list.innerHTML = data.map(p => `
    <div class="parking-card ${activeParking?.id == p.id ? 'active' : ''}" onclick="openDetail(${p.id})">
      <div class="parking-card-header">
        <span class="parking-card-name">${p.nom}</span>
        ${statusBadge(p.dernier_statut)}
      </div>
      <div class="parking-card-addr">📍 ${p.adresse}</div>
      <div class="parking-card-tags">
        ${p.gratuit ? '<span class="tag">Gratuit</span>' : ''}
        ${p.accessible_pmr ? '<span class="tag">PMR</span>' : ''}
        ${p.proche_fac ? '<span class="tag">Proche fac</span>' : ''}
        ${p.nb_places ? `<span class="tag">${p.nb_places} places</span>` : ''}
      </div>
      <div class="parking-card-meta">
        <span>${p.nb_commentaires || 0} avis ${p.note_moyenne ? '⭐ ' + p.note_moyenne : ''}</span>
      </div>
    </div>
  `).join('');
}

// ── Render markers ──
function renderMarkers(data) {
  Object.values(markers).forEach(m => map.removeLayer(m));
  markers = {};
  data.forEach(p => {
    const m = L.marker([p.latitude, p.longitude], { icon: getMarkerIcon(p.dernier_statut) }).addTo(map);
    m.bindPopup(`
      <div class="map-popup">
        <h3>${p.nom}</h3>
        <p>${p.adresse}</p>
        <button class="popup-btn" onclick="openDetail(${p.id})">Voir détails</button>
      </div>
    `);
    markers[p.id] = m;
  });
}

// ── Status badge ──
function statusBadge(statut) {
  const labels = { disponible: 'Disponible', occupe: 'Occupé', ferme: 'Fermé' };
  const cls = statut || 'inconnu';
  const label = labels[statut] || 'Inconnu';
  return `<span class="status-badge status-${cls}">${label}</span>`;
}

// ── Open detail modal ──
async function openDetail(id) {
  const p = parkings.find(x => x.id == id);
  if (!p) return;
  activeParking = p;
  renderList(parkings);

  if (markers[id]) {
    map.setView([p.latitude, p.longitude], 16);
    markers[id].openPopup();
  }

  const modal = document.getElementById('modal-detail');
  modal.querySelector('.modal-header h2').textContent = p.nom;
  modal.querySelector('#detail-body').innerHTML = `
    <div class="detail-status">${statusBadge(p.dernier_statut)}</div>
    <div class="detail-addr">📍 ${p.adresse}</div>
    <div class="detail-tags">
      ${p.gratuit ? '<span class="tag">✅ Gratuit</span>' : ''}
      ${p.accessible_pmr ? '<span class="tag">♿ PMR</span>' : ''}
      ${p.proche_fac ? '<span class="tag">🎓 Proche fac</span>' : ''}
      ${p.nb_places ? `<span class="tag">🅿️ ${p.nb_places} places</span>` : ''}
    </div>
    ${p.description ? `<div class="detail-desc">${p.description}</div>` : ''}
    <div class="detail-meta">Ajouté par ${p.ajoute_par || 'Anonyme'}</div>

    <div class="section-title">Signaler le statut</div>
    <div class="signalement-btns">
      <button class="signal-btn disponible" onclick="signaler(${p.id}, 'disponible')">✅ Disponible</button>
      <button class="signal-btn occupe" onclick="signaler(${p.id}, 'occupe')">🚗 Occupé</button>
      <button class="signal-btn ferme" onclick="signaler(${p.id}, 'ferme')">🔒 Fermé</button>
    </div>
    <div id="signal-success" class="success-msg">Merci pour le signalement !</div>

    <div class="section-title">Avis & commentaires</div>
    <div id="comment-list" class="comment-list"><div class="loading">Chargement...</div></div>

    <div class="section-title">Laisser un avis</div>
    <div class="form-group">
      <label>Votre nom (optionnel)</label>
      <input type="text" id="comment-auteur" placeholder="Anonyme" />
    </div>
    <div class="form-group">
      <label>Note</label>
      <div class="stars-input" id="stars-input">
        ${[1,2,3,4,5].map(i => `<button class="star-btn" data-val="${i}" onclick="setStar(${i})">★</button>`).join('')}
      </div>
    </div>
    <div class="form-group">
      <label>Commentaire *</label>
      <textarea id="comment-msg" placeholder="Votre avis sur ce parking..."></textarea>
    </div>
    <div id="comment-success" class="success-msg">Commentaire ajouté !</div>
    <button class="btn btn-primary" onclick="submitComment(${p.id})">Envoyer</button>
  `;

  openModal('modal-detail');
  loadComments(p.id);
}

// ── Load comments ──
async function loadComments(parkingId) {
  const res = await fetch(`${API}/commentaires.php?parking_id=${parkingId}`);
  const data = await res.json();
  const el = document.getElementById('comment-list');
  if (!data.length) {
    el.innerHTML = '<div class="empty">Aucun avis pour l\'instant. Soyez le premier !</div>';
    return;
  }
  el.innerHTML = data.map(c => `
    <div class="comment-item">
      <div class="comment-header">
        <span class="comment-author">${c.auteur}</span>
        <span class="comment-date">${new Date(c.date_commentaire).toLocaleDateString('fr-FR')}</span>
      </div>
      ${c.note ? `<div class="comment-stars">${'★'.repeat(c.note)}${'☆'.repeat(5 - c.note)}</div>` : ''}
      <div class="comment-text">${c.message}</div>
    </div>
  `).join('');
}

// ── Stars ──
function setStar(val) {
  selectedStar = val;
  document.querySelectorAll('.star-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i < val);
  });
}

// ── Submit comment ──
async function submitComment(parkingId) {
  const msg = document.getElementById('comment-msg').value.trim();
  if (!msg) return;
  const res = await fetch(`${API}/commentaires.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      parking_id: parkingId,
      auteur: document.getElementById('comment-auteur').value.trim() || 'Anonyme',
      message: msg,
      note: selectedStar || null
    })
  });
  const data = await res.json();
  if (data.success) {
    document.getElementById('comment-success').style.display = 'block';
    document.getElementById('comment-msg').value = '';
    document.getElementById('comment-auteur').value = '';
    setStar(0);
    loadComments(parkingId);
    setTimeout(() => document.getElementById('comment-success').style.display = 'none', 3000);
  }
}

// ── Signaler ──
async function signaler(parkingId, statut) {
  const res = await fetch(`${API}/signalements.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ parking_id: parkingId, statut })
  });
  const data = await res.json();
  if (data.success) {
    document.getElementById('signal-success').style.display = 'block';
    const p = parkings.find(x => x.id == parkingId);
    if (p) {
      p.dernier_statut = statut;
      if (markers[parkingId]) markers[parkingId].setIcon(getMarkerIcon(statut));
    }
    setTimeout(() => {
      if (document.getElementById('signal-success'))
        document.getElementById('signal-success').style.display = 'none';
    }, 3000);
  }
}

// ── Modal ajout ──
async function submitAjout() {
  const nom = document.getElementById('add-nom').value.trim();
  const adresse = document.getElementById('add-adresse').value.trim();
  const lat = document.getElementById('add-lat').value;
  const lng = document.getElementById('add-lng').value;

  if (!nom || !adresse || !lat || !lng) {
    alert('Merci de remplir tous les champs obligatoires et de cliquer sur la carte pour positionner le parking.');
    return;
  }

  const res = await fetch(`${API}/parkings.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nom, adresse,
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      nb_places: document.getElementById('add-places').value || 0,
      accessible_pmr: document.getElementById('add-pmr').checked ? 1 : 0,
      proche_fac: document.getElementById('add-fac').checked ? 1 : 0,
      description: document.getElementById('add-desc').value.trim(),
      ajoute_par: document.getElementById('add-auteur').value.trim() || 'Anonyme'
    })
  });
  const data = await res.json();
  if (data.success) {
    document.getElementById('ajout-success').style.display = 'block';
    document.getElementById('ajout-success').textContent = data.message;
    document.getElementById('form-ajout').reset();
    setTimeout(() => closeModal('modal-ajout'), 3000);
  }
}

// ── Modal helpers ──
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  if (id === 'modal-detail') { activeParking = null; renderList(parkings); }
}

// ── Filters ──
function applyFilters() {
  const search = document.getElementById('search').value.trim();
  const pmr = document.getElementById('filter-pmr').classList.contains('active') ? 1 : '';
  const fac = document.getElementById('filter-fac').classList.contains('active') ? 1 : '';
  loadParkings({ search, pmr, fac });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadParkings();

  document.getElementById('search').addEventListener('input', debounce(applyFilters, 400));

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      applyFilters();
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });
});

function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}
