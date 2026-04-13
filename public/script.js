let allData = [];

function showSection(section) {
    document.getElementById('rankings-section').style.display = section === 'rankings' ? 'block' : 'none';
    document.getElementById('servers-section').style.display = section === 'servers' ? 'block' : 'none';
    
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/rankings')
        .then(res => res.json())
        .then(data => {
            allData = data;
            render(allData);
        });

    document.querySelectorAll('.kit-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.kit-btn.active').classList.remove('active');
            btn.classList.add('active');
            const filtered = btn.dataset.kit === 'all' ? allData : allData.filter(p => p.kit.toLowerCase() === btn.dataset.kit);
            render(filtered);
        }
    });
});

function render(data) {
    const container = document.getElementById('ranking-data');
    container.innerHTML = data.map((p, i) => `
        <div class="player-card" onclick="openModal(${JSON.stringify(p).replace(/"/g, '&quot;')})">
            <div style="display:flex; align-items:center; gap:15px">
                <span style="color:#444; font-weight:800">#${i+1}</span>
                <img src="https://mc-heads.net/avatar/${p.username}/32" style="border-radius:4px">
                <span class="p-name">${p.username}</span>
            </div>
            <div style="display:flex; align-items:center; gap:20px">
                <span style="font-size:12px; color:#666">${p.kit.toUpperCase()}</span>
                <b class="${p.tier.toLowerCase()}">${p.tier.toUpperCase()}</b>
            </div>
        </div>
    `).join('');
}

function openModal(p) {
    document.getElementById('modal-avatar').src = `https://mc-heads.net/avatar/${p.username}/64`;
    document.getElementById('modal-username').innerText = p.username;
    document.getElementById('modal-points').innerText = p.points;
    document.getElementById('modal-kit').innerText = p.kit.toUpperCase();
    document.getElementById('modal-tier-badge').innerText = p.tier.toUpperCase();
    document.getElementById('modal-tier-badge').className = `tier-large ${p.tier.toLowerCase()}`;
    document.getElementById('player-modal').style.display = 'block';
}

function closeModal() { document.getElementById('player-modal').style.display = 'none'; }
