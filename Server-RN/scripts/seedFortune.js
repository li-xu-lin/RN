const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Fortune = require('../models/Yunshi');

// 连接数据库
connectDB();

// 运势建议库
const fortuneAdviceLibrary = {
    // 高分运势 (85-100)
    excellent: [
        '今日运势极佳！诸事顺利，把握机会必有收获。',
        '幸运之星高照，大胆尝试新事物会有意外惊喜。',
        '贵人运旺盛，主动与人交流会得到重要帮助。',
        '直觉敏锐，相信第一感觉做决定准没错。',
        '创意爆发的一天，灵感会为你带来突破。',
        '财运亨通，投资理财时机成熟，可适当冒险。',
        '爱情运势极佳，单身者易遇良缘，有伴者感情升温。',
        '工作效率极高，复杂问题也能轻松解决。'
    ],
    
    // 良好运势 (70-84)
    good: [
        '运势平稳上升，稳扎稳打会有好结果。',
        '人际关系和谐，团队合作事半功倍。',
        '学习运不错，适合充电提升自己。',
        '健康状况良好，精力充沛应对挑战。',
        '家庭运势温馨，与亲人相处愉快。',
        '出行运佳，外出办事或旅游都很顺利。',
        '沟通表达能力强，容易获得他人认同。',
        '小财运不断，生活品质有所提升。'
    ],
    
    // 一般运势 (50-69)  
    average: [
        '运势平稳，保持现状为宜，不宜大变动。',
        '需要耐心等待，时机未到切勿急躁。',
        '多听取他人意见，集思广益能避免失误。',
        '注意细节，小心谨慎可化解潜在问题。',
        '情绪管理很重要，保持平和心态。',
        '适合整理回顾，为未来做好准备。',
        '健康需要关注，注意劳逸结合。',
        '人际关系需要维护，主动示好很重要。'
    ]
};

// 根据分数选择对应的建议
function getAdviceByScore(score) {
    if (score >= 85) {
        return fortuneAdviceLibrary.excellent[Math.floor(Math.random() * fortuneAdviceLibrary.excellent.length)];
    } else if (score >= 70) {
        return fortuneAdviceLibrary.good[Math.floor(Math.random() * fortuneAdviceLibrary.good.length)];
    } else {
        return fortuneAdviceLibrary.average[Math.floor(Math.random() * fortuneAdviceLibrary.average.length)];
    }
}

// 生成运势分数（带权重分布）
function generateFortuneScore() {
    const rand = Math.random();
    
    // 15% 概率高分 (85-100)
    if (rand < 0.15) {
        return Math.floor(Math.random() * 16) + 85;
    }
    // 60% 概率良好 (70-84)
    else if (rand < 0.75) {
        return Math.floor(Math.random() * 15) + 70;
    }
    // 25% 概率一般 (50-69)
    else {
        return Math.floor(Math.random() * 20) + 50;
    }
}

// 初始化完整的运势种子数据
async function seedFortuneData() {
    try {
        console.log('🌱 开始生成运势种子数据...');

        // 清除现有数据
        await Fortune.deleteMany({});
        console.log('🗑️ 已清除现有运势数据');

        const colors = ['红色', '金色', '绿色', '紫色', '蓝色', '黄色', '白色', '粉色'];
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        
        const fortuneData = [];
        let totalRecords = 0;

        for (const color of colors) {
            for (const number of numbers) {
                const fortuneScore = generateFortuneScore();
                const advice = getAdviceByScore(fortuneScore);
                
                fortuneData.push({
                    luckyColor: color,
                    luckyNumber: number,
                    fortuneScore: fortuneScore,
                    advice: advice,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                
                totalRecords++;
            }
        }

        // 批量插入数据
        await Fortune.insertMany(fortuneData);
        
        console.log(`✅ 成功生成 ${totalRecords} 条运势数据`);
        
        // 生成统计信息
        const stats = await Fortune.aggregate([
            {
                $group: {
                    _id: null,
                    avgScore: { $avg: '$fortuneScore' },
                    minScore: { $min: '$fortuneScore' },
                    maxScore: { $max: '$fortuneScore' },
                    excellentCount: {
                        $sum: { $cond: [{ $gte: ['$fortuneScore', 85] }, 1, 0] }
                    },
                    goodCount: {
                        $sum: { $cond: [{ $and: [{ $gte: ['$fortuneScore', 70] }, { $lt: ['$fortuneScore', 85] }] }, 1, 0] }
                    },
                    averageCount: {
                        $sum: { $cond: [{ $lt: ['$fortuneScore', 70] }, 1, 0] }
                    }
                }
            }
        ]);

        if (stats.length > 0) {
            const stat = stats[0];
            console.log('\n📊 运势数据统计:');
            console.log(`平均分数: ${stat.avgScore.toFixed(1)}`);
            console.log(`分数范围: ${stat.minScore} - ${stat.maxScore}`);
            console.log(`优秀运势 (85+): ${stat.excellentCount} 条 (${(stat.excellentCount/totalRecords*100).toFixed(1)}%)`);
            console.log(`良好运势 (70-84): ${stat.goodCount} 条 (${(stat.goodCount/totalRecords*100).toFixed(1)}%)`);
            console.log(`一般运势 (<70): ${stat.averageCount} 条 (${(stat.averageCount/totalRecords*100).toFixed(1)}%)`);
        }

        console.log('\n🎯 数据分布示例:');
        const samples = await Fortune.find({}).limit(5);
        samples.forEach(sample => {
            console.log(`${sample.luckyColor} + ${sample.luckyNumber} = ${sample.fortuneScore}分 - ${sample.advice.substring(0, 20)}...`);
        });

    } catch (error) {
        console.error('❌ 生成运势数据失败:', error);
    }
}

// 主函数
async function main() {
    try {
        await seedFortuneData();
        console.log('\n🎉 运势种子数据生成完成！');
    } catch (error) {
        console.error('❌ 程序执行失败:', error);
    } finally {
        process.exit(0);
    }
}

// 如果直接运行此文件
if (require.main === module) {
    main();
}

module.exports = {
    seedFortuneData,
    getAdviceByScore,
    generateFortuneScore
}; 