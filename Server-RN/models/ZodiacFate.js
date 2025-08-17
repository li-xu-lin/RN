const mongoose = require('mongoose');

const zodiacFateSchema = new mongoose.Schema({
    // 用户星座
    userZodiac: {
        type: String,
        required: true,
        enum: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座',
               '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
    },
    
    // 目标星座
    targetZodiac: {
        type: String,
        required: true,
        enum: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座',
               '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
    },
    
    // 缘分类型
    fateType: {
        type: String,
        required: true,
        enum: ['爱情缘分', '友情缘分', '事业缘分', '财运缘分']
    },
    
    // 基础描述
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    
    // 建议
    advice: {
        type: String,
        required: true,
        maxlength: 300
    },
    
    // 基础契合度（1-100）
    baseCompatibility: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    
    // 内容层级
    contentLevel: {
        type: String,
        enum: ['basic', 'premium'],
        default: 'basic'
    },
    
    // 基础内容
    basicContent: {
        description: String,
        advice: String,
        compatibility: Number
    },
    
    // 高级内容（会员专享）
    premiumContent: {
        detailedDescription: String,
        specificAdvice: String,
        timeline: String,
        luckyItems: [String],
        warnings: String,
        compatibility: Number
    },
    
    // 统计信息
    stats: {
        viewCount: {
            type: Number,
            default: 0
        },
        lastViewed: Date
    },
    
    // 创建时间
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    // 更新时间
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const ZodiacFate = mongoose.model('ZodiacFate', zodiacFateSchema, 'ZodiacFate');

module.exports = ZodiacFate; 