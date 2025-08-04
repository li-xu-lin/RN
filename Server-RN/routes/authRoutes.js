const express = require('express');
const router = express.Router();

const User = require('../models/User.js')

router.post('/login', async (req, res) => {
    try {
    let { phone, pwd } = req.body;
    if (!phone || !pwd) {
        return res.status(400).json({
            code: 400,
            msg: "用户名和密码不能为空"
        });
    }
        
    let data = await User.find({ phone });

        if (data.length > 0) {
        if (data[0].pwd === pwd) {
            return res.status(200).json({
                code: 200,
                data:data[0],
                msg: "登录成功"
            });
        } else {
            return res.status(400).json({
                code: 400,
                msg: "密码错误"
            });
        }
    } else {
        return res.status(400).json({
            code: 400,
            msg: "用户名不存在"
        });
    }
    } catch (error) {
        console.error('登录处理错误:', error);
        return res.status(500).json({
            code: 500,
            msg: "服务器内部错误"
        });
    }
});

// 创建测试用户的路由（仅用于开发测试）
router.post('/create-test-user', async (req, res) => {
    try {
        // 创建测试用户
        const testUser = new User({
            phone: 'admin',
            pwd: '123456'
        });
        
        // 检查用户是否已存在
        const existingUser = await User.find({ phone: 'admin' });
        if (existingUser.length > 0) {
            return res.status(200).json({
                code: 200,
                msg: "测试用户已存在，用户名: admin, 密码: 123456"
            });
        }
        
        await testUser.save();
        return res.status(200).json({
            code: 200,
            msg: "测试用户创建成功！用户名: admin, 密码: 123456"
        });
    } catch (error) {
        console.error('创建测试用户错误:', error);
        return res.status(500).json({
            code: 500,
            msg: "创建测试用户失败"
        });
    }
});

module.exports = router; 