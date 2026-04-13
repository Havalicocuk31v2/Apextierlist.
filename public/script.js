let allPlayerData = []; // Veriyi globalde tut

document.addEventListener('DOMContentLoaded', () => {
    // 1. Veriyi API'den Çek
    fetch('/api/rankings')
        .then(res => res.json())
        .then(data => {
            allPlayerData = data;
            renderRankings(allPlayerData); // Overall olarak render et
        })
        .catch(err => console.error("API Hatası:", err));

    // 2. Kit Seçim Mantığı
    const kitBtns = document.querySelectorAll('.kit-btn');
    kitBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Aktif butonu değiştir
            document.querySelector('.kit-btn.active').classList.remove('active');
            btn.classList.add('active');

            // Filtrele ve Render et
            const selectedKit = btn.dataset.kit;
            const filteredData = selectedKit === 'all' 
                ? allPlayerData 
                : allPlayerData.filter(p => p.kit.toLowerCase() === selectedKit);
            
            renderRankings(filteredData);
        });
    });

    // 3. Modal Kapatma Mantığı
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) closeModal();
    });
});

// Dinamik Tier Rengi Belirleme
function getTierStyle(tier) {
    const t = tier.toLowerCase().trim();
    // CSS :root'taki değişkenleri kullanıyoruz
    return `background: rgba(var(--${t}-rgb), 0.1); color: var(--${t}); border-color: var(--${t});`;
}

// Rankings Tablosunu Render Et
function renderRankings(data) {
    const container = document.getElementById('ranking-data');
    container.innerHTML = ''; // Temizle

    if (data.length === 0) {
        container.innerHTML = '<div class="text-center" style="padding:40px; color:var(--muted-text);">Bu kitte oyuncu bulunamadı.</div>';
        return;
    }

    data.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        // Tıklayınca Modalı Aç
        card.onclick = () => openModal(player);
        
        const t = player.tier.toLowerCase().trim();
        const badgeColor = `var(--${t})`;

        card.innerHTML = `
            <div class="rank-num">#${index + 1}</div>
            <div class="player-info">
                <img class="player-avatar" src="https://mc-heads.net/avatar/${player.username}/36" onerror="this.src='https://mc-heads.net/avatar/steve/36'">
                <span class="player-name">${player.username}</span>
            </div>
            <div class="text-right">
                <span class="tier-badge" style="color: ${badgeColor}; border-color: ${badgeColor}; background: rgba(0,0,0,0.3);">${player.tier.toUpperCase()}</span>
            </div>
            <div class="text-right points-val">${player.points} PTS</div>
        `;
        container.appendChild(card);
    });
}

// Oyuncu Detay Panelini (Modal) Aç
function openModal(player) {
    document.getElementById('modal-avatar').src = `https://mc-heads.net/avatar/${player.username}/64`;
    document.getElementById('modal-username').innerText = player.username;
    document.getElementById('modal-points').innerText = `${player.points} PTS - ${player.kit.toUpperCase()} Kit`;
    
    const tierBadge = document.getElementById('modal-tier-badge');
    tierBadge.innerText = player.tier.toUpperCase();
    
    const t = player.tier.toLowerCase().trim();
    tierBadge.style.color = `var(--${t})`;
    tierBadge.style.borderColor = `var(--${t})`;
    tierBadge.style.background = 'rgba(0,0,0,0.3)';

    document.getElementById('player-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('player-modal').style.display = 'none';
}
