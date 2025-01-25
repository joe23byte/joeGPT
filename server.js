const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const config = require('./config'); 

const app = express();
const { PORT, API_BASE_URL } = config; 

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
    const { prompt, model } = req.body;

    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/generate`, 
            data: { model, prompt, stream: true },
            responseType: 'stream', 
        });

        response.data.pipe(res);
    } catch (error) {
        console.error('Fehler beim Abrufen der Antwort vom Modell:', error.message);
        res.status(500).json({ error: 'Fehler beim Abrufen der Antwort vom Modell' });
    }
});

app.get('/api/models', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tags`);

        const models = response.data.models.map((model) => model.name);

        res.json(models);
    } catch (error) {
        console.error('Fehler beim Abrufen der Modelle:', error.message);
        res.status(500).json({ error: 'Fehler beim Abrufen der Modelle' });
    }
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
