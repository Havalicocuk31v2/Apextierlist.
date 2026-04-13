const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const tierOrder = {
    'ht1': 1, 'ht2': 2, 'ht3': 3, 'ht4': 4, 'ht5': 5,
    'lt1': 6, 'lt2': 7, 'lt3': 8, 'lt4': 9, 'lt5': 10
};

module.exports = async (req, res) => {
    try {
        const { data, error } = await supabase.from('rankings').select('*');
        if (error) throw error;

        const processedData = data.map(p => ({
            ...p,
            points: parseInt(p.points) || 0,
            tierPriority: tierOrder[p.tier.toLowerCase().trim()] || 999
        }));

        // ÖNCE Tier (HT1 en üst), SONRA Puan (Yüksek puan üstte)
        processedData.sort((a, b) => {
            if (a.tierPriority !== b.tierPriority) return a.tierPriority - b.tierPriority;
            return b.points - a.points;
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(processedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
