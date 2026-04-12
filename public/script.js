document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/rankings')
        .then(res => res.json())
        .then(data => {
            const tableBody = document.getElementById('ranking-data');
            tableBody.innerHTML = '';

            // Puanlara göre sırala
            data.sort((a, b) => b.points - a.points);

            data.forEach((player, index) => {
                const isHT = player.tier.toLowerCase().startsWith('ht');
                const tierClass = isHT ? 'tier-ht' : 'tier-lt';
                
                const card = document.createElement('div');
                card.className = 'player-card';
                
                card.innerHTML = `
                    <div class="rank-num">${index + 1}.</div>
                    <div class="player-info">
                        <img src="https://mc-heads.net/avatar/${player.username}/40" alt="head">
                        <div class="player-name">${player.username}</div>
                    </div>
                    <div class="kit-info">
                        ${player.kit.toUpperCase()}
                    </div>
                    <div class="tier-box ${tierClass}">
                        ${player.tier.toUpperCase()}
                    </div>
                `;
                tableBody.appendChild(card);
            });
        });
});
