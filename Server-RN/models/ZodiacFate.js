const mongoose = require('mongoose');

const zodiacFateSchema = new mongoose.Schema({
    // 用户星座
    userZodiac: {
        type: String,
        required: true,
        enum: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座',
               '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
        index: true
    },
    
    // 目标星座
    targetZodiac: {
        type: String,
        required: true,
        enum: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座',
               '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
        index: true
    },
    
    // 缘分类型
    fateType: {
        type: String,
        required: true,
        enum: ['爱情缘分', '友情缘分', '事业缘分', '财运缘分'],
        index: true
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
}, {
    timestamps: true
});

// 复合索引
zodiacFateSchema.index({ 
    userZodiac: 1, 
    targetZodiac: 1, 
    fateType: 1 
}, { unique: true });

zodiacFateSchema.index({ userZodiac: 1, fateType: 1 });
zodiacFateSchema.index({ baseCompatibility: -1 });

// 实例方法：记录查看
zodiacFateSchema.methods.recordView = function() {
    this.stats.viewCount += 1;
    this.stats.lastViewed = new Date();
    return this.save();
};

// 静态方法：获取用户所有缘分
zodiacFateSchema.statics.getUserFates = function(userZodiac) {
    return this.find({ userZodiac: userZodiac });
};

// 静态方法：获取特定类型缘分
zodiacFateSchema.statics.getFatesByType = function(userZodiac, fateType) {
    return this.find({ 
        userZodiac: userZodiac, 
        fateType: fateType 
    }).sort({ baseCompatibility: -1 });
};

// 静态方法：获取最佳匹配
zodiacFateSchema.statics.getBestMatches = function(userZodiac, limit = 5) {
    return this.find({ userZodiac: userZodiac })
        .sort({ baseCompatibility: -1 })
        .limit(limit);
};

const ZodiacFate = mongoose.model('ZodiacFate', zodiacFateSchema, 'ZodiacFate');

module.exports = ZodiacFate; 