const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Subject name is required']
    },
    color: {
        type: String,
        default: '#3B82F6' // Default blue
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    examDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
