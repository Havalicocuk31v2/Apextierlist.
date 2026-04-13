const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// MCTiers Özel Tier Sıralama Mantığı
const tierOrder = {
    'ht1': 1, 'ht2': 2, 'ht3': 3, 'ht4': 4, 'ht5': 5,
    'lt1': 6, 'lt2': 7, 'lt3': 8, 'lt4': 9, 'lt5': 10
};

module.exports = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('rankings')
            .select('*');
        
        if (error) throw error;
        
        // Veriyi işle ve sırala
        const processedData = data.map(player => {
            const t = player.tier.toLowerCase().trim();
            return {
                ...player,
                // Puanı sayıya çevir
                points: parseInt(player.points) || 0,
                // Tier önceliğini belirle (eğer listede yoksa en sona at)
                tierPriority: tierOrder[t] || 999
            };
        });

        // Çoklu Sıralama: Önce Tier Önceliği, Sonra Puan
        processedData.sort((a, b) => {
            if (a.tierPriority !== b.tierPriority) {
                return a.tierPriority - b.tierPriority; // Tier önceliğine göre (HT1 önce)
            }
            return b.points - a.points; // Tier aynıysa puana göre (Yüksek puan önce)
        });
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(processedData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
