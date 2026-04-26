const axios = require('axios');
const Subject = require('../models/Subject');
const Task = require('../models/Task');

const generateTimetable = async (req, res) => {
    const { availableHours, preferredTime } = req.body;
    const userId = req.user._id;

    try {
        const subjects = await Subject.find({ userId });
        const tasks = await Task.find({ userId, status: { $ne: 'completed' } });

        if (subjects.length < 2) {
            return res.status(400).json({ message: 'Add at least 2 subjects to generate a plan' });
        }

        const prompt = `
            Act as an expert academic study planner. Generate a targeted study timetable for a student with the following details:
            - Weekly available hours daily: ${availableHours} hours
            - Preferred study time: ${preferredTime} (Morning/Night)
            - Subjects: ${subjects.map(s => `${s.name} (Priority: ${s.priority})`).join(', ')}
            - Pending Tasks: ${tasks.map(t => t.title).join(', ')}

            Format the output ONLY as a valid raw JSON object. Do not include markdown code blocks or any introductory text. 
            The structure must be: { "Monday": [{"time": "slot", "subject": "name", "task": "goal"}], ... }
            Fill all days Monday through Sunday.
        `;

        // Using Gemini API (simulated or real if key provided)
        // In a real scenario, we'd use @google/generative-ai
        // For this demo, we'll structure the request to Google's API
        
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            }
        );

        const aiText = response.data.candidates[0].content.parts[0].text;
        // Parsing JSON from text (Gemini sometimes wraps in markdown)
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        const timetable = jsonMatch ? JSON.parse(jsonMatch[0]) : aiText;

        res.json({ timetable });
    } catch (error) {
        console.error('AI Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to generate AI timetable', error: error.message });
    }
};

module.exports = { generateTimetable };
