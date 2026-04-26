const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const test = async () => {
    const key = process.env.GEMINI_API_KEY;
    console.log('Testing with key:', key.substring(0, 5) + '...');
    
    const models = [
        'v1/models/gemini-1.5-flash',
        'v1beta/models/gemini-1.5-flash',
        'v1beta/models/gemini-pro',
        'v1/models/gemini-pro'
    ];

    for (const model of models) {
        try {
            console.log(`Trying ${model}...`);
            const res = await axios.post(
                `https://generativelanguage.googleapis.com/${model}:generateContent?key=${key}`,
                { contents: [{ parts: [{ text: 'say hi' }] }] }
            );
            console.log(`✅ SUCCESS with ${model}`);
            process.exit(0);
        } catch (err) {
            console.log(`❌ FAILED with ${model}: ${err.response?.status} ${err.response?.data?.error?.message}`);
        }
    }
    process.exit(1);
};

test();
