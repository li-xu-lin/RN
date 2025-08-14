const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AlipayUtils = require('../utils/alipayUtils');

/**
 * 获取会员套餐列表
 */
router.get('/plans', async (req, res) => {
    try {
        const plans = {
            '月会员': AlipayUtils.getMembershipPlan('月会员'),
            '季会员': AlipayUtils.getMembershipPlan('季会员')
        };

        res.json({
            code: 200,
            msg: '获取套餐列表成功',
            data: plans
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            msg: '获取套餐列表失败',
            error: error.message
        });
    }
});

/**
 * 创建支付订单 - 简化版
 */
router.post('/create', async (req, res) => {
    try {
        const { userId, planType } = req.body;

        // 基础验证
        if (!userId || !planType) {
            return res.status(400).json({
                code: 400,
                msg: '缺少必要参数'
            });
        }

        // 验证用户存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                code: 404,
                msg: '用户不存在'
            });
        }

        // 验证套餐类型
        const plan = AlipayUtils.getMembershipPlan(planType);
        if (!plan) {
            return res.status(400).json({
                code: 400,
                msg: '无效的套餐类型'
            });
        }

        // 生成订单号
        const outTradeNo = AlipayUtils.generateOrderNo(userId, planType);

        // 创建支付订单
        const paymentResult = await AlipayUtils.createPayment({
            outTradeNo: outTradeNo,
            totalAmount: plan.price,
            subject: plan.name,
            body: plan.description
        });

        if (!paymentResult.success) {
            return res.status(500).json({
                code: 500,
                msg: paymentResult.message || '创建支付订单失败'
            });
        }

        res.json({
            code: 200,
            msg: '创建支付订单成功',
            data: {
                outTradeNo: outTradeNo,
                orderString: paymentResult.data.orderString,
                amount: plan.price,
                planInfo: plan
            }
        });

    } catch (error) {
        console.error('❌ 创建支付订单失败:', error);
        res.status(500).json({
            code: 500,
            msg: '创建支付订单失败',
            error: error.message
        });
    }
});

/**
 * 查询支付结果 - 简化版
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
            res.json({
                code: 200,
                msg: '查询失败',
                data: {
                    status: 'unknown'
                }
            });
        }

    } catch (error) {
        console.error('❌ 查询支付结果失败:', error);
        res.status(500).json({
            code: 500,
            msg: '查询支付结果失败',
            error: error.message
        });
    }
});

/**
 * 支付宝异步通知回调
 */
router.post('/notify', async (req, res) => {
    try {
        const notifyData = req.body;
        
        console.log('🔔 收到支付宝通知:', notifyData);
        console.log('🔔 通知时间:', new Date().toLocaleString());
        
        // 验证通知
        const isValid = AlipayUtils.verifyNotify(notifyData);
        if (!isValid) {
            console.error('❌ 支付宝通知验证失败');
            return res.send('failure');
        }

        const { out_trade_no, trade_status } = notifyData;
        console.log('📋 订单号:', out_trade_no, '支付状态:', trade_status);

        // 支付成功，更新用户VIP状态
        if (trade_status === 'TRADE_SUCCESS' || trade_status === 'TRADE_FINISHED') {
            try {
                console.log('🚀 开始处理支付成功回调...');
                await updateUserVipStatus(out_trade_no);
                console.log(`✅ 订单 ${out_trade_no} 处理成功`);
            } catch (error) {
                console.error(`❌ 处理订单 ${out_trade_no} 失败:`, error.message);
                return res.send('failure');
            }
        }

        res.send('success');

    } catch (error) {
        console.error('❌ 处理支付宝通知失败:', error);
        res.send('failure');
    }
});

/**
 * 支付宝同步回调 - 支付完成后跳转页面
 */
router.get('/return', async (req, res) => {
    try {
        const { out_trade_no, trade_status } = req.query;
        
        console.log('🔄 收到支付宝同步回调:', { out_trade_no, trade_status });
        
        if (trade_status === 'TRADE_SUCCESS') {
            // 同步回调也更新VIP状态（防止异步通知丢失）
            try {
                await updateUserVipStatus(out_trade_no);
            } catch (error) {
                console.error(`❌ 同步回调处理失败:`, error.message);
            }
            
            res.send(`
                <html>
                <head>
                    <title>支付成功</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            padding: 50px; 
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                        }
                        .success-box {
                            background: rgba(255,255,255,0.1);
                            padding: 30px;
                            border-radius: 15px;
                            max-width: 400px;
                            margin: 0 auto;
                        }
                        .success-icon { font-size: 60px; margin-bottom: 20px; }
                        .btn { 
                            background: #4CAF50; 
                            color: white; 
                            padding: 15px 30px; 
                            border: none; 
                            border-radius: 8px; 
                            font-size: 16px; 
                            cursor: pointer; 
                            margin: 10px;
                            text-decoration: none;
                            display: inline-block;
                        }
                    </style>
                </head>
                <body>
                    <div class="success-box">
                        <div class="success-icon">✅</div>
                        <h1>支付成功！</h1>
                        <p>🎉 您的会员权益已开通</p>
                        <p>订单号：${out_trade_no}</p>
                        <br>
                        <a href="myapp://payment/success?order=${out_trade_no}" class="btn">返回APP</a>
                        <button class="btn" onclick="window.close()" style="background: #6c757d;">关闭页面</button>
                    </div>
                    
                    <script>
                        // 3秒后自动尝试返回APP
                        setTimeout(() => {
                            try {
                                window.location.href = 'myapp://payment/success?order=${out_trade_no}';
                            } catch(e) {
                                console.log('返回APP失败');
                            }
                        }, 3000);
                    </script>
                </body>
                </html>
            `);
        } else {
            res.send(`
                <html>
                <head><title>支付结果</title><meta charset="utf-8"></head>
                <body style="text-align: center; padding: 50px;">
                    <h2>支付状态：${trade_status}</h2>
                    <p>订单号：${out_trade_no}</p>
                </body>
                </html>
            `);
        }
    } catch (error) {
        console.error('❌ 处理支付宝同步回调失败:', error);
        res.send('处理失败');
    }
});





/**
 * 更新用户VIP状态 - 核心功能
 */
async function updateUserVipStatus(outTradeNo) {
    try {
        console.log('🔄 开始更新用户VIP状态:', outTradeNo);
        
        // 从订单号解析用户ID和套餐类型
        const parts = outTradeNo.split('_');
        if (parts.length < 3) {
            throw new Error('订单号格式错误');
        }
        
        const userId = parts[0];
        const planType = parts[1];
        
        console.log('📝 解析信息:', { userId, planType });
        
        // 查找用户
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('用户不存在');
        }
        
        console.log('📝 更新前用户信息:', {
            username: user.username,
            vipType: user.vip?.type,
            isMember: user.isMember
        });
        
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
        
        console.log('✅ 用户信息更新成功:', {
            username: user.username,
            vipType: user.vip.type,
            isMember: user.isMember,
            endDate: expiryDate.toLocaleDateString()
        });
        
    } catch (error) {
        console.error('❌ 更新用户VIP状态失败:', error.message);
        throw error;
    }
}

// 临时调试接口 - 手动触发会员状态更新
router.post('/debug-update-vip', async (req, res) => {
    try {
        const { userId, planType } = req.body;
        
        if (!userId || !planType) {
            return res.status(400).json({
                code: 400,
                msg: '缺少必要参数'
            });
        }
        
        // 构造订单号格式
        const outTradeNo = `${userId}_${planType}_${Date.now()}`;
        
        console.log('🔧 调试：手动触发VIP状态更新:', { userId, planType, outTradeNo });
        
        await updateUserVipStatus(outTradeNo);
        
        res.json({
            code: 200,
            msg: 'VIP状态更新成功',
            data: { outTradeNo }
        });
        
    } catch (error) {
        console.error('❌ 调试更新VIP状态失败:', error);
        res.status(500).json({
            code: 500,
            msg: '更新失败: ' + error.message
        });
    }
});

module.exports = router; 