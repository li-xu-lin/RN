const mongoose = require('mongoose');

const simpleTarotCardSchema = new mongoose.Schema({
    cardId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    suit: {
        type: String,
        required: true,
        enum: ['大阿尔卡纳', '权杖', '圣杯', '宝剑', '钱币']
    },
    number: {
        type: String,
        required: true
    },
    element: {
        type: String,
        enum: ['火', '水', '风', '土', '灵']
    },
    description: {
        type: String,
        required: true
    },
    keywords: {
        upright: [String],
        reversed: [String]
    },
    // 统计信息
    stats: {
        drawCount: {
            type: Number,
            default: 0
        },
        uprightCount: {
            type: Number,
            default: 0
        },
        reversedCount: {
            type: Number,
            default: 0
        },
        lastDrawn: Date
    },
    // 图片路径
    imagePath: String,
    
    // 创建和更新时间
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// 索引
simpleTarotCardSchema.index({ suit: 1, number: 1 });
simpleTarotCardSchema.index({ 'stats.drawCount': -1 });

const SimpleTarotCard = mongoose.model('SimpleTarotCard', simpleTarotCardSchema, 'SimpleTarotCard');

module.exports = SimpleTarotCard; 