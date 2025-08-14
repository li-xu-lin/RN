const mongoose = require('mongoose');
const User = require('../models/User');

// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/RN');

async function testMemberUpdate() {
    try {
        console.log('🧪 测试会员状态更新功能...\n');

        // 1. 找到一个用户
        const user = await User.findOne();
        if (!user) {
            console.error('❌ 没有找到用户');
            return;
        }

        console.log('👤 测试用户:', {
            id: user._id,
            username: user.username,
            当前VIP类型: user.vip.type,
            是否会员: user.isMember,
            会员到期: user.membershipEndDate
        });

        // 2. 模拟支付成功，手动更新会员状态
        const userId = user._id.toString();
        const planType = '月会员';
        const outTradeNo = `${userId}_${planType}_${Date.now()}`;

        console.log('\n🔄 模拟支付成功，更新会员状态...');
        console.log('流水号:', outTradeNo);

        // 直接调用更新逻辑
        await updateUserMembershipDirect(outTradeNo, '9.90');

        // 3. 查询更新后的状态
        const updatedUser = await User.findById(user._id);
        console.log('\n✅ 更新后的用户状态:', {
            id: updatedUser._id,
            username: updatedUser.username,
            VIP类型: updatedUser.vip.type,
            是否会员: updatedUser.isMember,
            会员开始: updatedUser.vip.startDate,
            会员结束: updatedUser.vip.endDate,
            会员到期: updatedUser.membershipEndDate
        });

        console.log('\n🎉 测试完成！');

    } catch (error) {
        console.error('❌ 测试失败:', error);
    } finally {
        mongoose.disconnect();
    }
}

// 复制支付成功后的更新逻辑
async function updateUserMembershipDirect(outTradeNo, amount) {
    try {
        console.log('🔄 处理支付成功，更新会员状态:', { outTradeNo, amount });
        
        // 从流水号中解析用户ID和套餐类型
        const parts = outTradeNo.split('_');
        if (parts.length < 3) {
            throw new Error('流水号格式不正确');
        }
        
        const userId = parts[0];
        const planType = parts[1];
        
        console.log('📝 解析信息:', { userId, planType });
        
        // 更新用户会员信息（简化版：只改变vip.type）
        const user = await User.findById(userId);
        if (user) {
            const now = new Date();
            
            // 计算到期时间
            let duration = 30; // 默认30天
            if (planType === '季会员') {
                duration = 90; // 90天
            }
            
            const newEndDate = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);
            
            console.log('📅 计算到期时间:', {
                套餐类型: planType,
                天数: duration,
                到期时间: newEndDate
            });
            
            // 更新会员信息
            user.vip.type = planType;
            user.vip.startDate = now;
            user.vip.endDate = newEndDate;
            user.isMember = true;
            user.membershipEndDate = newEndDate;
            
            await user.save();
            
            console.log(`✅ 用户 ${user.username} 会员状态更新成功: ${planType}`);
        } else {
            throw new Error('用户不存在');
        }
    } catch (error) {
        console.error('❌ 更新用户会员信息失败:', error.message);
        throw error;
    }
}

// 运行测试
testMemberUpdate(); 