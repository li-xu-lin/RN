const mongoose = require('mongoose');

const yunShiSchema = new mongoose.Schema({
  // 幸运色和数字的组合
  luckyColor: {
    type: String,
    required: true,
    enum: ['红色', '金色', '绿色', '紫色', '蓝色', '黄色', '白色', '粉色']
  },
  luckyNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  
  // 运势指数 (1-100)
  fortuneScore: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  
  // 运势建议
  advice: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  // 创建时间
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Fortune', yunShiSchema,'Fortune'); 