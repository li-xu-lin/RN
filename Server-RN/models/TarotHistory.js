const mongoose = require('mongoose');

const tarotHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cardId: {
        type: String,
        required: true
    },
    cardName: {
        type: String,
        required: true
    },
    cardSuit: {
        type: String,
        required: true
    },
    position: {
        type: String,
        enum: ['upright', 'reversed'],
        required: true
    },
    question: {
        type: String,
        default: ''
    },
    interpretation: {
        keywords: [String],
        shortDescription: String,
        detailedDescription: String,
        meaning: {
            general: String,
            love: String,
            career: String,
            finance: String,
            health: String,
            advice: String
        }
    },
    // 占卜结果摘要
    resultSummary: {
        type: String,
        required: true
    },
    // 占卜评分 (1-100)
    score: {
        type: Number,
        min: 1,
        max: 100,
        default: 75
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TarotHistory = mongoose.model('TarotHistory', tarotHistorySchema, 'TarotHistory');

module.exports = TarotHistory; 