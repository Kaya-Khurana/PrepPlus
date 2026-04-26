const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Subject = require('../models/Subject');
const Task = require('../models/Task');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all users (Admin only)
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get global stats (Admin only)
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const userCount = await User.countDocuments({});
        const subjectCount = await Subject.countDocuments({});
        const taskCount = await Task.countDocuments({});
        
        res.json({
            userCount,
            subjectCount,
            taskCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// @desc    Get specific user's subjects and tasks (Admin only)
router.get('/users/:id/details', protect, admin, async (req, res) => {
    try {
        const subjects = await Subject.find({ userId: req.params.id });
        const tasks = await Task.find({ userId: req.params.id }).populate('subjectId', 'name');
        const user = await User.findById(req.params.id).select('-password');
        
        res.json({
            user,
            subjects,
            tasks
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
