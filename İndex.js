const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const app = express();
const path = require('path');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Statik dosyaları (html, css, js) sunmak için
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/rankings', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('rankings')
            .select('*');
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ana sayfa isteği gelince index.html'i gönder
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda hazır.`);
});

module.exports = app;
