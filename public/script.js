document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/rankings')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('ranking-data');
            container.innerHTML = '';

            // Puana göre sıralama
            data.sort((a, b) => parseInt(b.points) - parseInt(a.points));

            data.forEach((player, index) => {
                const isHT = player.tier.toLowerCase().includes('ht');
                const tierType = isHT ? 'ht' : 'lt';
                
                const card = document.createElement('div');
                card.className = 'player-card';
                
                card.innerHTML = `
                    <div class="rank-num">#${index + 1}</div>
                    <div class="player-info">
                        <img class="player-avatar" src="https://mc-heads.net/avatar/${player.username}/32" onerror="this.src='https://mc-heads.net/avatar/steve/32'">
                        <span class="player-name">${player.username}</span>
                    </div>
                    <div class="kit-info">${player.kit.toUpperCase()}</div>
                    <div class="tier-wrapper">
                        <span class="points-label">${player.points} PTS</span>
                        <span class="tier-badge ${tierType}">${player.tier.toUpperCase()}</span>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Veri çekme hatası:", err);
            document.getElementById('ranking-data').innerHTML = '<div class="text-center">Veriler yüklenemedi.</div>';
        });
});
