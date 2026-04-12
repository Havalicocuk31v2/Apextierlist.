document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistem başlatıldı, veriler çekiliyor...");
    fetch('/api/rankings')
        .then(response => response.json())
        .then(data => {
            console.log("Gelen ham veri:", data);
            const totalRankings = {};

            data.forEach(item => {
                // Kullanıcı adlarını küçük harfe çevirerek gruplayalım (çakışma olmasın)
                const nameKey = item.username.toLowerCase().trim();
                
                if (!totalRankings[nameKey]) {
                    totalRankings[nameKey] = { 
                        username: item.username, 
                        points: parseInt(item.points), 
                        tier: item.tier,
                        kit: item.kit 
                    };
                } else {
                    totalRankings[nameKey].points += parseInt(item.points);
                    totalRankings[nameKey].kit = "Hybrid";
                }
            });

            const sortedData = Object.values(totalRankings).sort((a, b) => b.points - a.points);
            const tableBody = document.getElementById('ranking-data');
            
            if (!tableBody) return;
            tableBody.innerHTML = ''; 

            sortedData.forEach((player, index) => {
                const row = document.createElement('tr');
                
                // Kit İkonu Belirleme
                let kitIcon = "https://minecraft.wiki/images/Elytra_JE2_BE2.png"; // Varsayılan Elytra
                if (player.kit.toLowerCase() === 'elytratrap' || player.kit.toLowerCase() === 'trap') {
                    kitIcon = "https://minecraft.wiki/images/Oak_Planks_JE6_BE3.png";
                } else if (player.kit === 'Hybrid') {
                    kitIcon = "https://minecraft.wiki/images/Nether_Star_JE3_BE2.png";
                }

                row.innerHTML = `
                    <td>#${index + 1}</td>
                    <td class="player"><img src="https://mc-heads.net/avatar/${player.username}/24" onerror="this.src='https://mc-heads.net/avatar/steve/24'"> ${player.username}</td>
                    <td><img src="${kitIcon}" class="item-icon"> ${player.kit.toUpperCase()}</td>
                    <td><span class="badge badge-elytra">${player.tier.toUpperCase()}</span></td>
                    <td><span class="puan-cell">${player.points} PTS</span></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(err => console.error("Hata oluştu:", err));
});
