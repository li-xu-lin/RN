// 引入Express框架
const express = require('express');
// 创建路由实例
const router = express.Router();

// 引入用户模型
const User = require('../models/User.js');
// 引入运势模型
const Fortune = require('../models/Yunshi.js');



// 生成每日运势的辅助函数
const generateDailyFortune = async (userId, userData) => {
    try {
        // 获取当前日期
        const today = new Date();
        // 获取今天的开始时间（0点）
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        // 检查用户今天是否已经生成过运势
        const lastUpdated = userData.dailyFortune?.lastUpdated;
        if (lastUpdated) {
            // 将上次更新时间转换为日期对象
            const lastUpdatedDate = new Date(lastUpdated);
            // 获取上次更新日期的开始时间
            const lastUpdatedStart = new Date(lastUpdatedDate.getFullYear(), lastUpdatedDate.getMonth(), lastUpdatedDate.getDate());
            
            // 如果今天已经生成过运势，则不重新生成
            if (todayStart.getTime() === lastUpdatedStart.getTime()) {
                return; // 直接返回，不执行后续代码
            }
        }
        
        // 定义幸运色数组
        const colors = ['红色', '金色', '绿色', '紫色', '蓝色', '黄色', '白色', '粉色'];
        // 定义幸运数字数组
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        // 随机选择一个幸运色
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        // 随机选择一个幸运数字
        const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
        
        // 从Fortune集合中查找对应的运势数据
        const fortuneData = await Fortune.findOne({
            luckyColor: randomColor, // 匹配幸运色
            luckyNumber: randomNumber // 匹配幸运数字
        });
        
        if (fortuneData) {
            // 准备更新数据对象
            const updateData = {
                'dailyFortune.luckyColor': randomColor, // 设置幸运色
                'dailyFortune.luckyColorDesc': '带来好运的颜色', // 幸运色描述
                'dailyFortune.luckyNumber': randomNumber, // 设置幸运数字
                'dailyFortune.luckyNumberDesc': '幸运的数字', // 幸运数字描述
                'dailyFortune.fortuneScore': fortuneData.fortuneScore, // 运势分数
                'dailyFortune.yunShi': fortuneData.advice, // 运势建议
                'dailyFortune.lastUpdated': new Date() // 更新时间
            };
            
            // 更新用户数据库中的运势数据
            await User.findByIdAndUpdate(userId, updateData);
            
            // 更新userData对象，确保返回给前端的数据是最新的
            userData.dailyFortune = {
                luckyColor: randomColor, // 幸运色
                luckyColorDesc: '带来好运的颜色', // 幸运色描述
                luckyNumber: randomNumber, // 幸运数字
                luckyNumberDesc: '幸运的数字', // 幸运数字描述
                fortuneScore: fortuneData.fortuneScore, // 运势分数
                yunShi: fortuneData.advice, // 运势建议
                lastUpdated: new Date() // 更新时间
            };
        }
        
    } catch (error) {
        // 捕获并记录错误
        console.error('❌ 生成每日运势失败:', error);
    }
};



// 检查并重置每日签到状态的辅助函数
const checkDailySignStatus = async (userId, userData) => {
    try {
        // 获取当前日期
        const today = new Date();
        // 获取今天的开始时间（0点）
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        // 检查最后签到日期
        const lastSignDate = userData.lastSignDate ? new Date(userData.lastSignDate) : null;
        
        if (lastSignDate) {
            // 获取最后签到日期的开始时间
            const lastSignStart = new Date(lastSignDate.getFullYear(), lastSignDate.getMonth(), lastSignDate.getDate());
            
            // 如果最后签到日期不是今天，重置今日签到状态
            if (todayStart.getTime() !== lastSignStart.getTime()) {
                // 更新数据库中的签到状态为false
                await User.findByIdAndUpdate(userId, { isQianDao: false });
                // 更新内存中的签到状态为false
                userData.isQianDao = false;
                // 记录日志
                console.log(`用户 ${userId} 的签到状态已重置（跨日重置）`);
            }
        } else {
            // 如果从未签到过，确保状态为false
            // 更新数据库中的签到状态为false
            await User.findByIdAndUpdate(userId, { isQianDao: false });
            // 更新内存中的签到状态为false
            userData.isQianDao = false;
        }
        
    } catch (error) {
        // 捕获并记录错误
        console.error('❌ 检查签到状态失败:', error);
    }
};

// 用户登录接口
router.post('/login', async (req, res) => {
    try {
        // 从请求体中解构出手机号和密码
        const { phone, pwd } = req.body;
        // 验证手机号和密码是否为空
        if (!phone || !pwd) return res.status(400).json({ code: 400, msg: "手机号和密码不能为空" });
        
        // 根据手机号查找用户
        const user = await User.findOne({ phone });
        // 验证用户是否存在且密码是否正确
        if (!user || user.pwd !== pwd) return res.status(400).json({ code: 400, msg: user ? "密码错误" : "用户不存在" });
        
        // 将用户数据转换为JSON格式
        const userData = user.toJSON();
        // 将用户ID转换为字符串
        userData._id = user._id.toString();
        // 清空图片字段
        userData.imgs = null;
        
        // 生成每日运势
        await generateDailyFortune(user._id, userData);
        // 检查并重置签到状态
        await checkDailySignStatus(user._id, userData);
        // 更新最后登录时间
        await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });
        
        // 返回登录成功响应
        return res.status(200).json({ code: 200, data: { ...userData, lastLoginAt: new Date() }, msg: "登录成功" });
        
    } catch (error) {
        // 捕获并记录错误
        console.error('登录错误:', error);
        // 返回服务器错误响应
        return res.status(500).json({ code: 500, msg: "服务器内部错误" });
    }
});




// 每日签到接口
router.post('/daily-sign', async (req, res) => {
    try {
        // 从请求体中获取用户ID
        const { userId } = req.body;
        // 验证用户ID是否为空
        if (!userId) return res.status(400).json({ code: 400, msg: "用户ID不能为空" });
        
        // 根据用户ID查找用户
        const user = await User.findById(userId);
        // 验证用户是否存在
        if (!user) return res.status(404).json({ code: 404, msg: "用户不存在" });
        
        // 获取当前日期
        const today = new Date();
        // 获取今天的开始时间（0点）
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        // 检查用户是否已经签到过
        if (user.isQianDao && user.lastSignDate) {
            // 获取最后签到日期的开始时间
            const lastSignStart = new Date(user.lastSignDate.getFullYear(), user.lastSignDate.getMonth(), user.lastSignDate.getDate());
            // 如果今天已经签到过，返回错误
            if (todayStart.getTime() === lastSignStart.getTime()) {
                return res.status(400).json({ code: 400, msg: "今日已签到，请明日再来" });
            }
        }
        
        // 计算新的累计签到天数
        const newTotalSignDays = (user.leiJiQianDao || 0) + 1;
        // 设置签到获得的经验值
        const totalExp = 20;
        // 计算新的总经验值
        const newExp = (user.exp || 0) + totalExp;
        
        // 更新用户的签到信息
        await User.findByIdAndUpdate(userId, {
            isQianDao: true, // 设置今日已签到
            leiJiQianDao: newTotalSignDays, // 更新累计签到天数
            lastSignDate: todayStart, // 更新最后签到日期
            exp: newExp // 更新经验值
        });
        
        // 返回签到成功响应
        return res.status(200).json({
            code: 200,
            data: { totalSignDays: newTotalSignDays, expGained: totalExp, newExp },
            msg: `签到成功！累计签到${newTotalSignDays}天，获得${totalExp}经验值`
        });
        
    } catch (error) {
        // 捕获并记录错误
        console.error('签到错误:', error);
        // 返回服务器错误响应
        return res.status(500).json({ code: 500, msg: "服务器内部错误" });
    }
});

// 获取用户签到状态接口
router.post('/check-sign-status', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ code: 400, msg: "用户ID不能为空" });
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ code: 404, msg: "用户不存在" });
        
        const userData = user.toJSON();
        userData._id = user._id.toString();
        await checkDailySignStatus(userId, userData);
        
        const updatedUser = await User.findById(userId);
        const finalUserData = updatedUser.toJSON();
        
        return res.status(200).json({
            code: 200,
            data: { isQianDao: finalUserData.isQianDao, leiJiQianDao: finalUserData.leiJiQianDao, exp: finalUserData.exp },
            msg: "获取签到状态成功"
        });
        
    } catch (error) {
        console.error('获取签到状态错误:', error);
        return res.status(500).json({ code: 500, msg: "服务器内部错误" });
    }
});

// 获取每日运势接口
router.post('/daily-fortune', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ code: 400, msg: "用户ID不能为空" });
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ code: 404, msg: "用户不存在" });
        
        const userData = user.toJSON();
        userData._id = user._id.toString();
        await generateDailyFortune(userId, userData);
        
        const updatedUser = await User.findById(userId);
        const finalUserData = updatedUser.toJSON();
        
        return res.status(200).json({
            code: 200,
            data: { dailyFortune: finalUserData.dailyFortune, exp: finalUserData.exp, username: finalUserData.username, imgs: null },
            msg: "获取每日运势成功"
        });
        
    } catch (error) {
        console.error('获取每日运势错误:', error);
        return res.status(500).json({ code: 500, msg: "服务器内部错误" });
    }
});

// 获取用户信息接口
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ code: 404, msg: "用户不存在" });
        
        const userInfo = user.toObject();
        delete userInfo.pwd;
        
        res.status(200).json({ code: 200, msg: "获取用户信息成功", data: userInfo });
        
    } catch (error) {
        console.error('获取用户信息错误:', error);
        return res.status(500).json({ code: 500, msg: "服务器内部错误" });
    }
});

// 更新用户个人资料接口
router.put('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, phone, content, sex } = req.body;

        if (!username?.trim() || !phone?.trim()) {
            return res.status(400).json({ code: 400, msg: "用户名和手机号不能为空" });
        }

        if (!/^1[3-9]\d{9}$/.test(phone)) {
            return res.status(400).json({ code: 400, msg: "请输入正确的手机号格式" });
        }

        const existingUser = await User.findOne({ phone, _id: { $ne: userId } });
        if (existingUser) return res.status(400).json({ code: 400, msg: "该手机号已被其他用户使用" });

        const updatedUser = await User.findByIdAndUpdate(userId, {
            username: username.trim(),
            phone: phone.trim(),
            content: content?.trim() || '',
            sex: sex || ''
        }, { new: true });

        if (!updatedUser) return res.status(404).json({ code: 404, msg: "用户不存在" });

        const userInfo = updatedUser.toObject();
        delete userInfo.pwd;

        res.status(200).json({ code: 200, msg: "个人资料更新成功", data: userInfo });

    } catch (error) {
        console.error('更新用户资料错误:', error);
        return res.status(500).json({ code: 500, msg: "服务器内部错误" });
    }
});

// 修改密码
router.put('/change-password/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { oldPassword, newPassword } = req.body;

        // 验证输入
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                code: 400,
                msg: "旧密码和新密码都不能为空"
            });
        }

        // 验证新密码格式
        if (newPassword.length < 6) {
            return res.status(400).json({
                code: 400,
                msg: "新密码长度至少6位"
            });
        }

        if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword)) {
            return res.status(400).json({
                code: 400,
                msg: "新密码须包含字母和数字"
            });
        }

        // 检查新旧密码是否相同
        if (oldPassword === newPassword) {
            return res.status(400).json({
                code: 400,
                msg: "新密码不能与当前密码相同"
            });
        }

        // 查找用户并验证旧密码
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                code: 404,
                msg: "用户不存在"
            });
        }

        // 验证旧密码（这里假设密码是明文存储，实际项目中应该使用加密）
        if (user.pwd !== oldPassword) {
            return res.status(400).json({
                code: 400,
                msg: "当前密码错误"
            });
        }

        // 更新密码
        user.pwd = newPassword;
        await user.save();

        res.status(200).json({
            code: 200,
            msg: "密码修改成功"
        });

    } catch (error) {
        console.error('❌ 修改密码错误:', error);
        return res.status(500).json({
            code: 500,
            msg: "服务器内部错误"
        });
    }
});

module.exports = router; 