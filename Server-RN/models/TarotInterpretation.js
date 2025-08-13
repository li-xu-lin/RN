const mongoose = require('mongoose');

const tarotInterpretationSchema = new mongoose.Schema({
    cardId: {
        type: String,
        required: true,
        index: true
    },
    position: {
        type: String,
        required: true,
        enum: ['upright', 'reversed'],
        index: true
    },
    keywords: {
        type: [String],
        required: true
    },
    shortDescription: {
        type: String,
        required: true,
        maxlength: 200
    },
    detailedDescription: {
        type: String,
        required: true
    },
    meaning: {
        general: String,
        love: String,
        career: String,
        finance: String,
        health: String,
        advice: String
    },
    // 统计信息
    stats: {
        drawCount: {
            type: Number,
            default: 0
        },
        lastDrawn: Date
    },
    // 创建和更新时间
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// 复合索引确保cardId和position的组合唯一
tarotInterpretationSchema.index({ cardId: 1, position: 1 }, { unique: true });

const TarotInterpretation = mongoose.model('TarotInterpretation', tarotInterpretationSchema, 'TarotInterpretation');

module.exports = TarotInterpretation; 