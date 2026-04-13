let rawData = [];

// BÖLÜM GEÇİŞLERİ
const btnRankings = document.getElementById('btn-rankings');
const btnServers = document.getElementById('btn-servers');
const rankingsSection = document.getElementById('rankings-section');
const serversSection = document.getElementById('servers-section');

btnRankings.onclick = () => {
    rankingsSection.style.display = 'block';
    serversSection.style.display = 'none';
    btnRankings.classList.add('active');
    btnServers.classList.remove('active');
};

btnServers.onclick = () => {
    rankingsSection.style.display = 'none';
    serversSection.style.display = 'block';
    btnServers.classList.add('active');
    btnRankings.classList.remove('active');
};

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/rankings')
        .then(res => res.json())
        .then(data => {
            rawData = data;
            render('all');
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
    let list = [];

    const tierWeight = { 'ht1':10,'lt1':9,'ht2':8,'lt2':7,'ht3':6,'lt3':5,'ht4':4,'lt4':3,'ht5':2,'lt5':1 };

    if (filter === 'all') {
        const groups = {};
        rawData.forEach(p => {
            const name = p.username.toLowerCase();
            const pTier = p.tier.toLowerCase().trim();
            if (!groups[name]) {
                groups[name] = { ...p, allKits: [p], totalPoints: p.points, bestWeight: tierWeight[pTier] || 0 };
            } else {
                groups[name].allKits.push(p);
                groups[name].totalPoints += p.points;
                let currentWeight = tierWeight[pTier] || 0;
                if (currentWeight > groups[name].bestWeight) {
                    groups[name].bestWeight = currentWeight;
                    groups[name].tier = p.tier;
                }
            }
        });
        list = Object.values(groups).sort((a,b) => b.bestWeight - a.bestWeight || b.totalPoints - a.totalPoints);
    } else {
        list = rawData.filter(p => p.kit.toLowerCase() === filter)
                      .sort((a,b) => (tierWeight[b.tier.toLowerCase()]||0) - (tierWeight[a.tier.toLowerCase()]||0) || b.points - a.points);
    }

    container.innerHTML = list.map((p, i) => `
        <div class="player-card" onclick='openModal(${JSON.stringify(p)})'>
            <div class="p-info">
                <span style="color:#222; font-weight:800; width:20px">#${i+1}</span>
                <img src="https://mc-heads.net/avatar/${p.username}/32" class="p-avatar">
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
    document.getElementById('modal-username').innerText = p.username;
    document.getElementById('modal-avatar').src = `https://mc-heads.net/avatar/${p.username}/64`;
    const kits = p.allKits || [p];
    document.getElementById('modal-tier-list').innerHTML = kits.map(k => `
        <div class="tier-item">
            <span style="font-size:12px; color:#444">${k.kit.toUpperCase()}</span>
            <b class="${k.tier.toLowerCase()}">${k.tier.toUpperCase()}</b>
        </div>
    `).join('') + `<p style="margin-top:15px; font-weight:800; color:var(--accent)">TOPLAM: ${p.totalPoints || p.points} PTS</p>`;
    document.getElementById('player-modal').style.display = 'block';
}

function closeModal() { document.getElementById('player-modal').style.display = 'none'; }
