const mongoose = require('mongoose');

const zhanBuSchema = new mongoose.Schema({
    // 关联用户
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // 占卜基本信息
    type: {
        type: String,
        enum: ['塔罗'],
        required: true
    },
    
    category: {
        type: String,
        enum: ['爱情', '事业', '财运', '健康', '学业'],
        required: true
    },
    
    // 占卜问题
    question: {
        type: String,
        maxlength: 500,
        trim: true
    },
    
    // 占卜结果
    result: {
        // 主要结果描述
        description: {
            type: String,
            required: true
        },
        
        // 详细解读
        interpretation: String,
        
        // 建议
        advice: String,
        
        // 评分 (0-100)
        score: {
            type: Number,
            min: 0,
            max: 100
        },
        
        // 关键词标签
        keywords: [String],
        
        // 幸运色彩
        luckyColor: String,
        
        // 幸运数字
        luckyNumber: Number
    },
    
    // 塔罗牌专用字段
    tarotCards: [{
        cardId: String,
        cardName: String,
        position: String, // 正位/逆位
        meaning: String,
        order: Number // 牌的位置顺序
    }],
    
    // 占卜状态
    status: {
        type: String,
        enum: ['进行中', '已完成', '已收藏'],
        default: '已完成'
    },
    
    // 是否收藏
    isFavorite: {
        type: Boolean,
        default: false
    },
    
    // 是否公开分享
    isPublic: {
        type: Boolean,
        default: false
    },
    
    // 占卜准确度反馈
    accuracy: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        feedback: String,
        ratedAt: Date
    },
    
    // 元数据
    metadata: {
        // 占卜时的设备信息
        device: String,
        // IP地址
        ipAddress: String,
        // 占卜时长（秒）
        duration: Number,
        // 使用的算法版本
        algorithmVersion: String
    },
    
    // 时间戳
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

const ZhanBu = mongoose.model('Divination', zhanBuSchema,'Divination');

module.exports = ZhanBu; 