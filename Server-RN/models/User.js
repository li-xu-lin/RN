const mongoose = require('mongoose');
const { calculateLevel, getLevelInfo } = require('../utils/levelSystem');


const userSchema = new mongoose.Schema({
    // 基本信息
    phone: {
        type: String,
        required: [true, '手机号是必填项'],
        unique: true,
        match: [/^1[3-9]\d{9}$/, '请输入有效的手机号码'],
        index: true
    },

    username: {
        type: String,
        default: '占卜师'
    },

    pwd: String,

    imgs: String,

    content: {
        type: String,
        maxlength: 200,
        default: '探索命运的奥秘'
    },

    sex: {
        type: String,
        enum: ['男', '女'],
        default: '女'
    },

    // 新增字段
    birthDate:String,

    // 用户星座
    zodiacSign: {
        type: String,
        enum: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座',
               '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
        default: '双鱼座'  // 默认星座
    },

    awa: { // 地址
        province: String, // 省份
        city: String, // 城市
        district: String, // 区县
        fullAddress: String // 详细地址
    },
    leiJiQianDao: Number,
    isQianDao: Boolean,
    lastSignDate: Date,
    
    // 每日运势相关
    dailyFortune: {
        luckyColor: String,        // 幸运色
        luckyColorDesc: String,    // 幸运色描述
        luckyNumber: Number,       // 幸运数字
        luckyNumberDesc: String,   // 幸运数字描述
        fortuneScore: Number,      // 运势指数 (1-100)
        yunShi: String,            // 运势建议
        lastUpdated: Date          // 最后更新时间
    },
    
    // 会员信息
    vip: {
        type: {
            type: String,
            enum: ['免费', '月会员', '季会员'],
            default: '免费'
        },
        startDate: Date,//开始时间
        endDate: Date,//结束时间
    },

    // 新增会员状态字段（用于支付系统）
    isMember: {
        type: Boolean,
        default: false,
        index: true
    },
    
    membershipEndDate: Date,

    // 占卜统计
    zhanBuStats: {
        total: Number,
        dayNum: Number,
        lastDate: Date, // 最后一次占卜时间
    },


    exp: Number,

    // 用户偏好设置
    pianHao: {
        tongZhi: {
            dayYunShi: {//每日运势
                type: Boolean,
                default: true
            }
        }
    },

    // 时间戳
    createdAt: Date,

    updatedAt: Date,

    lastLoginAt: Date,
});

// 虚拟字段：根据经验值动态计算等级
userSchema.virtual('level').get(function() {
    return calculateLevel(this.exp || 0);
});

// 虚拟字段：获取完整的等级信息
userSchema.virtual('levelInfo').get(function() {
    return getLevelInfo(this.exp || 0);
});

// 虚拟字段：获取等级进度百分比
userSchema.virtual('levelProgress').get(function() {
    const info = getLevelInfo(this.exp || 0);
    return info.progress;
});

// 虚拟字段：获取等级称号
userSchema.virtual('levelTitle').get(function() {
    const info = getLevelInfo(this.exp || 0);
    return info.title;
});

// 确保虚拟字段在JSON序列化时包含
userSchema.set('toJSON', { 
    virtuals: true,
    transform: function(doc, ret) {
        // 移除一些敏感或不需要的字段
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

userSchema.set('toObject', { virtuals: true });

// 实例方法：增加经验值
userSchema.methods.addExperience = function(expAmount) {
    const { addExperience } = require('../utils/levelSystem');
    const result = addExperience(this.exp || 0, expAmount);
    
    this.exp = result.newExp;
    
    return {
        ...result,
        levelInfo: getLevelInfo(result.newExp)
    };
};

// 实例方法：检查是否可以升级
userSchema.methods.checkLevelUp = function(newExp) {
    const oldLevel = calculateLevel(this.exp || 0);
    const newLevel = calculateLevel(newExp);
    return newLevel > oldLevel;
};

// 静态方法：根据等级查找用户
userSchema.statics.findByLevel = function(level) {
    const { getLevelExpRange } = require('../utils/levelSystem');
    const range = getLevelExpRange(level);
    
    return this.find({
        exp: {
            $gte: range.minExp,
            $lte: range.maxExp === Infinity ? Number.MAX_SAFE_INTEGER : range.maxExp
        }
    });
};

// 静态方法：获取等级排行榜
userSchema.statics.getLevelRanking = function(limit = 10) {
    return this.find({}, 'username exp imgs')
        .sort({ exp: -1 })
        .limit(limit);
};

const User = mongoose.model('User', userSchema, 'User');

module.exports = User; 