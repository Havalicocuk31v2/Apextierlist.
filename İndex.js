const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const app = express();
const path = require('path');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.static('public'));

app.get('/api/rankings', async (req, res) => {
    const { data, error } = await supabase
        .from('rankings')
        .select('*');
    
    if (error) return res.status(500).json(error);
    res.json(data);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
