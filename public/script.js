let allData = [];

// Bölümler Arası Geçiş (Filtreleri Sıfırlar)
function showSection(section) {
    document.getElementById('rankings-section').style.display = section === 'rankings' ? 'block' : 'none';
    document.getElementById('servers-section').style.display = section === 'servers' ? 'block' : 'none';
    
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // API'den Veri Çekme
    fetch('/api/rankings')
        .then(res => res.json())
        .then(data => {
            allData = data;
            render(allData);
        });

    // Kit Filtreleme Butonları
    document.querySelectorAll('.kit-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.kit-btn.active').classList.remove('active');
            btn.classList.add('active');
            const kit = btn.dataset.kit;
            const filtered = kit === 'all' ? allData : allData.filter(p => p.kit.toLowerCase() === kit);
            render(filtered);
        }
    });
});

// Oyuncuları Listeleme
function render(data) {
    const container = document.getElementById('ranking-data');
    container.innerHTML = data.map((p, i) => `
        <div class="player-card" onclick='openModal(${JSON.stringify(p)})'>
            <div style="display:flex; align-items:center">
                <span style="color:#333; font-weight:800; width:25px; font-size:12px">#${i+1}</span>
                <img src="https://mc-heads.net/avatar/${p.username}/32" style="border-radius:6px">
                <span class="p-name">${p.username}</span>
            </div>
            <div class="text-right">
                <span style="font-size:11px; color:#444; margin-right:15px">${p.kit.toUpperCase()}</span>
                <b class="${p.tier.toLowerCase()}" style="font-size:14px">${p.tier.toUpperCase()}</b>
            </div>
        </div>
    `).join('');
}

// Oyuncu Detayı Açma
function openModal(p) {
    document.getElementById('modal-avatar').src = `https://mc-heads.net/avatar/${p.username}/64`;
    document.getElementById('modal-username').innerText = p.username;
    document.getElementById('modal-points').innerText = p.points + " PTS";
    document.getElementById('modal-kit').innerText = p.kit.toUpperCase();
    document.getElementById('modal-tier-badge').innerText = p.tier.toUpperCase();
    document.getElementById('modal-tier-badge').className = `tier-large ${p.tier.toLowerCase()}`;
    document.getElementById('player-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('player-modal').style.display = 'none';
}
