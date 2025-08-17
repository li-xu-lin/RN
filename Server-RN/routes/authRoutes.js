const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
const path = require('path');
const fs = require('fs');
const User = require('../models/User.js');
const Fortune = require('../models/Yunshi.js');

// 常量定义
const FORTUNE_CONSTANTS = {
    colors: ['红色', '金色', '绿色', '紫色', '蓝色', '黄色', '白色', '粉色'],
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    colorDescriptions: {
        '红色': '象征着好运、财富和激情，特别在中国文化中非常重要。',
        '金色': '代表财富、成功和繁荣，常与好运挂钩。',
        '绿色': '在西方文化中代表幸运和生长，常与自然、平衡相关联。',
        '紫色': '被认为是神秘、高贵的颜色，象征灵性和智慧。',
        '蓝色': '象征着宁静和安定，常与情感的和谐和平衡相关。',
        '黄色': '代表阳光、幸福和活力，常见于西方的幸运色。',
        '白色': '纯洁、新开始，常与新的机会和好运联系在一起。',
        '粉色': '通常与爱和幸福有关，能够带来积极的情感。'
    },
    numberDescriptions: {
        1: '代表新开始、独立和领导力。是"开端"和"创造力"的象征。',
        2: '代表和谐、合作和双重性。它也与平衡和关系密切相关。',
        3: '象征着幸运、创造力和社交。被认为是最有创造力和幸运的数字之一。',
        4: '代表稳定性、基础和努力。它常与脚踏实地的工作和耐力相关。',
        5: '象征自由、冒险和变化。这个数字与探索和寻求新机会相关。',
        6: '代表家庭、爱和责任。它与温暖和关爱有关，是平衡与照顾的象征。',
        7: '被认为是最幸运的数字之一，代表智慧、神秘和完美。它与灵性和深度探索相关。',
        8: '象征财富、权力和成功。它与物质和实际成果紧密相连。',
        9: '代表完成、仁慈和人道主义。它也与理想主义和全局观相关。',
        10: '通常象征着完美和圆满。它代表的是终结和新阶段的开始，常带有积极向上的意义。'
    }
};

// 生成每日运势的函数
const generateDailyFortune = async (userId, userData) => {
    try {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        // 检查用户今天是否已经生成过运势
        const lastUpdated = userData.dailyFortune?.lastUpdated;
        if (lastUpdated) {
            const lastUpdatedDate = new Date(lastUpdated);
            const lastUpdatedStart = new Date(lastUpdatedDate.getFullYear(), lastUpdatedDate.getMonth(), lastUpdatedDate.getDate());
            
            // 如果今天已经生成过运势，则不重新生成
            if (todayStart.getTime() === lastUpdatedStart.getTime()) {
                return;
            }
        }
        
        // 生成随机幸运色和幸运数字
        const randomColor = FORTUNE_CONSTANTS.colors[Math.floor(Math.random() * FORTUNE_CONSTANTS.colors.length)];
        const randomNumber = FORTUNE_CONSTANTS.numbers[Math.floor(Math.random() * FORTUNE_CONSTANTS.numbers.length)];
        
        // 从Fortune集合中查找对应的运势数据
        const fortuneData = await Fortune.findOne({
            luckyColor: randomColor,
            luckyNumber: randomNumber
        });
        
        if (fortuneData) {
            // 更新用户的每日运势数据
            const updateData = {
                'dailyFortune.luckyColor': randomColor,
                'dailyFortune.luckyColorDesc': FORTUNE_CONSTANTS.colorDescriptions[randomColor] || '带来好运的颜色',
                'dailyFortune.luckyNumber': randomNumber,
                'dailyFortune.luckyNumberDesc': FORTUNE_CONSTANTS.numberDescriptions[randomNumber] || '幸运的数字',
                'dailyFortune.fortuneScore': fortuneData.fortuneScore,
                'dailyFortune.yunShi': fortuneData.advice,
                'dailyFortune.lastUpdated': new Date()
            };
            
            await User.findByIdAndUpdate(userId, updateData);
            
            // 更新userData对象，确保返回给前端的数据是最新的
            userData.dailyFortune = {
                luckyColor: randomColor,
                luckyColorDesc: FORTUNE_CONSTANTS.colorDescriptions[randomColor] || '带来好运的颜色',
                luckyNumber: randomNumber,
                luckyNumberDesc: FORTUNE_CONSTANTS.numberDescriptions[randomNumber] || '幸运的数字',
                fortuneScore: fortuneData.fortuneScore,
                yunShi: fortuneData.advice,
                lastUpdated: new Date()
            };
        }
        
    } catch (error) {
        console.error('❌ 生成每日运势失败:', error);
    }
};

// 检查并重置每日签到状态
const checkDailySignStatus = async (userId, userData) => {
    try {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        // 检查最后签到日期
        const lastSignDate = userData.lastSignDate ? new Date(userData.lastSignDate) : null;
        
        if (lastSignDate) {
            const lastSignStart = new Date(lastSignDate.getFullYear(), lastSignDate.getMonth(), lastSignDate.getDate());
            
            // 如果最后签到日期不是今天，重置今日签到状态
            if (todayStart.getTime() !== lastSignStart.getTime()) {
                await User.findByIdAndUpdate(userId, { isQianDao: false });
                userData.isQianDao = false;
                console.log(`用户 ${userId} 的签到状态已重置（跨日重置）`);
            }
        } else {
            // 如果从未签到过，确保状态为false
            await User.findByIdAndUpdate(userId, { isQianDao: false });
            userData.isQianDao = false;
        }
        
    } catch (error) {
        console.error('❌ 检查签到状态失败:', error);
    }
};

router.post('/login', async (req, res) => {
    try {
        const { phone, pwd } = req.body;
        
        // 验证必填字段
        if (!phone || !pwd) {
            return res.status(400).json({
                code: 400,
                msg: "手机号和密码不能为空"
            });
        }
        
        const user = await User.findOne({ phone });
        
        if (!user) {
            return res.status(400).json({
                code: 400,
                msg: "用户不存在"
            });
        }
        
        // 验证密码
        if (user.pwd !== pwd) {
            return res.status(400).json({
                code: 400,
                msg: "密码错误"
            });
        }
        
        // 处理用户数据，包含虚拟字段（等级信息）
        const userData = user.toJSON();
        
        // 确保_id字段正确
        userData._id = user._id.toString();
        
        // 确保头像URL是完整的HTTP地址
        if (userData.imgs && !userData.imgs.startsWith('http')) {
            userData.imgs = `http://10.0.2.2:3010/uploads/avatars/${userData.imgs}`;
        }
        
        // 检查并生成每日运势
        await generateDailyFortune(user._id, userData);
        
        // 检查并重置每日签到状态
        await checkDailySignStatus(user._id, userData);
        
        // 更新最后登录时间
        await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });
        userData.lastLoginAt = new Date();
        
        return res.status(200).json({
            code: 200,
            data: userData,
            msg: "登录成功"
        });
        
    } catch (error) {
        console.error('❌ 登录处理错误:', error);
        return res.status(500).json({
            code: 500,
            msg: "服务器内部错误"
        });
    }
});


// 头像上传
router.post('/upload-avatar', async (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                code: 400,
                msg: "上传失败"
            });
        }
        const uploadedFile = files.avatar[0];
        const userId = fields.userId[0];

        // 生成新的文件名
        const ext = path.extname(uploadedFile.originalFilename);
        const newFilename = `avatar_${Date.now()}${ext}`;
        const targetPath = path.join(__dirname, '../uploads/avatars', newFilename);

        // 移动文件
        fs.renameSync(uploadedFile.path, targetPath);

        // 构建头像URL
        const avatarUrl = `http://10.0.2.2:3010/uploads/avatars/${newFilename}`;
        
        // 更新用户头像
        await User.findByIdAndUpdate(userId, { imgs: avatarUrl });
        
        return res.status(200).json({
            code: 200,
            data: { avatarUrl: avatarUrl },
            msg: "上传成功"
        });
    });
});

// 每日签到API
router.post('/daily-sign', async (req, res) => {
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
        
        // 获取今天的日期（不包含时间）
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        // 检查今天是否已经签到
        if (user.isQianDao) {
            // 检查最后签到日期是否是今天
            const lastSignDate = user.lastSignDate ? new Date(user.lastSignDate) : null;
            if (lastSignDate) {
                const lastSignStart = new Date(lastSignDate.getFullYear(), lastSignDate.getMonth(), lastSignDate.getDate());
                if (todayStart.getTime() === lastSignStart.getTime()) {
                    return res.status(400).json({
                        code: 400,
                        msg: "今日已签到，请明日再来"
                    });
                }
            }
        }
        
        // 累计签到天数+1
        const newTotalSignDays = (user.leiJiQianDao || 0) + 1;
        
        // 计算经验奖励（固定奖励）
        const totalExp = 20; // 每日固定20经验值
        
        // 使用新的等级系统计算升级
        const { addExperience } = require('../utils/levelSystem');
        const expResult = addExperience(user.exp || 0, totalExp);
        
        // 更新用户数据
        const updateData = {
            isQianDao: true,
            leiJiQianDao: newTotalSignDays,
            lastSignDate: todayStart,
            exp: expResult.newExp
        };
        
        await User.findByIdAndUpdate(userId, updateData);
        
        // 获取更新后的用户信息（包含虚拟字段）
        const updatedUser = await User.findById(userId);
        
        // 返回签到结果
        return res.status(200).json({
            code: 200,
            data: {
                totalSignDays: newTotalSignDays,
                expGained: totalExp,
                newLevel: expResult.newLevel,
                oldLevel: expResult.oldLevel,
                newExp: expResult.newExp,
                isLevelUp: expResult.levelUp,
                levelTitle: updatedUser.levelTitle,
                levelInfo: updatedUser.levelInfo
            },
            msg: `签到成功！累计签到${newTotalSignDays}天，获得${totalExp}经验值${expResult.levelUp ? `，恭喜从${expResult.oldLevel}级升到${expResult.newLevel}级！` : ''}`
        });
        
    } catch (error) {
        console.error('❌ 签到处理错误:', error);
        return res.status(500).json({
            code: 500,
            msg: "服务器内部错误"
        });
    }
});

// 获取用户签到状态API
router.post('/check-sign-status', async (req, res) => {
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
        
        // 检查并更新签到状态
        const userData = user.toJSON();
        userData._id = user._id.toString();
        await checkDailySignStatus(userId, userData);
        
        // 重新获取更新后的用户信息
        const updatedUser = await User.findById(userId);
        const finalUserData = updatedUser.toJSON();
        finalUserData._id = updatedUser._id.toString();
        
        return res.status(200).json({
            code: 200,
            data: {
                isQianDao: finalUserData.isQianDao,
                leiJiQianDao: finalUserData.leiJiQianDao,
                level: finalUserData.level,
                levelTitle: finalUserData.levelTitle,
                exp: finalUserData.exp
            },
            msg: "获取签到状态成功"
        });
        
    } catch (error) {
        console.error('❌ 获取签到状态错误:', error);
        return res.status(500).json({
            code: 500,
            msg: "服务器内部错误"
        });
    }
});

// 获取每日运势API
router.post('/daily-fortune', async (req, res) => {
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
        
        // 获取用户数据并生成/更新每日运势
        const userData = user.toJSON();
        userData._id = user._id.toString();
        
        // 生成或更新每日运势
        await generateDailyFortune(userId, userData);
        
        // 重新获取更新后的用户信息
        const updatedUser = await User.findById(userId);
        const finalUserData = updatedUser.toJSON();
        finalUserData._id = updatedUser._id.toString();
        
        return res.status(200).json({
            code: 200,
            data: {
                dailyFortune: finalUserData.dailyFortune,
                level: finalUserData.level,
                levelTitle: finalUserData.levelTitle,
                exp: finalUserData.exp,
                username: finalUserData.username,
                imgs: finalUserData.imgs
            },
            msg: "获取每日运势成功"
        });
        
    } catch (error) {
        console.error('❌ 获取每日运势错误:', error);
        return res.status(500).json({
            code: 500,
            msg: "服务器内部错误"
        });
    }
});

// 获取用户信息
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                code: 404,
                msg: "用户不存在"
            });
        }

        // 返回用户信息（不包含密码）
        const userInfo = user.toObject();
        delete userInfo.pwd;

        res.status(200).json({
            code: 200,
            msg: "获取用户信息成功",
            data: userInfo
        });

    } catch (error) {
        console.error('❌ 获取用户信息错误:', error);
        return res.status(500).json({
            code: 500,
            msg: "服务器内部错误"
        });
    }
});

// ==================== 个人资料相关路由 ====================

// 更新用户资料
router.put('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, phone, content, sex } = req.body;  // 移除birthDate

        // 验证必需字段
        if (!username?.trim()) {
            return res.status(400).json({
                code: 400,
                msg: "用户名不能为空"
            });
        }

        if (!phone?.trim()) {
            return res.status(400).json({
                code: 400,
                msg: "手机号不能为空"
            });
        }

        // 验证手机号格式
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                code: 400,
                msg: "请输入正确的手机号格式"
            });
        }



        // 检查手机号是否已被其他用户使用
        const existingUser = await User.findOne({ 
            phone: phone, 
            _id: { $ne: userId } 
        });
        
        if (existingUser) {
            return res.status(400).json({
                code: 400,
                msg: "该手机号已被其他用户使用"
            });
        }

        // 更新用户信息，移除birthDate
        const updateData = {
            username: username.trim(),
            phone: phone.trim(),
            content: content?.trim() || '',
            sex: sex || ''
            // 移除birthDate字段
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                code: 404,
                msg: "用户不存在"
            });
        }

        // 返回更新后的用户信息（不包含密码）
        const userInfo = updatedUser.toObject();
        delete userInfo.pwd;

        res.status(200).json({
            code: 200,
            msg: "个人资料更新成功",
            data: userInfo
        });

    } catch (error) {
        console.error('❌ 更新用户资料错误:', error);
        return res.status(500).json({
            code: 500,
            msg: "服务器内部错误"
        });
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