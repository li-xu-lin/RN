const express = require('express');
const router = express.Router();
const Fortune = require('../models/Yunshi');

// 配置数据
const CONFIG_DATA = {
  colors: [
    { color: '红色', desc: '象征着好运、财富和激情，特别在中国文化中非常重要。' },
    { color: '金色', desc: '代表财富、成功和繁荣，常与好运挂钩。' },
    { color: '绿色', desc: '在西方文化中代表幸运和生长，常与自然、平衡相关联。' },
    { color: '紫色', desc: '被认为是神秘、高贵的颜色，象征灵性和智慧。' },
    { color: '蓝色', desc: '象征着宁静和安定，常与情感的和谐和平衡相关。' },
    { color: '黄色', desc: '代表阳光、幸福和活力，常见于西方的幸运色。' },
    { color: '白色', desc: '纯洁、新开始，常与新的机会和好运联系在一起。' },
    { color: '粉色', desc: '通常与爱和幸福有关，能够带来积极的情感。' }
  ],
  numbers: [
    { number: 1, desc: '代表新开始、独立和领导力。是"开端"和"创造力"的象征。' },
    { number: 2, desc: '代表和谐、合作和双重性。它也与平衡和关系密切相关。' },
    { number: 3, desc: '象征着幸运、创造力和社交。被认为是最有创造力和幸运的数字之一。' },
    { number: 4, desc: '代表稳定性、基础和努力。它常与脚踏实地的工作和耐力相关。' },
    { number: 5, desc: '象征自由、冒险和变化。这个数字与探索和寻求新机会相关。' },
    { number: 6, desc: '代表家庭、爱和责任。它与温暖和关爱有关，是平衡与照顾的象征。' },
    { number: 7, desc: '被认为是最幸运的数字之一，代表智慧、神秘和完美。它与灵性和深度探索相关。' },
    { number: 8, desc: '象征财富、权力和成功。它与物质和实际成果紧密相连。' },
    { number: 9, desc: '代表完成、仁慈和人道主义。它也与理想主义和全局观相关。' },
    { number: 10, desc: '通常象征着完美和圆满。它代表的是终结和新阶段的开始，常带有积极向上的意义。' }
  ]
};

// 获取配置数据
router.get('/config', (req, res) => {
  try {
    res.json({
      success: true,
      data: CONFIG_DATA
    });
  } catch (error) {
    console.error('获取配置失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取每日运势
router.post('/dayYunShi', async (req, res) => {
  try {
    const { luckyColor, luckyNumber } = req.body;

    // 验证输入参数
    if (!luckyColor || !luckyNumber) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数：幸运色和幸运数字'
      });
    }

    // 从数据库查询对应的运势建议
    const fortune = await Fortune.findOne({
      luckyColor: luckyColor,
      luckyNumber: parseInt(luckyNumber)
    });

    if (!fortune) {
      return res.status(404).json({
        success: false,
        message: '未找到对应的运势数据'
      });
    }

    res.json({
        success: true,
        data: {
      fortuneScore: fortune.fortuneScore,
      advice: fortune.advice,
      luckyColor: fortune.luckyColor,
      luckyNumber: fortune.luckyNumber
        }
    });

  } catch (error) {
    console.error('获取运势失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router; 