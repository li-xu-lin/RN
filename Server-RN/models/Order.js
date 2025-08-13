const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // 订单基本信息
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    
    // 用户信息
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    
    // 商品信息
    productType: {
        type: String,
        enum: ['月会员', '季会员'],
        required: true
    },
    
    productName: {
        type: String,
        required: true
    },
    
    // 价格信息
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    
    currency: {
        type: String,
        default: 'CNY'
    },
    
    // 支付信息
    paymentMethod: {
        type: String,
        enum: ['alipay'],
        default: 'alipay'
    },
    
    // 支付宝相关字段
    alipayTradeNo: String,      // 支付宝交易号
    alipayBuyerId: String,      // 支付宝买家ID
    
    // 订单状态
    status: {
        type: String,
        enum: ['pending', 'paid', 'cancelled', 'refunded'],
        default: 'pending',
        index: true
    },
    
    // 时间戳
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    
    paidAt: {
        type: Date,
        index: true
    },
    
    expiredAt: {
        type: Date,
        index: true
    },
    
    // 会员有效期
    membershipDuration: {
        type: Number, // 天数
        required: true
    },
    
    // 备注
    notes: String
}, {
    timestamps: true
});

// 索引
orderSchema.index({ userId: 1, status: 1 });
orderSchema.index({ createdAt: -1 });

// 实例方法：检查订单是否过期
orderSchema.methods.isExpired = function() {
    return this.expiredAt && new Date() > this.expiredAt;
};

// 静态方法：生成订单号
orderSchema.statics.generateOrderId = function() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${timestamp}${random}`;
};

const Order = mongoose.model('Order', orderSchema, 'Order');

module.exports = Order; 