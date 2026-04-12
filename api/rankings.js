const { createClient } = require('@supabase/supabase-js');

// Vercel Environment Variables'dan bilgileri çeker
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
    try {
        // Rankings tablosundaki tüm verileri çek
        const { data, error } = await supabase
            .from('rankings')
            .select('*');
        
        if (error) throw error;
        
        // CORS ve JSON başlıklarını ayarla
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
        res.setHeader('Content-Type', 'application/json');
        
        // Veriyi gönder
        res.status(200).json(data);
    } catch (error) {
        console.error("API Hatası:", error.message);
        res.status(500).json({ error: error.message });
    }
};
