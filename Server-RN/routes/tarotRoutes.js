const express = require('express');
const router = express.Router();
const SimpleTarotCard = require('../models/SimpleTarotCard');
const TarotInterpretation = require('../models/TarotInterpretation');
const TarotHistory = require('../models/TarotHistory');
const User = require('../models/User');

// 检查用户每日占卜次数限制
async function checkDailyDivinationLimit(user) {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    
    // 获取用户会员类型和对应的每日限制
    const vipType = user.vip?.type || '免费';
    const dailyLimits = {
        '免费': 3,
        '月会员': 10,
        '季会员': -1  // -1 表示无限次数
    };
    
    const maxDailyCount = dailyLimits[vipType] || 3;
    
    // 季会员无限次数，直接通过
    if (maxDailyCount === -1) {
        return {
            allowed: true,
            currentCount: user.zhanBuStats?.dayNum || 0,
            maxCount: '无限',
            resetTime: tomorrowStart.toISOString()
        };
    }
    
    // 检查今日是否需要重置计数
    const lastDate = user.zhanBuStats?.lastDate;
    let currentDayCount = user.zhanBuStats?.dayNum || 0;
    
    if (!lastDate || new Date(lastDate) < todayStart) {
        // 今天还没有占卜记录，或者是新的一天，重置计数为0
        currentDayCount = 0;
    }
    
    // 检查是否超过限制
    if (currentDayCount >= maxDailyCount) {
        return {
            allowed: false,
            message: `${vipType}用户每日最多可进行${maxDailyCount}次占卜，今日次数已用完`,
            currentCount: currentDayCount,
            maxCount: maxDailyCount,
            resetTime: tomorrowStart.toISOString()
        };
    }
    
    return {
        allowed: true,
        currentCount: currentDayCount,
        maxCount: maxDailyCount,
        resetTime: tomorrowStart.toISOString()
    };
}

// 更新用户占卜统计
async function updateDivinationStats(userId) {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const user = await User.findById(userId);
    if (!user) return;
    
    const lastDate = user.zhanBuStats?.lastDate;
    let dayNum = user.zhanBuStats?.dayNum || 0;
    
    // 如果是新的一天，重置每日计数，然后设为1（因为这是今天第一次占卜）
    if (!lastDate || new Date(lastDate) < todayStart) {
        dayNum = 1;
    } else {
        // 如果是当天，dayNum +1
        dayNum += 1;
    }
    
    // 更新统计数据
    await User.findByIdAndUpdate(userId, {
        $inc: { 
            'zhanBuStats.total': 1  // 总次数 +1
        },
        $set: {
            'zhanBuStats.dayNum': dayNum,  // 今日次数设为计算后的值
            'zhanBuStats.lastDate': new Date()  // 更新最后占卜时间
        }
    });
}

// 获取所有塔罗牌列表接口
router.get('/cards', async (req, res) => {
    try {
        // 从数据库查询所有塔罗牌，只选择指定字段
        const cards = await SimpleTarotCard.find({}).select('cardId name suit number element description');
        // 返回成功响应
        return res.status(200).json({ code: 200, data: cards, msg: "获取塔罗牌列表成功" });
    } catch (error) {
        // 捕获并记录错误
        console.error('获取塔罗牌列表失败:', error);
        // 返回服务器错误响应
        return res.status(500).json({ code: 500, msg: "服务器内部错误" });
    }
});

// 抽取塔罗牌进行占卜接口
router.post('/draw', async (req, res) => {
    try {
        // 从请求体中获取用户ID和问题
        const { userId, question } = req.body;
        // 验证用户ID是否为空
        if (!userId) return res.status(400).json({ code: 400, msg: "用户ID不能为空" });

        // 根据用户ID查找用户
        const user = await User.findById(userId);
        // 验证用户是否存在
        if (!user) return res.status(404).json({ code: 404, msg: "用户不存在" });

        // 检查用户的每日占卜限制
        const membershipCheck = await checkDailyDivinationLimit(user);
        // 如果超过限制，返回错误
        if (!membershipCheck.allowed) {
            return res.status(403).json({
                code: 403,
                msg: membershipCheck.message,
                data: {
                    currentCount: membershipCheck.currentCount, // 当前使用次数
                    maxCount: membershipCheck.maxCount, // 最大允许次数
                    vipType: user.vip.type, // VIP类型
                    resetTime: membershipCheck.resetTime // 重置时间
                }
            });
        }

        // 从数据库获取所有塔罗牌
        const allCards = await SimpleTarotCard.find({});
        // 检查是否有塔罗牌数据
        if (allCards.length === 0) return res.status(404).json({ code: 404, msg: "暂无塔罗牌数据" });

        // 随机选择一张牌
        const randomIndex = Math.floor(Math.random() * allCards.length);
        const selectedCard = allCards[randomIndex];
        // 随机决定正位或逆位（30%概率逆位）
        const position = Math.random() < 0.3 ? 'reversed' : 'upright';
        
        // 查找对应的牌解释
        const interpretation = await TarotInterpretation.findOne({
            cardId: selectedCard.cardId, // 匹配牌ID
            position: position // 匹配位置（正位/逆位）
        });

        // 检查是否找到解释数据
        if (!interpretation) return res.status(404).json({ code: 404, msg: "未找到牌的解释数据" });

        // 更新牌的统计信息
        await SimpleTarotCard.findByIdAndUpdate(selectedCard._id, {
            $inc: { 'stats.drawCount': 1, [`stats.${position}Count`]: 1 }, // 增加抽取次数和位置次数
            'stats.lastDrawn': new Date() // 更新最后抽取时间
        });

        // 更新解释的统计信息
        await TarotInterpretation.findByIdAndUpdate(interpretation._id, {
            $inc: { 'stats.drawCount': 1 }, // 增加抽取次数
            'stats.lastDrawn': new Date()
        });

        // 生成占卜结果摘要
        const resultSummary = `${selectedCard.name}（${position === 'upright' ? '正位' : '逆位'}） - ${interpretation.shortDescription}`;
        
        // 计算占卜评分（基于牌的含义和位置）
        const score = Math.floor(Math.random() * 30) + 70; // 70-100分的随机评分

        // 保存占卜历史记录
        const historyRecord = new TarotHistory({
            userId: userId,
            cardId: selectedCard.cardId,
            cardName: selectedCard.name,
            cardSuit: selectedCard.suit,
            position: position,
            question: question || '',
            interpretation: {
                keywords: interpretation.keywords,
                shortDescription: interpretation.shortDescription,
                detailedDescription: interpretation.detailedDescription,
                meaning: interpretation.meaning
            },
            resultSummary: resultSummary,
            score: score
        });

        await historyRecord.save();

        // 更新用户的占卜统计
        await updateDivinationStats(userId);

        // 构造返回数据
        const cardWithInterpretation = {
            card: {
                ...selectedCard.toJSON(),
                position,
                drawTime: new Date()
            },
            interpretation: {
                keywords: interpretation.keywords,
                shortDescription: interpretation.shortDescription,
                detailedDescription: interpretation.detailedDescription,
                meaning: interpretation.meaning
            }
        };

        return res.status(200).json({
            code: 200,
            data: {
                question,
                result: cardWithInterpretation,
                drawTime: new Date(),
                historyId: historyRecord._id
            },
            msg: "塔罗占卜成功"
        });

    } catch (error) {
        console.error('❌ 塔罗占卜失败:', error);
        return res.status(500).json({
            code: 500,
            msg: "服务器内部错误"
        });
    }
});

// 获取塔罗占卜历史
router.post('/history', async (req, res) => {
    try {
        const { userId, limit = 10, page = 1 } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                code: 400,
                msg: "用户ID不能为空"
            });
        }

        // 验证用户是否存在
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                code: 404,
                msg: "用户不存在"
            });
        }

        // 分页计算
        const skip = (page - 1) * limit;

        // 获取历史记录
        const historyRecords = await TarotHistory.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('cardId cardName cardSuit position question resultSummary score createdAt');

        // 获取总数用于分页
        const totalCount = await TarotHistory.countDocuments({ userId });

        // 获取统计数据
        const mongoose = require('mongoose');
        const stats = await TarotHistory.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalCount: { $sum: 1 },
                    averageScore: { $avg: '$score' },
                    thisMonthCount: {
                        $sum: {
                            $cond: {
                                if: {
                                    $gte: ['$createdAt', new Date(new Date().getFullYear(), new Date().getMonth(), 1)]
                                },
                                then: 1,
                                else: 0
                            }
                        }
                    }
                }
            }
        ]);

        const statsData = stats[0] || { totalCount: 0, averageScore: 0, thisMonthCount: 0 };

        // 格式化历史记录
        const formattedHistory = historyRecords.map(record => ({
            id: record._id,
            type: 'tarot',
            title: `${record.cardSuit}${record.cardName}`,
            question: record.question,
            result: record.resultSummary,
            date: record.createdAt.toISOString().split('T')[0],
            time: record.createdAt.toTimeString().split(' ')[0].substr(0, 5),
            score: record.score,
            icon: '🔮',
            position: record.position
        }));

        return res.status(200).json({
            code: 200,
            data: {
                history: formattedHistory,
                stats: {
                    totalCount: statsData.totalCount,
                    thisMonthCount: statsData.thisMonthCount,
                    averageScore: Math.round(statsData.averageScore || 0)
                },
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount: totalCount,
                    hasMore: skip + limit < totalCount
                }
            },
            msg: "获取占卜历史成功"
        });

    } catch (error) {
        console.error('❌ 获取占卜历史失败:', error);
        return res.status(500).json({
            code: 500,
            msg: "服务器内部错误"
        });
    }
});



// 获取单个塔罗占卜历史详情
router.post('/history-detail', async (req, res) => {
    try {
        const { historyId } = req.body;
        
        if (!historyId) {
            return res.status(400).json({
                code: 400,
                msg: "历史记录ID不能为空"
            });
        }

        // 获取历史记录详情
        const historyRecord = await TarotHistory.findById(historyId);
        
        if (!historyRecord) {
            return res.status(404).json({
                code: 404,
                msg: "未找到该历史记录"
            });
        }

        // 格式化返回数据
        const detailData = {
            id: historyRecord._id,
            cardId: historyRecord.cardId,
            cardName: historyRecord.cardName,
            cardSuit: historyRecord.cardSuit,
            position: historyRecord.position,
            question: historyRecord.question,
            resultSummary: historyRecord.resultSummary,
            score: historyRecord.score,
            date: historyRecord.createdAt.toISOString().split('T')[0],
            time: historyRecord.createdAt.toTimeString().split(' ')[0].substr(0, 5),
            interpretation: historyRecord.interpretation
        };

        return res.status(200).json({
            code: 200,
            data: detailData,
            msg: "获取历史详情成功"
        });

    } catch (error) {
        console.error('❌ 获取历史详情失败:', error);
        return res.status(500).json({
            code: 500,
            msg: "服务器内部错误"
        });
    }
});

// 获取用户今日占卜次数状态
router.post('/daily-status', async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                code: 400,
                msg: "用户ID不能为空"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                code: 404,
                msg: "用户不存在"
            });
        }

        const membershipCheck = await checkDailyDivinationLimit(user);
        
        return res.status(200).json({
            code: 200,
            data: {
                currentCount: membershipCheck.currentCount,
                maxCount: membershipCheck.maxCount,
                remainingCount: membershipCheck.maxCount - membershipCheck.currentCount,
                vipType: user.vip?.type || '免费',
                canDivine: membershipCheck.allowed,
                resetTime: membershipCheck.resetTime
            },
            msg: "获取占卜状态成功"
        });

    } catch (error) {
        console.error('❌ 获取占卜状态失败:', error);
        return res.status(500).json({
            code: 500,
            msg: "服务器内部错误"
        });
    }
});

module.exports = router; 