let rawData = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/rankings')
        .then(res => res.json())
        .then(data => {
            rawData = data;
            render('all'); // İlk açılışta Overall göster
        });

    document.querySelectorAll('.kit-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.kit-btn.active').classList.remove('active');
            btn.classList.add('active');
            render(btn.dataset.kit);
        }
    });
});

function render(filter) {
    const container = document.getElementById('ranking-data');
    let displayList = [];

    if (filter === 'all') {
        // OYUNCU BİRLEŞTİRME MANTIĞI (Overall için)
        const groups = {};
        rawData.forEach(p => {
            const name = p.username.toLowerCase();
            if (!groups[name]) {
                groups[name] = { ...p, allKits: [p], totalPoints: p.points };
            } else {
                groups[name].allKits.push(p);
                groups[name].totalPoints += p.points;
                // En iyi tieri ana gösterim yap
                if (p.tierWeight > groups[name].tierWeight) {
                    groups[name].tier = p.tier;
                    groups[name].tierWeight = p.tierWeight;
                }
            }
        });
        displayList = Object.values(groups).sort((a, b) => b.tierWeight - a.tierWeight || b.totalPoints - a.totalPoints);
    } else {
        displayList = rawData.filter(p => p.kit.toLowerCase() === filter);
    }

    container.innerHTML = displayList.map((p, i) => `
        <div class="player-card" onclick='openModal(${JSON.stringify(p)})'>
            <div class="p-info">
                <span style="color:#333; font-weight:800; width:20px">#${i+1}</span>
                <img src="https://mc-heads.net/avatar/${p.username}/32" style="border-radius:6px">
                <div>
                    <span class="p-name">${p.username}</span>
                    <span class="p-pts">${p.totalPoints || p.points} PTS</span>
                </div>
            </div>
            <b class="${p.tier.toLowerCase()}">${p.tier.toUpperCase()}</b>
        </div>
    `).join('');
}

function openModal(p) {
    const modal = document.getElementById('player-modal');
    document.getElementById('modal-username').innerText = p.username;
    document.getElementById('modal-avatar').src = `https://mc-heads.net/avatar/${p.username}/64`;
    
    // Çoklu Kit Gösterimi
    const kits = p.allKits || [p];
    const listHtml = kits.map(k => `
        <div class="tier-item">
            <span style="font-size:12px; color:#666">${k.kit.toUpperCase()}</span>
            <b class="${k.tier.toLowerCase()}">${k.tier.toUpperCase()}</b>
        </div>
    `).join('');
    
    document.querySelector('.modal-tier-list').innerHTML = `
        <p style="font-size:10px; color:#444; text-align:center; text-transform:uppercase">Kayıtlı Tierlar</p>
        ${listHtml}
        <div style="text-align:center; margin-top:15px; font-weight:800; color:var(--accent)">
            Toplam: ${p.totalPoints || p.points} PTS
        </div>
    `;

    modal.style.display = 'block';
}

function closeModal() { document.getElementById('player-modal').style.display = 'none'; }
