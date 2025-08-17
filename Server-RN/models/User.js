const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // 基本信息
    phone: {
        type: String,
        required: [true, '手机号是必填项'],
        unique: true
    },

    username: {
        type: String,
        default: '占卜师'
    },

    pwd: String,
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

    // 生日
    birthDate: String,

    // 用户星座
    zodiacSign: {
        type: String,
        enum: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座',
               '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
        default: '双鱼座'
    },

    // 地址
    awa: {
        province: String,
        city: String,
        district: String,
        fullAddress: String
    },

    // 签到相关
    leiJiQianDao: Number,
    isQianDao: Boolean,
    lastSignDate: Date,
    
    // 每日运势相关
    dailyFortune: {
        luckyColor: String,
        luckyColorDesc: String,
        luckyNumber: Number,
        luckyNumberDesc: String,
        fortuneScore: Number,
        yunShi: String,
        lastUpdated: Date
    },
    
    // 会员信息
    vip: {
        type: {
            type: String,
            enum: ['免费', '月会员', '季会员'],
            default: '免费'
        },
        startDate: Date,
        endDate: Date,
    },

    // 会员状态
    isMember: {
        type: Boolean,
        default: false
    },
    
    membershipEndDate: Date,

    // 占卜统计
    zhanBuStats: {
        total: Number,
        dayNum: Number,
        lastDate: Date,
    },

    // 经验值
    exp: Number,

    // 用户偏好设置
    pianHao: {
        tongZhi: {
            dayYunShi: {
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



const User = mongoose.model('User', userSchema, 'User');

module.exports = User; 