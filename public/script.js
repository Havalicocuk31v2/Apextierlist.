document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/rankings')
        .then(response => response.json())
        .then(data => {
            const totalRankings = {};

            // Puanları toplama mantığı
            data.forEach(item => {
                if (!totalRankings[item.username]) {
                    totalRankings[item.username] = { ...item };
                } else {
                    totalRankings[item.username].points += item.points;
                    totalRankings[item.username].kit = "hybrid"; // İki kiti de varsa
                }
            });

            // Puanlara göre büyükten küçüğe sırala
            const sortedData = Object.values(totalRankings).sort((a, b) => b.points - a.points);

            const tableBody = document.getElementById('ranking-data');
            tableBody.innerHTML = ''; 

            sortedData.forEach((player, index) => {
                const row = document.createElement('tr');
                
                // Kit ikonu ayarı
                let kitIcon = player.kit === 'elytra' 
                    ? 'https://minecraft.wiki/images/Elytra_JE2_BE2.png' 
                    : 'https://minecraft.wiki/images/Oak_Planks_JE6_BE3.png';
                
                if(player.kit === 'hybrid') kitIcon = 'https://minecraft.wiki/images/Nether_Star_JE3_BE2.png';

                row.innerHTML = `
                    <td>#${index + 1}</td>
                    <td class="player"><img src="https://mc-heads.net/avatar/steve/24"> ${player.username}</td>
                    <td><img src="${kitIcon}" class="item-icon"> ${player.kit.toUpperCase()}</td>
                    <td><span class="badge badge-elytra">${player.tier.toUpperCase()}</span></td>
                    <td><span class="puan-cell">${player.points} PTS</span></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Hata:', error));
});

