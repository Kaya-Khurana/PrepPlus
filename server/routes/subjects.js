const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { protect } = require('../middleware/auth');

// Get all subjects
router.get('/', protect, async (req, res) => {
    try {
        const subjects = await Subject.find({ userId: req.user._id });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add subject
router.post('/', protect, async (req, res) => {
    const { name, color, priority, examDate } = req.body;
    try {
        const subject = await Subject.create({
            userId: req.user._id,
            name, color, priority, examDate
        });
        res.status(201).json(subject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update subject
router.put('/:id', protect, async (req, res) => {
    const { name, color, priority, examDate } = req.body;
    try {
        const subject = await Subject.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { name, color, priority, examDate },
            { new: true }
        );
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        res.json(subject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete subject
router.delete('/:id', protect, async (req, res) => {
    try {
        const subject = await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        res.json({ message: 'Subject deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
