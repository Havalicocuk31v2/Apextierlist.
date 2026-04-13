const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// MCTiers Özel Tier Sıralama Mantığı (HT1-LT5)
const tierOrder = {
    'ht1': 1, 'lt1': 2, 'ht2': 3, 'lt2': 4,
    'ht3': 5, 'lt3': 6, 'ht4': 7, 'lt4': 8,
    'ht5': 9, 'lt5': 10
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
                points: parseInt(player.points) || 0,
                tierPriority: tierOrder[t] || 999 // Eğer listede yoksa en sona at
            };
        });

        // Sıralama Mantığı: Önce Tier Önceliği, Sonra Puan
        processedData.sort((a, b) => {
            if (a.tierPriority !== b.tierPriority) {
                return a.tierPriority - b.tierPriority;
            }
            return b.points - a.points; // Tier aynıysa yüksek puan önce
        });
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(processedData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
