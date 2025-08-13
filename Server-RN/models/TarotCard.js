const mongoose = require('mongoose');

const tarotCardSchema = new mongoose.Schema({
    // 基本信息
    cardId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
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
    
    // 元素和象征
    element: {
        type: String,
        enum: ['火', '水', '风', '土', '灵'],
        required: false
    },
    planet: String,
    zodiac: String,
    hebrew: String,
    
    // 描述信息
    description: {
        type: String,
        required: true
    },
    symbolism: String,
    
    // 关键词
    keywords: {
        upright: [String],
        reversed: [String]
    },
    
    // 详细含义
    meanings: {
        upright: {
            general: String,
            love: String,
            career: String,
            finance: String,
            health: String,
            spirituality: String
        },
        reversed: {
            general: String,
            love: String,
            career: String,
            finance: String,
            health: String,
            spirituality: String
        }
    },
    
    // 占卜建议
    advice: {
        upright: String,
        reversed: String
    },
    
    // 图片和视觉
    imagePath: String,
    colors: [String],
    symbols: [String],
    
    // 统计信息
    stats: {
        totalDraws: {
            type: Number,
            default: 0
        },
        uprightDraws: {
            type: Number,
            default: 0
        },
        reversedDraws: {
            type: Number,
            default: 0
        },
        lastDrawn: Date,
        popularity: {
            type: Number,
            default: 0
        }
    },
    
    // 难度和复杂度
    complexity: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    
    // 是否启用
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// 索引优化
tarotCardSchema.index({ suit: 1, number: 1 });
tarotCardSchema.index({ element: 1 });
tarotCardSchema.index({ 'stats.totalDraws': -1 });
tarotCardSchema.index({ 'stats.lastDrawn': -1 });
tarotCardSchema.index({ isActive: 1 });

// 实例方法：记录抽牌
tarotCardSchema.methods.recordDraw = function(position) {
    this.stats.totalDraws += 1;
    this.stats.lastDrawn = new Date();
    
    if (position === 'upright') {
        this.stats.uprightDraws += 1;
    } else if (position === 'reversed') {
        this.stats.reversedDraws += 1;
    }
    
    // 更新人气度（基于最近抽牌频率）
    this.stats.popularity = this.stats.totalDraws * 0.1;
    
    return this.save();
};

// 静态方法：获取热门牌
tarotCardSchema.statics.getPopularCards = function(limit = 10) {
    return this.find({ isActive: true })
        .sort({ 'stats.totalDraws': -1 })
        .limit(limit);
};

// 静态方法：按花色获取牌
tarotCardSchema.statics.getBySuit = function(suit) {
    return this.find({ suit: suit, isActive: true }).sort({ number: 1 });
};

const TarotCard = mongoose.model('TarotCard', tarotCardSchema, 'TarotCard');

module.exports = TarotCard; 