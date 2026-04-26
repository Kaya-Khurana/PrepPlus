const express = require('express');
const router = express.Router();
const { generateTimetable } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateTimetable);

module.exports = router;
