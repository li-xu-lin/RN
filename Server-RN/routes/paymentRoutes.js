const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AlipayUtils = require('../utils/alipayUtils');

// 获取会员套餐列表接口
router.get('/plans', async (req, res) => {
    try {
        const plans = {
            '月会员': AlipayUtils.getMembershipPlan('月会员'),
            '季会员': AlipayUtils.getMembershipPlan('季会员')
        };
        res.json({ code: 200, msg: '获取套餐列表成功', data: plans });
    } catch (error) {
        res.status(500).json({ code: 500, msg: '获取套餐列表失败', error: error.message });
    }
});

// 创建支付订单接口
router.post('/create', async (req, res) => {
    try {
        const { userId, planType } = req.body;
        if (!userId || !planType) return res.status(400).json({ code: 400, msg: '缺少必要参数' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ code: 404, msg: '用户不存在' });

        const plan = AlipayUtils.getMembershipPlan(planType);
        if (!plan) return res.status(400).json({ code: 400, msg: '无效的套餐类型' });

        const outTradeNo = AlipayUtils.generateOrderNo(userId, planType);
        const paymentResult = await AlipayUtils.createPayment({
            outTradeNo,
            totalAmount: plan.price,
            subject: plan.name,
            body: plan.description
        });

        if (!paymentResult.success) {
            return res.status(500).json({ code: 500, msg: paymentResult.message || '创建支付订单失败' });
        }

        res.json({
            code: 200,
            msg: '创建支付订单成功',
            data: { outTradeNo, orderString: paymentResult.data.orderString, amount: plan.price, planInfo: plan }
        });

    } catch (error) {
        res.status(500).json({ code: 500, msg: '创建支付订单失败', error: error.message });
    }
});

/**
 * 查询支付结果
 */
router.post('/query', async (req, res) => {
    try {
        const { outTradeNo } = req.body;

        if (!outTradeNo) {
            return res.status(400).json({
                code: 400,
                msg: '缺少订单号'
            });
        }

        // 查询支付宝支付状态
        const queryResult = await AlipayUtils.queryPayment(outTradeNo);
        
        if (queryResult.success) {
            const { tradeStatus, totalAmount } = queryResult.data;
            
            if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') {
                // 支付成功，更新用户VIP状态
                await updateUserVipStatus(outTradeNo);
                
                res.json({
                    code: 200,
                    msg: '支付成功',
                    data: {
                        status: 'paid',
                        amount: totalAmount
                    }
                });
            } else {
                res.json({
                    code: 200,
                    msg: '支付中',
                    data: {
                        status: 'pending'
                    }
                });
            }
        } else {
            res.json({ code: 200, msg: '查询失败', data: { status: 'unknown' } });
        }

    } catch (error) {
        res.status(500).json({ code: 500, msg: '查询支付结果失败', error: error.message });
    }
});









/**
 * 更新用户VIP状态 - 核心功能
 */
async function updateUserVipStatus(outTradeNo) {
    try {
        // 从订单号解析用户ID和套餐类型
        const parts = outTradeNo.split('_');
        if (parts.length < 3) {
            throw new Error('订单号格式错误');
        }
        
        const userId = parts[0];
        const planType = parts[1];
        
        // 查找用户
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('用户不存在');
        }
        
        // 计算到期时间
        const expiryDate = AlipayUtils.calculateExpiryDate(planType);
        if (!expiryDate) {
            throw new Error('无效的套餐类型');
        }
        
        // 更新用户VIP状态
        const now = new Date();
        user.vip.type = planType;
        user.vip.startDate = now;
        user.vip.endDate = expiryDate;
        user.isMember = true;
        user.membershipEndDate = expiryDate;
        
        await user.save();
        
    } catch (error) {
        throw error;
    }
}

// 调试接口 - 手动触发会员状态更新
router.post('/debug-update-vip', async (req, res) => {
    try {
        const { userId, planType } = req.body;
        if (!userId || !planType) return res.status(400).json({ code: 400, msg: '缺少必要参数' });
        
        const outTradeNo = `${userId}_${planType}_${Date.now()}`;
        await updateUserVipStatus(outTradeNo);
        
        res.json({ code: 200, msg: 'VIP状态更新成功', data: { outTradeNo } });
        
    } catch (error) {
        res.status(500).json({ code: 500, msg: '更新失败: ' + error.message });
    }
});

module.exports = router; 