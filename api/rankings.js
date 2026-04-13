const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const tierOrder = {
    'ht1': 1000, 'lt1': 900, 'ht2': 800, 'lt2': 700,
    'ht3': 600, 'lt3': 500, 'ht4': 400, 'lt4': 300,
    'ht5': 200, 'lt5': 100
};

module.exports = async (req, res) => {
    try {
        const { data, error } = await supabase.from('rankings').select('*');
        if (error) throw error;

        // Verileri sayısal değerlere dönüştür
        const processed = data.map(p => ({
            ...p,
            points: parseInt(p.points) || 0,
            tierWeight: tierOrder[p.tier.toLowerCase().trim()] || 0
        }));

        // Eşitlik durumunda puanın devreye girdiği kesin sıralama
        processed.sort((a, b) => {
            if (a.tierWeight !== b.tierWeight) return b.tierWeight - a.tierWeight;
            return b.points - a.points;
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(processed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
