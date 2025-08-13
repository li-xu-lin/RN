const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Fortune = require('../models/Yunshi');
const User = require('../models/User');

// 连接数据库
connectDB();

// 初始化运势数据
async function initFortuneData() {
    try {
        // 检查是否已有数据
        const existingCount = await Fortune.countDocuments();
        if (existingCount > 0) {
            console.log(`运势数据已存在 ${existingCount} 条记录，跳过初始化`);
            return;
        }

        const colors = ['红色', '金色', '绿色', '紫色', '蓝色', '黄色', '白色', '粉色'];
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        
        const fortuneAdvices = [
            '今日运势极佳，万事如意！把握机会，会有意外惊喜。',
            '适合与人合作，团队协作会带来丰硕成果。',
            '保持平静的心态，好运自然而来。',
            '今日宜出行，可能会遇到贵人相助。',
            '财运不错，投资理财要谨慎而行。',
            '学习运势旺盛，适合充电提升自己。',
            '人际关系和谐，社交活动会很顺利。',
            '创意灵感丰富，适合进行创作活动。',
            '健康状况良好，但要注意劳逸结合。',
            '爱情运势上升，单身者有望遇到心仪对象。'
        ];

        const fortuneData = [];
        
        for (const color of colors) {
            for (const number of numbers) {
                const fortuneScore = Math.floor(Math.random() * 30) + 70; // 70-100分
                const advice = fortuneAdvices[Math.floor(Math.random() * fortuneAdvices.length)];
                
                fortuneData.push({
                    luckyColor: color,
                    luckyNumber: number,
                    fortuneScore: fortuneScore,
                    advice: advice
                });
            }
        }

        await Fortune.insertMany(fortuneData);
        console.log(`✅ 成功初始化 ${fortuneData.length} 条运势数据`);

    } catch (error) {
        console.error('❌ 初始化运势数据失败:', error);
    }
}

// 创建测试用户
async function createTestUser() {
    try {
        const existingUser = await User.findOne({ phone: '13800138000' });
        if (existingUser) {
            console.log('测试用户已存在，跳过创建');
            return;
        }

        const testUser = new User({
            phone: '13800138000',
            username: '测试用户',
            pwd: '123456',
            zodiacSign: '白羊座',
            sex: '女',
            exp: 100
        });

        await testUser.save();
        console.log('✅ 成功创建测试用户');
        console.log(`用户ID: ${testUser._id}`);
        console.log('登录信息: 13800138000 / 123456');

    } catch (error) {
        console.error('❌ 创建测试用户失败:', error);
    }
}

// 主函数
async function initializeData() {
    console.log('🚀 开始初始化数据...');
    
    try {
        await initFortuneData();
        await createTestUser();
        
        console.log('🎉 数据初始化完成！');
        console.log('\n可以使用以下账号登录测试:');
        console.log('手机号: 13800138000');
        console.log('密码: 123456');
        
    } catch (error) {
        console.error('❌ 数据初始化失败:', error);
    } finally {
        process.exit(0);
    }
}

// 如果直接运行此文件
if (require.main === module) {
    initializeData();
}

module.exports = {
    initFortuneData,
    createTestUser,
    initializeData
}; 