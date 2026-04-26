const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Subject = require('../models/Subject');
const { protect } = require('../middleware/auth');

// Get all tasks
router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id }).populate('subjectId', 'name color');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add task
router.post('/', protect, async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            userId: req.user._id
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update task status
router.patch('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { status: req.body.status },
            { new: true }
        );
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get dashboard stats
router.get('/stats/summary', protect, async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments({ userId: req.user._id });
        const pendingTasks = await Task.countDocuments({ userId: req.user._id, status: 'pending' });
        const completedTasks = await Task.countDocuments({ userId: req.user._id, status: 'completed' });
        const totalSubjects = await Subject.countDocuments({ userId: req.user._id });

        res.json({
            totalTasks,
            pendingTasks,
            completedTasks,
            totalSubjects,
            studyHours: (completedTasks * 1.5).toFixed(1), // Estimate based on 1.5h per task
            streak: req.user.streak || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
