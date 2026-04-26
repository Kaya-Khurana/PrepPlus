const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const listModels = async () => {
    try {
        const key = process.env.GEMINI_API_KEY;
        const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        console.log('Available Models:');
        res.data.models.forEach(m => console.log(m.name));
    } catch (err) {
        console.error('Failed to list models:', err.response?.data || err.message);
    }
};

listModels();
