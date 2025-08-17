const express = require('express');
const router = express.Router();
const ZodiacFate = require('../models/ZodiacFate');
const User = require('../models/User');

// 获取每日星座缘分接口
router.post('/daily-fate', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ code: 400, msg: "用户ID不能为空" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ code: 404, msg: "用户不存在" });

        const userZodiac = user.zodiacSign || '双鱼座';
        const today = new Date();
        const seed = parseInt(userId.slice(-6), 16) + today.getDate() + today.getMonth() * 31;
        
        const userFates = await ZodiacFate.find({ userZodiac });
        if (userFates.length === 0) return res.status(404).json({ code: 404, msg: `暂无${userZodiac}的星座缘分数据` });

        const selectedFate = userFates[seed % userFates.length];
        const baseScore = selectedFate.baseCompatibility || 80;
        const randomFloat = (seed % 11) - 5;
        const compatibilityScore = Math.max(65, Math.min(95, baseScore + randomFloat));
        
        const content = selectedFate.basicContent || {
            description: selectedFate.description || '',
            advice: selectedFate.advice || ''
        };
        
        const result = {
            userZodiac,
            targetZodiac: selectedFate.targetZodiac,
            fateType: selectedFate.fateType,
            fateDescription: content.description,
            compatibilityScore,
            advice: content.advice,
            date: today.toISOString().split('T')[0]
        };

        return res.status(200).json({ code: 200, data: result, msg: "获取星座缘分成功" });

    } catch (error) {
        console.error('获取星座缘分失败:', error);
        return res.status(500).json({ code: 500, msg: "服务器内部错误" });
    }
});

module.exports = router; 