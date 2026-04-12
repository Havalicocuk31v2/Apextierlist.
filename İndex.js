const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const app = express();
const path = require('path');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.static('public'));

app.get('/api/rankings', async (req, res) => {
    const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('tier', { ascending: true });
    
    if (error) return res.status(500).json(error);
    res.json(data);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT} üzerinde çalışıyor`));

module.exports = app;

